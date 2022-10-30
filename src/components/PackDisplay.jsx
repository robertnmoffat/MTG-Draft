import Card from "./Card"
import Pack from "../Pack"
import { useEffect, useRef, useState } from "react";

const PLAYER_COUNT = 8;

/**
 * Component to display sets for the user to pick and then to display cards from packs for drafting.
 * @param {setSelectedCards: Function to add card to players picked cards, setSidebarHeight: Function for resizing height of sidebar} properties 
 * @returns 
 */
function PackDisplay(properties) {
    let [packsData, setPacksData] = useState({ packs: [[], [], [], [], [], [], [], []], currentPackIndex: 0 });

    useEffect(() => {
        //Initialize empty packs. Sets image to card back so that something is shown while API is loading.
        setPacksData((old) => {
            for (let i = 0; i < PLAYER_COUNT; i++) {
                old.packs[i] = Pack.getEmptyPack();
            }
            return { ...old };
        });

        Pack.manuallyFetchPack(setPacksData,properties.selectedSets.names[0], 0);
    }, []);

    /**
     * Copies the card at the given index of the current pack into the selected cards array.
     * The card is then removed from the current pack.
     * Updating of computer player packs is done and then checks for empty finished packs.
     * @param {Index of selected card within current pack} index 
     * @returns 
     */
    function selectCard(cardIndex) {
        //If for some reason the pack is empty or if the pack has not yet been loaded, return without card selection.
        if (packsData===undefined || packsData.packs[packsData.currentPackIndex % PLAYER_COUNT].length === 0 || packsData.packs[packsData.currentPackIndex % PLAYER_COUNT][cardIndex].name === "loading...") {
            return;
        }

        let currentSet =properties.selectedSets.currentSetIndex;
        setPacksData((old) => {
            //Index of current pack. Modulus used to keep reference within range of current packs after a full round.
            const packIndex = old.currentPackIndex % PLAYER_COUNT;

            //Makes sure that the card has a colour that can be referenced.
            let colors;
            if (old.packs[packIndex][cardIndex].colors != undefined &&
                old.packs[packIndex][cardIndex].colors != NaN) {
                colors = old.packs[packIndex][cardIndex].colors;
            }
            let types = old.packs[packIndex][cardIndex].types;

            //Iterate through each of the card's colours and increment that colour count by one.
            properties.setPickStats((oldC) => {
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
                            properties.setPhase(2);
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
                Pack.manuallyFetchPack(setPacksData,properties.selectedSets.names[currentSet], (nextPackIndex));
            }
            properties.setSelectedSets((old) => {
                old.currentSetIndex = currentSet;
                return { ...old };
            });
            return { ...old }
        });
    }

    if(packsData!=undefined)
    return (
        <div id="card-space" className="body-text">
            <div style={{ borderBottom: "solid" }}>
                <p>{JSON.stringify(properties.pickStats.types, null, 1).replace('{', "").replace(/"/g, "").replace("\"", "").replace("}", "")}</p>
                <p>White:{properties.pickStats.W} Blue:{properties.pickStats.U} Black:{properties.pickStats.B} Red:{properties.pickStats.R} Green:{properties.pickStats.G} </p>
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
    else
    return <div></div>//Empty div to prevent error if data is blank between loading.
}

export default PackDisplay;