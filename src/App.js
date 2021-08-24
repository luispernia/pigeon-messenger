import { useEffect } from "react";
import Routes from "./components/Routes";
import useCookies from "./components/useCookies";

function App() {

  const cookie = useCookies();

  useEffect(() => {
    console.log(cookie);
    console.log(process.env.API);
    console.log(process.env.CLIENT_ID);
  }, [])

  return <Routes />;
}



export default App;
