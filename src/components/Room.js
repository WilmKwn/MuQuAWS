import React, { useEffect, useState } from 'react';
import Youtube from 'react-youtube';

import { WEBSOCKET } from '../Links';
import { fetchData, postData, deleteData } from '../globals/Crud';

import { useGlobal } from '../globals/Globals';

import loadingImage from '../assets/loading.gif';

const Room = () => {
    const [typed, setTyped] = useState('');
    const [links, setLinks] = useState([]);

    const {state, dispatch} = useGlobal();

    const updateLinks = (items) => {
        let array = [];
        for (let i = 0; i < items.length; i++) {
            let data = {link: items[i].link, id: items[i].id};
            array.push(data);
        }
        array.sort((a,b) => a.id - b.id);
        setLinks(array);
    }

    useEffect(() => {
        const URL = WEBSOCKET;
        const socket = new WebSocket(URL);
        socket.addEventListener('message', (event) => {
            let raw = event.data;
            let items = JSON.parse(raw).Items;
            updateLinks(items);
        });

        fetchData().then((body) => {
            updateLinks(body);
        });

        return () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, []);

    const playLink = () => {
        const checkEnded = async(e) => {
            if (e.target.getPlayerState() === 0) {
                dispatch({ type: 'UPDATE_LOADING', payload: true });
                await deleteData(links[0].link, links[0].id);
                dispatch({ type: 'UPDATE_LOADING', payload: false });
            }
        }

        let id = links.length!==0 ? links[0].id : -1;
        let url = links.length!==0 ? (String)(links[0].link) : "";
        let videoId = url.substring(url.indexOf("=")+1);

        const opts = {
            playerVars: {
            autoplay: 1,
            }
        }
        return (
            <div className=''>
                <p className='text-xl text-center bg-green-100 mb-2 p-2 rounded-xl'>{url}</p>
                {links.length>0 ? <Youtube className='' key={id} videoId={videoId} opts={opts} onStateChange={(e) => checkEnded(e)}/> 
                : 
                <h1 className='text-lg font-bold'>Enter something in the queue...🙏</h1>}
            </div>
        )
    }

    const setLink = async(e) => {
        e.preventDefault();
        if ((String)(typed).indexOf("=") !== -1) {
            dispatch({ type: 'UPDATE_LOADING', payload: true });

            const currentDate = new Date();
            const year = currentDate.getFullYear().toString();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.getDate().toString().padStart(2, '0');
            const hours = currentDate.getHours().toString().padStart(2, '0');
            const minutes = currentDate.getMinutes().toString().padStart(2, '0');
            const seconds = currentDate.getSeconds().toString().padStart(2, '0');
            const id = year + month + day + hours + minutes + seconds;

            await postData(typed, parseInt(id));

            dispatch({ type: 'UPDATE_LOADING', payload: false });
            setTyped("");
        }
    }

    const showLoading = () => {
        return (
            <div className='z-5 w-screen flex justify-center'>
                <img src={loadingImage} alt='' className='w-24' />
            </div>
        )
    }

    return (
        <div className='w-full min-h-screen bg-purple-300 flex flex-col items-center pt-20 absolute'>
            {!state.loading ? <h1 className='text-4xl mb-5 mt-5'>Enter Youtube Link</h1> : showLoading()}
            <div className='w-full text-center text-xl pb-5'>
                <form onSubmit={setLink} className=''>
                    <input className='w-1/3 h-10 mr-1 rounded-lg pl-3' value={typed} onChange={(e) => setTyped(e.target.value)} placeHolder='Type link' />
                    <button className='h-10 rounded-lg bg-gray-300 px-10' type="submit">Play</button>
                </form>
            </div>
            <div className='text-center'>
                {playLink()}
                <p className='text-2xl text-black mt-2 bg-purple-400'>In Queue:</p>
                {links.slice(1).map((link, index) => (
                    <div className='text-xl mt-2 border-2 border-purple-600 bg-purple-100 p-1' key={index}>
                        <p>{link.link}</p>
                    </div>
                ))}
            </div>
            <div className='h-10'>

            </div>
        </div>
    )
}

export default Room;