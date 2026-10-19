import { useEffect, useState } from "react";

const API = "http://localhost:3000";

export default function App() {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    fetch(`${API}/board`)
      .then((res) => res.json())
      .then(setBoard)
      .catch(console.error);
  }, []);

  return (
    <div style={{ display: "flex", gap: 16, padding: 16, alignItems: "flex-start" }}>
      {board.map((column) => (
        <div
          key={column.id}
          style={{ minWidth: 220, background: "#eee", padding: 12, borderRadius: 8 }}
        >
          <h3>{column.name}</h3>
          {column.cards.map((card) => (
            <div
              key={card.id}
              style={{ background: "white", padding: 8, marginBottom: 8, borderRadius: 4 }}
            >
              <strong>{card.title}</strong>
              <p>{card.content}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}