
"use strict";

/* =========================================================
   FRAX.TOOLS — Vanilla JavaScript
   No framework, no backend, no external dependencies.
========================================================= */

const tools = [
  {
    id: "json",
    name: "JSON X-Ray",
    icon: "{}",
    category: "developer",
    description: "Inspect, format, validate, and explore JSON structures.",
    detail: "Explore JSON structures with formatting, validation, and interactive tree inspection."
  },
  {
    id: "headers",
    name: "Header Detective",
    icon: "⌘",
    category: "developer",
    description: "Inspect HTTP headers and understand their purpose.",
    detail: "Paste HTTP response headers to inspect their values and identify missing security headers."
  },
  {
    id: "regex",
    name: "Regex Playground",
    icon: ".*",
    category: "developer",
    description: "Test regular expressions and inspect matches.",
    detail: "Test JavaScript regular expressions against sample text and inspect matches and capture groups."
  },
  {
    id: "sql",
    name: "SQL Anatomy",
    icon: "▤",
    category: "developer",
    description: "Break down SQL queries into readable clauses.",
    detail: "Inspect the structure of SQL statements and identify their main clauses."
  },
  {
    id: "subnet",
    name: "Subnet Visualizer",
    icon: "◈",
    category: "system",
    description: "Calculate IPv4 subnet information from CIDR.",
    detail: "Calculate IPv4 network addresses, broadcast addresses, and usable host ranges."
  },
  {
    id: "storage",
    name: "Storage Map",
    icon: "▧",
    category: "system",
    description: "Visualize the size of files in a selected folder.",
    detail: "Select local files or a folder to see how storage is distributed. Files stay in your browser."
  },
  {
    id: "cron",
    name: "Cron Visualizer",
    icon: "◷",
    category: "productivity",
    description: "Understand cron expressions and upcoming schedules.",
    detail: "Parse standard five-field cron expressions and preview upcoming execution times in your local timezone."
  },
  {
    id: "image",
    name: "Image Forensics Lite",
    icon: "▧",
    category: "file",
    description: "Inspect image dimensions, format, and file metadata.",
    detail: "Inspect local image properties without uploading the image to a server."
  },
  {
    id: "contrast",
    name: "Contrast Lab",
    icon: "◐",
    category: "productivity",
    description: "Check color contrast and accessibility ratios.",
    detail: "Calculate WCAG contrast ratios and preview foreground/background combinations."
  },
  {
    id: "diff",
    name: "Text Surgery",
    icon: "⇄",
    category: "developer",
    description: "Compare two text blocks and find their differences.",
    detail: "Compare text line by line and inspect added, removed, and unchanged content."
  }
];

const $ = (selector, root = document) => root.querySelector(selector);

const homePage = $("#homePage");
const toolPage = $("#toolPage");
const toolGrid = $("#toolGrid");
const toolWorkspace = $("#toolWorkspace");

let activeCategory = "all";
let currentTool = null;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  return `${(bytes / Math.pow(1024, index)).toFixed(index ? 2 : 0)} ${units[index]}`;
}

function showHome() {
  currentTool = null;
  homePage.classList.remove("hidden");
  toolPage.classList.add("hidden");
  $("#breadcrumb").textContent = "Overview";
  document.title = "Frax.Tools — Small tools. Real utility.";
  renderTools();
}

function renderTools() {
  const query = ($("#searchInput")?.value || "").toLowerCase();

  const filtered = tools.filter(tool => {
    const matchesCategory =
      activeCategory === "all" || tool.category === activeCategory;

    const matchesSearch =
      `${tool.name} ${tool.description} ${tool.category}`
        .toLowerCase()
        .includes(query);

    return matchesCategory && matchesSearch;
  });

  $("#toolCount").textContent = `${filtered.length} TOOLS`;

  toolGrid.innerHTML = filtered.length
    ? filtered.map(tool => `
      <button class="tool-card" data-open-tool="${tool.id}">
        <div class="card-top">
          <div class="card-icon">${escapeHTML(tool.icon)}</div>
          <span class="card-arrow">↗</span>
        </div>
        <h3>${escapeHTML(tool.name)}</h3>
        <p>${escapeHTML(tool.description)}</p>
        <div class="card-category">${escapeHTML(tool.category)}</div>
      </button>
    `).join("")
    : `<div class="notice">No tools found. Try another search.</div>`;
}

function openTool(id) {
  const tool = tools.find(item => item.id === id);
  if (!tool) return;

  currentTool = tool;
  homePage.classList.add("hidden");
  toolPage.classList.remove("hidden");

  $("#breadcrumb").textContent = tool.name;
  $("#toolIcon").textContent = tool.icon;
  $("#toolCategory").textContent = tool.category.toUpperCase();
  $("#toolTitle").textContent = tool.name;
  $("#toolDescription").textContent = tool.detail;

  document.title = `${tool.name} — Frax.Tools`;
  toolWorkspace.innerHTML = toolTemplates[id]();

  $("#sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setActiveCategory(category) {
  activeCategory = category;

  document.querySelectorAll("[data-filter]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.filter === category
    );
  });

  document.querySelectorAll("[data-category]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === category
    );
  });

  renderTools();
}

