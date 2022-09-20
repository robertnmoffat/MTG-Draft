import { useState } from "react";
import { useRef } from "react";
import Header from "./Header"
import Sidebar from "./Sidebar"
import PackDisplay from "./PackDisplay"

let num = 0;

function App() {  
  let [sidebarHeight, setSidebarHeight] = useState("100vh");

  //Reference for accessing window size.
  const ref = useRef(null);

  return (
    <div className="App">
      <Header />
      <Sidebar setSidebarHeight={setSidebarHeight} height={sidebarHeight} />
      <PackDisplay />
    </div>
  );
}

export default App;
