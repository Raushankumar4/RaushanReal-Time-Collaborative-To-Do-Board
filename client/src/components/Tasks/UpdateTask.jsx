import React from "react";
import Button from "../resuable/Button";
import InputField from "../resuable/InputField";
import "./UpdateTask.css";

const UpdateTask = ({
  setUpdTitle,
  setEditMode,
  handleUpdateSubmit,
  setUpdDesc,
  isUpdating,
  updDesc,
  updTitle,
}) => {
  return (
    <form className="update-task-form" onSubmit={handleUpdateSubmit}>
      <InputField
        type="text"
        value={updTitle}
        onChange={(e) => setUpdTitle(e.target.value)}
        required
      />
      <textarea
        className="update-task-textarea"
        value={updDesc}
        onChange={(e) => setUpdDesc(e.target.value)}
        rows={3}
        required
      />
      <div className="update-task-buttons">
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Save"}
        </Button>
        <Button type="danger" onClick={() => setEditMode(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default UpdateTask;
