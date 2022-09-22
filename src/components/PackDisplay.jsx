import { useEffect, useRef, useState } from "react";
import Card from "./Card"
import Pack from "../Pack"
import MtgSetController from "../MtgSetController"
import MtgSet from "./MtgSet";


function PackDisplay(properties) {
    let [pack, setPack] = useState(Pack.getEmptyPack());
    let [packs, setPacks] = useState([[],[],[],[],[],[],[],[]]);
    let [currentPackIndex, setCurrentPackIndex] = useState(0);
    let [sets, setSets] = useState([]);
    let [selectedSets, setSelectedSets] = useState(['___', '___', '___']);
    let [picking, setPicking] = useState(false);
    let [threeSetsPicked, setThreeSetsPicked] = useState(false);

    //Reference for accessing window size.
    const ref = useRef(null);

    /**
     * If page first loaded, fetch cards from the MTG API.
     */
    useEffect(() => {
        if (pack[0].name === "loading...") {            
            MtgSetController.fetchSets(setSets);
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
        console.log(pack);
        Pack.selectCard(properties.setSelectedCards, setPack, pack, index)
        console.log(pack);
        setPacks((old)=>{
            old[currentPackIndex] = pack.filter((card, i)=>i!=index);
            return [...old];
        });
        if(currentPackIndex+1>=7){
            setCurrentPackIndex(0);
        }else{
            let nextIndex = currentPackIndex+1;
            setCurrentPackIndex(nextIndex);
        }
        if(packs[currentPackIndex].length===0){
            console.log("Fetching new...")
            setPack(Pack.getEmptyPack());
            Pack.fetchPack(setPack, selectedSets[0]);
        }else{
            setPack(packs[currentPackIndex]);
        }
        console.log(pack);
    }

    function addSet(abbr) {
        setSelectedSets((old) => {
            console.log(old)
            if (old[0] === "___") {
                old[0] = abbr;
                return old;
            } else if (old[1] === "___") {
                old[1] = abbr;
                return old;
            } else if (old[2] === "___") {
                old[2] = abbr;
                setThreeSetsPicked(true);
                Pack.fetchPack(setPack, selectedSets[0]);
                return old;
            } else {
                return old;
            }
        });
        setSelectedSets((old)=>[...old]);
    }

    if (picking) {
        return (
            <div ref={ref} id="card-space" className="body-text">
                {pack.map((card, index) => {
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
                {threeSetsPicked? <button onClick={()=>setPicking(true)}>Done</button> : <h2>Select three sets</h2>}
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