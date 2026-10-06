# Note Board Collab

A real-time collaborative board app (kanban-style), built as a learning project
to develop fullstack skills: Node.js/Express, PostgreSQL, Socket.IO, React, and Docker.

## Why this project

Built step by step while preparing for a backend/fullstack developer role focused on
real-time communication systems. Each phase below was built, tested, and committed
incrementally, see commit history for the full progression.

## Tech stack

- **Backend:** Node.js, Express
- **Database:** PostgreSQL (raw SQL via `pg`, parameterized queries)
- **Real-time:** Socket.IO (WebSocket)
- **Frontend:** React (in progress)
- **Deployment:** Docker (planned)

## Progress

- [x] REST API (CRUD) with Express — routing, validation, proper status codes
- [x] PostgreSQL integration — schema design, constraints, parameterized queries
- [x] Real-time updates via Socket.IO — live broadcast on create/delete
- [ ] Reframe data model: notes → columns + cards (kanban board)
- [ ] React frontend
- [ ] Docker
- [ ] Authentication
- [ ] Deployment

## Running locally

```bash
# install dependencies
npm install

# set up PostgreSQL database (see src/db.js for connection config)
createdb noteboard

# start the server (auto-restarts on changes)
npx nodemon src/server.js
```

Server runs on `http://localhost:3000`.

## API endpoints (current)

| Method | Endpoint      | Description          |
|--------|---------------|-----------------------|
| GET    | `/notes`      | List all notes        |
| GET    | `/notes/:id`  | Get a single note     |
| POST   | `/notes`      | Create a note         |
| PUT    | `/notes/:id`  | Update a note         |
| DELETE | `/notes/:id`  | Delete a note         |

WebSocket events: `note:created`, `note:deleted`, broadcast to all connected clients.
