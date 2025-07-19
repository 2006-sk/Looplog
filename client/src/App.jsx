import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/logs'; // or your deployed URL

function App() {
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('event');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    try {
      const res = await axios.get(API_URL);
      setLogs(res.data);
    } catch (err) {
      setError('Failed to fetch logs');
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!message.trim()) return;

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { type, message });
        setEditingId(null);
      } else {
        await axios.post(API_URL, {
          type,
          message,
          metadata: { user: 'dev', page: 'test' },
        });
      }
      setMessage('');
      fetchLogs();
    } catch (err) {
      setError('Failed to submit log');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchLogs();
    } catch (err) {
      setError('Delete failed');
    }
  };

  const startEdit = (log) => {
    setMessage(log.message);
    setType(log.type);
    setEditingId(log._id);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>LoopLog Admin</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '8px', marginBottom: 16 }}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="event">event</option>
          <option value="error">error</option>
          <option value="info">info</option>
          <option value="debug">debug</option>
        </select>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Log message"
          style={{ flex: 1 }}
        />
        <button onClick={handleSubmit}>
          {editingId ? 'Update' : 'Log'}
        </button>
      </div>

      <ul>
        {logs.map((log) => (
          <li key={log._id} style={{ marginBottom: 12 }}>
            <div><strong>{log.type}</strong>: {log.message}</div>
            <div style={{ fontSize: 12, color: '#777' }}>
              {new Date(log.createdAt).toLocaleString()}
            </div>
            <div>
              <button onClick={() => startEdit(log)}>Edit</button>
              <button onClick={() => handleDelete(log._id)} style={{ marginLeft: 8 }}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
