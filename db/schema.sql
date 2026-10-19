CREATE TABLE IF NOT EXISTS columns (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position INTEGER NOT NULL,
  CONSTRAINT unique_position UNIQUE (position)
);

CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  column_id INTEGER NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO columns (name, position)
VALUES ('To Do', 0), ('In Progress', 1), ('Done', 2)
ON CONFLICT (position) DO NOTHING;