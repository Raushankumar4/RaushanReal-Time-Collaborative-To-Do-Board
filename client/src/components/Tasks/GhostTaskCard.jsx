const GhostTaskCard = ({ task, x, y }) => {
  console.log(task);

  return (
    <div
      className="task-card ghost"
      style={{
        position: "fixed",
        left: x + 10,
        top: y + 10,
        opacity: 0.8,
        pointerEvents: "none",
        background: "#fff",
        border: "1px dashed #ccc",
        padding: "10px",
        borderRadius: "8px",
        zIndex: 1000,
        width: "220px",
      }}
    >
      <strong>{task.title}</strong>
      <p style={{ fontSize: "13px", marginTop: "4px" }}>{task.description}</p>
    </div>
  )
}

export default GhostTaskCard;
