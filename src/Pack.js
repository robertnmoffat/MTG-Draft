import { useState } from "react";

class Pack {
    static getEmptyPack() {
        let emptyPack = [];
        //Create empty pack data while loading data from API.
        for (let i = 0; i < 14; i++) {
            emptyPack[i] = { name: "loading...", imageUrl: "./mtg-back.jpg" };
        }
        return emptyPack;
    }

    static fetchPack(setPack, set) {
        fetch("https://api.magicthegathering.io/v1/sets/"+set+"/booster")
            .then(res => res.json())
            .then(json => {
                setPack(json.cards);
            }
            )
    }

    /**
     * Removes a card from the pack array and adds it to the selectedCards array.
     * @param {function to set currently selected cards} setSelectedCards 
     * @param {function to set cards left in pack} setPack 
     * @param {index of selected card in current pack} index 
     * @param {current pack of cards} pack
     */
    static selectCard(setSelectedCards, setPack, pack, index){
        console.log("Index:" + index);
        setSelectedCards((old) => {
            return [...old, pack[index]];
        });
        setPack((old) => {
            return old.filter((card, i) => {
                return i !== index;
            });
        });    
    }
}

export default Pack;