const toolTemplates = {
  json: () => `
    <div class="workspace">
      <div class="workspace-title">JSON INSPECTOR</div>
      <div class="workspace-grid">
        <div class="field">
          <label>INPUT JSON</label>
          <textarea id="jsonInput" spellcheck="false" placeholder='{"name":"Frax.Tools","version":1}'></textarea>
        </div>
        <div class="field">
          <label>FORMATTED OUTPUT</label>
          <textarea id="jsonOutput" readonly spellcheck="false" placeholder="Formatted JSON will appear here..."></textarea>
        </div>
      </div>
      <div class="action-row">
        <button class="btn btn-primary" id="jsonFormat">Format JSON</button>
        <button class="btn" id="jsonMinify">Minify</button>
        <button class="btn" id="jsonTree">Inspect structure</button>
        <button class="btn" id="jsonCopy">Copy output</button>
        <button class="btn btn-danger" id="jsonClear">Clear</button>
      </div>
      <div id="jsonStats" class="stat-grid"></div>
      <div class="output-block">
        <h3>STRUCTURE</h3>
        <div class="result" id="jsonStructure"><span class="result-empty">Structure will appear here.</span></div>
      </div>
      <div id="jsonMessage" class="tool-workspace-note"></div>
    </div>
  `,

  headers: () => `
    <div class="workspace">
      <div class="notice">Paste raw HTTP headers below. This tool analyzes the text you provide; it does not make network requests or verify a live server.</div>
      <div class="field">
        <label>HTTP RESPONSE HEADERS</label>
        <textarea id="headerInput" placeholder="HTTP/1.1 200 OK&#10;Content-Type: application/json&#10;Cache-Control: no-cache&#10;X-Content-Type-Options: nosniff"></textarea>
      </div>
      <div class="action-row">
        <button class="btn btn-primary" id="headerAnalyze">Analyze headers</button>
        <button class="btn" id="headerClear">Clear</button>
      </div>
      <div id="headerResult" class="result"><span class="result-empty">Analysis will appear here.</span></div>
    </div>
  `,

  regex: () => `
    <div class="workspace">
      <div class="workspace-grid">
        <div class="field">
          <label>REGULAR EXPRESSION</label>
          <input type="text" id="regexPattern" placeholder="\\b\\w+@\\w+\\.\\w+\\b">
        </div>
        <div class="field">
          <label>FLAGS</label>
          <input type="text" id="regexFlags" value="gi" placeholder="g, i, m, s, u">
        </div>
      </div>
      <div class="field">
        <label>TEST TEXT</label>
        <textarea id="regexText" placeholder="Enter text to test against your regular expression..."></textarea>
      </div>
      <div class="action-row">
        <button class="btn btn-primary" id="regexRun">Run expression</button>
        <button class="btn" id="regexClear">Clear</button>
      </div>
      <div id="regexResult" class="result"><span class="result-empty">Matches will appear here.</span></div>
    </div>
  `,

  sql: () => `
    <div class="workspace">
      <div class="field">
        <label>SQL QUERY</label>
        <textarea id="sqlInput" placeholder="SELECT users.name, orders.total&#10;FROM users&#10;JOIN orders ON users.id = orders.user_id&#10;WHERE orders.total > 100&#10;ORDER BY orders.total DESC;"></textarea>
      </div>
      <div class="action-row">
        <button class="btn btn-primary" id="sqlAnalyze">Analyze query</button>
        <button class="btn" id="sqlFormat">Basic formatting</button>
        <button class="btn" id="sqlClear">Clear</button>
      </div>
      <div id="sqlResult" class="result"><span class="result-empty">SQL analysis will appear here.</span></div>
      <div class="notice">This is a lightweight text-based analyzer, not a full SQL parser. It does not execute queries or connect to a database.</div>
    </div>
  `,

  subnet: () => `
    <div class="workspace">
      <div class="workspace-grid">
        <div class="field">
          <label>IP ADDRESS</label>
          <input type="text" id="subnetIP" value="192.168.1.10" placeholder="192.168.1.10">
        </div>
        <div class="field">
          <label>CIDR PREFIX</label>
          <input type="number" id="subnetCIDR" value="24" min="0" max="32">
        </div>
      </div>
      <div class="action-row">
        <button class="btn btn-primary" id="subnetCalculate">Calculate subnet</button>
      </div>
      <div id="subnetResult"><span class="result-empty">Subnet information will appear here.</span></div>
    </div>
  `,

  storage: () => `
    <div class="workspace">
      <div class="notice">Choose files or a folder. Your browser reads file metadata and sizes; file contents are not uploaded.</div>
      <div class="field">
        <label>SELECT FILES</label>
        <input type="file" id="storageFiles" multiple>
      </div>
      <div class="field">
        <label>OR SELECT A FOLDER (SUPPORTED BROWSERS)</label>
        <input type="file" id="storageFolder" webkitdirectory multiple>
      </div>
      <div id="storageStats" class="stat-grid"></div>
      <div class="output-block">
        <h3>FILE SIZE DISTRIBUTION</h3>
        <div id="storageMap" class="result"><span class="result-empty">Select files to visualize storage.</span></div>
      </div>
      <div class="output-block">
        <h3>LARGEST FILES</h3>
        <div id="storageList" class="result"><span class="result-empty">No files selected.</span></div>
      </div>
    </div>
  `,

  cron: () => `
    <div class="workspace">
      <div class="field">
        <label>CRON EXPRESSION</label>
        <input type="text" id="cronInput" value="*/5 * * * *" placeholder="*/5 * * * *">
      </div>
      <div class="notice">Uses standard five-field cron syntax: minute, hour, day of month, month, day of week. Special extensions such as L, W, and # are not supported.</div>
      <div class="action-row">
        <button class="btn btn-primary" id="cronAnalyze">Explain expression</button>
      </div>
      <div id="cronResult" class="result"><span class="result-empty">Cron explanation will appear here.</span></div>
    </div>
  `,

  image: () => `
    <div class="workspace">
      <div class="notice">Image metadata is read locally in your browser. No image is uploaded.</div>
      <div class="field">
        <label>SELECT IMAGE</label>
        <input type="file" id="imageFile" accept="image/*">
      </div>
      <div id="imagePreview" class="output-block"></div>
      <div id="imageResult" class="result"><span class="result-empty">Image information will appear here.</span></div>
    </div>
  `,

  contrast: () => `
    <div class="workspace">
      <div class="workspace-grid">
        <div class="field">
          <label>FOREGROUND COLOR</label>
          <input type="text" id="contrastFG" value="#FFFFFF">
        </div>
        <div class="field">
          <label>BACKGROUND COLOR</label>
          <input type="text" id="contrastBG" value="#17191D">
        </div>
      </div>
      <div class="action-row">
        <button class="btn btn-primary" id="contrastCheck">Calculate contrast</button>
      </div>
      <div class="color-preview" id="contrastPreview"></div>
      <div id="contrastResult" class="result"><span class="result-empty">Contrast results will appear here.</span></div>
    </div>
  `,

  diff: () => `
    <div class="workspace">
      <div class="workspace-grid">
        <div class="field">
          <label>ORIGINAL TEXT</label>
          <textarea id="diffOriginal" placeholder="Paste original text..."></textarea>
        </div>
        <div class="field">
          <label>MODIFIED TEXT</label>
          <textarea id="diffModified" placeholder="Paste modified text..."></textarea>
        </div>
      </div>
      <div class="action-row">
        <button class="btn btn-primary" id="diffCompare">Compare text</button>
        <button class="btn" id="diffClear">Clear</button>
      </div>
      <div id="diffStats" class="stat-grid"></div>
      <div class="output-block">
        <h3>DIFF OUTPUT</h3>
        <div id="diffResult" class="result"><span class="result-empty">Comparison will appear here.</span></div>
      </div>
      <div class="tool-workspace-note">Line-based comparison. Very large inputs are limited to keep your browser responsive.</div>
    </div>
  `
};

