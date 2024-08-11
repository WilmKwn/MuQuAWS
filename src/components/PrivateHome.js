import React, { useEffect, useState } from 'react'

import { WBSOCKET_PRIVATE } from '../Links';
import { deleteData, fetchData, postData } from '../globals/Crud';
import { useGlobal } from '../globals/Globals';

import lockImage from '../assets/lock.jpg';
import loadingImage from '../assets/loading.gif';

const PrivateHome = () => {
    const [rooms, setRooms] = useState([]);

    const [isCreate, setIsCreate] = useState(false);
    const [isPassowrd, setIsPassword] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [myPassword, setMyPassword] = useState('');
    const [currIndex, setCurrIndex] = useState(-1);

    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');

    const {state, dispatch} = useGlobal();

    useEffect(() => {
        const URL = WBSOCKET_PRIVATE;
        const socket = new WebSocket(URL);
        socket.addEventListener('message', (event) => {
            let raw = event.data;
            let items = JSON.parse(raw).data;
            setRooms(items);
            dispatch({ type: 'UPDATE_LOADING', payload: false });
        });

        dispatch({ type: 'UPDATE_LOADING', payload: true });
        fetchData('muqu_rooms').then((body) => {
            setRooms(body);
            dispatch({ type: 'UPDATE_LOADING', payload: false });
        });

        return () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        }
    }, []);

    const createTable = (name, argPassword) => {
        let valid = true;
        rooms.map((room) => {
            if (room.name === name) {
                valid = false;
                return;
            }
        });

        if (valid) {
            const arg = {
                link: name,
                id: state.username,
                password: argPassword
            };
            dispatch({ type: 'UPDATE_LOADING', payload: true });
            postData(arg, 'muqu_rooms');
            setIsCreate(false);
        } else {
            alert("ROOM NAME ALREADY EXISTS!!");
        }
    }

    const createRoom = (e) => {
        const pass = password;

        e.preventDefault();
        if (isPassowrd) {
            if (roomName!=='' && pass!=='') {
                createTable(roomName, pass);
            }
        } else {
            if (roomName!=='') {
                createTable(roomName, "");
            }
        }
    }

    const roomClicked = (e, index) => {
        e.preventDefault();

        const curr = rooms[showPassword ? currIndex : index];
        if (showPassword && myPassword !== curr.password) {
            alert("Wrong password");
        } else {
            dispatch({ type: 'UPDATE_WHICH', payload: 'ROOM' });
            dispatch({ type: 'UPDATE_ROOM', payload: curr.name });
        }
    }

    const passwordTrue = (p) => {
        return p!=='' && p!==undefined;
    }
    const clickOnLocked = (index) => {
        setShowPassword(true);
        setCurrIndex(index);
    }
    const clickOnDelete = async(e, index) => {
        const arg = {
            link: rooms[index].name, 
            id: rooms[index].creator
        }
        dispatch({ type: 'UPDATE_LOADING', payload: true });
        await deleteData(arg, 'muqu_rooms');
        setShowPassword(false);
    }

    return (
        <div className='w-full h-screen flex flex-col items-center bg-purple-300 pt-20 absolute'>
            <div className='w-1/2 h-screen bg-purple-200 mt-5 mb-5 border-2 px-0 border-purple-700 rounded-3xl flex flex-col items-center'>
                <button onClick={()=>{setIsCreate(true)}} className='absolute right-1/4 mr-5 text-4xl border-2 border-purple-400 rounded-full hover:scale-105 duration-200'>+</button>
                {state.loading ? <img src={loadingImage} alt='' className='w-14'/> : <p className='text-4xl mt-2 w-full text-center pb-2 border-b-2 border-purple-700'>ROOMS</p>}
                {rooms.map(({name, creator, password}, index) => (
                    <div key={index} onClick={(e) => {passwordTrue(password) ? clickOnLocked(index) : roomClicked(e, index) }} className='z-1 w-4/5 text-center mt-2 rounded-lg border-2 border-purple-700 hover:scale-105 duration-150'>
                        <div className='flex justify-center'>
                            <p key={index} className='text-xl p-3'>{name}</p>
                            {password!=='' && password!==undefined && <img src={lockImage} alt='' className='w-7 h-7 mt-3' />}
                        </div>
                        {creator===state.username && <button onClick={(e)=>{clickOnDelete(e, index); e.stopPropagation()}} key={index} className='z-20 bg-red-400 p-1 rounded-lg'>delete</button>}
                    </div>
                ))}
                {showPassword && !state.loading && (
                    <div className='fixed w-1/4 h-1/5 rounded-xl bg-gray-400 mt-10'>
                        <form onSubmit={roomClicked} className='h-screen mt-10 flex flex-col items-center w-full'>
                            <input className='w-3/4 h-10 mr-1 mb-2 rounded-lg pl-3' value={myPassword} onChange={(e) => setMyPassword(e.target.value)} placeholder='Enter Password' />
                            <div className='w-3/4 text-center'>
                                <button className='w-auto h-10 rounded-lg bg-gray-300 px-10 hover:scale-105 duration-100' type="submit">Enter</button>
                                <button onClick={()=>{setShowPassword(false)}} className='w-auto h-10 rounded-lg bg-red-300 px-10 hover:scale-105 duration-100'>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            {isCreate && (
                <div className='fixed w-1/3 h-1/2 rounded-xl bg-purple-400 border-2 border-black z-10 mt-12 flex flex-col items-center'>
                    <p className='text-2xl mt-2 pb-2 border-b-2 w-full text-center'>Create New Room</p>
                    <form onSubmit={(e) => {createRoom(e)}} className='h-screen mt-10 flex flex-col items-center w-full'>
                        <input className='w-1/2 h-10 mr-1 mb-2 rounded-lg pl-3' value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder='Enter room name' />
                        {isPassowrd && <input className='w-1/2 h-10 mr-1 mb-2 rounded-lg pl-3' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter password' />}
                        <div className='w-1/2 '>
                            <button className='w-auto h-10 rounded-lg bg-green-400 px-10 hover:scale-105 duration-100' type="submit">Create</button>
                            <button onClick={()=>{setIsCreate(false)}} className='w-auto h-10 rounded-lg bg-red-300 px-10 hover:scale-105 duration-100'>Cancel</button>
                        </div>
                        <p onClick={()=>{setIsPassword(!isPassowrd)}} className='text-md mt-5 cursor-pointer hover:scale-105 duration-100'>Set Password</p>
                    </form>
                </div>
            )}
        </div>
    )
}

export default PrivateHome
