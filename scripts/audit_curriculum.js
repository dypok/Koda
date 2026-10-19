const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'content', 'languages', 'python', 'modules');

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const modJson = path.join(full, 'module.json');
      const bankJson = path.join(full, 'bank.json');
      if (fs.existsSync(modJson)) {
        try {
          const mod = JSON.parse(fs.readFileSync(modJson, 'utf8'));
          const bank = fs.existsSync(bankJson) ? JSON.parse(fs.readFileSync(bankJson, 'utf8')) : null;
          const lessons = mod.sections && mod.sections[0] ? mod.sections[0].lessons.length : 0;
          const questions = bank && bank.questions ? bank.questions.length : 0;
          const rel = path.relative(baseDir, full).replace(/\\/g, '/');
          
          // Check for emojis
          const rawMod = fs.readFileSync(modJson, 'utf8');
          const rawBank = bank ? fs.readFileSync(bankJson, 'utf8') : '';
          const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
          const hasEmoji = emojiRegex.test(rawMod) || emojiRegex.test(rawBank);

          console.log(`${rel} | ${lessons} lecciones | ${questions} preguntas | emoji: ${hasEmoji}`);
        } catch (e) {
          console.error(`Error reading ${full}:`, e.message);
        }
      }
      scanDir(full);
    }
  }
}

scanDir(baseDir);
