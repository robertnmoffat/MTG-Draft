import { useState } from "react";
import { useRef } from "react";
import Header from "./Header"
import Sidebar from "./Sidebar"
import PackDisplay from "./PackDisplay"
import { useEffect } from "react";

let num = 0;

function App() {
  let [sidebarHeight, setSidebarHeight] = useState("100vh");
  let [selectedCards, setSelectedCards] = useState([]);

  return (
    <div className="App">
      <Header />
      <Sidebar
        selectedCards={selectedCards}
        height={sidebarHeight}
      />
      <PackDisplay
        setSelectedCards={setSelectedCards}
        setSidebarHeight={setSidebarHeight}
      />
    </div>
  );
}

export default App;
