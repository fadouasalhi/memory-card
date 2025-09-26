import './style.css'
function Card({card, onClick}){
   return(
    <div onClick={()=>onClick(card.id)} className="card">
      <img src={card.image} alt={card.name} />
    </div>
   )
}
export default Card;