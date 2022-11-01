
function Card(properties) {

    //If no image url was supplied by the API, use a component displaying card information in html instead.
    if (properties.imageUrl === undefined) {
        return (
            <div
                className={properties.isSelected === "true" ? "selected-card imageless-card" : "pack-card imageless-card"}
                style={{
                    verticalAlign: "middle",
                    display:"inline-block",
                    width: "223px",
                    height: "311px",
                    marginTop: properties.isSelected === "true" ? properties.id * 35 : 0
                }}
                onClick={() => {
                    if (properties.isSelected === "false")
                        properties.selectCard(properties.id)
                }}
            >
                <h3>{properties.name}</h3>
                <p>{properties.mana}</p>
                <p>{properties.text}</p>
                <p>{properties.power? properties.power + "/" + properties.toughness : ""}</p>
            </div>
        )
    } else {

        let classes;
        if(properties.isSelected==="true"){
            classes = "selected-card";
        }else if(properties.name!="loading..."){
            classes = "pack-card loaded";
        }

        return (
            <img 
                className={classes}
                onClick={() => {
                    if (properties.isSelected === "false")
                        properties.selectCard(properties.id)
                }}
                src={properties.imageUrl}
                style={{
                    width: "223px",
                    height: "311px",
                    marginTop: properties.isSelected === "true" ? properties.id * 35 : 0
                }}
            />
        );
    }
}

export default Card;