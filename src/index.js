import './sass/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ProvideUser } from './services/context/UserState';

console.log(process.env.NODE_ENV);

ReactDOM.render(
  <React.StrictMode>
    <ProvideUser>
      <App />
    </ProvideUser>
  </React.StrictMode>,
  document.getElementById('root')
);