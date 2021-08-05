import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ProvideUser } from './services/context/UserState';

ReactDOM.render(
  <React.StrictMode>
    <ProvideUser>
      <App />
    </ProvideUser>
  </React.StrictMode>,
  document.getElementById('root')
);