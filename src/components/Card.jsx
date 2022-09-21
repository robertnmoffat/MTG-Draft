
function Card(properties) {

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
        return (
            <img
                className={properties.isSelected === "true" ? "selected-card" : "pack-card"}
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