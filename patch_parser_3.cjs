const fs = require('fs');
let content = fs.readFileSync('src/utils/parser.ts', 'utf8');

const newParseCode = `
// Parse text into 2D string array properly handling quotes and newlines
export function parseRawText(rawText: string): { headers: string[]; rows: string[][] } {
  const clean = rawText.replace(/\\r\\n/g, "\\n").replace(/\\r/g, "\\n").trim();
  if (!clean) return { headers: [], rows: [] };

  const delimiter = detectDelimiter(clean);
  
  const parsedRows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;
  
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    
    if (char === '"') {
      if (inQuotes && clean[i + 1] === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if (char === '\\n' && !inQuotes) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c.length > 0)) {
        parsedRows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }
  
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(c => c.length > 0)) {
      parsedRows.push(currentRow);
    }
  }

  if (parsedRows.length === 0) return { headers: [], rows: [] };

  const headers = parsedRows[0] || [];
  const rows = parsedRows.slice(1);

  return { headers, rows };
}
`;

content = content.replace(
  /\/\/ Parse text into 2D string array\nexport function parseRawText[\s\S]*?return \{ headers, rows \};\n\}/,
  newParseCode.trim()
);

fs.writeFileSync('src/utils/parser.ts', content, 'utf8');
console.log("patched parseRawText");
