import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import Card from "./Card"
import Header from "./Header"
import Sidebar from "./Sidebar"

let num = 0;

function App() {
  let emptyPack = [];
  for (let i = 0; i < 15; i++) {
    emptyPack[i] = { name: "loading...", imageUrl: "./mtg-back.jpg" };
  }
  let [pack, setPack] = useState(emptyPack);
  let [selectedCards, setSelectedCards] = useState([]);
  let [sidebarHeight, setSidebarHeight] = useState("100vh");

  //Reference for accessing window size.
  const ref = useRef(null);

  let fetched = false;

  console.log("App" + (num++));

  /**
   * If page first loaded, fetch cards from the MTG API.
   */
  useEffect(() => {
    if (pack[0].name === "loading...") {
      fetch("https://api.magicthegathering.io/v1/sets/ktk/booster")
        .then(res => res.json())
        .then(json => {
          setPack(json.cards);
          //Match sidebar height to page after cards have been loaded.
          setSidebarHeight(ref.current.clientHeight);
        }
        )
      //Call reset to reference of page height when it has changed.
      window.addEventListener('resize', handleResize)
    }
  }, []);

  //Reset the reference to page height.
  function handleResize(){
    setSidebarHeight(ref.current.clientHeight);
  }


  /**
   * Removes a card from the pack array and adds it to the selectedCards array.
   * @param {Array index of selected card.} index 
   */
  function selectCard(index) {
    console.log("Index:" + index);
    setSelectedCards((old) => {
      return [...old, pack[index]];
    });
    setPack((old) => {
      return old.filter((card, i) => {
        return i !== index;
      });
    });
  }

  return (
    <div className="App">
      <Header />
      <Sidebar height={sidebarHeight} />
      <div ref={ref} id="card-space" className="body-text">
        {pack.map((card, index) => {
          return <Card selectCard={selectCard} key={index} id={index} imageUrl={card.imageUrl} />
        })}
      </div>
    </div>
  );
}

export default App;
