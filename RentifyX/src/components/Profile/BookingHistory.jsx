const BookingHistory = () => {

    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    return (
        <div className="profile-card">

            <h4>Booking History</h4>

            {bookings.length === 0 && (
                <p>No bookings yet</p>
            )}

            {bookings.map((b) => (

                <div key={b.id} className="booking-row">

                    <div>
                        <h6>{b.title}</h6>
                        <span>{b.date}</span>
                    </div>

                    <div>
                        <strong>{b.amount}</strong>

                        <span className={`booking-status ${b.status}`}>
                            {b.status}
                        </span>
                    </div>

                </div>

            ))}

        </div>
    );
};

export default BookingHistory;