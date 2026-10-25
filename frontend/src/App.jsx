import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/students"
});

const emptyForm = {
  name: "",
  rollNumber: "",
  branch: "",
  marks: ""
};

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadStudents = async () => {
    try {
      const response = await api.get("");
      setStudents(response.data);
      setError("");
    } catch {
      setError("Could not connect to the backend. Make sure Spring Boot is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return students;
    return students.filter((student) =>
      student.rollNumber.toLowerCase().includes(value)
    );
  }, [students, search]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setMessage("");
    setError("");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!form.name.trim() || !form.rollNumber.trim() || !form.branch.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const marks = Number(form.marks);
    if (form.marks === "" || !Number.isFinite(marks) || marks < 0 || marks > 100) {
      setError("Marks must be between 0 and 100.");
      return;
    }

    const student = {
      name: form.name.trim(),
      rollNumber: form.rollNumber.trim(),
      branch: form.branch.trim(),
      marks
    };

    try {
      if (editingId === null) {
        await api.post("", student);
        setMessage("Student added successfully.");
      } else {
        await api.put(`/${editingId}`, student);
        setMessage("Student updated successfully.");
      }
      resetForm();
      await loadStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the student.");
    }
  };

  const editStudent = (student) => {
    setForm({
      name: student.name,
      rollNumber: student.rollNumber,
      branch: student.branch,
      marks: String(student.marks)
    });
    setEditingId(student.id);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteStudent = async (student) => {
    if (!window.confirm(`Delete ${student.name}'s record?`)) return;

    try {
      await api.delete(`/${student.id}`);
      setMessage("Student deleted successfully.");
      if (editingId === student.id) resetForm();
      await loadStudents();
    } catch {
      setError("Could not delete the student.");
    }
  };

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">STUDENT PORTAL</p>
          <h1>Student Records</h1>
          <p className="subtitle">Manage student details in one place.</p>
        </div>
        <div className="total">
          <span>Total students</span>
          <strong>{students.length}</strong>
        </div>
      </header>

      <section className="panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">{editingId === null ? "NEW RECORD" : "EDIT RECORD"}</p>
            <h2>{editingId === null ? "Add a student" : "Update student"}</h2>
          </div>
        </div>

        <form className="student-form" onSubmit={handleSubmit}>
          <label>
            Student name
            <input name="name" value={form.name} onChange={handleChange} placeholder="Enter full name" />
          </label>
          <label>
            Roll number
            <input name="rollNumber" value={form.rollNumber} onChange={handleChange} placeholder="Enter roll number" />
          </label>
          <label>
            Branch
            <input name="branch" value={form.branch} onChange={handleChange} placeholder="e.g. CSE" />
          </label>
          <label>
            Marks
            <input name="marks" type="number" min="0" max="100" value={form.marks} onChange={handleChange} placeholder="0–100" />
          </label>
          <div className="form-actions">
            <button className="primary" type="submit">{editingId === null ? "Add student" : "Save changes"}</button>
            {editingId !== null && <button className="secondary" type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>

        {message && <p className="notice success">{message}</p>}
        {error && <p className="notice error">{error}</p>}
      </section>

      <section className="panel">
        <div className="list-header">
          <div>
            <p className="eyebrow">RECORDS</p>
            <h2>All students</h2>
          </div>
          <input className="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search roll number" />
        </div>

        {loading ? (
          <p className="empty">Loading students...</p>
        ) : filteredStudents.length === 0 ? (
          <div className="empty">
            <strong>{students.length === 0 ? "No students added yet" : "No matching students"}</strong>
            <p>{students.length === 0 ? "Add the first record using the form above." : "Try searching with another roll number."}</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll number</th>
                  <th>Branch</th>
                  <th>Marks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="student-name">{student.name}</td>
                    <td>{student.rollNumber}</td>
                    <td><span className="branch">{student.branch}</span></td>
                    <td>{student.marks}/100</td>
                    <td>
                      <div className="row-actions">
                        <button className="edit" onClick={() => editStudent(student)}>Edit</button>
                        <button className="delete" onClick={() => deleteStudent(student)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <footer>Student Record Management System</footer>
    </main>
  );
}
