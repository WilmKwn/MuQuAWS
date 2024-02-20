import React, { useState } from 'react';

import { useGlobal } from '../globals/Globals';
import { fetchData, postData } from '../globals/Crud';

import muquImage from '../assets/muqu.png';
import loadingImage from '../assets/loading.gif';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const [isLogin, setIsLogin] = useState(true);

    const { state, dispatch } = useGlobal();

    const submitted = (e) => {
        e.preventDefault();

        if (isLogin) {
            if (username!=='' && password!=='') {
                dispatch({ type: 'UPDATE_LOADING', payload: true });
                fetchData('users').then((body) => {
                    dispatch({ type: 'UPDATE_LOADING', payload: false });
                    const users = body;
                    
                    const user = users.find(user => user.username === username);
                    if (user !== undefined) {
                        if (user.password === password) {
                            dispatch({ type: 'UPDATE_USERNAME', payload: username });
                            dispatch({ type: 'UPDATE_WHICH', payload: 'PRIVATE' });
                        } else {
                            alert("Wrong password");
                        }
                    } else {
                        alert("Account does not exist");
                    }
                });
            }
        } else {
            if (username!=='' && password!=='') {
                dispatch({ type: 'UPDATE_LOADING', payload: true });
                fetchData('users').then((body) => {
                    dispatch({ type: 'UPDATE_LOADING', payload: false });
                    const users = body;
                    if (users.some(user => user.username === username)) {
                        alert("User already exists");
                    } else {
                        if (password === password2) {
                            const args = {
                                link: username,
                                id: password
                            }
                            dispatch({ type: 'UPDATE_LOADING', payload: true });
                            postData(args, 'users').then(() => {
                                dispatch({ type: 'UPDATE_LOADING', payload: false });

                                dispatch({ type: 'UPDATE_USERNAME', payload: username });
                                dispatch({ type: 'UPDATE_WHICH', payload: 'PRIVATE' });
                            });
                        } else {
                            alert("Passwords mismatch");
                        }
                    }
                });
            }
        }
    }

    return (
        <div className='w-full h-screen flex flex-col items-center bg-gradient-to-b from-purple-200 to-purple-400 text-center'>
            <img src={muquImage} alt='' className='w-1/4 mb-10 mt-20 rounded-3xl' />
            {state.loading && <img src={loadingImage} alt='' className='w-20 mb-10' />}
            <div className='w-1/3 h-screen justify-center'>
                <form onSubmit={(e) => submitted(e)} className='flex flex-col w-full text-black'>
                    <input onChange={(e) => {setUsername(e.target.value)}} type='text' placeholder='Enter username' className='w-full h-30 mb-3 p-4 rounded-md bg-gray-100' />
                    <input onChange={(e) => {setPassword(e.target.value)}} type='text' placeholder='Enter password' className='w-full h-30 mb-3 p-4 rounded-md bg-gray-100' />
                    { !isLogin && (
                        <input onChange={(e) => {setPassword2(e.target.value)}} type='text' placeholder='Confirm password' className='w-full h-30 mb-3 p-4 rounded-md bg-gray-100' />
                    )}
                    <button type='submit' name='submit' className='mb-2 p-3 rounded-xl bg-gray-400 text-gray-800 text-xl'>
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                    <button onClick={() => {setIsLogin(!isLogin)}} type='button' className='text-md w-auto hover:scale-105 duration-200'>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login
