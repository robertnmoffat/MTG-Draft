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
    static getFillerCard() {
        return {
            name: "Filler Card",
            text: "Card not returned by API."
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
                imageUrl: "./mtg-back.jpg"
            };
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
                    for (let i = json.cards.length; i < 14; i++) {
                        json.cards.push(this.getFillerCard());
                    }
                    old.packs[old.currentPackIndex % 8] = json.cards;
                    return { ...old };
                });
            }
            )
    }

    /**
     * Generates packs through individual API calls to bypass patchy coverage in their pack generation.
     * @param {*} setPacksData 
     * @param {*} set 
     * @param {*} amountToRemove 
     */
    static manuallyFetchPack(setPacksData, set, amountToRemove) {
        const r = amountToRemove === undefined ? 0 : amountToRemove;
        let cards = [];
        let isMythic = Math.round(Math.random() * 7.4) === 1 ? true : false;
        fetch(isMythic ? "https://api.magicthegathering.io/v1/cards?set=" + set + "&rarity=mythic&pageSize=1&random=true" : "https://api.magicthegathering.io/v1/cards?set=" + set + "&rarity=rare&pageSize=1&random=true")
            .then(res => res.json())
            .then(res => {
                console.log('rare')
                console.log(res)
                cards = [res.cards[0]]
            }).then(res => {
                fetch("https://api.magicthegathering.io/v1/cards?set=" + set + "&rarity=uncommon&pageSize=3&random=true")
                    .then(res => res.json())
                    .then(
                        res => {
                            console.log('uncommon')
                            console.log(res)
                            cards = [...cards, ...res.cards]
                        })
                    .then(res => {
                        fetch("https://api.magicthegathering.io/v1/cards?set=" + set + "&rarity=common&pageSize=10&random=true")
                            .then(res => res.json())
                            .then(
                                res => {
                                    console.log('common')
                                    console.log(res)
                                    cards = [...cards, ...res.cards]
                                    console.log(cards)
                                })
                            .then(res => {
                                setPacksData((old) => {
                                    old.packs[old.currentPackIndex % 8] = (cards.filter((card, index) => {
                                        return index >= r;
                                    }))
                                    return { ...old };
                                })
                            })
                    })
            })
    }

    /**
     * Generates packs through individual API calls to bypass patchy coverage in their pack generation.
     * Alternate version that makes the three calls in parallel to save time.
     * @param {*} setPacksData 
     * @param {*} set 
     * @param {*} amountToRemove 
     */
    static manuallyFetchPackParallel(setPacksData, set, amountToRemove) {
        let threadDone = [false, false, false];
        const r = amountToRemove === undefined ? 0 : amountToRemove;
        let rare, uncommon, common;
        let isMythic = Math.round(Math.random() * 7.4) === 1 ? true : false;
        fetch(isMythic ? "https://api.magicthegathering.io/v1/cards?set=" + set + "&rarity=mythic&pageSize=1&random=true" : "https://api.magicthegathering.io/v1/cards?set=" + set + "&rarity=rare&pageSize=1&random=true")
            .then(res => res.json())
            .then(res => {
                console.log('rare')
                console.log(res)
                rare = [res.cards[0]]
                threadDone[0]=true;
                if(threadDone[0]&&threadDone[1]&&threadDone[2]){
                    threadDone[0]=false;
                    this.createPack(setPacksData,rare, uncommon, common, r);
                }
            })
        fetch("https://api.magicthegathering.io/v1/cards?set=" + set + "&rarity=uncommon&pageSize=3&random=true")
            .then(res => res.json())
            .then(res => {
                console.log('uncommon')
                console.log(res)
                uncommon = [...res.cards];
                threadDone[1]=true;
                if(threadDone[0]&&threadDone[1]&&threadDone[2]){
                    threadDone[1]=false;
                    this.createPack(setPacksData,rare, uncommon, common, r);
                }
            })
        fetch("https://api.magicthegathering.io/v1/cards?set=" + set + "&rarity=common&pageSize=10&random=true")
            .then(res => res.json())
            .then(res => {
                console.log('common')
                console.log(res)
                common = [...res.cards]
                threadDone[2]=true;
                if(threadDone[0]&&threadDone[1]&&threadDone[2]){
                    threadDone[2]=false;
                    this.createPack(setPacksData,rare, uncommon, common, r);
                }
            })

    }

    static createPack(setPacksData, rare, uncommons, commons, r) {
        let cards = [...rare, ...uncommons, ...commons];
        setPacksData((old) => {
            old.packs[old.currentPackIndex % 8] = (cards.filter((card, index) => {
                return index >= r;
            }))
            return { ...old };
        })
    }

    /**
     * Fetches a pack from the API, removes a set amount of cards and copies it into the current pack.
     * @param {Function to update pack data} setPacksData 
     * @param {Magic set to be fetched from API} set 
     * @param {Amount of cards to remove from the pack before being copied} amountToRemove 
     */
    static fetchPack(setPacksData, set, amountToRemove) {
        const r = amountToRemove === undefined ? 0 : amountToRemove;
        fetch("https://api.magicthegathering.io/v1/sets/" + set + "/booster")
            .then(res => res.json())
            .then(json => {
                setPacksData((old) => {
                    for (let i = json.cards.length; i < 14; i++) {
                        json.cards.push(this.getFillerCard());
                    }
                    old.packs[old.currentPackIndex % 8] = (json.cards.filter((card, index) => {
                        return index >= r;
                    }))
                    return { ...old };
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
        if (card === undefined || card.name === "loading...") {
            return;
        }
        setSelectedCards((old) => {
            return [...old, card];
        });
    }
}

export default Pack;