/* =========================================================
   JSON X-RAY
========================================================= */

function inspectJSON(value, depth = 0, key = "root") {
  const indent = "  ".repeat(depth);
  const safeKey = escapeHTML(key);

  if (Array.isArray(value)) {
    let output = `${indent}▾ ${safeKey} <span class="mono">Array(${value.length})</span>\n`;
    value.slice(0, 100).forEach((item, index) => {
      output += inspectJSON(item, depth + 1, `[${index}]`);
    });
    if (value.length > 100) {
      output += `${indent}  … ${value.length - 100} more items\n`;
    }
    return output;
  }

  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value);
    let output = `${indent}▾ ${safeKey} <span class="mono">Object(${entries.length})</span>\n`;
    entries.slice(0, 100).forEach(([childKey, childValue]) => {
      output += inspectJSON(childValue, depth + 1, childKey);
    });
    if (entries.length > 100) {
      output += `${indent}  … ${entries.length - 100} more properties\n`;
    }
    return output;
  }

  let type = value === null ? "null" : typeof value;
  let display = typeof value === "string" ? `"${value}"` : String(value);
  if (display.length > 90) display = display.slice(0, 87) + "...";

  return `${indent}• ${safeKey}: <span class="mono">${escapeHTML(display)}</span> <span style="color:var(--subtle)">(${type})</span>\n`;
}

function runJSON(mode) {
  const input = $("#jsonInput").value;
  const output = $("#jsonOutput");
  const message = $("#jsonMessage");

  try {
    const parsed = JSON.parse(input);
    const formatted = mode === "minify"
      ? JSON.stringify(parsed)
      : JSON.stringify(parsed, null, 2);

    output.value = formatted;

    const stats = {
      bytes: new Blob([input]).size,
      keys: countJSONKeys(parsed),
      type: Array.isArray(parsed) ? "Array" :
        parsed === null ? "Null" : typeof parsed
    };

    $("#jsonStats").innerHTML = `
      <div class="stat"><strong>${formatBytes(stats.bytes)}</strong><span>INPUT SIZE</span></div>
      <div class="stat"><strong>${stats.keys}</strong><span>PROPERTIES / ITEMS</span></div>
      <div class="stat"><strong>${escapeHTML(stats.type)}</strong><span>ROOT TYPE</span></div>
    `;

    if (mode === "tree") {
      $("#jsonStructure").innerHTML =
        `<pre>${inspectJSON(parsed)}</pre>`;
    } else {
      $("#jsonStructure").innerHTML =
        `<span class="result-empty">Click "Inspect structure" to explore the JSON tree.</span>`;
    }

    message.textContent = "Valid JSON. Parsing completed successfully.";
    message.className = "tool-workspace-note success";
  } catch (error) {
    message.textContent = `Invalid JSON: ${error.message}`;
    message.className = "tool-workspace-note error";
    $("#jsonStructure").innerHTML =
      `<span class="result-empty">Could not inspect invalid JSON.</span>`;
  }
}

function countJSONKeys(value) {
  if (Array.isArray(value)) {
    return value.length + value.reduce((sum, item) => sum + countJSONKeys(item), 0);
  }

  if (value && typeof value === "object") {
    return Object.keys(value).length +
      Object.values(value).reduce((sum, item) => sum + countJSONKeys(item), 0);
  }

  return 0;
}

