import React, { useEffect, useState } from 'react'

const PrivateHome = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        // fetch rooms from db
        setRooms([1,2,3]);
    }, []);

    return (
        <div className='w-full h-screen flex flex-col items-center bg-purple-300 pt-20 absolute'>
            <div className='w-1/2 h-screen bg-purple-200 mt-5 mb-5 border-2 border-purple-700 rounded-3xl flex flex-col items-center'>
                <p className='text-4xl mt-2 w-full text-center pb-2 border-b-2 border-purple-700'>ROOMS</p>
                {rooms.map((room, index) => (
                    <p key={index} className='text-xl w-4/5 text-center mt-2 p-3 rounded-lg border-2 border-purple-700 hover:scale-105 duration-150'>{room}</p>
                ))}
            </div>
        </div>
    )
}

export default PrivateHome
