import { useEffect } from "react";
import Routes from "./components/Routes";
import useCookies from "./components/useCookies";

function App() {

  const cookie = useCookies();

  useEffect(() => {
    console.log(cookie);
  }, [])

  return <Routes />;
}



export default App;
