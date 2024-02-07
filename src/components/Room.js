import React, { useEffect, useState } from 'react';

import Youtube from 'react-youtube';
import {TwitchPlayer} from 'react-twitch-embed';

import { WEBSOCKET } from '../Links';
import { fetchData, postData, deleteData } from '../globals/Crud';

import { useGlobal } from '../globals/Globals';

import loadingImage from '../assets/loading.gif';

const Room = () => {
    const [typed, setTyped] = useState('');
    const [links, setLinks] = useState([]);

    const {state, dispatch} = useGlobal();

    const table = 'songlinks';

    const updateLinks = (items) => {
        let array = [];
        for (let i = 0; i < items.length; i++) {
            let data = {link: items[i].link, id: items[i].id, room: items[i].room };
            array.push(data);
        }

        let temp = [];
        array.forEach(link => {
            if (link.room === state.room) {
                temp.push(link);
            }
        });
        temp.sort((a,b) => a.id - b.id);
        
        setLinks(temp);
    }

    useEffect(() => {
        const URL = WEBSOCKET;
        const socket = new WebSocket(URL);
        socket.addEventListener('message', (event) => {
            let raw = event.data;
            let items = JSON.parse(raw).Items;
            updateLinks(items);
            dispatch({ type: 'UPDATE_LOADING', payload: false });
        });

        dispatch({ type: 'UPDATE_LOADING', payload: true });
        fetchData(table).then((body) => {
            updateLinks(body);
            dispatch({ type: 'UPDATE_LOADING', payload: false });
        });

        return () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, []);

    const playLink = () => {
        const videoEnded = async() => {
            dispatch({ type: 'UPDATE_LOADING', payload: true });
            const arg = {
                link: links[0].link, 
                id: links[0].id,
                room: state.room
            }
            await deleteData(arg, table);
        }
        const checkEnded = async(e) => {
            if (e.target.getPlayerState() === 0) {
                videoEnded(e);
            }
        }
        const typeOfLink = (type, videoId, id) => {
            const opts = {
                playerVars: {
                    autoplay: 1,
                }
            }
            switch (type) {
                case 'youtube':
                    return <Youtube key={id} videoId={videoId} opts={opts} onStateChange={(e) => checkEnded(e)}/>
                case 'twitch':
                    return <TwitchPlayer key={id} video={videoId} autoplay={true} muted={false} width={600} height={400} onEnded={() => videoEnded()} />
                default:
                    return <></>
            };
        }

        let id = links.length!==0 ? links[0].id : -1;
        let url = links.length!==0 ? (String)(links[0].link) : "";

        let type;
        let videoId;
        if (url.indexOf('youtube') !== -1) {
            type = 'youtube';
            videoId = url.substring(url.indexOf("=")+1);
        } else {
            type = 'twitch';
            videoId = url.substring(url.indexOf('videos/')+7);
        }

        return (
            <div className=''>
                <p className='text-xl text-center bg-green-100 mb-2 p-2 rounded-xl'>{url}</p>
                {links.length>0 && typeOfLink(type, videoId, id)}
            </div>
        )
    }

    const setLink = async(e) => {
        e.preventDefault();
        
        if ((String)(typed).indexOf("https://www.") !== -1) {
            dispatch({ type: 'UPDATE_LOADING', payload: true });

            const currentDate = new Date();
            const year = currentDate.getFullYear().toString();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.getDate().toString().padStart(2, '0');
            const hours = currentDate.getHours().toString().padStart(2, '0');
            const minutes = currentDate.getMinutes().toString().padStart(2, '0');
            const seconds = currentDate.getSeconds().toString().padStart(2, '0');
            const id = year + month + day + hours + minutes + seconds;

            const arg = {
                link: typed, 
                id: parseInt(id),
                room: state.room
            }
            await postData(arg, table);
            setTyped("");
        }
    }

    const showLoading = () => {
        return (
            <div className='z-5 w-screen flex justify-center'>
                <img src={loadingImage} alt='' className='w-20' />
            </div>
        )
    }

    const upload = () => {
        alert("WOW");
    }

    return (
        <div className='w-full h-screen bg-purple-300 pt-20 absolute'>
            <p className='w-full absolute text-center text-4xl border-b-4 pb-3 bg-purple-400 font-bold'>{state.room}</p>
            <div className='w-full h-full pt-16 flex justify-center'>
                <div className='w-1/2 h-full flex flex-col items-center'>
                    {!state.loading ? <h1 className='text-4xl mb-5 mt-5'>Enter [Youbtube | Twitch] Link</h1> : showLoading()}
                    <div className='w-full text-center text-xl pb-5'>
                        <form onSubmit={setLink} className=''>
                            <input className='w-1/2 h-10 mr-1 rounded-lg pl-3 border-2 border-black' value={typed} onChange={(e) => setTyped(e.target.value)} placeholder='Type link' />
                            <button className='h-10 rounded-lg bg-gray-300 px-10 mr-1 border-2 border-black hover:scale-105 duration-100' type="submit">Play</button>
                            <button className='h-10 rounded-lg bg-gray-300 px-7 border-2 border-black hover:scale-105 duration-100' onClick={()=>{upload()}}>Upload</button>
                        </form>
                    </div>
                    <div className='text-center'>
                        {playLink()}
                    </div>
                </div>
                <div className='w-1/3 h-full mr-5 text-center'>
                    <p className='text-2xl text-black mt-2 bg-purple-400 border-2 border-black'>In Queue:</p>
                    {links.slice(1).map((link, index) => (
                        <div className='text-xl mt-2 border-2 border-purple-600 bg-purple-100 p-1' key={index}>
                            <p>{link.link}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Room;