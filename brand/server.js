const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 8091;
const ROOT = __dirname;
const ANSWERS_DIR = path.join(ROOT, 'answers');

app.use(express.json({ limit: '2mb' }));
app.use(express.static(ROOT));

app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT, 'founder-questionnaire.html'));
});

app.post('/save', async (req, res) => {
  const { filename, markdown } = req.body || {};
  if (!filename || !markdown) {
    return res.status(400).send('filename and markdown are required');
  }
  const safe = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '-');
  if (!safe.endsWith('.md')) {
    return res.status(400).send('filename must end with .md');
  }
  await fs.mkdir(ANSWERS_DIR, { recursive: true });
  const fullPath = path.join(ANSWERS_DIR, safe);
  await fs.writeFile(fullPath, markdown, 'utf8');
  const relative = path.relative(path.dirname(ROOT), fullPath);
  res.json({ path: relative });
});

app.listen(PORT, () => {
  console.log(`\nOttavia brand questionnaire`);
  console.log(`  → http://localhost:${PORT}`);
  console.log(`  → answers will be saved to ${path.relative(process.cwd(), ANSWERS_DIR)}/\n`);
});
