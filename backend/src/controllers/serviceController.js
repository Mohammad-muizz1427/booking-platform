import * as Service from '../models/Service.js';

function validateServiceInput({ name, durationMinutes, priceCents }) {
  if (!name || name.trim().length === 0) {
    return 'Service name is required';
  }
  if (!durationMinutes || durationMinutes <= 0) {
    return 'Duration must be a positive number of minutes';
  }
  if (priceCents === undefined || priceCents < 0) {
    return 'Price must be zero or a positive number (in cents)';
  }
  return null;
}

export async function createService(req, res, next) {
  try {
    const error = validateServiceInput(req.body);
    if (error) return res.status(400).json({ message: error });

    const { name, description, durationMinutes, priceCents } = req.body;

    const service = await Service.createService({
      providerId: req.auth.userId,
      name,
      description,
      durationMinutes,
      priceCents,
    });

    res.status(201).json({ service });
  } catch (err) {
    next(err);
  }
}

export async function listMyServices(req, res, next) {
  try {
    const services = await Service.findServicesByProvider(req.auth.userId);
    res.json({ services });
  } catch (err) {
    next(err);
  }
}

export async function updateService(req, res, next) {
  try {
    const service = await Service.updateService(req.params.id, req.auth.userId, req.body);

    if (!service) {
      return res.status(404).json({ message: 'Service not found or you do not own it' });
    }

    res.json({ service });
  } catch (err) {
    next(err);
  }
}

export async function deleteService(req, res, next) {
  try {
    const deleted = await Service.deleteService(req.params.id, req.auth.userId);

    if (!deleted) {
      return res.status(404).json({ message: 'Service not found or you do not own it' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}