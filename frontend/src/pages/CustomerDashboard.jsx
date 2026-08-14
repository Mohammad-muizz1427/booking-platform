import { useState, useEffect } from 'react';
import api from '../api/client.js';

export default function CustomerDashboard() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAllServices();
    loadBookings();
  }, []);

 async function loadAllServices() {
  const res = await api.get('/services/all');
  setServices(res.data.services);
}

  async function loadBookings() {
    const res = await api.get('/bookings/customer');
    setBookings(res.data.bookings);
  }

  async function handleSelectService(service) {
    setSelectedService(service);
    setError('');
    try {
      const res = await api.get(`/slots/service/${service.id}`);
      setSlots(res.data.slots);
    } catch (err) {
      setError('Failed to load slots');
    }
  }

  async function handleBook(slotId) {
    setError('');
    setMessage('');
    try {
      await api.post('/bookings', { slotId });
      setMessage('Booked successfully!');
      setSlots(slots.filter((s) => s.id !== slotId));
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  }

  async function handleCancel(bookingId) {
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      loadBookings();
    } catch (err) {
      setError('Failed to cancel booking');
    }
  }

  return (
    <div>
      <h2>Customer Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <section>
        <h3>Your Bookings</h3>
        <ul>
          {bookings.map((b) => (
            <li key={b.id}>
              {new Date(b.startsAt).toLocaleString()} — {b.status}
              {b.status !== 'cancelled' && (
                <button onClick={() => handleCancel(b.id)}>Cancel</button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Browse Services</h3>
        <ul>
          {services.map((s) => (
            <li key={s.id}>
              {s.name} — {s.durationMinutes} min — ${(s.priceCents / 100).toFixed(2)}
              <button onClick={() => handleSelectService(s)}>View Slots</button>
            </li>
          ))}
        </ul>
      </section>

      {selectedService && (
        <section>
          <h3>Available Slots for {selectedService.name}</h3>
          <ul>
            {slots.map((slot) => (
              <li key={slot.id}>
                {new Date(slot.startsAt).toLocaleString()}
                <button onClick={() => handleBook(slot.id)}>Book</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}