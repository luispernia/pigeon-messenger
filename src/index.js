import './sass/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ProvideUser } from './services/context/UserState';
import {CookiesProvider} from "react-cookie";
 
ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <ProvideUser>
        <App />
      </ProvideUser>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);