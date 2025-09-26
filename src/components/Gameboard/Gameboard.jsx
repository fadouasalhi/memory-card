import Card from "../Card/Card.jsx";
import './style.css'
function Gameboard({ cards, onCardClick, }){
    return(
        <div className="gameboard">
            {cards.map((card)=>(
                <Card card={card} key={card.id} onClick={onCardClick} />
            ))}
        </div>
    )
}
export default Gameboard;