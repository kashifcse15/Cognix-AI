import imagekit from "../configs/imagekit.js";
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

        console.log("userId:", userId);
console.log("chatId:", chatId);


const chat = await Chat.findOne({ userId, _id: chatId });

console.log("chat:", chat);
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
        
        console.time("AI Response");
        
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
        
        const reply = {
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
        console.error("ERROR RESPONSE:", error.response?.data);
    
        res.json({
            success: false,
            message: error.message
        });
    }
}

//Image Generation
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        if (req.user.credits < 2) {
            return res.json({ success: false, message: "Out of Credits" });
        }
        const { prompt, chatId, isPublished } = req.body;
        const chat = await Chat.findOne({ userId, _id: chatId });
        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });

        const encodedPrompt = encodeURIComponent(prompt);
        const generateImageURL =
        `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/aibox/${Date.now()}.png?tr=w-800,h-800`;

        const aiImageResponse = await axios.get(generateImageURL, { responseType: "arraybuffer" });

        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`;

        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "aibox"
        })
        const reply = {
            role: "assistant",
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        }
        res.json({ success: true, reply });
        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    } catch (error) {
        console.error("IMAGE ERROR:", error);
        console.error("RESPONSE:", error.response?.data);
    
        res.json({
            success: false,
            message: error.message
        });
    }
}

