/**
 * PricingSection — Clean booking flow:
 * 1. Select Pickup date/time
 * 2. Return date enabled only after pickup, min = pickup
 * 3. "Confirm Dates" button shows availability
 * 4. Price breakdown only visible once both dates are selected
 */
const PricingSection = ({
  hourlyRate,
  dayRate,
  selectedHours,
  selectedDays,
  bookingType,
  onHoursChange,
  onDaysChange,
  onBookingTypeChange,
  calculateTotal,
  startDate,
  endDate,
  onDatesChange,
  availability,
}) => {
  const rate = hourlyRate || dayRate || 0;
  const isHourly = Boolean(hourlyRate);
  const extraChargeRate = Math.ceil(rate * 1.5);

  // Minimum datetime = right now (formatted for datetime-local input)
  const nowIso = () => {
    const d = new Date();
    d.setSeconds(0, 0);
    return d.toISOString().slice(0, 16);
  };

  // Whether both dates are filled & end > start
  const datesValid =
    startDate &&
    endDate &&
    new Date(endDate) > new Date(startDate);

  // Derived duration text
  const durationLabel = (() => {
    if (!datesValid) return null;
    const diffHours = (new Date(endDate) - new Date(startDate)) / 3_600_000;
    if (diffHours >= 24) return `${(diffHours / 24).toFixed(1)} day(s)`;
    return `${diffHours.toFixed(1)} hour(s)`;
  })();

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title border-bottom pb-2 mb-3">Booking Details</h5>

        {/* ── Booking type toggle (only show if daily option exists) ──── */}
        {dayRate > 0 && (
          <div className="btn-group w-100 mb-4" role="group">
            <button
              style={{
                flex: 1, padding: '10px', border: '2px solid rgb(230,80,0)',
                background: bookingType === 'hourly' ? 'rgb(230,80,0)' : 'transparent',
                color: bookingType === 'hourly' ? 'white' : 'rgb(230,80,0)',
                fontWeight: 700, cursor: 'pointer', fontSize: 14,
                borderRadius: '8px 0 0 8px', transition: 'all .2s',
              }}
              onClick={() => onBookingTypeChange('hourly')}
            >
              Hourly Basis
            </button>
            <button
              style={{
                flex: 1, padding: '10px', border: '2px solid rgb(230,80,0)',
                background: bookingType === 'daily' ? 'rgb(230,80,0)' : 'transparent',
                color: bookingType === 'daily' ? 'white' : 'rgb(230,80,0)',
                fontWeight: 700, cursor: 'pointer', fontSize: 14,
                borderRadius: '0 8px 8px 0', borderLeft: 'none', transition: 'all .2s',
              }}
              onClick={() => onBookingTypeChange('daily')}
            >
              Daily Basis
            </button>
          </div>
        )}

        {/* ── Rate info ────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: '#fff8f5', border: '1px solid #ffe0cc', borderRadius: 8,
          padding: '10px 14px', marginBottom: 20,
        }}>
          <span style={{ fontSize: 13, color: '#666' }}>
            {isHourly ? 'Hourly Rate' : 'Daily Rate'}
          </span>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'rgb(230,80,0)' }}>
            ₹{rate}/{isHourly ? 'hr' : 'day'}
          </span>
        </div>

        {/* ── Step 1 — Pickup Date & Time ──────────────────────────────── */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: 'block', fontSize: 13, fontWeight: 600,
            color: '#444', marginBottom: 6,
          }}>
            📅 Pickup Date &amp; Time <span style={{ color: '#e53e3e' }}>*</span>
          </label>
          <input
            type="datetime-local"
            value={startDate || ''}
            min={nowIso()}
            onChange={(e) => {
              const val = e.target.value;
              // If new pickup is after current endDate, clear endDate
              const newEnd = endDate && new Date(endDate) <= new Date(val) ? '' : endDate;
              onDatesChange(val, newEnd);
            }}
            style={{
              width: '100%', padding: '11px 14px',
              border: `1.5px solid ${startDate ? 'rgb(230,80,0)' : '#ddd'}`,
              borderRadius: 8, fontSize: 14, fontFamily: 'inherit',
              outline: 'none', background: 'white', cursor: 'pointer',
            }}
          />
        </div>

        {/* ── Step 2 — Return Date & Time (disabled until pickup chosen) ── */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block', fontSize: 13, fontWeight: 600,
            color: startDate ? '#444' : '#aaa', marginBottom: 6,
          }}>
            🏁 Return Date &amp; Time <span style={{ color: '#e53e3e' }}>*</span>
          </label>
          <input
            type="datetime-local"
            value={endDate || ''}
            min={startDate || nowIso()}     /* past dates disabled in calendar */
            disabled={!startDate}
            onChange={(e) => {
              const val = e.target.value;
              onDatesChange(startDate, val);
            }}
            style={{
              width: '100%', padding: '11px 14px',
              border: `1.5px solid ${endDate ? 'rgb(230,80,0)' : '#ddd'}`,
              borderRadius: 8, fontSize: 14, fontFamily: 'inherit',
              outline: 'none',
              background: startDate ? 'white' : '#f5f5f5',
              cursor: startDate ? 'pointer' : 'not-allowed',
              opacity: startDate ? 1 : 0.5,
            }}
          />
          {!startDate && (
            <p style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
              Select a pickup date first
            </p>
          )}
        </div>

        {/* ── Availability status ─────────────────────────────────────── */}
        {availability?.checking && (
          <div style={{
            padding: '10px 14px', borderRadius: 8,
            background: '#fffbf0', border: '1px solid #fcd34d',
            fontSize: 13, color: '#92400e', marginBottom: 14,
          }}>
            ⏳ Checking availability…
          </div>
        )}
        {availability?.conflict && !availability?.checking && (
          <div style={{
            padding: '10px 14px', borderRadius: 8,
            background: '#fff5f5', border: '1px solid #f87171',
            fontSize: 13, color: '#b91c1c', marginBottom: 14,
          }}>
            ❌ Already booked for this period. Choose different dates.
          </div>
        )}
        {datesValid && availability && !availability.checking && !availability.conflict && (
          <div style={{
            padding: '10px 14px', borderRadius: 8,
            background: '#f0fdf4', border: '1px solid #86efac',
            fontSize: 13, color: '#166534', marginBottom: 14,
          }}>
            ✅ Vehicle is available for your selected dates!
          </div>
        )}

        {/* ── Duration + Price breakdown (only when dates valid) ──────── */}
        {datesValid && (
          <div style={{
            background: '#fafafa', border: '1px solid #eee',
            borderRadius: 10, padding: '14px 16px', marginBottom: 8,
          }}>
            {durationLabel && (
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 13, marginBottom: 8, color: '#555',
              }}>
                <span>⏱ Duration</span>
                <strong>{durationLabel}</strong>
              </div>
            )}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 13, marginBottom: 6, color: '#555',
            }}>
              <span>Subtotal</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 13, marginBottom: 6, color: '#555',
            }}>
              <span>Service Fee (5%)</span>
              <span>₹{(calculateTotal() * 0.05).toFixed(0)}</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 13, marginBottom: 0, color: '#555',
            }}>
              <span>Insurance (10%)</span>
              <span>₹{(calculateTotal() * 0.10).toFixed(0)}</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 15, fontWeight: 700, borderTop: '1px solid #e5e5e5',
              paddingTop: 10, marginTop: 10, color: '#222',
            }}>
              <span>Total</span>
              <span style={{ color: 'rgb(230,80,0)' }}>
                ₹{Math.round(calculateTotal() * 1.15).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* Placeholder when dates not yet chosen */}
        {!datesValid && (
          <div style={{
            textAlign: 'center', padding: '14px 0',
            color: '#aaa', fontSize: 13,
          }}>
            {startDate && !endDate
              ? '⬆ Now select your return date'
              : 'Select pickup & return dates to see total'}
          </div>
        )}

        {/* ── Extra charge note ────────────────────────────────────────── */}
        <div style={{
          background: '#f0f8ff', border: '1px solid #bfdbfe',
          borderRadius: 8, padding: '10px 14px', marginTop: 12,
          fontSize: 12, color: '#1e40af', display: 'flex', gap: 8,
        }}>
          <span>💡</span>
          <span>
            <strong>Note:</strong> Exceeding your booking time incurs{' '}
            <strong>₹{extraChargeRate}/{isHourly ? 'hr' : 'day'}</strong> extra charges.
          </span>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;