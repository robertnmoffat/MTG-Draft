import { useEffect } from "react";
import { useState } from "react";
import Card from "./Card"

let num = 0;

function App() {
  let emptyPack = [];
  for(let i=0; i<15; i++){
    emptyPack[i]={ name: "loading...", imageUrl:"./mtg-back.jpg" };
  }
  let [pack, setPack] = useState(emptyPack);
  let [selectedCards, setSelectedCards] = useState([]);
  let fetched = false;

  console.log("App" + (num++));

  /**
   * If page first loaded, fetch cards from the MTG API.
   */
  useEffect(() => {
    if (pack[0].name === "loading...") {
      fetch("https://api.magicthegathering.io/v1/sets/ktk/booster")
        .then(res => res.json())
        .then(json => setPack(json.cards))
        .then(console.log("got cards."));
    }
  }, []);


  /**
   * Removes a card from the pack array and adds it to the selectedCards array.
   * @param {Array index of selected card.} index 
   */
  function selectCard(index) {
    console.log("Index:"+index);
    setSelectedCards((old)=>{
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
      {pack.map((card, index) => {
        return <Card selectCard={selectCard} key={index} id={index} imageUrl={card.imageUrl} />
      })}
    </div>
  );
}

export default App;
