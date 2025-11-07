# 🐛 DFIR Analyzer: Endpoint Artifact Intelligence Engine

An AI-powered triage assistant for SOC analysts, incident responders and DFIR engineers. Upload or paste raw process and network data from compromised endpoints to receive structured, severity-ranked findings enriched with threat intelligence and MITRE ATT&CK mappings.

## 🎯 Live Demo

- [dfir-analyzer](https://dfir-analyzer.vercel.app/) on Vercel.
- To help you explore the app, I've included mock logs right here in the repository - mock-one.json and mock-two.json.

dfir-analyzer Static Laptop View

![dfir-analyzer Static Laptop View](/dfir-analyzer/media/dfir-static-laptop-view.png)

dfir-analyzer Search Laptop View

![dfir-analyzer Search Laptop View](/dfir-analyzer/media/dfir-search-laptop-view.png)

dfir-analyzer Spinner Laptop View

![dfir-analyzer Spinner Laptop View](/dfir-analyzer/media/dfir-spinner-laptop-view.png)

dfir-analyzer Analysis Laptop View

![dfir-analyzer Analysis Laptop View](/dfir-analyzer/media/dfir-analysis-laptop-view.png)

dfir-analyzer Search Mobile View

![dfir-analyzer Search Mobile View](/dfir-analyzer/media/dfir-search-mobile-view.png)

dfir-analyzer Analysis Mobile View

![dfir-analyzer Analysis Mobile View](/dfir-analyzer/media/dfir-analysis-mobile-view.png)


## 🧰 Tech Stack

- ***Backend***: Node.js, Express, Google Generative AI (Gemini 2.5 Flash)
- ***Frontend***: HTML5, Tailwind CSS, Vanilla JavaScript
- ***Security***: Input validation, JSON sanitization, XSS-safe rendering
- ***Deployment***: Hosted on Vercel
- ***License***: MIT License

## 🔍 Key Features

- ✅ Paste or upload raw endpoint data (processes, network connections, command lines)
- ✅ Gemini-powered triage with threat intel from VirusTotal, Exploit-DB and NVD
- ✅ Severity-ranked findings with MITRE ATT&CK technique IDs
- ✅ JSON-only output for easy integration with SIEMs or dashboards
- ✅ Responsive UI with Tailwind-styled summaries

## 🧠 How It Works

1. User pastes or uploads endpoint data (e.g. EDR output, Sysmon logs)
2. Clicks “Run Triage”
3. Backend sends structured prompt to Gemini API
4. Gemini returns JSON array of suspicious findings:
    - PID, process name, path, user
    - Network connections
    - Explanation and severity
    - MITRE ATT&CK technique ID
5. Results rendered in browser with severity badges and expandable details

## 📦 How to Use

1. Clone or fork the repo
2. Add your `GEMINI_API_KEY` to `.env`
3. Run `npm install -g vercel` then `vercel login` if need be
4. Run `vercel`
5. Open the frontend and paste endpoint data
6. Click “Run Triage” to receive AI-powered findings

## 🧪 Sample Use Cases

- Triage suspicious PowerShell or rundll32 executions
- Detect persistence via scheduled tasks or registry abuse
- Flag outbound connections to known C2 infrastructure
- Enrich process trees with MITRE technique IDs
- Validate analyst hypotheses with AI-backed reasoning

## 👨‍💻 Author

**shadywhale** – DFIR toolsmith, SOC workflow optimizer and modular architecture enthusiast. Passionate about building AI-powered triage engines that empower analysts to detect threats faster, smarter and with forensic-grade clarity.

## 🌐 Explore My Security Toolkit

- [LogSentinel](https://logsentinel.netlify.app/) on Netlify

- [LogSentinel](https://github.com/shadywhale/LogSentinel/) on Github

- [LogRecon](https://logrecon.netlify.app/) on Netlify

- [LogRecon](https://github.com/shadywhale/LogRecon/) on Github
