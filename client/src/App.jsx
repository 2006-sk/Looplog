import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('event');
  const [filter, setFilter] = useState('');
  const [editId, setEditId] = useState(null);

  const API_URL = 'http://localhost:5001/api/logs';

  // Fetch logs (optionally filtered)
  const fetchLogs = async () => {
    const res = await axios.get(`${API_URL}${filter ? `?type=${filter}` : ''}`);
    setLogs(res.data);
  };

  // Add or update a log
  const handleSubmit = async () => {
    if (editId) {
      await axios.put(`${API_URL}/${editId}`, { message, type });
      setEditId(null);
    } else {
      await axios.post(API_URL, {
        type,
        message,
        metadata: { page: 'home', user: 'frontend' },
      });
    }
    setMessage('');
    fetchLogs();
  };

  // Delete a log
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchLogs();
  };

  // Load existing log into input fields
  const handleEdit = (log) => {
    setMessage(log.message);
    setType(log.type);
    setEditId(log._id);
  };

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📊 LoopLog - Logging Dashboard</h1>

      {/* Log Input */}
      <div className="flex gap-2 mb-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="event">event</option>
          <option value="error">error</option>
          <option value="info">info</option>
          <option value="debug">debug</option>
        </select>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter log message"
          className="border px-4 py-2 w-full rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? 'Update' : 'Log It'}
        </button>
      </div>

      {/* Log Filter */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by type:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All</option>
          <option value="event">event</option>
          <option value="error">error</option>
          <option value="info">info</option>
          <option value="debug">debug</option>
        </select>
      </div>

      {/* Display Logs */}
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log._id} className="border p-4 rounded relative bg-white">
            <p><strong>Type:</strong> {log.type}</p>
            <p><strong>Message:</strong> {log.message}</p>
            <p className="text-sm text-gray-500">
              {new Date(log.createdAt).toLocaleString()}
            </p>
            <div className="absolute top-2 right-2 space-x-2">
              <button onClick={() => handleEdit(log)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(log._id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
