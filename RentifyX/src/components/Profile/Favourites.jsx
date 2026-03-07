const Favourites = () => {

    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];

    return (
        <div className="profile-card">

            <h4>Favourites</h4>

            {favourites.length === 0 && (

                <div className="empty-state">
                    <h3>No favourites yet</h3>
                    <p>Save listings you love.</p>
                </div>

            )}

            <div className="row">

                {favourites.map((item) => (

                    <div key={item.id} className="col-md-4">

                        <div className="fav-card">

                            <img src={item.image} alt={item.title} />

                            <h6>{item.title}</h6>

                        </div>

                    </div>

                ))}

            </div>
        </div>
    );
};

export default Favourites;