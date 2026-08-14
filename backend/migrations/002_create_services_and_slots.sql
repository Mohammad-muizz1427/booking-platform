CREATE TABLE services (
  id                BIGSERIAL PRIMARY KEY,
  provider_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name              VARCHAR(255) NOT NULL,
  description       TEXT,
  duration_minutes  INT NOT NULL CHECK (duration_minutes > 0),
  price_cents       INT NOT NULL CHECK (price_cents >= 0),
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT services_provider_name_unique UNIQUE (provider_id, name)
);

CREATE TYPE slot_status AS ENUM ('open', 'blocked', 'booked');

CREATE TABLE availability_slots (
  id              BIGSERIAL PRIMARY KEY,
  provider_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id      BIGINT REFERENCES services(id) ON DELETE SET NULL,
  starts_at       TIMESTAMPTZ NOT NULL,
  ends_at         TIMESTAMPTZ NOT NULL,
  status          slot_status NOT NULL DEFAULT 'open',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT slot_time_order CHECK (ends_at > starts_at)
);