import React from 'react'
import { useAppContext } from '../context/AppContext';
import { useState } from 'react';
import darklogo from "../assets/cognixdark.jpeg"
import lightlogo from "../assets/cognixlight.jpeg"
import { assets } from '../assets/assets/assets';
import { LuImage, LuCoins, LuMoon, LuUser, LuLogOut, LuX } from "react-icons/lu"
import toast from 'react-hot-toast';
import moment from 'moment'

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { user, chats, selectedChat, theme, setTheme, navigate, setSelectedChat,
    createNewChat, axios, setChats, fetchUserChats, setToken, token } = useAppContext();
  const [search, setSearch] = useState('');

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    toast.success('LoggedOut SuccessFully !')
  }

  const deleteChat = async (e, chatId) => {
    e.stopPropagation(); //stops event from moving to parent

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat?"
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.post(
        "/api/chat/delete",
        { chatId },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        setChats((prev) => prev.filter((chat) => chat._id !== chatId));
        await fetchUserChats();
        toast.success("Chat deleted");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`fixed md:relative top-0 left-0 z-50 flex flex-col w-[85vw] max-w-[320px] 
        md:w-72 h-screen md:h-[95vh] p-5 overflow-y-auto bg-white dark:bg-[#000000] border border-green-100 
        rounded-none md:rounded-3xl shadow-xl shadow-green-100/40 transition-transform duration-300
${isMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:m-4`
      }
    >
      <>
        <>
          {/* Light mode logo */}
          <img
            src={darklogo}
            alt="Logo"
            className="w-full h-28 mx-auto mt-1 mb-5 block dark:hidden"
          />

          {/* Dark mode logo */}
          <img
            src={lightlogo}
            alt="Logo"
            className="w-full h-26 mx-auto mt-1 mb-9 hidden dark:block"
          />
        </>
      </>
      <button onClick={() => { setIsMenuOpen(false); createNewChat(); }} // NEW CHAT BUTTON
        className="w-full flex items-center justify-center gap-2 text-white bg-linear-to-br from-green-400 to-blue-600 rounded-xl p-4 font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
      >
        <span className="text-xl">+</span>
        <span>New Chat</span>
      </button>

      <div className="relative"> {/* SEARCH */}
        <input
          type="text" id="search" placeholder=" " onChange={(e) => setSearch(e.target.value)}
          className="peer w-full h-12 px-4 pr-12 text-m text-slate-900 dark:text-white
           bg-white dark:bg-[#000000] border border-slate-300 dark:border-white/10 rounded-lg outline-none
            transition-all duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 relative mt-6"
        />

        <label
          htmlFor="search"
          className="absolute left-3 top-3 bg-white dark:bg-[#181818] px-1 text-slate-500 dark:text-slate-100
           transition-all duration-200 pointer-events-none peer-focus:text-green-600"
        >
          Search Chats...
        </label>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 mt-3 text-slate-400 dark:text-slate-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M10.979 16.8991C11.0591 17.4633 10.6657 17.9926 10.0959 17.9994C8.52021 18.0183 6.96549 17.5712 5.63246 16.7026C4.00976 15.6452 2.82575 14.035 2.30018 12.1709C1.77461 10.3068 1.94315 8.31525 2.77453 6.56596C3.60592 4.81667 5.04368 3.42838 6.82101 2.65875C8.59833 1.88911 10.5945 1.79039 12.4391 2.3809C14.2837 2.97141 15.8514 4.21105 16.8514 5.86977C17.8513 7.52849 18.2155 9.49365 17.8764 11.4005C17.5979 12.967 16.8603 14.4068 15.7684 15.543C15.3736 15.9539 14.7184 15.8787 14.3617 15.4343C14.0051 14.9899 14.0846 14.3455 14.4606 13.9173C15.1719 13.1073 15.6538 12.1134 15.8448 11.0393C16.0964 9.62426 15.8261 8.166 15.0841 6.93513C14.3421 5.70426 13.1788 4.78438 11.81 4.34618C10.4412 3.90799 8.95988 3.98125 7.641 4.55236C6.32213 5.12348 5.25522 6.15367 4.63828 7.45174C4.02135 8.74982 3.89628 10.2276 4.28629 11.6109C4.67629 12.9942 5.55489 14.1891 6.75903 14.9737C7.67308 15.5693 8.72759 15.8979 9.80504 15.9333C10.3746 15.952 10.8989 16.3349 10.979 16.8991Z" />
            <rect
              transform="rotate(-49.6812 12.2469 14.8859)" x="12.2469" y="14.8859" width="2" height="10.1881" rx="1"
            />
          </svg>
        </div>
      </div>

      {chats.length > 0 && (
        <p className="mt-4 mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Recent Chats
        </p>
      )}

      <div>
        {chats
          .filter((chat) =>chat.messages[0] ? chat.messages[0].content.toLowerCase().includes(search.toLowerCase()) //this parts searches chat
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div key={chat._id} onClick={() => {
                setSelectedChat(chat);
                navigate("/");
                setIsMenuOpen(false); // optional, closes sidebar on mobile
              }}
              className={`p-3 mb-3 rounded-xl border cursor-pointer transition-all duration-200
        flex items-center justify-between group
        ${selectedChat?._id === chat._id
                  ? "bg-green-100 dark:bg-[#1B2B22] border-green-500 shadow-md"
                  : "bg-white dark:bg-[#0F0F0F] border-gray-300 dark:border-[#2A2A2A] hover:bg-gray-100 dark:hover:bg-[#181818]"
                }`}
            >
              {/* Left */}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-gray-800 dark:text-white">
                  {chat.messages.length > 0
                    ? chat.messages[0].content
                    : chat.name}
                </p>

                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                  {moment(chat.updatedAt).format("DD MMM YYYY, hh:mm A")}
                </p>
              </div>

              {/* Delete Button */}
              <img
                src={assets.bin_icon}
                alt="Delete"
                onClick={(e) => deleteChat(e, chat._id)}
                className="w-4 h-4 ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer not-dark:invert shrink-0"
              />
            </div>
          ))}
      </div>
      {/* COMMUNITY */}
      <div className='mt-auto flex flex-col gap-3'>

        <button onClick={() => { navigate('/community'); setIsMenuOpen(false) }} className='flex items-center gap-3 p-3 rounded-xl 
bg-white dark:bg-[#181818]  border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white
 hover:bg-gray-50 dark:hover:bg-[#222] hover:shadow-md transition-all duration-300 cursor-pointer'>
          <LuImage className='text-2xl text-green-500' />
          <div className='text-left'>
            <p className='font-medium'>Community Images</p>
            <p className='text-sm text-gray-500'>Explore AI creations</p>
          </div>
        </button>
        {/* CREDITS */}
        <button onClick={() => { navigate('/credits'); setIsMenuOpen(false) }} className='mt-auto flex items-center gap-3 p-3 rounded-xl
 bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/10
  hover:bg-gray-50 dark:hover:bg-[#222]  hover:shadow-md transition-all duration-300 cursor-pointer'>
          <LuCoins className='text-2xl text-green-500' />
          <div className='text-left'>
            <p className='font-medium'>Credits : {user?.credits}</p>
            <p className='text-sm text-gray-500'>Purchase Credits</p>
          </div>
        </button>
        {/* DARK MODE */}
        <div className='flex items-center justify-between p-3 mt-4 rounded-xl border border-gray-200 dark:border-white/10
bg-white dark:bg-[#181818] text-gray-700 dark:text-white hover:shadow-md transition-all duration-300'>
          <div className='flex items-center gap-2 text-sm font-medium '>
            <LuMoon className='text-xl text-green-500' />
            <p>Dark Mode</p>
          </div>
          <label className='relative inline-flex cursor-pointer'>
            <input
              onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              type='checkbox' className='sr-only peer' checked={theme === 'dark'}
            />
            <div className='w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-all duration-300'></div>
            <span className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5'></span>
          </label>
        </div>
        {/* LOGOUT & USERNAME */}
        <button className='mt-auto w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-[#181818] 
border border-gray-200 dark:border-white hover:bg-gray-50 dark:hover:bg-[#222] transition-all duration-300 '>
          <div className='flex items-center gap-3'>
            <LuUser className='text-xl text-green-600 dark:text-green-400' />
            <p className='font-medium text-gray-800 dark:text-white'>
              {user?.name}
            </p>
          </div>
          <LuLogOut onClick={logout} className='text-xl text-red-600 dark:text-green-700 cursor-pointer transition-all' />
        </button>


      </div>
      {/* X BUTTON FOR MOBILE*/}
      <button onClick={() => setIsMenuOpen(false)} className='md:hidden absolute top-3 right-3 w-5 h-5 cursor-pointer'>
        <LuX className='text-3xl text-red-500' />
      </button>

    </div>
  )
}

export default Sidebar

