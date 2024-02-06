import React, { useState } from 'react';

import { useGlobal } from '../globals/Globals';

import muquImage from '../assets/muqu.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const [isLogin, setIsLogin] = useState(true);

    const { dispatch } = useGlobal();

    const submitted = (e) => {
        e.preventDefault();

        if (isLogin) {
            if (username!=='' && password!=='') {
                // check db
                dispatch({ type: 'UPDATE_USERNAME', payload: username });
            }
        } else {
            if (username!=='' && password!=='' && password2!=='') {
                // check db
                dispatch({ type: 'UPDATE_USERNAME', payload: username });
            }
        }
    }

    return (
        <div className='w-full h-screen flex flex-col items-center bg-gradient-to-b from-purple-200 to-purple-400 text-center'>
            <img src={muquImage} alt='' className='w-1/4 m-10 rounded-3xl' />
            <div className='w-1/3 h-screen justify-center'>
                <form onSubmit={(e) => submitted(e)} className='flex flex-col w-full text-black'>
                    <input onChange={(e) => {setUsername(e.target.value)}} type='text' placeholder='enter username' className='w-full h-30 mb-3 p-4 rounded-md bg-gray-100' />
                    <input onChange={(e) => {setPassword(e.target.value)}} type='text' placeholder='enter password' className='w-full h-30 mb-3 p-4 rounded-md bg-gray-100' />
                    { !isLogin && (
                        <input onChange={(e) => {setPassword2(e.target.value)}} type='text' placeholder='confirm password' className='w-full h-30 mb-3 p-4 rounded-md bg-gray-100' />
                    )}
                    <button type='submit' name='submit' className='mb-2 p-3 rounded-xl bg-gray-400 text-gray-800 text-xl'>{isLogin ? 'Log In' : 'Sign Up'}</button>
                    <button onClick={() => {setIsLogin(!isLogin)}} className='text-md w-auto hover:scale-105 duration-200'>Don't have an account</button>
                </form>
            </div>
        </div>
    );
}

export default Login
