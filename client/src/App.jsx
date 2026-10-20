import { useEffect, useState } from "react";

const API = "http://localhost:3000";

function Card({ card, onDelete }) {
  return (
    <div style={{ background: "white", padding: 8, marginBottom: 8, borderRadius: 4 }}>
      <strong>{card.title}</strong>
      <p>{card.content}</p>
      <button onClick={() => onDelete(card.id)}>Delete</button>
    </div>
  );
}

function Column({ column, onAddCard, onDeleteCard }) {
  const [title, setTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAddCard(column.id, title.trim());
    setTitle("");
  }

  return (
    <div style={{ width: 240, background: "#eee", padding: 12, borderRadius: 8 }}>
      <h3>{column.name}</h3>
      {column.cards.map((card) => (
        <Card key={card.id} card={card} onDelete={onDeleteCard} />
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New card title"
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default function App() {
  const [board, setBoard] = useState([]);

  async function loadBoard() {
    const res = await fetch(`${API}/board`);
    setBoard(await res.json());
  }

  useEffect(() => {
    loadBoard().catch(console.error);
  }, []);

  async function addCard(columnId, title) {
    const res = await fetch(`${API}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ column_id: columnId, title, content: "" }),
    });
    if (!res.ok) return console.error("Could not add card");
    const newCard = await res.json();
    setBoard((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
      )
    );
  }

  async function deleteCard(cardId) {
    const res = await fetch(`${API}/cards/${cardId}`, { method: "DELETE" });
    if (!res.ok) return console.error("Could not delete card");
    setBoard((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => card.id !== cardId),
      }))
    );
  }

  return (
    <div style={{ display: "flex", gap: 16, padding: 16, alignItems: "flex-start" }}>
      {board.map((column) => (
        <Column
          key={column.id}
          column={column}
          onAddCard={addCard}
          onDeleteCard={deleteCard}
        />
      ))}
    </div>
  );
}