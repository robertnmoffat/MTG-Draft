import Card from "./Card";

function Sidebar(properties) {
    return (
        <div style={{ height: properties.height }} className="sidebar">
            <div><h2>Deck</h2></div>
            {properties.selectedCards.map((card, index) => {
                return (
                    <Card
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