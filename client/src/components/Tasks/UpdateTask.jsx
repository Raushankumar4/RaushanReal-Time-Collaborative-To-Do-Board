import InputField from "../resuable/InputField"


const UpdateTask = ({ setUpdTitle, setEditMode, handleUpdateSubmit, setUpdDesc, isUpdating, updDesc, updTitle }) => {
  return (
    <>
      <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <InputField
          type="text"
          value={updTitle}
          onChange={e => setUpdTitle(e.target.value)}
          required
        />
        <textarea
          value={updDesc}
          onChange={e => setUpdDesc(e.target.value)}
          rows={3}
          required
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Save"}
          </button>
          <button type="button" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}
export default UpdateTask