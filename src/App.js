import React from 'react';

import Room from './components/Room';
import Login from './components/Login';
import Navbar from './components/Navbar';
import PrivateHome from './components/PrivateHome';

import { useGlobal } from './globals/Globals';

const App = () => {
  const { state } = useGlobal();

  const render = () => {
    switch (state.which) {
      case 'ROOM':
        return <Room />
      case 'PRIVATE':
        return <PrivateHome />
      default:
        return (<></>)
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