/* =========================================================
   HEADER DETECTIVE
========================================================= */

const headerDescriptions = {
  "content-type": "Describes the media type of the response.",
  "content-length": "Indicates the response body size in bytes.",
  "cache-control": "Controls caching behavior.",
  "content-security-policy": "Defines permitted content sources and helps mitigate injection attacks.",
  "strict-transport-security": "Instructs browsers to use HTTPS for future requests.",
  "x-content-type-options": "Helps prevent MIME type sniffing.",
  "x-frame-options": "Controls whether the page can be embedded in frames.",
  "referrer-policy": "Controls how much referrer information is sent.",
  "permissions-policy": "Controls access to selected browser features.",
  "access-control-allow-origin": "Controls which origins can access resources through CORS.",
  "server": "May disclose server software information.",
  "set-cookie": "Sets a cookie in the browser.",
  "etag": "Provides a validator for cached resources.",
  "vary": "Indicates which request headers affect the response."
};

function analyzeHeaders() {
  const lines = $("#headerInput").value.split(/\r?\n/);
  const headers = [];
  let statusLine = "";

  for (const line of lines) {
    if (!line.trim()) continue;

    const separator = line.indexOf(":");

    if (separator === -1) {
      if (!statusLine && /^(HTTP\/|[A-Z]{3,})/.test(line)) {
        statusLine = line.trim();
      }
      continue;
    }

    headers.push({
      name: line.slice(0, separator).trim(),
      value: line.slice(separator + 1).trim()
    });
  }

  const present = new Set(headers.map(item => item.name.toLowerCase()));
  const recommendations = [
    ["content-security-policy", "Consider a suitable Content-Security-Policy."],
    ["strict-transport-security", "Consider HSTS when the site is served exclusively over HTTPS."],
    ["x-content-type-options", "Consider X-Content-Type-Options: nosniff."],
    ["referrer-policy", "Consider setting an explicit Referrer-Policy."],
    ["permissions-policy", "Review whether a Permissions-Policy is appropriate."]
  ];

  let html = "";

  if (statusLine) {
    html += `<div class="result-line"><b>Status line</b><br>${escapeHTML(statusLine)}</div>`;
  }

  html += `<div class="result-line"><b>${headers.length} headers detected</b></div>`;

  for (const header of headers) {
    const name = header.name.toLowerCase();
    const description = headerDescriptions[name] || "No built-in description available.";
    html += `
      <div class="result-line">
        <b>${escapeHTML(header.name)}</b>
        <div class="mono">${escapeHTML(header.value)}</div>
        <div style="color:var(--muted);margin-top:4px">${escapeHTML(description)}</div>
      </div>
    `;
  }

  const missing = recommendations.filter(([name]) => !present.has(name));

  html += `<div class="result-line"><b>Review suggestions</b></div>`;

  if (missing.length) {
    for (const [, suggestion] of missing) {
      html += `<div class="result-line"><span class="error">•</span> ${escapeHTML(suggestion)}</div>`;
    }
  } else {
    html += `<div class="result-line success">The listed review headers are present.</div>`;
  }

  $("#headerResult").innerHTML = html;
}

/* =========================================================
   REGEX PLAYGROUND
========================================================= */

function runRegex() {
  const pattern = $("#regexPattern").value;
  const flags = $("#regexFlags").value;
  const text = $("#regexText").value;
  const result = $("#regexResult");

  try {
    if (/[^dgimsuvy]/.test(flags) || new Set(flags).size !== flags.length) {
      throw new Error("Invalid or duplicate regular expression flags.");
    }

    const regex = new RegExp(pattern, flags);
    const matches = [];
    let match;

    if (regex.global || regex.sticky) {
      let safetyCounter = 0;

      while ((match = regex.exec(text)) !== null) {
        matches.push({
          value: match[0],
          index: match.index,
          groups: match.slice(1)
        });

        if (!match[0].length) regex.lastIndex++;
        if (++safetyCounter >= 1000) break;
      }
    } else {
      match = regex.exec(text);
      if (match) {
        matches.push({
          value: match[0],
          index: match.index,
          groups: match.slice(1)
        });
      }
    }

    const html = matches.length
      ? matches.map((item, index) => `
        <div class="result-line">
          <b>Match ${index + 1}</b>
          <div class="mono">${escapeHTML(item.value)}</div>
          <div style="color:var(--muted)">Index: ${item.index}</div>
          ${item.groups.length
            ? `<div style="color:var(--muted)">Groups: ${escapeHTML(JSON.stringify(item.groups))}</div>`
            : ""}
        </div>
      `).join("")
      : `<div class="result-line">No matches found.</div>`;

    result.innerHTML = `
      <div class="result-line"><b>${matches.length} match(es)</b></div>
      ${html}
    `;
  } catch (error) {
    result.innerHTML = `<span class="error">${escapeHTML(error.message)}</span>`;
  }
}

/* =========================================================
   SQL ANATOMY
========================================================= */

const sqlClauses = [
  ["SELECT", "Selects columns or expressions."],
  ["FROM", "Specifies the source table or relation."],
  ["JOIN", "Combines rows from multiple relations."],
  ["ON", "Defines the join condition."],
  ["WHERE", "Filters rows before grouping."],
  ["GROUP BY", "Groups rows by expressions."],
  ["HAVING", "Filters grouped results."],
  ["ORDER BY", "Sorts the result set."],
  ["LIMIT", "Limits the number of returned rows."],
  ["OFFSET", "Skips a number of rows."]
];

