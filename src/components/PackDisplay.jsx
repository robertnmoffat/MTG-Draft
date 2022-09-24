import { useEffect, useRef, useState } from "react";
import Card from "./Card"
import Pack from "../Pack"
import MtgSetController from "../MtgSetController"
import MtgSet from "./MtgSet";


function PackDisplay(properties) {
    //let [pack, setPack] = useState(Pack.getEmptyPack());
    let [packsData, setPacksData] = useState({ packs: [[], [], [], [], [], [], [], []], currentPackIndex: 0 });
    //let [currentPackIndex, setCurrentPackIndex] = useState(0);
    let [sets, setSets] = useState([]);
    let [selectedSets, setSelectedSets] = useState(['___', '___', '___']);
    let [picking, setPicking] = useState(false);
    let [threeSetsPicked, setThreeSetsPicked] = useState(false);

    //Reference for accessing window size.
    const ref = useRef(null);

    /**setPack
     * If page first loaded, fetch cards from the MTG API.
     */
    useEffect(() => {
        //if (pack[0].name === "loading...") {            
        if (packsData.packs[0].length === 0) {
            MtgSetController.fetchSets(setSets);
            setPacksData((old) => {
                for (let i = 0; i < 8; i++) {
                    old.packs[i] = Pack.getEmptyPack();
                }
                return { ...old };
            });
        }

        //Call reset to reference of page height when it has changed.
        window.addEventListener('resize', handleResize)
    }, []);

    /**
     * This useEffect is to be called every time the component is refreshed.
     */
    useEffect(() => {
        //Call a resize every time the content is refreshed
        handleResize();
    });

    //Reset the reference to page height.
    function handleResize() {
        if (ref.current != null)
            properties.setSidebarHeight(ref.current.clientHeight);
    }

    function selectCard(index) {
        if (packsData.packs[packsData.currentPackIndex % 8].length === 0 || packsData.packs[packsData.currentPackIndex % 8][index].name === "loading...") {
            return;
        }

        setPacksData((old) => {
            let playerCount = 8;
            let selectedCard = old.packs[old.currentPackIndex % playerCount][index];
            Pack.selectCard(properties.setSelectedCards, selectedCard);
            old.packs[old.currentPackIndex % playerCount].splice(index, 1);

            for (let i = 0; i < 8; i++) {
                if (i !== (old.currentPackIndex % playerCount) && old.packs[i][0].name !== "loading...") {
                    old.packs[i].splice(0, 1);
                    if (old.packs[i].length === 0) {
                        old.currentPackIndex = -1;
                        for (let i = 0; i < 8; i++) {
                            old.packs[i] = Pack.getEmptyPack();
                        }
                        break;
                    }
                }
            }


            old.currentPackIndex++;

            if (old.packs[old.currentPackIndex % playerCount].length === 0 || old.packs[old.currentPackIndex % playerCount][0].name === "loading...") {
                Pack.fetchPack(setPacksData, selectedSets[0], (old.currentPackIndex % playerCount));
            }
            return { ...old }
        });
    }

    function addSet(abbr) {
        setSelectedSets((old) => {
            if (old[0] === "___") {
                old[0] = abbr;
                return old;
            } else if (old[1] === "___") {
                old[1] = abbr;
                return old;
            } else if (old[2] === "___") {
                old[2] = abbr;
                setThreeSetsPicked(true);
                Pack.fetchPack(setPacksData, selectedSets[0]);
                return old;
            } else {
                return old;
            }
        });
        setSelectedSets((old) => [...old]);
    }

    if (picking) {
        return (
            <div ref={ref} id="card-space" className="body-text">
                {packsData.packs[packsData.currentPackIndex % 8].map((card, index) => {
                    return (
                        <Card
                            name={card.name}
                            mana={card.manaCost}
                            text={card.text}
                            power={card.power}
                            toughness={card.toughness}
                            isSelected="false"
                            selectCard={selectCard}
                            key={index}
                            id={index}
                            imageUrl={card.imageUrl}
                        />
                    )
                })}
            </div>
        );
    } else {
        return (
            <div ref={ref} id="card-space" className="body-text">
                {threeSetsPicked ? <button onClick={() => setPicking(true)}>Done</button> : <h2>Select three sets</h2>}
                <div id="selected-sets">
                    <h1>{selectedSets[0]} + {selectedSets[1]} + {selectedSets[2]}</h1>
                </div>
                <div id="all-set-components">
                    {sets.filter((old, index) => index < 100).map((set, index) => {
                        return (
                            <MtgSet
                                key={index}
                                name={set.name}
                                type={set.type}
                                releaseDate={set.releaseDate}
                                abbr={set.code}
                                addSet={addSet}
                            />
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default PackDisplay;