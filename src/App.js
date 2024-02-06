import React from 'react';

import Room from './components/Room';
import Login from './components/Login';
import Navbar from './components/Navbar';
import PrivateHome from './components/PrivateHome';
import Profile from './components/Profile';

import { useGlobal } from './globals/Globals';

const App = () => {
  const { state } = useGlobal();

  const render = () => {
    switch (state.which) {
      case 'PUBLIC':
        return <Room />
      case 'PRIVATE':
        return <PrivateHome />
      case 'PROFILE':
        return <Profile />
    }
  }

  return (
    <div>
      { state.username!=='' && <Navbar /> }
      { state.username==='' ? <Login /> : render() }
    </div>
  )
}

export default App