function analyzeSQL() {
  const sql = $("#sqlInput").value.trim();
  if (!sql) return;

  const upper = sql.toUpperCase();
  const found = sqlClauses.filter(([keyword]) => {
    return new RegExp(`\\b${keyword.replace(" ", "\\s+")}\\b`, "i").test(upper);
  });

  const lines = found.map(([keyword, description]) => `
    <div class="result-line">
      <b>${escapeHTML(keyword)}</b>
      <div style="color:var(--muted);margin-top:4px">${escapeHTML(description)}</div>
    </div>
  `).join("");

  const statement = /^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH)\b/i.exec(sql);

  $("#sqlResult").innerHTML = `
    <div class="result-line">
      <b>Statement type</b>
      ${statement ? escapeHTML(statement[1].toUpperCase()) : "Unknown"}
    </div>
    <div class="result-line"><b>${found.length} recognized clauses</b></div>
    ${lines || '<div class="result-line">No recognized clauses found.</div>'}
  `;
}

function formatSQL() {
  let sql = $("#sqlInput").value.trim();
  if (!sql) return;

  const keywords = [
    "SELECT", "FROM", "WHERE", "GROUP BY", "HAVING",
    "ORDER BY", "LIMIT", "OFFSET", "LEFT JOIN",
    "RIGHT JOIN", "INNER JOIN", "FULL JOIN", "JOIN",
    "ON", "UNION", "VALUES", "SET"
  ];

  for (const keyword of keywords) {
    const pattern = keyword.replace(" ", "\\s+");
    sql = sql.replace(
      new RegExp(`\\s+(${pattern})\\b`, "gi"),
      "\n$1"
    );
  }

  $("#sqlInput").value = sql.replace(/[ \t]+/g, " ").trim();
  analyzeSQL();
}

/* =========================================================
   SUBNET VISUALIZER
========================================================= */

function ipv4ToNumber(ip) {
  const parts = ip.split(".");
  if (parts.length !== 4) throw new Error("IPv4 must contain four octets.");

  let number = 0;

  for (const part of parts) {
    if (!/^\d+$/.test(part)) throw new Error("Invalid IPv4 octet.");
    const value = Number(part);

    if (value < 0 || value > 255) throw new Error("IPv4 octets must be 0–255.");

    number = (number * 256 + value) >>> 0;
  }

  return number >>> 0;
}

function numberToIPv4(number) {
  return [
    (number >>> 24) & 255,
    (number >>> 16) & 255,
    (number >>> 8) & 255,
    number & 255
  ].join(".");
}

function calculateSubnet() {
  try {
    const ip = $("#subnetIP").value.trim();
    const cidr = Number($("#subnetCIDR").value);

    if (!Number.isInteger(cidr) || cidr < 0 || cidr > 32) {
      throw new Error("CIDR prefix must be between 0 and 32.");
    }

    const ipNumber = ipv4ToNumber(ip);
    const mask = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
    const wildcard = (~mask) >>> 0;
    const network = (ipNumber & mask) >>> 0;
    const broadcast = (network | wildcard) >>> 0;

    let firstHost = network;
    let lastHost = broadcast;
    let hostCount = Math.pow(2, 32 - cidr);

    if (cidr <= 30) {
      firstHost = network + 1;
      lastHost = broadcast - 1;
      hostCount -= 2;
    }

    if (cidr === 31) {
      firstHost = network;
      lastHost = broadcast;
    }

    if (cidr === 32) {
      firstHost = network;
      lastHost = network;
    }

    const rows = [
      ["IP address", ip],
      ["Network address", numberToIPv4(network)],
      ["Broadcast address", numberToIPv4(broadcast)],
      ["Subnet mask", numberToIPv4(mask)],
      ["Wildcard mask", numberToIPv4(wildcard)],
      ["First usable address", numberToIPv4(firstHost)],
      ["Last usable address", numberToIPv4(lastHost)],
      ["Usable host addresses", hostCount.toLocaleString("en-US")],
      ["CIDR notation", `${numberToIPv4(network)}/${cidr}`]
    ];

    $("#subnetResult").innerHTML = `
      <div class="stat-grid">
        <div class="stat"><strong>/${cidr}</strong><span>PREFIX</span></div>
        <div class="stat"><strong>${hostCount.toLocaleString("en-US")}</strong><span>USABLE HOSTS</span></div>
        <div class="stat"><strong>${32 - cidr}</strong><span>HOST BITS</span></div>
      </div>
      <div class="result">
        ${rows.map(([label, value]) => `
          <div class="result-line">
            <b>${escapeHTML(label)}</b>
            <span class="mono">${escapeHTML(value)}</span>
          </div>
        `).join("")}
      </div>
    `;
  } catch (error) {
    $("#subnetResult").innerHTML =
      `<div class="notice error">${escapeHTML(error.message)}</div>`;
  }
}

/* =========================================================
   STORAGE MAP
========================================================= */

