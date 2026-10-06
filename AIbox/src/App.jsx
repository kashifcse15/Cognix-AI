import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { Route, Routes, useLocation } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { LuMenu } from 'react-icons/lu'
import { assets } from './assets/assets/assets'
import './assets/assets/prism.css'
import Loading from './pages/Loading'
import Login from './pages/Login'
import { useAppContext } from './context/AppContext'
import { Toaster } from 'react-hot-toast';

const App = () => { // gradient

    const { user, loadingUser } = useAppContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { pathname } = useLocation();

    if (pathname === '/loading' || loadingUser) {
        return <Loading />
    }
    return (
        <>
            <Toaster />
            {!isMenuOpen && <LuMenu className='absolute top-3 left-3 w-8 h-8 cursor-pointer 
        md:hidden not-dark:invert text-fuchsia-50' onClick={() => setIsMenuOpen(true)} />}
            {user ? (
                <div className='dark:bg-linear-to-b from-[#000000] to-[#000000]
        dark:text-white'>
                    <div className="w-full h-screen overflow-hidden dark:bg-linear-to-b from-[#000000] to-[#000000] dark:text-white">
                        <div className="flex h-screen w-full min-w-0 overflow-hidden">
                            <Sidebar
                                isMenuOpen={isMenuOpen}
                                setIsMenuOpen={setIsMenuOpen}
                            />

                            <Routes>
                                <Route path="/" element={<ChatBox />} />
                                <Route path="/credits" element={<Credits />} />
                                <Route path="/community" element={<Community />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='bg-linear-to-b from-[#242124] to-[#000000] h-screen w-screen flex items-center justify-center'>
                    <Login />
                </div>

            )}

        </>
    )
}
export default App;