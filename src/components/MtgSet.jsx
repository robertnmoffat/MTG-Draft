import React from "react";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

function MtgSet(properties) {
    return (
        <div id="mtg-set">
            <h3>{properties.name}</h3>
            <p>{properties.type}</p>
            <p>{properties.releaseDate}</p>
            <Fab className="set-button" onClick={() => { properties.addSet(properties.abbr) }} color='secondary' aria-label="add">
                <AddIcon />
            </Fab>
        </div>
    );
}

export default MtgSet;