function analyzeStorage(fileList) {
  const files = Array.from(fileList || []);
  const total = files.reduce((sum, file) => sum + file.size, 0);
  const largest = [...files].sort((a, b) => b.size - a.size).slice(0, 15);

  $("#storageStats").innerHTML = `
    <div class="stat"><strong>${files.length}</strong><span>FILES</span></div>
    <div class="stat"><strong>${formatBytes(total)}</strong><span>TOTAL SIZE</span></div>
    <div class="stat"><strong>${formatBytes(largest[0]?.size || 0)}</strong><span>LARGEST FILE</span></div>
  `;

  if (!files.length) {
    $("#storageMap").innerHTML = `<span class="result-empty">No files selected.</span>`;
    $("#storageList").innerHTML = `<span class="result-empty">No files selected.</span>`;
    return;
  }

  const sorted = [...files].sort((a, b) => b.size - a.size);
  const colors = ["#c6a36a", "#8eb99b", "#7894ad", "#ad8cba", "#c17f7f", "#8a9a75"];

  const blocks = sorted.slice(0, 30).map((file, index) => {
    const share = total ? (file.size / total) * 100 : 0;
    return `
      <div style="
        width:${Math.max(share, 0.5)}%;
        min-width:3px;
        height:32px;
        background:${colors[index % colors.length]};
        border-right:2px solid var(--bg);
        flex-grow:${Math.max(file.size, 1)};
      " title="${escapeHTML(file.name)} — ${formatBytes(file.size)}"></div>
    `;
  }).join("");

  $("#storageMap").innerHTML = `
    <div style="display:flex;gap:2px;overflow:hidden;border-radius:4px">
      ${blocks}
    </div>
    <div class="tool-workspace-note">Showing up to 30 largest files. Each segment represents a file's relative size.</div>
  `;

  $("#storageList").innerHTML = largest.map(file => `
    <div class="result-line" style="display:flex;justify-content:space-between;gap:12px">
      <span style="overflow-wrap:anywhere">${escapeHTML(file.webkitRelativePath || file.name)}</span>
      <b style="white-space:nowrap">${formatBytes(file.size)}</b>
    </div>
  `).join("");
}

/* =========================================================
   CRON VISUALIZER
========================================================= */

function parseCronField(field, min, max, name) {
  const values = new Set();

  for (const part of field.split(",")) {
    const [rangePart, stepPart] = part.split("/");
    const step = stepPart === undefined ? 1 : Number(stepPart);

    if (!Number.isInteger(step) || step < 1) {
      throw new Error(`Invalid step in ${name}.`);
    }

    let start, end;

    if (rangePart === "*") {
      start = min;
      end = max;
    } else if (rangePart.includes("-")) {
      const range = rangePart.split("-").map(Number);
      if (range.length !== 2) throw new Error(`Invalid range in ${name}.`);
      [start, end] = range;
    } else {
      start = Number(rangePart);
      end = stepPart === undefined ? start : max;
    }

    if (
      !Number.isInteger(start) || !Number.isInteger(end) ||
      start < min || end > max || start > end
    ) {
      throw new Error(`Value out of range in ${name}.`);
    }

    for (let value = start; value <= end; value += step) {
      values.add(value);
    }
  }

  return values;
}

function cronMatches(date, fields) {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const weekday = date.getDay();

  const dayMatch = fields.day.has(day);
  const weekdayMatch = fields.weekday.has(weekday);

  // Standard cron behavior: if both day-of-month and day-of-week
  // are restricted, either one may match.
  const dayOfMonthRestricted = fields.day.size < 31;
  const dayOfWeekRestricted = fields.weekday.size < 7;

  let calendarMatch;

  if (dayOfMonthRestricted && dayOfWeekRestricted) {
    calendarMatch = dayMatch || weekdayMatch;
  } else {
    calendarMatch = dayMatch && weekdayMatch;
  }

  return fields.minute.has(minute) &&
    fields.hour.has(hour) &&
    calendarMatch &&
    fields.month.has(month);
}

function analyzeCron() {
  try {
    const expression = $("#cronInput").value.trim();
    const parts = expression.split(/\s+/);

    if (parts.length !== 5) {
      throw new Error("Cron expression must contain exactly five fields.");
    }

    const fields = {
      minute: parseCronField(parts[0], 0, 59, "minute"),
      hour: parseCronField(parts[1], 0, 23, "hour"),
      day: parseCronField(parts[2], 1, 31, "day of month"),
      month: parseCronField(parts[3], 1, 12, "month"),
      weekday: parseCronField(parts[4], 0, 6, "day of week")
    };

    const descriptions = [
      ["Minute", parts[0], [...fields.minute].join(", ")],
      ["Hour", parts[1], [...fields.hour].join(", ")],
      ["Day of month", parts[2], [...fields.day].join(", ")],
      ["Month", parts[3], [...fields.month].join(", ")],
      ["Day of week", parts[4], [...fields.weekday].join(", ")]
    ];

    const upcoming = [];
    const now = new Date();
    const cursor = new Date(now);
    cursor.setSeconds(0, 0);
    cursor.setMinutes(cursor.getMinutes() + 1);

    const limit = 366 * 24 * 60;

    for (let i = 0; i < limit && upcoming.length < 5; i++) {
      if (cronMatches(cursor, fields)) {
        upcoming.push(new Date(cursor));
      }
      cursor.setMinutes(cursor.getMinutes() + 1);
    }

    const dateFormatter = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });

    $("#cronResult").innerHTML = `
      <div class="result-line"><b>Expression</b><span class="mono">${escapeHTML(expression)}</span></div>
      ${descriptions.map(([label, raw, expanded]) => `
        <div class="result-line">
          <b>${label}</b>
          <span class="mono">${escapeHTML(raw)}</span>
          <div style="color:var(--muted);margin-top:4px">${escapeHTML(expanded)}</div>
        </div>
      `).join("")}
      <div class="result-line"><b>Next scheduled runs (local time)</b></div>
      ${upcoming.length
        ? upcoming.map(date => `<div class="result-line mono">${escapeHTML(dateFormatter.format(date))}</div>`).join("")
        : `<div class="result-line">No execution found within the next 366 days.</div>`
      }
    `;
  } catch (error) {
    $("#cronResult").innerHTML =
      `<span class="error">${escapeHTML(error.message)}</span>`;
  }
}

