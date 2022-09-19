
function Card(properties){
    return (
        <img style={{width:"223px", height:"311px"}} onClick={()=>{properties.selectCard(properties.id)}} src={properties.imageUrl} />
    );
}

export default Card;