const fs = require('fs');
const path = require('path');

const userHistoriesDir = path.join(__dirname, '../documentation/UserHistories');
const outputFile = path.join(__dirname, '../documentation/jira-backlog-with-subtasks.csv');

const files = fs.readdirSync(userHistoriesDir)
  .filter(f => f.startsWith('EPIC-') && f.endsWith('.md'))
  .sort();

function escapeCSV(text) {
  if (text === null || text === undefined) return '';
  const str = String(text);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const headers = [
  'Issue Type',
  'Issue Id',
  'Parent Id',
  'Epic Name',
  'Epic Link',
  'Summary',
  'Description',
  'Component',
  'Priority',
  'Story Points',
  'Sprint',
  'Labels'
];

const rows = [headers];

function mapPriority(pText) {
  if (!pText) return 'Medium';
  const lower = pText.toLowerCase();
  if (lower.includes('muy alta') || lower.includes('crítica') || lower.includes('highest')) return 'Highest';
  if (lower.includes('alta') || lower.includes('high')) return 'High';
  if (lower.includes('media') || lower.includes('medium')) return 'Medium';
  if (lower.includes('baja') || lower.includes('low')) return 'Low';
  return 'Medium';
}

function determineComponent(taskLine) {
  const upper = taskLine.toUpperCase();
  if (upper.includes('[FRONTEND]')) return 'frontend';
  if (upper.includes('[BACKEND]')) return 'backend';
  if (upper.includes('[BD]') || upper.includes('[SUPABASE]') || upper.includes('[DEVOPS]') || upper.includes('[DOCS]')) return 'devops';
  return 'frontend';
}

let epicCount = 0;
let storyCount = 0;
let subtaskCount = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(userHistoriesDir, file), 'utf8');
  epicCount++;

  // 1. Parse Epic
  const epicTitleMatch = content.match(/# (?:[^\s]+ )?EPIC (\d+) — (.+)/);
  const sprintMatch = content.match(/(Sprint \d+)/);
  const epicNumber = epicTitleMatch ? epicTitleMatch[1] : String(epicCount);
  const epicName = epicTitleMatch ? `EPIC-${epicNumber}: ${epicTitleMatch[2].trim()}` : `EPIC-${epicNumber}: ${file}`;
  const sprint = sprintMatch ? sprintMatch[1] : `Sprint ${epicNumber}`;
  const epicId = `EPIC-${epicNumber}`;

  const epicIntroMatch = content.match(/> (.+?)(?:\r?\n\r?\n|---)/s);
  const epicDescription = epicIntroMatch ? epicIntroMatch[1].replace(/\r?\n> /g, ' ').trim() : epicName;

  // Add Epic row
  rows.push([
    'Epic',
    epicId,
    '',
    epicName,
    '',
    epicName,
    epicDescription,
    '',
    'High',
    '',
    sprint,
    'epic, koda-mvp, scrumban'
  ]);

  // 2. Parse Stories
  const storyBlocks = content.split(/\n(?=### [A-Z]+-\d+)/).slice(1);

  for (const block of storyBlocks) {
    storyCount++;
    const titleMatch = block.match(/### ([A-Z]+-\d+) — (.+)/);
    if (!titleMatch) continue;
    const code = titleMatch[1];
    const storyTitle = titleMatch[2].trim();

    // Priority & SP
    const spMatch = block.match(/\*\*SP:\*\*\s*(\d+)/i);
    const priorityMatch = block.match(/\*\*Prioridad:\*\*\s*([^\|\n]+)/i);
    const storySP = spMatch ? spMatch[1] : '5';
    const priority = mapPriority(priorityMatch ? priorityMatch[1] : 'Medium');

    // Branch
    const branchMatch = block.match(/\*\*Rama sugerida:\*\*\s*`?([^`\n]+)`?/i);
    const suggestedBranch = branchMatch ? branchMatch[1].trim() : `feature/${code.toLowerCase()}`;

    // User Story narrative
    const narrativeMatch = block.match(/\*\*Historia de usuario:\*\*\s*\n> "([^"]+)"/s);
    const userStory = narrativeMatch ? narrativeMatch[1].replace(/\r?\n> /g, ' ').trim() : '';

    // Acceptance Criteria
    let acText = '';
    const acSection = block.match(/\*\*Criterios de aceptación:\*\*\s*\n([\s\S]+?)(?=\n\*\*Subtasks:\*\*|\n---|\n\*\*DoD)/);
    if (acSection) {
      acText = acSection[1].trim();
    }

    // DoD
    let dodText = '';
    const dodSection = block.match(/\*\*DoD adicional para esta US:\*\*\s*\n([\s\S]+?)(?=\n---|\n###|$)/);
    if (dodSection) {
      dodText = dodSection[1].trim();
    }

    // Subtasks
    const subtaskLines = block.split('\n')
      .filter(l => l.trim().startsWith('- [ ]') || l.trim().startsWith('- [x]'))
      .map(l => l.trim());

    // Determine components present
    const hasFE = subtaskLines.some(l => l.toUpperCase().includes('[FRONTEND]'));
    const hasBE = subtaskLines.some(l => l.toUpperCase().includes('[BACKEND]'));
    const hasDO = subtaskLines.some(l => l.toUpperCase().includes('[BD]') || l.toUpperCase().includes('[DEVOPS]') || l.toUpperCase().includes('[DOCS]') || l.toUpperCase().includes('[SUPABASE]'));
    const comps = [];
    if (hasFE) comps.push('frontend');
    if (hasBE) comps.push('backend');
    if (hasDO) comps.push('devops');
    const storyComponent = comps.join(', ') || 'frontend';

    // Story Description
    const storyDescription = `h3. 📋 Historia de Usuario
${userStory ? `"${userStory}"` : `Implementación funcional de ${code}: ${storyTitle}.`}

h3. ✅ Criterios de Aceptación
${acText || '- Verificación funcional completa.'}

${dodText ? `h3. 🛡️ Definition of Done Específica\n${dodText}\n` : ''}
h3. 🏛️ Gobernanza
* *Rama sugerida:* \`${suggestedBranch}\`
* *Épica:* ${epicName}
* *DoD Global:* Verificado según checklist de Koda.`;

    // Add Story Row (Parent is Epic)
    rows.push([
      'Story',
      code,
      epicId,
      '',
      epicName,
      `${code} — ${storyTitle}`,
      storyDescription,
      storyComponent,
      priority,
      storySP,
      sprint,
      'story, koda-mvp, scrumban'
    ]);

    // 3. Add Sub-tasks (Parent is Story)
    let subIndex = 0;
    for (const taskLine of subtaskLines) {
      subIndex++;
      subtaskCount++;
      const subtaskId = `${code}-SUB-${String(subIndex).padStart(2, '0')}`;
      const isDone = taskLine.startsWith('- [x]');
      const cleanTask = taskLine.replace(/^- \[[ x]\]\s*/, '').trim();
      const component = determineComponent(cleanTask);

      // Clean summary
      const subtaskSummary = cleanTask.length > 250 ? cleanTask.slice(0, 247) + '...' : cleanTask;

      const subtaskDescription = `h3. 🛠️ Subtarea Técnica (${component.toUpperCase()})
* *Tarea:* ${cleanTask}
* *Estado en backlog documental:* ${isDone ? '✅ Completada' : '⏳ Pendiente'}
* *Historia de Usuario Padre:* ${code} — ${storyTitle}
* *Épica:* ${epicName}

h3. 🏛️ Reglas de Flujo Koda
* Rama base: \`develop\`
* Nomenclatura sugerida: \`feat/${component}-${code.toLowerCase()}\`
* Entregable requerido al finalizar: \`documentation/done/${component}/${component}-${code.toLowerCase()}.md\``;

      rows.push([
        'Sub-task',
        subtaskId,
        code,
        '',
        '',
        subtaskSummary,
        subtaskDescription,
        component,
        priority,
        '1',
        sprint,
        `subtask, ${component}, koda-mvp, scrumban`
      ]);
    }
  }
}

// Write to CSV with UTF-8 BOM
const csvContent = rows.map(r => r.map(escapeCSV).join(',')).join('\r\n');
fs.writeFileSync(outputFile, '\uFEFF' + csvContent, 'utf8');

console.log(`Generated: ${outputFile}`);
console.log(`Epics: ${epicCount}`);
console.log(`Stories: ${storyCount}`);
console.log(`Sub-tasks: ${subtaskCount}`);
console.log(`Total Rows in CSV: ${rows.length}`);
