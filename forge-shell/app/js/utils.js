/* ═══════════════════════════════════════════════════════════════
   ForgeUtils — Shared Utility Layer
   ═══════════════════════════════════════════════════════════════ */
window.ForgeUtils = {};

/* ═══════════════════════════════════════════════════════════════
   YAML — Lightweight frontmatter parser & stringifier
   ═══════════════════════════════════════════════════════════════ */
ForgeUtils.YAML = {
  parse(str) {
    if (!str || !str.trim()) return {};
    const result = {};
    const lines = str.split('\n');
    let currentKey = null;
    let inArray = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      if (/^\s+- /.test(line) && inArray && currentKey) {
        const val = trimmed.substring(2).trim();
        result[currentKey].push(this._parseValue(val));
        continue;
      }

      if (inArray && !/^\s/.test(line)) inArray = false;

      const colonIdx = line.indexOf(':');
      if (colonIdx > 0 && /^[a-zA-Z_]/.test(line)) {
        const key = line.substring(0, colonIdx).trim();
        let value = line.substring(colonIdx + 1).trim();
        currentKey = key;

        if (value === '' || value === '~') {
          let next = i + 1;
          while (next < lines.length && lines[next].trim() === '') next++;
          if (next < lines.length && /^\s+- /.test(lines[next])) {
            result[key] = [];
            inArray = true;
          } else {
            result[key] = null;
            inArray = false;
          }
        } else if (value === '[]') {
          result[key] = [];
          inArray = false;
        } else {
          result[key] = this._parseValue(value);
          inArray = false;
        }
      }
    }
    return result;
  },

  _parseValue(v) {
    if (!v.startsWith('"') && !v.startsWith("'")) {
      const ci = v.indexOf(' #');
      if (ci > 0) v = v.substring(0, ci).trim();
    }
    if (v === 'null' || v === '~') return null;
    if (v === 'true') return true;
    if (v === 'false') return false;
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      return v.slice(1, -1);
    if (v.startsWith('[') && v.endsWith(']')) {
      const inner = v.slice(1, -1).trim();
      if (!inner) return [];
      return inner.split(',').map(x => this._parseValue(x.trim()));
    }
    if (/^-?\d+$/.test(v)) return parseInt(v, 10);
    if (/^-?\d+\.\d+$/.test(v)) return parseFloat(v);
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    return v;
  },

  stringify(obj, fieldOrder) {
    const order = fieldOrder || Object.keys(obj);
    const quotedFields = new Set(['title', 'description', 'stakeholders', 'version']);
    const lines = [];
    const written = new Set();

    const writePair = (key, value) => {
      written.add(key);
      if (value === null || value === undefined) {
        lines.push(`${key}: null`);
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          lines.push(`${key}: []`);
        } else {
          lines.push(`${key}:`);
          value.forEach(item => lines.push(`  - ${item}`));
        }
      } else if (typeof value === 'boolean') {
        lines.push(`${key}: ${value}`);
      } else if (typeof value === 'number') {
        lines.push(`${key}: ${value}`);
      } else {
        const s = String(value);
        if (quotedFields.has(key) || s.includes(': ') || s.includes(' #') || s === '') {
          lines.push(`${key}: "${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
        } else {
          lines.push(`${key}: ${s}`);
        }
      }
    };

    for (const key of order) {
      if (key in obj) writePair(key, obj[key]);
    }
    for (const key of Object.keys(obj)) {
      if (!written.has(key)) writePair(key, obj[key]);
    }
    return lines.join('\n');
  }
};

/* ═══════════════════════════════════════════════════════════════
   MD — Markdown-to-HTML Renderer
   ═══════════════════════════════════════════════════════════════ */
ForgeUtils.MD = {
  render(src) {
    if (!src) return '';
    const lines = src.split('\n');
    const blocks = this._parseBlocks(lines);
    return blocks.map(b => this._renderBlock(b)).join('\n');
  },

  _parseBlocks(lines) {
    const blocks = [];
    let cur = null;
    const push = () => { if (cur) { blocks.push(cur); cur = null; } };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (cur && cur.type === 'code') {
        if (line.trim().startsWith('```')) { push(); }
        else cur.lines.push(line);
        continue;
      }

      if (line.trim().startsWith('```')) {
        push();
        cur = { type: 'code', lang: line.trim().slice(3).trim(), lines: [] };
        continue;
      }

      const hm = line.match(/^(#{1,6})\s+(.+)$/);
      if (hm) { push(); blocks.push({ type: 'heading', level: hm[1].length, text: hm[2] }); continue; }

      if (/^(\s*[-*_]){3,}\s*$/.test(line)) { push(); blocks.push({ type: 'hr' }); continue; }

      const bq = line.match(/^>\s?(.*)$/);
      if (bq) {
        if (!cur || cur.type !== 'blockquote') { push(); cur = { type: 'blockquote', lines: [] }; }
        cur.lines.push(bq[1]);
        continue;
      }

      const ul = line.match(/^(\s*)([-*+])\s+(.+)$/);
      if (ul) {
        if (!cur || cur.type !== 'ul') { push(); cur = { type: 'ul', items: [] }; }
        cur.items.push(ul[3]);
        continue;
      }

      const ol = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
      if (ol) {
        if (!cur || cur.type !== 'ol') { push(); cur = { type: 'ol', items: [] }; }
        cur.items.push(ol[3]);
        continue;
      }

      if (!line.trim()) { push(); continue; }

      if (!cur || cur.type !== 'paragraph') { push(); cur = { type: 'paragraph', lines: [] }; }
      cur.lines.push(line);
    }
    push();
    return blocks;
  },

  _renderBlock(b) {
    switch (b.type) {
      case 'heading': return `<h${b.level}>${this._inline(b.text)}</h${b.level}>`;
      case 'paragraph': return `<p>${b.lines.map(l => this._inline(l)).join(' ')}</p>`;
      case 'ul': return `<ul>${b.items.map(i => `<li>${this._inline(i)}</li>`).join('')}</ul>`;
      case 'ol': return `<ol>${b.items.map(i => `<li>${this._inline(i)}</li>`).join('')}</ol>`;
      case 'hr': return '<hr>';
      case 'blockquote': return `<blockquote>${b.lines.map(l => `<p>${this._inline(l)}</p>`).join('')}</blockquote>`;
      case 'code': {
        const esc = b.lines.join('\n').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        return `<pre><code>${esc}</code></pre>`;
      }
      default: return '';
    }
  },

  _inline(t) {
    t = t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/__(.+?)__/g, '<strong>$1</strong>');
    t = t.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    t = t.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '<em>$1</em>');
    t = t.replace(/`(.+?)`/g, '<code>$1</code>');
    t = t.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return t;
  }
};

