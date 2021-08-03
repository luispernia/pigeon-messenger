// import logo from './logo.svg';
import './App.scss';
import Routes from "./components/Routes";
import { ProvideUser } from './services/context/UserState';

import Docs from "./components/Docs";

function App() {


  return (
    <div className="App">
      <ProvideUser>
        <Routes />
      </ProvideUser>
    </div>
  );
}



export default App;
