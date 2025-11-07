import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises'; 
import path from 'path'; 

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

if (!process.env.GEMINI_API_KEY) {
    console.error("FATAL: GEMINI_API_KEY is not set in your .env file or Vercel environment.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const __dirname = path.resolve();

app.get('/load-data/:filename', async (req, res) => {
    const filename = req.params.filename; 
    const filePath = path.join(__dirname, filename); 

    try {
        const data = await fs.readFile(filePath, 'utf-8');
        res.type('text/plain').send(data);

    } catch (error) {
        console.error(`Error reading mock file ${filename}:`, error.message);
        if (error.code === 'ENOENT') {
            return res.status(404).json({ error: `Mock file '${filename}' not found. Make sure it's at the project root.` });
        }
        res.status(500).json({ error: 'Failed to read data file.' });
    }
});


app.post('/analyze', async (req, res) => {
    const { rawData } = req.body;
    if (!rawData) return res.status(400).json({ error: 'Missing data' });

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
You are a DFIR triage assistant.
Analyze the following raw process and network data from a potentially compromised endpoint.
Before providing any final analysis or feedback, the AI must cross-reference key indicators from the raw data against authoritative cyber threat intelligence sources.
Specifically, search for and integrate findings related to file hashes, IP addresses, domains, and known vulnerabilities from the following:
VirusTotal: For malware analysis reports and file reputation based on submitted hashes and IP addresses.
Exploit-DB (Exploits Database): To identify known exploit code or techniques that match observed process behavior or software versions.
NIST National Vulnerability Database (NVD): To check for documented Common Vulnerabilities and Exposures (CVEs) and associated weaknesses that correspond to any identified software versions or suspicious network activity patterns.
Consider the context of recent cyber threat trends, such as ransomware campaigns, phishing attacks, and advanced persistent threats (APTs), to enhance your analysis.
Return findings sorted by severity and include MITRE ATT&CK technique IDs if applicable.
You can also include is the attack is benign hence a low severity

Data:
${rawData}

Return a JSON array of suspicious findings. Each finding must include:
- pid: Process ID
- name: Process name
- path: Full process path
- user: User running the process
- connections: Network connection details or 'NONE'
- explanation: DFIR reason why this entry is suspicious
- severity: One of "High", "Medium", or "Low" based on threat level

Respond ONLY with valid JSON. No commentary, no Markdown.
`;

        const result = await model.generateContent([prompt]);

        const rawText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText || rawText.trim().length === 0) {
            throw new Error("Gemini API returned an empty or invalid response.");
        }

        const cleaned = rawText.replace(/```json|```/g, '').trim();
        const findings = cleaned.length === 0 ? [] : JSON.parse(cleaned);

        console.log('Gemini raw output:', cleaned);
        res.json({ findings });
    } catch (err) {
        console.error('Gemini API/Processing Fatal Error:', err.message);
        const errorMessage = err.message.includes('API key')
            ? 'Authentication failed. Check your GEMINI_API_KEY.'
            : 'AI processing failed. Check server logs for malformed JSON or API key issues.';
        res.status(500).json({ error: errorMessage });
    }
});

export default app;