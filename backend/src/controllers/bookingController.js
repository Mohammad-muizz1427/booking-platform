import * as Booking from '../models/Booking.js';
import * as Slot from '../models/Slot.js';
import * as Service from '../models/Service.js';

export async function createBooking(req, res, next) {
  try {
    const { slotId } = req.body;
    if (!slotId) {
      return res.status(400).json({ message: 'slotId is required' });
    }

    const slot = await Slot.findSlotById(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    if (slot.status !== 'open') {
      return res.status(409).json({ message: 'This slot is no longer available' });
    }
    if (new Date(slot.startsAt) < new Date()) {
      return res.status(400).json({ message: 'Cannot book a slot in the past' });
    }

    const service = await Service.findServiceById(slot.serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Associated service not found' });
    }

    const booking = await Booking.createBooking({
      customerId: req.auth.userId,
      providerId: slot.providerId,
      serviceId: slot.serviceId,
      slotId: slot.id,
      priceCents: service.priceCents,
      durationMinutes: service.durationMinutes,
      startsAt: slot.startsAt,
      endsAt: slot.endsAt,
    });

    await Booking.markSlotBooked(slot.id);

    res.status(201).json({ booking });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'This slot was just booked by someone else' });
    }
    next(err);
  }
}

export async function listMyBookingsAsCustomer(req, res, next) {
  try {
    const bookings = await Booking.findBookingsByCustomer(req.auth.userId);
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
}

export async function listMyBookingsAsProvider(req, res, next) {
  try {
    const bookings = await Booking.findBookingsByProvider(req.auth.userId);
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
}

export async function cancelBooking(req, res, next) {
  try {
    const booking = await Booking.findBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isCustomer = booking.customerId === req.auth.userId;
    const isProvider = booking.providerId === req.auth.userId;
    if (!isCustomer && !isProvider) {
      return res.status(403).json({ message: 'You do not have permission to cancel this booking' });
    }

    const updated = await Booking.updateBookingStatus(
      req.params.id,
      'cancelled',
      req.auth.userId,
      isCustomer ? 'customer_id' : 'provider_id'
    );

    await Booking.markSlotOpen(booking.slotId);

    res.json({ booking: updated });
  } catch (err) {
    next(err);
  }
}

export async function confirmBooking(req, res, next) {
  try {
    const updated = await Booking.updateBookingStatus(
      req.params.id,
      'confirmed',
      req.auth.userId,
      'provider_id'
    );
    if (!updated) {
      return res.status(404).json({ message: 'Booking not found or you do not own it' });
    }
    res.json({ booking: updated });
  } catch (err) {
    next(err);
  }
}