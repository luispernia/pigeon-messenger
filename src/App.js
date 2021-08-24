import { useEffect } from "react";
import Routes from "./components/Routes";
import useCookies from "./components/useCookies";


function App() {

  const cookie = useCookies();

  useEffect(() => {
      alert(cookie? "Cookies allowed" : "Cookies not allowed please turn on");
  }, [cookie])

  return <Routes />;
}



export default App;
