import * as Slot from '../models/Slot.js';

export async function createSlot(req, res, next) {
  try {
    const { serviceId, startsAt, endsAt } = req.body;

    if (!startsAt || !endsAt) {
      return res.status(400).json({ message: 'startsAt and endsAt are required' });
    }
    if (new Date(endsAt) <= new Date(startsAt)) {
      return res.status(400).json({ message: 'endsAt must be after startsAt' });
    }
    if (new Date(startsAt) < new Date()) {
      return res.status(400).json({ message: 'Cannot create a slot in the past' });
    }

    const slot = await Slot.createSlot({
      providerId: req.auth.userId,
      serviceId,
      startsAt,
      endsAt,
    });

    res.status(201).json({ slot });
  } catch (err) {
    if (err.code === '23P01') {
      return res.status(409).json({ message: 'This slot overlaps with an existing slot for this provider' });
    }
    next(err);
  }
}

export async function listMySlots(req, res, next) {
  try {
    const slots = await Slot.findSlotsByProvider(req.auth.userId);
    res.json({ slots });
  } catch (err) {
    next(err);
  }
}

export async function listOpenSlotsForService(req, res, next) {
  try {
    const slots = await Slot.findOpenSlotsByService(req.params.serviceId);
    res.json({ slots });
  } catch (err) {
    next(err);
  }
}