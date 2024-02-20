import React, { memo, useEffect, useState } from 'react';
import aws from 'aws-sdk';

import Youtube from 'react-youtube';
import {TwitchPlayer} from 'react-twitch-embed';

import { WEBSOCKET, s3_data } from '../Links';
import { fetchData, postData, deleteData } from '../globals/Crud';

import { useGlobal } from '../globals/Globals';

import loadingImage from '../assets/loading.gif';

const MemoizedTwitchPlayer = memo(TwitchPlayer, (prevProps, nextProps) => {
    return prevProps.video === nextProps.video;
});

const Room = () => {
    const [typed, setTyped] = useState('');
    const [links, setLinks] = useState([]);

    const {state, dispatch} = useGlobal();

    const table = 'songlinks';

    const s3 = new aws.S3({
        region: s3_data.S3_REGION,
        accessKeyId: s3_data.S3_ACCESS_KEY,
        secretAccessKey: s3_data.S3_SECRET_KEY,
        signatureVersion: 'v4'
    });

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
        const fileEnded = async() => {
            videoEnded();
            const params = {
                Bucket: s3_data.S3_NAME,
                Key: `${links[0].id}`
            };
            await s3.deleteObject(params, (err) => {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log("successfully deleted");
                }
            });
        }
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
                    return <MemoizedTwitchPlayer key={id} video={videoId} autoplay={true} muted={false} width={600} height={400} onEnded={() => videoEnded()} />
                case 's3_audio':
                    console.log(videoId);
                    return (
                        <audio key={id} controls autoPlay={true} onEnded={() => fileEnded()}>
                            <source src={videoId} type="audio/mpeg"/>
                        </audio>
                    );
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
        } else if (url.indexOf('twitch') !== -1) {
            type = 'twitch';
            let startIndex = url.indexOf('videos/')
            if (startIndex === -1) {
                startIndex = url.indexOf('-') + 1;
            } else {
                startIndex += 7
            }
            videoId = url.substring(startIndex);
        } else {
            if (url.indexOf('mp3') !== -1) type = 's3_audio';
            else type = 's3_video';

            videoId = `https://${s3_data.S3_NAME}.s3.${s3_data.S3_REGION}.amazonaws.com/${id}`;
        }

        return (
            <div className=''>
                <p className='text-xl text-center bg-green-100 mb-2 p-2 rounded-xl'>{url}</p>
                {links.length>0 && typeOfLink(type, videoId, id)}
            </div>
        )
    }

    const createId = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        return year + month + day + hours + minutes + seconds;
    }

    const setLink = async(e) => {
        e.preventDefault();
        
        if ((String)(typed).indexOf("https://www.") !== -1) {
            dispatch({ type: 'UPDATE_LOADING', payload: true });

            const id = createId();

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

    const upload = async(e) => {
        const file = e.target.files[0];

        const id = createId();
        const params = ({
            Bucket: s3_data.S3_NAME,
            Key: id,
            Expires: 60,
        });

        dispatch({ type: 'UPDATE_LOADING', payload: true });
        const url = await s3.getSignedUrlPromise('putObject', params);

        await fetch(url, {
            method: "PUT",
            body: file
        });

        const arg = {
            link: file.name, 
            id: parseInt(id),
            room: state.room
        }
        await postData(arg, table);
    }

    return (
        <div className='w-full h-screen bg-purple-300 pt-20 absolute'>
            <p className='w-full absolute text-center text-4xl border-b-4 pb-3 bg-purple-400 font-bold'>{state.room}</p>
            <div className='w-full h-full pt-16 flex justify-center'>
                <div className='w-1/2 h-full flex flex-col items-center'>
                    {!state.loading ? <h1 className='text-4xl mb-5 mt-5'>Enter [YouTube | Twitch] Link</h1> : showLoading()}
                    <div className='w-full text-xl pb-5 flex justify-center'>
                        <form onSubmit={setLink} className='w-4/5 flex'>
                            <input className='w-full h-10 mr-1 rounded-lg pl-3 border-2 border-black' value={typed} onChange={(e) => setTyped(e.target.value)} placeholder='Type link' />
                            <button className='h-10 rounded-lg bg-gray-300 px-6 mr-1 border-2 border-black hover:scale-105 duration-100' type="submit">Queue</button>
                        </form>
                        <form className='flex items-center'>
                            <input type='file' accept="audio/mp3" id='fileInput' className='hidden' onChange={upload} />
                            <label htmlFor='fileInput' className='h-10 rounded-lg bg-gray-300 px-6 pt-1 border-2 border-black hover:scale-105 duration-100 cursor-pointer'>Upload</label>
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