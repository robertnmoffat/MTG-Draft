import { useState } from "react";
import { useRef } from "react";
import Header from "./Header"
import Sidebar from "./Sidebar"
import PackDisplay from "./PackDisplay"
import { useEffect } from "react";

let num = 0;

function App() {
  //Height of sidebar. To be adjusted as cards are selected.
  let [sidebarHeight, setSidebarHeight] = useState("100vh");
  //Cards that have been selected in the draft. To be displayed on the sidebar.
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
