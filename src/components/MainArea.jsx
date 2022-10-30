import { useEffect, useRef, useState } from "react";
import MtgSetController from "../MtgSetController"
import SetDisplay from "./SetDisplay";
import DraftStats from './DraftStats'
import PackDisplay from "./PackDisplay";

const PLAYER_COUNT = 8;

function MainArea(properties) {
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
     * Adds sets abbreviated name to state holding array of selected sets to draft.
     * @param {Abbreviated name of set used by API} abbr 
     */
    function addSet(abbr) {
        setSelectedSets((old) => {
            old.names[old.currentSetIndex++] = abbr;
            if (old.currentSetIndex == 3) {
                old.currentSetIndex = 0;
                old.finishedPicking = true;
            }
            return {...old};
        });
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
            return (
                <div ref={ref}>
                    <PackDisplay 
                        setPhase={setPhase}
                        selectedSets={selectedSets}
                        setSelectedSets={setSelectedSets}
                        pickStats={pickStats}
                        setPickStats={setPickStats}
                        setSelectedCards={properties.setSelectedCards}
                    />
                </div>
            );

        case 2:
            return <DraftStats pickStats={pickStats} />
    }
}

export default MainArea;