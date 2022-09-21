import React from "react";

function MtgSet(properties){
    return (
        <div id="mtg-set">
            <h3>{properties.name}</h3>
            <p>{properties.type}</p>
            <p>{properties.releaseDate}</p>
            <button onClick={()=>{properties.addSet(properties.abbr)}}>+</button>
        </div>
    );
}

export default MtgSet;