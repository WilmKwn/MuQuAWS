import React from 'react'

import { useGlobal } from '../globals/Globals'

const Navbar = () => {
    const {dispatch} = useGlobal();

    const publicPressed = () => {
        dispatch({ type: 'UPDATE_WHICH', payload: 'PUBLIC' });
    }
    const privatePressed = () => {
        dispatch({ type: 'UPDATE_WHICH', payload: 'PRIVATE' });
    }
    const profilePressed = () => {
        dispatch({ type: 'UPDATE_WHICH', payload: 'PROFILE' });
    }

    return (
        <div className='flex items-center w-full h-20 px-4 bg-purple-200 text-purple-800 fixed z-10'>
            <ul className='w-screen flex justify-center text-2xl'>
                <li onClick={publicPressed} className='p-2 rounded-md border-2 border-gray-500 cursor-pointer hover:scale-105 duration-100 mr-10 '>Public</li>
                <li onClick={privatePressed} className='p-2 rounded-md border-2 border-gray-500 cursor-pointer hover:scale-105 duration-100'>Private</li>
            </ul>
            <p onClick={profilePressed} className='fixed right-5 text-xl border-2 border-gray-500 rounded-full p-2 cursor-pointer hover:scale-105 duration-100'>Profile</p>
        </div>
    )
}

export default Navbar
