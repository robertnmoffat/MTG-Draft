import { useEffect, useRef, useState } from "react";
import Card from "./Card"


function PackDisplay(properties) {
    let emptyPack = [];
    //Create empty pack data while loading data from API.
    for (let i = 0; i < 14; i++) {
        emptyPack[i] = { name: "loading...", imageUrl: "./mtg-back.jpg" };
    }
    let [pack, setPack] = useState(emptyPack);
    let [selectedCards, setSelectedCards] = useState([]);

    //Reference for accessing window size.
    const ref = useRef(null);

    /**
     * If page first loaded, fetch cards from the MTG API.
     */
    useEffect(() => {
        if (pack[0].name === "loading...") {
            fetch("https://api.magicthegathering.io/v1/sets/ktk/booster")
                .then(res => res.json())
                .then(json => {
                    setPack(json.cards);
                }
                )
        }
    }, []);

    //Reset the reference to page height.
    function handleResize() {
        if (ref.current != null)
            properties.setSidebarHeight(ref.current.clientHeight);
    }

    //Call reset to reference of page height when it has changed.
    window.addEventListener('resize', handleResize)

    //Call a resize every time the content is refreshed
    handleResize();

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
        <div ref={ref} id="card-space" className="body-text">
            {pack.map((card, index) => {
                return <Card selectCard={selectCard} key={index} id={index} imageUrl={card.imageUrl} />
            })}
        </div>
    );
}

export default PackDisplay;