/* ═══════════════════════════════════════════════════════════════
   Diff — Line-diff for edit previews
   ═══════════════════════════════════════════════════════════════ */
ForgeUtils.Diff = {
  compute(oldText, newText) {
    const oldLines = (oldText || '').split('\n');
    const newLines = (newText || '').split('\n');
    const m = oldLines.length, n = newLines.length;

    const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = oldLines[i-1] === newLines[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j], dp[i][j-1]);

    const result = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldLines[i-1] === newLines[j-1]) {
        result.unshift({ type: 'same', text: oldLines[i-1] }); i--; j--;
      } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
        result.unshift({ type: 'added', text: newLines[j-1] }); j--;
      } else {
        result.unshift({ type: 'removed', text: oldLines[i-1] }); i--;
      }
    }
    return result;
  }
};

/* ═══════════════════════════════════════════════════════════════
   DB — Single IndexedDB for the unified shell
   ═══════════════════════════════════════════════════════════════ */
ForgeUtils.DB = {
  _db: null,
  _dbName: 'ForgeShellUnified',
  _storeName: 'handles',

  async open() {
    if (this._db) return this._db;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this._dbName, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(this._storeName);
      req.onsuccess = () => { this._db = req.result; resolve(this._db); };
      req.onerror = () => reject(req.error);
    });
  },

  async save(key, value) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this._storeName, 'readwrite');
      tx.objectStore(this._storeName).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async get(key) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this._storeName, 'readonly');
      const req = tx.objectStore(this._storeName).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  },

  async remove(key) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this._storeName, 'readwrite');
      tx.objectStore(this._storeName).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   FS — File System Access API Helpers
   ═══════════════════════════════════════════════════════════════ */
