import { useState } from "react";

const empty = { rollNo: "", name: "", email: "", phone: "", course: "", year: 1, gpa: 0, status: "active" };

export default function StudentForm({ student, onSave, onClose }) {
  const [form, setForm] = useState(student || empty);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await onSave({ ...form, year: Number(form.year), gpa: Number(form.gpa) });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{student ? "Edit student" : "Add student"}</h2>
        <div className="grid">
          <label>Roll number<input value={form.rollNo} onChange={set("rollNo")} required /></label>
          <label>Full name<input value={form.name} onChange={set("name")} required /></label>
          <label>Email<input type="email" value={form.email} onChange={set("email")} required /></label>
          <label>Phone<input value={form.phone || ""} onChange={set("phone")} /></label>
          <label>Course<input value={form.course} onChange={set("course")} required /></label>
          <label>Year<input type="number" min="1" max="6" value={form.year} onChange={set("year")} /></label>
          <label>GPA<input type="number" step="0.01" min="0" max="4" value={form.gpa} onChange={set("gpa")} /></label>
          <label>Status
            <select value={form.status} onChange={set("status")}>
              <option value="active">Active</option>
              <option value="graduated">Graduated</option>
              <option value="suspended">Suspended</option>
            </select>
          </label>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary">{student ? "Save changes" : "Add student"}</button>
        </div>
      </form>
    </div>
  );
}
