import { useEffect, useRef, useState } from "react";
import Card from "./Card"
import Pack from "../Pack"
import MtgSetController from "../MtgSetController"
import SetDisplay from "./SetDisplay";



function PackDisplay(properties) {
    //let [pack, setPack] = useState(Pack.getEmptyPack());
    let [packsData, setPacksData] = useState({ packs: [[], [], [], [], [], [], [], []], currentPackIndex: 0 });
    //let [currentPackIndex, setCurrentPackIndex] = useState(0);
    let [sets, setSets] = useState([]);
    let [selectedSets, setSelectedSets] = useState({ names: ['___', '___', '___'], finishedPicking: false, currentSetIndex: 0 });
    let [pickingCards, setPickingCards] = useState(false);
    //let [threeSetsPicked, setThreeSetsPicked] = useState(false);

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

        let currentSet = selectedSets.currentSetIndex;
        setPacksData((old) => {

            let playerCount = 8;
            let selectedCard = old.packs[old.currentPackIndex % playerCount][index];
            Pack.selectCard(properties.setSelectedCards, selectedCard);
            old.packs[old.currentPackIndex % playerCount].splice(index, 1);
            console.log('Removed card.')

            //If player pack empty after pick
            if (old.packs[old.currentPackIndex % playerCount].length === 0) {
                console.log('Pack size zero triggered.')
                old.currentPackIndex = -1;
                for (let i = 0; i < 8; i++) {
                    old.packs[i] = Pack.getEmptyPack();
                }
                currentSet++;
            } else {
                for (let i = 0; i < 8; i++) {
                    if (i !== (old.currentPackIndex % playerCount) && old.packs[i][0].name !== "loading...") {
                        old.packs[i].splice(0, 1);
                        console.log('   Removed card from pack ' + i)
                        //If current computer pack empty after pick
                        if (old.packs[i].length === 0) {
                            console.log('Pack size zero triggered.')
                            old.currentPackIndex = -1;
                            for (let i = 0; i < 8; i++) {
                                old.packs[i] = Pack.getEmptyPack();
                            }
                            currentSet++;
                            break;
                        }
                    }
                }
            }

            old.currentPackIndex++;
            console.log('Pack index incremented.')

            if (old.packs[old.currentPackIndex % playerCount].length === 0 || old.packs[old.currentPackIndex % playerCount][0].name === "loading...") {
                console.log('Fetching new pack...')
                Pack.fetchPack(setPacksData, selectedSets.names[currentSet], (old.currentPackIndex % playerCount));
            }
            setSelectedSets((old) => {
                old.currentSetIndex = currentSet;
                return { ...old };
            });
            return { ...old }
        });
    }

    function addSet(abbr) {
        setSelectedSets((old) => {
            if (old.names[0] === "___") {
                old.names[0] = abbr;
                return old;
            } else if (old.names[1] === "___") {
                old.names[1] = abbr;
                return old;
            } else if (old.names[2] === "___") {
                old.names[2] = abbr;
                setSelectedSets((old) => {
                    old.finishedPicking = true;
                    return { ...old };
                });
                Pack.fetchPack(setPacksData, selectedSets.names[0]);
                return old;
            } else {
                return old;
            }
        });
        setSelectedSets((old) => { return { ...old } });
    }

    if (pickingCards) {
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
            <SetDisplay 
                finishedPicking={selectedSets.finishedPicking}
                setPickingCards={setPickingCards}
                names={selectedSets.names}
                sets={sets}                
                addSet={addSet}
                setSidebarHeight={properties.setSidebarHeight}
            />
        );
    }
}

export default PackDisplay;

//selectedSets.finishedPicking      finishedPicking
//setPickingCards()                 setPickingCards
//selectedSets.names[0] [1] [2]     names
//sets                              sets