ForgeUtils.FS = {
  async pickDirectory(mode) {
    return window.showDirectoryPicker({ mode: mode || 'readwrite' });
  },

  async requestPermission(handle, mode) {
    const opts = { mode: mode || 'readwrite' };
    if (await handle.queryPermission(opts) === 'granted') return true;
    if (await handle.requestPermission(opts) === 'granted') return true;
    return false;
  },

  async getSubDir(parentHandle, name) {
    try {
      return await parentHandle.getDirectoryHandle(name, { create: false });
    } catch {
      return null;
    }
  },

  async getFile(dirHandle, name) {
    try {
      const fh = await dirHandle.getFileHandle(name);
      const file = await fh.getFile();
      return { handle: fh, file, text: await file.text(), lastModified: file.lastModified };
    } catch {
      return null;
    }
  },

  async readAllMd(dirHandle) {
    const files = [];
    try {
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file' && entry.name.endsWith('.md')) {
          try {
            const file = await entry.getFile();
            files.push({
              name: entry.name,
              handle: entry,
              text: await file.text(),
              lastModified: file.lastModified
            });
          } catch (e) {
            console.warn(`Failed to read ${entry.name}:`, e);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to enumerate directory:', e);
    }
    return files;
  },

  async writeFile(fileHandle, content) {
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  },

  async dirExists(parentHandle, name) {
    try {
      await parentHandle.getDirectoryHandle(name, { create: false });
      return true;
    } catch {
      return false;
    }
  }
};

/* ═══════════════════════════════════════════════════════════════
   Theme — Apply, toggle, get
   ═══════════════════════════════════════════════════════════════ */
ForgeUtils.Theme = {
  _key: 'forge-shell-theme',

  get() {
    return localStorage.getItem(this._key) || 'light';
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this._key, theme);
  },

  toggle() {
    const current = this.get();
    const next = current === 'light' ? 'dark' : 'light';
    this.apply(next);
    return next;
  },

  init() {
    this.apply(this.get());
  }
};

/* ═══════════════════════════════════════════════════════════════
   Toast — Toast notification manager
   ═══════════════════════════════════════════════════════════════ */
ForgeUtils.Toast = {
  show(message, type, duration) {
    type = type || 'info';
    duration = duration || 3500;
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
    }, duration);
  }
};

/* ═══════════════════════════════════════════════════════════════
   Confirm — Promise-based confirm dialog
   ═══════════════════════════════════════════════════════════════ */
ForgeUtils.Confirm = {
  _resolve: null,

  show(title, message, details) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('confirm-details').innerHTML = details || '';
    document.getElementById('confirm-dialog').classList.add('visible');
    return new Promise(r => { this._resolve = r; });
  },

  resolve(val) {
    document.getElementById('confirm-dialog').classList.remove('visible');
    if (this._resolve) { this._resolve(val); this._resolve = null; }
  }
};

/* ═══════════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════════ */
ForgeUtils.escapeHTML = function(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
};

ForgeUtils.todayISO = function() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
};

ForgeUtils.parseFrontmatter = function(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  try {
    return { frontmatter: ForgeUtils.YAML.parse(match[1]), body: (match[2] || '').trim() };
  } catch {
    return null;
  }
};
