function CategoryTabs({ selected, setSelected }) {
  const categories = ["Houses", "Flats", "PGs", "Travel Stays"];

  return (
    <div className="category-tabs">
      {categories.map((cat) => (
        <button
          key={cat}
          className={selected === cat ? "active" : ""}
          onClick={() => setSelected(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;
