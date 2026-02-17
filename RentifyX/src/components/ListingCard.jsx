function ListingCard({ item }) {
  return (
    <div className="listing-card">
      <img src={item.image} alt={item.name} />
      <div className="listing-info">
        <h3>{item.name}</h3>
        <p>{item.location}</p>
        <p>⭐ {item.rating} ({item.reviews})</p>
        <p>{item.type}</p>
        <h4>₹{item.price} / {item.minStay}</h4>
        <p className="aadhar">Aadhar Required</p>
      </div>
    </div>
  );
}

export default ListingCard;
