import React, { createContext, useReducer, useContext } from 'react';

const initalState = {
    username: '',
    loading: false,
    which: 'ROOM',
    room: 'public',
};

const GlobalContext = createContext();

const globalReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_USERNAME':
            return { 
                ...state, 
                username: action.payload
            };
        case 'UPDATE_WHICH':
            return {
                ...state,
                which: action.payload
            };
        case 'UPDATE_LOADING':
            return {
                ...state,
                loading: action.payload
            }
        case 'UPDATE_ROOM':
            return {
                ...state,
                room: action.payload
            }
        default:
            return state;
    }
};

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(globalReducer, initalState);

    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
  };