/* =========================================================
   IMAGE FORENSICS LITE
========================================================= */

function inspectImage(file) {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    $("#imageResult").innerHTML = `<span class="error">Please select an image file.</span>`;
    return;
  }

  const objectURL = URL.createObjectURL(file);
  const image = new Image();

  image.onload = () => {
    const ratio = image.width / image.height;

    $("#imagePreview").innerHTML = `
      <img
        src="${objectURL}"
        alt="Selected image preview"
        style="display:block;max-width:100%;max-height:320px;object-fit:contain;border-radius:7px;background:#101214"
      >
    `;

    const properties = [
      ["File name", file.name],
      ["MIME type", file.type || "Unknown"],
      ["File size", formatBytes(file.size)],
      ["Last modified", file.lastModified ? new Date(file.lastModified).toLocaleString() : "Unknown"],
      ["Width", `${image.width}px`],
      ["Height", `${image.height}px`],
      ["Aspect ratio", ratio.toFixed(4)],
      ["Orientation", image.width > image.height ? "Landscape" : image.width < image.height ? "Portrait" : "Square"]
    ];

    $("#imageResult").innerHTML = properties.map(([label, value]) => `
      <div class="result-line">
        <b>${escapeHTML(label)}</b>
        <span class="mono">${escapeHTML(value)}</span>
      </div>
    `).join("") + `
      <div class="notice">
        This browser-based version reads file properties and image dimensions. It does not currently decode full EXIF metadata.
      </div>
    `;
  };

  image.onerror = () => {
    URL.revokeObjectURL(objectURL);
    $("#imageResult").innerHTML = `<span class="error">Could not read this image.</span>`;
  };

  image.src = objectURL;
}

/* =========================================================
   CONTRAST LAB
========================================================= */

function parseHex(hex) {
  let value = hex.trim().replace(/^#/, "");

  if (/^[0-9a-f]{3}$/i.test(value)) {
    value = value.split("").map(char => char + char).join("");
  }

  if (!/^[0-9a-f]{6}$/i.test(value)) {
    throw new Error("Use a valid 3-digit or 6-digit HEX color.");
  }

  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16)
  ];
}

