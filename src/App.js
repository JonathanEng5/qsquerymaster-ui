import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://qsquerymaster.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setInsights(data.insights || ['No insights returned.']);
    } catch (err) {
      setInsights(['Error uploading file.']);
    } finally {
      setLoading(false);
    }
  };

  const downloadTextReport = () => {
    const text = insights.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'qsquerymaster_report.txt';
    link.click();
  };

  return (
    <div className="App">
      <h1>QSQueryMaster</h1>
      <p>Upload a quantity surveying spreadsheet (.xlsx) for analysis</p>

      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Analyzing...' : 'Upload & Analyze'}
      </button>

      {insights.length > 0 && (
        <div className="results">
          <h2>Insights</h2>
          <ul>
            {insights.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <button onClick={downloadTextReport}>Download Text Report</button>
        </div>
      )}
    </div>
  );
}

export default App;