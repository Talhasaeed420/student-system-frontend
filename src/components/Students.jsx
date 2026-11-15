import { useEffect, useState, useCallback } from "react";
import { api } from "../api.js";
import StudentForm from "./StudentForm.jsx";

export default function Students({ onLogout }) {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [editing, setEditing] = useState(null); // null | "new" | student
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [list, s] = await Promise.all([api.list({ search, status, page, limit: 8 }), api.stats()]);
      setRows(list.data);
      setPages(list.pages || 1);
      setStats(s);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }, [search, status, page]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const save = async (data) => {
    if (editing === "new") await api.create(data);
    else await api.update(editing._id, data);
    setEditing(null);
    load();
  };

  const remove = async (s) => {
    if (!confirm(`Delete ${s.name}?`)) return;
    await api.remove(s._id);
    load();
  };

  return (
    <div className="app">
      <header>
        <h1>Student records</h1>
        <button className="btn" onClick={onLogout}>Sign out</button>
      </header>

      <section className="stats">
        <div><b>{stats.total ?? 0}</b> students</div>
        <div><b>{stats.active ?? 0}</b> active</div>
        <div><b>{stats.graduated ?? 0}</b> graduated</div>
        <div><b>{stats.suspended ?? 0}</b> suspended</div>
      </section>

      <section className="toolbar">
        <input placeholder="Search name, roll no, email or course" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="graduated">Graduated</option>
          <option value="suspended">Suspended</option>
        </select>
        <button className="btn primary" onClick={() => setEditing("new")}>Add student</button>
      </section>

      {error && <p className="error">{error}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Roll no</th><th>Name</th><th>Email</th><th>Course</th><th>Year</th><th>GPA</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s._id}>
                <td>{s.rollNo}</td><td>{s.name}</td><td>{s.email}</td><td>{s.course}</td>
                <td>{s.year}</td><td>{s.gpa?.toFixed(2)}</td>
                <td><span className={`tag ${s.status}`}>{s.status}</span></td>
                <td className="row-actions">
                  <button className="link" onClick={() => setEditing(s)}>Edit</button>
                  <button className="link danger" onClick={() => remove(s)}>Delete</button>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="8" className="empty">No students yet. Add the first one.</td></tr>}
          </tbody>
        </table>
      </div>

      <footer className="pager">
        <button className="btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {pages}</span>
        <button className="btn" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
      </footer>

      {editing && <StudentForm student={editing === "new" ? null : editing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}
