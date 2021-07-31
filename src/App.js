// import logo from './logo.svg';
import './App.scss';
import Routes from "./components/Routes";
import { ProvideAuth } from './services/context/UserContext';
import { useEffect } from 'react';


function App() {

  return (
    <div className="App">
      <ProvideAuth>
        <Routes />
      </ProvideAuth>
    </div>
  );
}



export default App;
