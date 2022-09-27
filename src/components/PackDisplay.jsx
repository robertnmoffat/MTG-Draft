import { useEffect, useRef, useState } from "react";
import Card from "./Card"
import Pack from "../Pack"
import MtgSetController from "../MtgSetController"
import SetDisplay from "./SetDisplay";


/**
 * Component to display sets for the user to pick and then to display cards from packs for drafting.
 * @param {setSelectedCards: Function to add card to players picked cards, setSidebarHeight: Function for resizing height of sidebar} properties 
 * @returns 
 */
function PackDisplay(properties) {
    let [packsData, setPacksData] = useState({ packs: [[], [], [], [], [], [], [], []], currentPackIndex: 0 });
    let [coloursPicked, setColoursPicked] = useState({ R: 0, G: 0, U: 0, B: 0, W: 0 });
    let [sets, setSets] = useState([]);
    let [selectedSets, setSelectedSets] = useState({ names: ['___', '___', '___'], finishedPicking: false, currentSetIndex: 0 });
    let [phase, setPhase] = useState(0);

    //Reference for accessing window size.
    const ref = useRef(null);

    /**
     * If page first loaded, fetch cards from the MTG API.
     */
    useEffect(() => {
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

    /**
     * Reset the reference to page height.
     */
    function handleResize() {
        if (ref.current != null)
            properties.setSidebarHeight(ref.current.clientHeight);
    }

    /**
     * Copies the card at the given index of the current pack into the selected cards array.
     * The card is then removed from the current pack.
     * Updating of computer player packs is done and then checks for empty finished packs.
     * @param {Index of selected card within current pack} index 
     * @returns 
     */
    function selectCard(index) {
        if (packsData.packs[packsData.currentPackIndex % 8].length === 0 || packsData.packs[packsData.currentPackIndex % 8][index].name === "loading...") {
            return;
        }

        let currentSet = selectedSets.currentSetIndex;
        setPacksData((old) => {
            let playerCount = 8;

            if (old.packs[old.currentPackIndex % playerCount][index].colors != undefined &&
                old.packs[old.currentPackIndex % playerCount][index].colors != NaN) {
                console.log("color array")
                console.log(old.packs[old.currentPackIndex % playerCount][index].colors)
                console.log(old.packs[old.currentPackIndex % playerCount][index].colors.length)
                let colors = [];
                for (let i = 0; i < old.packs[old.currentPackIndex % playerCount][index].colors.length; i++) {
                    console.log(old.packs[old.currentPackIndex % playerCount][index].colors[i])
                    colors.push(old.packs[old.currentPackIndex % playerCount][index].colors[i]);
                }
                setColoursPicked((oldC) => {
                    for (let i = 0; i < colors.length; i++) {
                        switch (colors[i]) {
                            case 'W':
                                oldC.W = oldC.W + 1;
                                break;
                            case 'B':
                                oldC.B = oldC.B + 1;
                                break;
                            case 'U':
                                oldC.U = oldC.U + 1;
                                break;
                            case 'R':
                                oldC.R = oldC.R + 1;
                                break;
                            case 'G':
                                oldC.G = oldC.G + 1;
                                break;
                        }
                    }
                    return { ...oldC }
                })
            }

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
                if (currentSet > 2) {
                    setPhase(2);
                    return;
                }
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
                            if (currentSet > 2) {
                                setPhase(2);
                                return;
                            }
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

    switch (phase) {
        case 0:
            return (
                <SetDisplay
                    finishedPicking={selectedSets.finishedPicking}
                    setPhase={setPhase}
                    names={selectedSets.names}
                    sets={sets}
                    addSet={addSet}
                    setSidebarHeight={properties.setSidebarHeight}
                />
            );

        case 1:
            return (
                <div ref={ref} id="card-space" className="body-text">
                    <div style={{ borderBottom: "solid" }}>
                        <p>White:{coloursPicked.W} Blue:{coloursPicked.U} Black:{coloursPicked.B} Red:{coloursPicked.R} Green:{coloursPicked.G} </p>
                    </div>
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

        case 2:
            return <div id="card-space" className="body-text">
                <h2>Draft Complete</h2>
            </div>
    }
}

export default PackDisplay;