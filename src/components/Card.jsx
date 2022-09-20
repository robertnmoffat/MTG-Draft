
function Card(properties) {

    return (
        <img
            className={properties.isSelected === "true" ? "selected-card" : "pack-card"}
            onClick={() => {
                if(properties.isSelected==="false")
                    properties.selectCard(properties.id)
            }}
            src={properties.imageUrl}
            style={{ width: "223px", height: "311px" }}
        />
    );
}

export default Card;