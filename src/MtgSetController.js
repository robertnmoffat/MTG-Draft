
class MtgSet{

    static fetchSets(setSets){
        fetch("https://api.magicthegathering.io/v1/sets")
            .then(res => res.json())
            .then(json => json.sets.filter((old)=>{
                return old.type==="expansion"||old.type==="core";
            }))
            .then(json=>{
                return json.sort((a,b)=>{
                    return new Date(b.releaseDate) - new Date(a.releaseDate);
                });
            })
            .then(json=>setSets(json))
    }
}

export default MtgSet;