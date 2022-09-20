import { useEffect, useRef, useState } from "react";
import Card from "./Card"
import Pack from "../Pack"


function PackDisplay(properties) {
    let [pack, setPack] = useState(Pack.getEmptyPack());

    //Reference for accessing window size.
    const ref = useRef(null);

    /**
     * If page first loaded, fetch cards from the MTG API.
     */
    useEffect(() => {
        if (pack[0].name === "loading...") {
            Pack.fetchPack(setPack);
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

    function selectCard(index){
        Pack.selectCard(properties.setSelectedCards, setPack, pack, index)
    }

    return (
        <div ref={ref} id="card-space" className="body-text">
            {pack.map((card, index) => {
                return (
                    <Card
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
}

export default PackDisplay;