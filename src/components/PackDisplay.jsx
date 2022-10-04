import { useEffect, useRef, useState } from "react";
import Card from "./Card"
import Pack from "../Pack"
import MtgSetController from "../MtgSetController"
import SetDisplay from "./SetDisplay";
import { PieChart } from "react-minimal-pie-chart";


const PLAYER_COUNT = 8;

/**
 * Component to display sets for the user to pick and then to display cards from packs for drafting.
 * @param {setSelectedCards: Function to add card to players picked cards, setSidebarHeight: Function for resizing height of sidebar} properties 
 * @returns 
 */
function PackDisplay(properties) {
    let [packsData, setPacksData] = useState({ packs: [[], [], [], [], [], [], [], []], currentPackIndex: 0 });
    let [pickStats, setPickStats] = useState({ R: 0, G: 0, U: 0, B: 0, W: 0, types: { Creature: 0, Artifact: 0, Instant: 0, Sorcery: 0, Land: 0, Planeswalker: 0, Enchantment: 0 } });
    let [sets, setSets] = useState([]);
    let [selectedSets, setSelectedSets] = useState({ names: ['___', '___', '___'], finishedPicking: false, currentSetIndex: 0 });
    let [phase, setPhase] = useState(0);

    //Reference for accessing window size.
    const ref = useRef(null);

    /**
     * If page first loaded, fetch cards from the MTG API.
     */
    useEffect(() => {
        MtgSetController.fetchSets(setSets);
        //Initialize empty packs. Sets image to card back so that something is shown while API is loading.
        setPacksData((old) => {
            for (let i = 0; i < PLAYER_COUNT; i++) {
                old.packs[i] = Pack.getEmptyPack();
            }
            return { ...old };
        });

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
    function selectCard(cardIndex) {
        //If for some reason the pack is empty or if the pack has not yet been loaded, return without card selection.
        if (packsData.packs[packsData.currentPackIndex % PLAYER_COUNT].length === 0 || packsData.packs[packsData.currentPackIndex % PLAYER_COUNT][cardIndex].name === "loading...") {
            return;
        }

        let currentSet = selectedSets.currentSetIndex;
        setPacksData((old) => {
            //Idex of current pack. Modulus used to keep reference within range of current packs.
            const packIndex = old.currentPackIndex % PLAYER_COUNT;

            //Makes sure that the card has a colour that can be referenced.
            let colors;
            if (old.packs[packIndex][cardIndex].colors != undefined &&
                old.packs[packIndex][cardIndex].colors != NaN) {
                colors = old.packs[packIndex][cardIndex].colors;
            }
            let types = old.packs[packIndex][cardIndex].types;

            //Iterate through each of the card's colours and increment that colour count by one.
            setPickStats((oldC) => {
                if (colors) {
                    for (let i = 0; i < colors.length; i++) {
                        oldC[colors[i]] = oldC[colors[i]] + 1;
                    }
                }
                if (types) {
                    for (let i = 0; i < types.length; i++) {
                        if (oldC.types[types[i]] === undefined) {
                            oldC.types[types[i]] = 1;
                        } else {
                            oldC.types[types[i]] = oldC.types[types[i]] + 1;
                        }
                    }
                }

                return { ...oldC }
            })


            let selectedCard = old.packs[packIndex][cardIndex];
            Pack.selectCard(properties.setSelectedCards, selectedCard);
            //Remove the selected card
            old.packs[packIndex].splice(cardIndex, 1);

            //For each pack, if it isn't the players pack and it isn't loading - remove one card.
            for (let i = 0; i < PLAYER_COUNT; i++) {
                if (old.packs[i][0].name !== "loading...") {
                    if (i !== packIndex) {
                        old.packs[i].splice(0, 1);
                    }
                    //If current computer pack empty after pick reset index and fill with empty cards.
                    if (old.packs[i].length === 0) {
                        old.currentPackIndex = -1;
                        for (let i = 0; i < PLAYER_COUNT; i++) {
                            old.packs[i] = Pack.getEmptyPack();
                        }
                        //Finished opening pack, move set to the next set. If greater than 2, 
                        //a pack from each set has been opened and draft is complete.
                        currentSet++;
                        if (currentSet > 2) {
                            setPhase(2);
                            return;
                        }
                        break;
                    }
                }
            }

            old.currentPackIndex++;
            const nextPackIndex = old.currentPackIndex % PLAYER_COUNT;

            //If current pack is empty, load a new pack
            if (old.packs[nextPackIndex].length === 0 || old.packs[nextPackIndex][0].name === "loading...") {
                //Pack.fetchPack(setPacksData, selectedSets.names[currentSet], (nextPackIndex));
                Pack.manuallyFetchPack(setPacksData, selectedSets.names[currentSet], (nextPackIndex));
            }
            setSelectedSets((old) => {
                old.currentSetIndex = currentSet;
                return { ...old };
            });
            return { ...old }
        });
    }

    /**
     * Adds sets abbreviated name to state holding array of selected sets to draft.
     * @param {Abbreviated name of set used by API} abbr 
     */
    function addSet(abbr) {
        setSelectedSets((old) => {
            if (old.names[0] === "___") {
                old.names[0] = abbr;
                return old;
            } else if (old.names[1] === "___") {
                old.names[1] = abbr;
                return old;
                //If last set, set to finished and begin loading first pack prior to user start.
            } else if (old.names[2] === "___") {
                old.names[2] = abbr;
                setSelectedSets((old) => {
                    old.finishedPicking = true;
                    return { ...old };
                });
                Pack.manuallyFetchPack(setPacksData, selectedSets.names[0]);
                return old;
            } else {
                return old;
            }
        });
        setSelectedSets((old) => { return { ...old } });
    }

    /**
     * Switch on phase:
     * Phase 0 - Choose sets to draft.
     * Phase 1 - Select cards from packs.
     * Phase 2 - Draft complete. Display statistics.
     */
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
            console.log(pickStats.types)
            return (
                <div ref={ref} id="card-space" className="body-text">
                    <div style={{ borderBottom: "solid" }}>
                        <p>{JSON.stringify(pickStats.types, null, 1).replace('{', "").replace(/"/g, "").replace("\"", "").replace("}", "")}</p>
                        <p>White:{pickStats.W} Blue:{pickStats.U} Black:{pickStats.B} Red:{pickStats.R} Green:{pickStats.G} </p>
                    </div>
                    {packsData.packs[packsData.currentPackIndex % PLAYER_COUNT].map((card, index) => {
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
                <p className="stat-text">White:{pickStats.W} {Math.round((pickStats.W / 42) * 100)}% Blue:{pickStats.U} {Math.round((pickStats.U / 42) * 100)}% Black:{pickStats.B} {Math.round((pickStats.B / 42) * 100)}% Red:{pickStats.R} {Math.round((pickStats.R / 42) * 100)}% Green:{pickStats.G} {Math.round((pickStats.G / 42) * 100)}%</p>
                <div id="pie-chart">
                    <PieChart
                        labelStyle={{ fontSize: '35%' }}
                        label={({ dataEntry }) => {
                            let percent = Math.round(dataEntry.percentage);
                            if (percent != 0)
                                if (percent >= 15)
                                    return '' + dataEntry.title + '\n' + percent + '%'
                                else
                                    return `${percent} %`
                            else
                                return '';
                        }}
                        data={[
                            { title: 'Creature', value: pickStats.types.Creature, color: "#533483" },
                            { title: 'Instant', value: pickStats.types.Instant, color: '#E94560' },
                            { title: 'Sorcery', value: pickStats.types.Sorcery, color: '#9E3D72' },
                            { title: 'Artifact', value: pickStats.types.Artifact, color: '#6E44AC' },
                            { title: 'Planeswalker', value: pickStats.types.Planeswalker, color: '#FF5B7E' },
                            { title: 'Land', value: pickStats.types.Land, color: '#79397B' },
                            { title: 'Enchantment', value: pickStats.types.Enchantment, color: '#723145' }
                        ]}
                    />
                </div>
                <p className="stat-text">{JSON.stringify(pickStats.types, null, 1).replace('{', "").replace(/"/g, "").replace("\"", "").replace("}", "")}</p>
            </div>
    }
}

export default PackDisplay;