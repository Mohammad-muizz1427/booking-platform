import { useState, useEffect } from 'react';
import api from '../api/client.js';

export default function ProviderDashboard() {
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', durationMinutes: 30, priceCents: 0 });
  const [slotForm, setSlotForm] = useState({ serviceId: '', startsAt: '', endsAt: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadServices();
    loadSlots();
    loadBookings();
  }, []);

  async function loadServices() {
    const res = await api.get('/services');
    setServices(res.data.services);
  }

  async function loadSlots() {
    const res = await api.get('/slots/mine');
    setSlots(res.data.slots);
  }

  async function loadBookings() {
    const res = await api.get('/bookings/provider');
    setBookings(res.data.bookings);
  }

  async function handleCreateService(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/services', {
        ...serviceForm,
        durationMinutes: Number(serviceForm.durationMinutes),
        priceCents: Number(serviceForm.priceCents),
      });
      setServiceForm({ name: '', description: '', durationMinutes: 30, priceCents: 0 });
      loadServices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create service');
    }
  }

  async function handleCreateSlot(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/slots', {
        serviceId: slotForm.serviceId,
        startsAt: new Date(slotForm.startsAt).toISOString(),
        endsAt: new Date(slotForm.endsAt).toISOString(),
      });
      setSlotForm({ serviceId: '', startsAt: '', endsAt: '' });
      loadSlots();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create slot');
    }
  }

  async function handleConfirm(bookingId) {
    setError('');
    try {
      await api.patch(`/bookings/${bookingId}/confirm`);
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm booking');
    }
  }

  return (
    <div>
      <h2>Provider Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section>
        <h3>Your Services</h3>
        <ul>
          {services.map((s) => (
            <li key={s.id}>{s.name} — {s.durationMinutes} min — ${(s.priceCents / 100).toFixed(2)}</li>
          ))}
        </ul>

        <form onSubmit={handleCreateService}>
          <h4>Add a Service</h4>
          <input placeholder="Name" value={serviceForm.name}
            onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} required />
          <input placeholder="Description" value={serviceForm.description}
            onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} />
          <input type="number" placeholder="Duration (minutes)" value={serviceForm.durationMinutes}
            onChange={(e) => setServiceForm({ ...serviceForm, durationMinutes: e.target.value })} required />
          <input type="number" placeholder="Price (cents)" value={serviceForm.priceCents}
            onChange={(e) => setServiceForm({ ...serviceForm, priceCents: e.target.value })} required />
          <button type="submit">Add Service</button>
        </form>
      </section>

      <section>
        <h3>Your Availability Slots</h3>
        <ul>
          {slots.map((s) => (
            <li key={s.id}>{new Date(s.startsAt).toLocaleString()} — {new Date(s.endsAt).toLocaleString()} — {s.status}</li>
          ))}
        </ul>

        <form onSubmit={handleCreateSlot}>
          <h4>Add a Slot</h4>
          <select value={slotForm.serviceId} onChange={(e) => setSlotForm({ ...slotForm, serviceId: e.target.value })} required>
            <option value="">Select a service</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input type="datetime-local" value={slotForm.startsAt}
            onChange={(e) => setSlotForm({ ...slotForm, startsAt: e.target.value })} required />
          <input type="datetime-local" value={slotForm.endsAt}
            onChange={(e) => setSlotForm({ ...slotForm, endsAt: e.target.value })} required />
          <button type="submit">Add Slot</button>
        </form>
      </section>

      <section>
        <h3>Incoming Bookings</h3>
        <ul>
          {bookings.map((b) => (
            <li key={b.id}>
              {new Date(b.startsAt).toLocaleString()} — {b.status}
              {b.status === 'pending' && (
                <button onClick={() => handleConfirm(b.id)}>Confirm</button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}