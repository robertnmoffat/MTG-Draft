import Card from "./Card";

function Sidebar(properties) {
    return (
        <div style={{ height: properties.height }} className="sidebar container">
            <div className="border-bottom"><h2>Deck</h2></div>
            <p>{properties.selectedCards.length}/42</p>
            {properties.selectedCards.map((card, index) => {
                return (                    
                    <Card
                        name={card.name}
                        mana={card.manaCost}
                        text={card.text}
                        power={card.power}
                        toughness={card.toughness}
                        isSelected="true"
                        key={index}
                        id={index}
                        imageUrl={card.imageUrl}
                    />
                );
            })}
        </div>
    );
}

export default Sidebar;