import { useEffect } from "react";
import Routes from "./components/Routes";
import useCookies from "./components/useCookies";
import {client, api, mode} from "./services/config";

function App() {

  const cookie = useCookies();

  useEffect(() => {
    console.log(cookie, client, api, mode);
  }, [])

  return <Routes />;
}



export default App;
