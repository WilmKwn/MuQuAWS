import React from 'react'

import { useGlobal } from '../globals/Globals'

const Navbar = () => {
    const {state, dispatch} = useGlobal();

    const publicPressed = () => {
        dispatch({ type: 'UPDATE_WHICH', payload: 'ROOM' });
        dispatch({ type: 'UPDATE_ROOM', payload: 'public' });
    }
    const privatePressed = () => {
        dispatch({ type: 'UPDATE_WHICH', payload: 'PRIVATE' });
    }
    
    const logOut = () => {
        dispatch({ type: 'UPDATE_USERNAME', payload: '' });
    }

    return (
        <div className='flex items-center w-full h-20 px-4 bg-purple-200 text-purple-800 fixed z-10'>
            <ul className='w-screen flex justify-center text-2xl'>
                <li onClick={publicPressed} className='p-2 rounded-md border-2 border-gray-500 cursor-pointer hover:scale-105 duration-100 mr-10 '>Public</li>
                <li onClick={privatePressed} className='p-2 rounded-md border-2 border-gray-500 cursor-pointer hover:scale-105 duration-100'>Private</li>
            </ul>
            <button onClick={() => {logOut()}} className='fixed right-3 text-lg w-30 bg-red-400 rounded-3xl p-2 hover:bg-red-300'>Log Out</button>
        </div>
    )
}

export default Navbar
