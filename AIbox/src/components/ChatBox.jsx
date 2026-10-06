import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import darklogo from "../assets/cognixlight.jpeg";
import lightlogo from "../assets/cognixdark.jpeg";
import Message from "./Message";
import { LuSend, LuCircleStop } from "react-icons/lu";
import toast from "react-hot-toast";

const ChatBox = () => {
  const {
    selectedChat,
    theme,
    user,
    axios,
    token,
    setUser
  } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const containerRef = useRef(null);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!user) {
        return toast("Login to Send Message");
      }

      setLoading(true);

      const promptCopy = prompt;

      setPrompt("");

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
          timestamp: Date.now(),
          isImage: false
        }
      ]);

      const { data } = await axios.post(
        `/api/message/${mode}`,
        {
          chatId: selectedChat._id,
          prompt,
          isPublished
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          data.reply
        ]);

        if (mode === "image") {
          setUser((prev) => ({
            ...prev,
            credits: prev.credits - 2
          }));
        } else {
          setUser((prev) => ({
            ...prev,
            credits: prev.credits - 1
          }));
        }
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }

    } catch (error) {
      toast.error(error.message);

    } finally {
      setPrompt("");
      setLoading(false);
    }
  };

  useEffect(() => {
    setMessages(selectedChat?.messages || []);
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  return (

   <div
    className="
        flex flex-1 h-full min-h-0 min-w-0 max-w-full
        flex-col justify-between p-4
        m-5 md:p-10 xl:px-30 max-md:pt-14 2xl:pr-40
    "
>

      {/* ================= CHAT MESSAGES ================= */}

    <div
    ref={containerRef}
    className="
        flex-1 min-h-0 min-w-0 max-w-full mb-5
        overflow-y-auto overflow-x-hidden
    "
>

        {messages.length === 0 && (

          <div
            className="
              h-full w-full flex flex-col
              items-center justify-center px-4
            "
          >

            <img
              src={theme === "dark" ? darklogo : lightlogo}
              alt="Logo"
              className="w-full max-w-56 sm:max-w-68"
            />

            <p
              className="
                mt-5 text-2xl sm:text-3xl
                text-center text-gray-400 dark:text-white
              "
            >
              Welcome {user?.name} 🚀
            </p>

            <p
              className="
                mt-5 text-2xl sm:text-3xl
                text-center text-gray-400 dark:text-white
              "
            >
              How Can i assist ?
            </p>

          </div>
        )}

        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
          />
        ))}

        {loading && (

          <div className="loader flex items-center gap-1.5 px-2">

            <div
              className="
                w-1.5 h-1.5 rounded-full
                bg-gray-500 dark:bg-white-600
                animate-bounce
              "
            />

            <div
              className="
                w-1.5 h-1.5 rounded-full
                bg-gray-500 dark:bg-white-600
                animate-bounce
              "
            />

            <div
              className="
                w-1.5 h-1.5 rounded-full
                bg-gray-500 dark:bg-white-600
                animate-bounce
              "
            />

          </div>
        )}

      </div>

      {/* ================= IMAGE PUBLISH OPTION ================= */}

      {mode === "image" && (

        <label
          className="
            inline-flex items-center justify-center
            gap-2 mb-3 text-sm mx-auto max-w-full
          "
        >

          <p className="text-sm text-center">
            Publish generated image to Community
          </p>

          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-green-600 shrink-0"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />

        </label>
      )}

      {/* ================= INPUT FORM ================= */}

      <form
        onSubmit={onSubmit}
        className="
          w-full max-w-2xl min-w-0 mx-auto
          p-2 pl-3 md:p-3 md:pl-4
          flex items-center gap-2 md:gap-4
          bg-green-100/20 dark:bg-[#0F1A14]
          border border-green-300 dark:border-[#1F4D36]
          rounded-full
        "
      >

        {/* MODE SELECT */}

        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="
            shrink-0 text-sm px-2 md:px-3 py-2
            rounded-lg bg-green-100/30 dark:bg-[#13231B]
            border border-green-300 dark:border-[#1F4D36]
            text-gray-700 dark:text-green-300
            outline-none cursor-pointer
            hover:border-green-500 transition
          "
        >

          <option
            className="bg-[#13231B]"
            value="text"
          >
            Text
          </option>

          <option
            className="bg-[#13231B]"
            value="image"
          >
            Image
          </option>

        </select>

        {/* PROMPT */}

        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="Type your Prompt here..."
          className="
            flex-1 min-w-0 w-full
            text-sm outline-none bg-transparent
            dark:text-white
            dark:placeholder:text-green-200/50
          "
          required
        />

        {/* SEND BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="
            shrink-0 p-2 rounded-full
            bg-[#1F4D36]
            hover:bg-[#2A6A4A]
            transition
          "
        >

          {loading ? (

            <LuCircleStop
              className="w-5 h-5 text-green-200"
            />

          ) : (

            <LuSend
              className="w-5 h-5 text-green-200"
            />

          )}

        </button>

      </form>

    </div>
  );
};

export default ChatBox;