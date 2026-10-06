import Chat from "../models/Chat.js";
import User from "../models/User.js";
import axios from 'axios';
import openai from "../configs/openai.js";

export const textMessageController = async (req, res) => { // MESSAGE BY AI
    try {
        const userId = req.user._id;

        if (req.user.credits < 1) {
            return res.json({ success: false, message: "Out of Credits" });
        }

        const { chatId, prompt } = req.body;

        const chat = await Chat.findOne({ userId, _id: chatId });

        if (!chat) {
            return res.json({
                success: false,
                message: "Chat not found"
            });
        }

        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });

        const response = await openai.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        console.timeEnd("AI Response");

        console.log("AI Response:", JSON.stringify(response, null, 2));

        const { choices } = response;

        if (!choices || choices.length === 0) {
            return res.json({
                success: false,
                message: "No response received from AI"
            });
        }

        const reply = { // Save AI's reply and add it to the chat
            ...choices[0].message,
            timestamp: Date.now(),
            isImage: false
        };

        chat.messages.push(reply);
        await chat.save();

        await User.updateOne(
            { _id: userId },
            { $inc: { credits: -1 } }
        );

        res.json({
            success: true,
            reply
        });

    }
    catch (error) {
        console.error("TEXT ERROR:", error);
        console.error("STATUS:", error.status);
        console.error("MESSAGE:", error.message);
        console.error("ERROR:", error.error);
        console.error("HEADERS:", error.headers);
        res.json({
            success: false,
            message: error.message
        });
    }
}

// Image Generation
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;

        if (req.user.credits < 2) {
            return res.json({
                success: false,
                message: "Out of Credits"
            });
        }

        const { prompt, chatId, isPublished } = req.body;

        const chat = await Chat.findOne({
            userId,
            _id: chatId
        });

        if (!chat) {
            return res.json({
                success: false,
                message: "Chat not found"
            });
        }

        // Save user's prompt
        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });

        // Encode prompt for URL
        const encodedPrompt = encodeURIComponent(prompt);

        // Pollinations image URL
        const generateImageURL =
            `https://gen.pollinations.ai/image/${encodedPrompt}?model=flux`;

        console.log("Generating image...");
        console.log("Prompt:", prompt);

        // Generate image
        const aiImageResponse = await axios.get(
            generateImageURL,
            {
                responseType: "arraybuffer",
                headers: {
                    Authorization: `Bearer ${process.env.POLLINATIONS_API_KEY}`
                }
            }
        );

        // Convert generated image to Base64
        const base64Image =
            `data:image/jpeg;base64,${Buffer.from(
                aiImageResponse.data
            ).toString("base64")}`;

        const reply = {
            role: "assistant",
            content: base64Image,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        };

        chat.messages.push(reply);

        await chat.save();

        await User.updateOne(
            { _id: userId },
            { $inc: { credits: -2 } }
        );

        res.json({
            success: true,
            reply
        });

    } catch (error) {
        console.error("IMAGE ERROR:", error);
        console.error("STATUS:", error.response?.status);
        console.error("RESPONSE:", error.response?.data);
        console.error("MESSAGE:", error.message);

        res.json({
            success: false,
            message: error.message
        });
    }
};

