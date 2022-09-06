import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import { log } from '@shareit/shareit-hybird-js-sdk';
import { getUrlParam } from './common/js/utils';

function App() {
  useEffect(() => {
    log({
      params: {
        eventId: 'show_ve',
        pve_cur: process.env.REACT_APP_REPLACE_LOG_PVE_CUR + '/0',
        extras: process.env.REACT_APP_REPLACE_LOG_EXTRAS,
        portal: getUrlParam('portal'),
      },
    });
  });
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className='App-link' href='https://reactjs.org' target='_blank' rel='noopener noreferrer'>
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
