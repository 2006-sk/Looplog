import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://looplog-1.onrender.com/api/logs';

// Category style config
const categoryStyles = {
  work: { label: '💼 Work', color: '#3182ce' },
  learning: { label: '📘 Learning', color: '#805ad5' },
  mental: { label: '🧠 Mental Health', color: '#d53f8c' },
  productivity: { label: '🚀 Productivity', color: '#38a169' },
  social: { label: '🤝 Social', color: '#dd6b20' },
};

const typeColors = {
  info: '#2b6cb0', // all logs default to info
};

function App() {
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('work');
  const [editingId, setEditingId] = useState(null);
  const [groupMode, setGroupMode] = useState('none'); // 'none' | 'date' | 'category'

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(API_URL);
      setLogs(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, {
          message,
          type: 'info',
        });
        setEditingId(null);
      } else {
        await axios.post(API_URL, {
          type: 'info',
          message,
          metadata: { category },
        });
      }
      setMessage('');
      fetchLogs();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchLogs();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const startEdit = (log) => {
    setMessage(log.message);
    setCategory(log.metadata?.category || 'work');
    setEditingId(log._id);
  };

  const groupLogs = (by) => {
    return logs.reduce((acc, log) => {
      const key =
        by === 'date'
          ? new Date(log.createdAt).toLocaleDateString()
          : log.metadata?.category || 'uncategorized';
      acc[key] = acc[key] || [];
      acc[key].push(log);
      return acc;
    }, {});
  };

  const groupedLogs = groupMode !== 'none' ? groupLogs(groupMode) : null;

  return (
    <div
      style={{
        maxWidth: 780,
        margin: '40px auto',
        fontFamily: 'Segoe UI, sans-serif',
        background: '#f0f4f8',
        padding: '20px',
        borderRadius: 8,
      }}
    >
      <h1
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: '#2d3748',
          marginBottom: 20,
        }}
      >
        📘 LoopLog Admin
      </h1>

      {/* Input Form */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 16,
          background: '#fff',
          padding: 12,
          borderRadius: 6,
        }}
      >
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {Object.entries(categoryStyles).map(([key, val]) => (
            <option key={key} value={key}>
              {val.label}
            </option>
          ))}
        </select>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Log something..."
          style={{ flex: 1 }}
        />

        <button
          onClick={handleSubmit}
          style={{
            background: '#2b6cb0',
            color: 'white',
            padding: '6px 12px',
            border: 'none',
            borderRadius: 4,
          }}
        >
          {editingId ? 'Update' : 'Log'}
        </button>
      </div>

      {/* Group Toggle Buttons */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <button
          onClick={() =>
            setGroupMode(groupMode === 'date' ? 'none' : 'date')
          }
          style={{
            background: groupMode === 'date' ? '#bee3f8' : '#edf2f7',
            padding: '6px 12px',
            borderRadius: 4,
            border: '1px solid #cbd5e0',
            cursor: 'pointer',
          }}
        >
          {groupMode === 'date' ? 'Ungroup' : 'Group by Date'}
        </button>
        <button
          onClick={() =>
            setGroupMode(groupMode === 'category' ? 'none' : 'category')
          }
          style={{
            background: groupMode === 'category' ? '#fbd38d' : '#edf2f7',
            padding: '6px 12px',
            borderRadius: 4,
            border: '1px solid #cbd5e0',
            cursor: 'pointer',
          }}
        >
          {groupMode === 'category' ? 'Ungroup' : 'Group by Category'}
        </button>
      </div>

      <h2 style={{ marginBottom: 10, color: '#2d3748' }}>
        🗂️ Your Current Logs
      </h2>

      {/* Logs View */}
      {groupMode !== 'none' ? (
        Object.entries(groupedLogs).map(([groupKey, entries]) => (
          <div key={groupKey} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, color: '#4a5568' }}>
              {groupMode === 'date'
                ? `📅 ${groupKey}`
                : `📁 ${categoryStyles[groupKey]?.label || groupKey}`}
            </h3>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {entries.map((log) => (
                <li
                  key={log._id}
                  style={{
                    background: '#fff',
                    padding: 10,
                    borderRadius: 6,
                    marginBottom: 8,
                    borderLeft: `6px solid ${
                      categoryStyles[log.metadata?.category]?.color || '#ccc'
                    }`,
                  }}
                >
                  <strong style={{ color: typeColors['info'] }}>
                    INFO
                  </strong>{' '}
                  – {log.message}
                  <div
                    style={{
                      fontSize: 13,
                      color: '#718096',
                      marginTop: 4,
                    }}
                  >
                    {
                      categoryStyles[log.metadata?.category]?.label ||
                      '📁 Other'
                    }{' '}
                    · {new Date(log.createdAt).toLocaleTimeString()}
                  </div>
                  <button
                    onClick={() => startEdit(log)}
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(log._id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {logs.map((log) => (
            <li
              key={log._id}
              style={{
                background: '#fff',
                padding: 10,
                borderRadius: 6,
                marginBottom: 10,
                borderLeft: `6px solid ${
                  categoryStyles[log.metadata?.category]?.color || '#ccc'
                }`,
              }}
            >
              <strong style={{ color: typeColors['info'] }}>INFO</strong> –{' '}
              {log.message}
              <div
                style={{
                  fontSize: 13,
                  color: '#718096',
                  marginTop: 4,
                }}
              >
                {categoryStyles[log.metadata?.category]?.label ||
                  '📁 Other'}{' '}
                · {new Date(log.createdAt).toLocaleString()}
              </div>
              <button
                onClick={() => startEdit(log)}
                style={{ marginRight: 8 }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(log._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