function luminance(rgb) {
  const channels = rgb.map(value => {
    const normalized = value / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * channels[0] +
    0.7152 * channels[1] +
    0.0722 * channels[2];
}

function checkContrast() {
  try {
    const fg = $("#contrastFG").value;
    const bg = $("#contrastBG").value;

    const foreground = parseHex(fg);
    const background = parseHex(bg);

    const l1 = luminance(foreground);
    const l2 = luminance(background);
    const ratio = (Math.max(l1, l2) + 0.05) /
      (Math.min(l1, l2) + 0.05);

    const normalAA = ratio >= 4.5;
    const largeAA = ratio >= 3;
    const normalAAA = ratio >= 7;
    const largeAAA = ratio >= 4.5;

    const fgHex = "#" + foreground.map(v => v.toString(16).padStart(2, "0")).join("");
    const bgHex = "#" + background.map(v => v.toString(16).padStart(2, "0")).join("");

    $("#contrastPreview").style.background = bgHex;
    $("#contrastPreview").style.color = fgHex;
    $("#contrastPreview").style.display = "grid";
    $("#contrastPreview").style.placeItems = "center";
    $("#contrastPreview").style.fontSize = "18px";
    $("#contrastPreview").style.fontWeight = "700";
    $("#contrastPreview").textContent = "Frax.Tools Preview";

    $("#contrastResult").innerHTML = `
      <div class="stat-grid">
        <div class="stat"><strong>${ratio.toFixed(2)}:1</strong><span>CONTRAST RATIO</span></div>
        <div class="stat"><strong class="${normalAA ? "success" : "error"}">${normalAA ? "PASS" : "FAIL"}</strong><span>WCAG AA NORMAL</span></div>
        <div class="stat"><strong class="${normalAAA ? "success" : "error"}">${normalAAA ? "PASS" : "FAIL"}</strong><span>WCAG AAA NORMAL</span></div>
      </div>
      <div class="result-line">AA large text: <b class="${largeAA ? "success" : "error"}">${largeAA ? "PASS" : "FAIL"}</b> (minimum 3:1)</div>
      <div class="result-line">AAA large text: <b class="${largeAAA ? "success" : "error"}">${largeAAA ? "PASS" : "FAIL"}</b> (minimum 4.5:1)</div>
      <div class="result-line">Foreground: <span class="mono">${fgHex.toUpperCase()}</span></div>
      <div class="result-line">Background: <span class="mono">${bgHex.toUpperCase()}</span></div>
    `;
  } catch (error) {
    $("#contrastResult").innerHTML =
      `<span class="error">${escapeHTML(error.message)}</span>`;
  }
}

/* =========================================================
   TEXT SURGERY
========================================================= */

function compareText() {
  const original = $("#diffOriginal").value.split(/\r?\n/);
  const modified = $("#diffModified").value.split(/\r?\n/);

  if (original.length > 300 || modified.length > 300) {
    $("#diffResult").innerHTML =
      `<span class="error">This lightweight comparison supports up to 300 lines per input.</span>`;
    return;
  }

  const rows = original.length + 1;
  const cols = modified.length + 1;

  const dp = Array.from({ length: rows }, () => new Uint16Array(cols));

  for (let i = original.length - 1; i >= 0; i--) {
    for (let j = modified.length - 1; j >= 0; j--) {
      dp[i][j] = original[i] === modified[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const operations = [];
  let i = 0;
  let j = 0;

  while (i < original.length && j < modified.length) {
    if (original[i] === modified[j]) {
      operations.push({ type: "same", text: original[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      operations.push({ type: "removed", text: original[i] });
      i++;
    } else {
      operations.push({ type: "added", text: modified[j] });
      j++;
    }
  }

  while (i < original.length) {
    operations.push({ type: "removed", text: original[i++] });
  }

  while (j < modified.length) {
    operations.push({ type: "added", text: modified[j++] });
  }

  const added = operations.filter(item => item.type === "added").length;
  const removed = operations.filter(item => item.type === "removed").length;
  const unchanged = operations.filter(item => item.type === "same").length;

  $("#diffStats").innerHTML = `
    <div class="stat"><strong class="success">${added}</strong><span>ADDED LINES</span></div>
    <div class="stat"><strong class="error">${removed}</strong><span>REMOVED LINES</span></div>
    <div class="stat"><strong>${unchanged}</strong><span>UNCHANGED</span></div>
  `;

  $("#diffResult").innerHTML = `
    <pre>${operations.map(item => {
      const prefix = item.type === "added" ? "+" :
        item.type === "removed" ? "-" : " ";

      const className = item.type === "added" ? "diff-added" :
        item.type === "removed" ? "diff-removed" : "";

      return `<span class="${className}">${prefix} ${escapeHTML(item.text)}</span>`;
    }).join("\n")}</pre>
  `;
}

/* =========================================================
   EVENT DELEGATION
========================================================= */

document.addEventListener("click", event => {
  const openButton = event.target.closest("[data-open-tool]");
  if (openButton) {
    openTool(openButton.dataset.openTool);
    return;
  }

  const categoryButton = event.target.closest("[data-filter]");
  if (categoryButton) {
    setActiveCategory(categoryButton.dataset.filter);
    return;
  }

  const sidebarCategory = event.target.closest("[data-category]");
  if (sidebarCategory) {
    setActiveCategory(sidebarCategory.dataset.category);
    $("#breadcrumb").textContent = sidebarCategory.textContent.trim();
    return;
  }
});

$("#searchInput").addEventListener("input", renderTools);

$("#backButton").addEventListener("click", showHome);
$("#menuToggle").addEventListener("click", () => {
  $("#sidebar").classList.toggle("open");
});

/* JSON */
toolWorkspace.addEventListener("click", async event => {
  const id = event.target.id;

  if (id === "jsonFormat") runJSON("format");
  if (id === "jsonMinify") runJSON("minify");
  if (id === "jsonTree") runJSON("tree");

  if (id === "jsonCopy") {
    const output = $("#jsonOutput");
    if (output.value) {
      await navigator.clipboard.writeText(output.value);
      $("#jsonMessage").textContent = "Output copied to clipboard.";
      $("#jsonMessage").className = "tool-workspace-note success";
    }
  }

  if (id === "jsonClear") {
    $("#jsonInput").value = "";
    $("#jsonOutput").value = "";
    $("#jsonStats").innerHTML = "";
    $("#jsonStructure").innerHTML = `<span class="result-empty">Structure will appear here.</span>`;
    $("#jsonMessage").textContent = "";
  }

  /* Headers */
  if (id === "headerAnalyze") analyzeHeaders();
  if (id === "headerClear") {
    $("#headerInput").value = "";
    $("#headerResult").innerHTML = `<span class="result-empty">Analysis will appear here.</span>`;
  }

  /* Regex */
  if (id === "regexRun") runRegex();
  if (id === "regexClear") {
    $("#regexPattern").value = "";
    $("#regexFlags").value = "gi";
    $("#regexText").value = "";
    $("#regexResult").innerHTML = `<span class="result-empty">Matches will appear here.</span>`;
  }

  /* SQL */
  if (id === "sqlAnalyze") analyzeSQL();
  if (id === "sqlFormat") formatSQL();
  if (id === "sqlClear") {
    $("#sqlInput").value = "";
    $("#sqlResult").innerHTML = `<span class="result-empty">SQL analysis will appear here.</span>`;
  }

  /* Subnet */
  if (id === "subnetCalculate") calculateSubnet();

  /* Cron */
  if (id === "cronAnalyze") analyzeCron();

  /* Contrast */
  if (id === "contrastCheck") checkContrast();

  /* Diff */
  if (id === "diffCompare") compareText();
  if (id === "diffClear") {
    $("#diffOriginal").value = "";
    $("#diffModified").value = "";
    $("#diffStats").innerHTML = "";
    $("#diffResult").innerHTML = `<span class="result-empty">Comparison will appear here.</span>`;
  }
});

/* File inputs */
toolWorkspace.addEventListener("change", event => {
  if (event.target.id === "storageFiles" || event.target.id === "storageFolder") {
    analyzeStorage(event.target.files);
  }

  if (event.target.id === "imageFile") {
    inspectImage(event.target.files?.[0]);
  }
});

/* Keyboard shortcut: "/" focuses search */
document.addEventListener("keydown", event => {
  const isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);

  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    if (homePage.classList.contains("hidden")) showHome();
    $("#searchInput").focus();
  }

  if (event.key === "Escape") {
    $("#sidebar").classList.remove("open");
  }
});

/* Initial render */
renderTools();
