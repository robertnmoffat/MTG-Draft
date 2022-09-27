import { useState } from "react";
import Card from "./components/Card";

/**
 * Class containing static functions to be used in pack creation.
 */
class Pack {

    /**
     * Creates a filler card to be used when API fails to return a full pack of cards.
     * @returns Object representing a blank card
     */
    static getFillerCard(){
        return {
            name:"Filler Card",
            text:"Card not returned by API."
        }
    }

    /**
     * Generates a pack of empty cards with an image of a card back to be used while real pack is being loaded.
     * @returns An empty pack of card backs
     */
    static getEmptyPack() {
        let emptyPack = [];
        //Create empty pack data while loading data from API.
        for (let i = 0; i < 14; i++) {
            emptyPack[i] = { 
                name: "loading...", 
                imageUrl: "./mtg-back.jpg" };
        }
        return emptyPack;
    }

    /**
     * Fetches a pack from the API and copies it into the current pack.
     * @param {Function to update pack data} setPacksData 
     * @param {Magic set to be fetched from API} set 
     */
    static fetchPack(setPacksData, set) {
        fetch("https://api.magicthegathering.io/v1/sets/" + set + "/booster")
            .then(res => res.json())
            .then(json => {
                setPacksData((old) => {
                    for(let i=json.cards.length; i<14; i++){
                        json.cards.push(this.getFillerCard());
                    }
                    old.packs[old.currentPackIndex % 8] = json.cards;
                    return {...old};
                });
            }
            )
    }

    /**
     * Fetches a pack from the API, removes a set amount of cards and copies it into the current pack.
     * @param {Function to update pack data} setPacksData 
     * @param {Magic set to be fetched from API} set 
     * @param {Amount of cards to remove from the pack before being copied} amountToRemove 
     */
    static fetchPack(setPacksData, set, amountToRemove) {
        const r = amountToRemove===undefined? 0 : amountToRemove;
        fetch("https://api.magicthegathering.io/v1/sets/" + set + "/booster")
            .then(res => res.json())
            .then(json => {
                setPacksData((old) => {
                    for(let i=json.cards.length; i<14; i++){
                        json.cards.push(this.getFillerCard());
                    }
                    old.packs[old.currentPackIndex % 8] = (json.cards.filter((card, index)=>{
                        return index>=r;
                    }))
                    return {...old};
                });
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
    static selectCard(setSelectedCards, card) {
        if(card===undefined || card.name==="loading..."){
            return;
        }
        setSelectedCards((old) => {
            return [...old, card];
        });
    }
}

export default Pack;