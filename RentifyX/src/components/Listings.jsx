import ListingCard from "./ListingCard";

function Listings({ data }) {
  return (
    <div className="listings-grid">
      {data.map((item) => (
        <ListingCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default Listings;
