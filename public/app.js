document.getElementById('runAnalysisBtn').addEventListener('click', () => {
  const textData = document.getElementById('processDataInput').value.trim();
  if (!textData) return alert('Please paste or upload process data.');
  document.getElementById('loadingSpinner').classList.remove('hidden');
  sendToAI(textData);
});

document.getElementById('logFileUpload').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById('processDataInput').value = e.target.result;
  };
  reader.readAsText(file);
});

function sendToAI(data) {
  fetch('/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawData: data })
  })
    .then(res => {
      if (!res.ok) {
        return res.json().then(errorData => {
          throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        });
      }
      return res.json();
    })
    .then(renderResults)
    .catch(err => {
      console.error('AI error:', err);
      alert(`AI analysis failed. Error: ${err.message || 'Check browser console.'}`);
    })
    .finally(() => {
      document.getElementById('loadingSpinner').classList.add('hidden');
    });
}

function renderResults(response) {
  const resultsDiv = document.getElementById('analysisResults');
  if (!response || !response.findings || response.findings.length === 0) {
    resultsDiv.innerHTML = `<div class="p-6 bg-green-700/30 rounded-lg text-center border border-green-600">
      <p class="text-xl font-bold text-green-300">🎉 Endpoint Clean</p>
      <p class="text-green-200">No suspicious artifacts found.</p>
    </div>`;
    return;
  }

  let html = `<p class="text-white text-lg mb-4 font-semibold">AI Triage: Found <span class="text-red-400">${response.findings.length}</span> Suspicious Artifact(s)</p>`;

  response.findings.forEach((item) => {
    const severityColor =
      item.severity === 'High' ? 'red-400' :
      item.severity === 'Medium' ? 'yellow-300' :
      'green-300';

    html += `
      <div class="flagged-item p-4 rounded-lg shadow-xl mb-4">
        <p class="text-xl font-bold text-red-300">${item.name} (PID: ${item.pid})</p>
        <p class="text-sm text-gray-300 mb-2">Path: <span class="font-mono text-xs text-white">${item.path}</span></p>
        <p class="text-sm text-gray-300 mb-2">User: ${item.user}</p>
        <p class="text-sm text-gray-300 mb-2">Network: <span class="font-mono text-xs text-yellow-300">${item.connections}</span></p>
        <p class="text-sm text-gray-300 mb-2">Severity: <span class="font-bold text-${severityColor}">${item.severity}</span></p>
        <p class="text-sm font-semibold text-red-400 mt-2">AI Explanation:</p>
        <p class="text-sm text-gray-200">${item.explanation}</p>
      </div>
    `;
  });

  html += `<button id="exportBtn" class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg">Export Findings</button>`;
  resultsDiv.innerHTML = html;

  document.getElementById('exportBtn').addEventListener('click', () => exportFindings(response.findings));
}

function exportFindings(findings) {
  const blob = new Blob([JSON.stringify(findings, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dfir_findings.json';
  a.click();
  URL.revokeObjectURL(url);
}
