import { useRef, useEffect } from "react";
import MtgSet from "./MtgSet";

function SetDisplay(properties) {

    //Reference for accessing window size.
    const ref = useRef(null);

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


    return <div  ref={ref} id="card-space" className="body-text" >
        {properties.finishedPicking ? <button onClick={() => properties.setPhase(1)}>Done</button> : <h2>Select three sets</h2>}
        <div id="selected-sets">
            <h1>{properties.names[0]} + {properties.names[1]} + {properties.names[2]}</h1>
        </div>
        <div id="all-set-components">
            {properties.sets.filter((old, index) => index < 100).map((set, index) => {
                return (
                    <MtgSet
                        key={index}
                        name={set.name}
                        type={set.type}
                        releaseDate={set.releaseDate}
                        abbr={set.code}
                        addSet={properties.addSet}
                    />
                )
            })}
        </div>
    </div>
}

export default SetDisplay;