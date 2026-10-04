const fs = require('fs');

const text = fs.readFileSync('../sheet.csv', 'utf8');

const rows = [];
let curr = [];
let currCell = '';
let inQuotes = false;
for (let i = 0; i < text.length; i++) {
  if (text[i] === '"') inQuotes = !inQuotes;
  else if (text[i] === ',' && !inQuotes) { curr.push(currCell); currCell = ''; }
  else if (text[i] === '\n' && !inQuotes) { curr.push(currCell); rows.push(curr); curr = []; currCell = ''; }
  else { currCell += text[i]; }
}
if (currCell || curr.length > 0) { curr.push(currCell); rows.push(curr); }

const headers = rows[0];

function getGridAnswers(startIndex, row, headers) {
  if (startIndex < 0 || startIndex >= headers.length) return [];
  const startHeader = headers[startIndex] || "";
  if (!startHeader.includes('[')) {
    return [(row[startIndex] || "").trim()];
  }
  const baseText = startHeader.split('[')[0].trim();
  const results = [];
  for (let i = startIndex; i < headers.length; i++) {
    if (headers[i].startsWith(baseText) && headers[i].includes('[')) {
      const val = (row[i] || "").trim();
      if (val && val !== "-" && val !== "特になし") {
        const match = headers[i].match(/\[(.*?)\]/);
        if (match && match[1]) {
          results.push(match[1].trim());
        } else {
          results.push(val);
        }
      }
    } else {
      break;
    }
  }
  return results;
}

let emptyCountQ5 = 0;
for (let i = 1; i < rows.length; i++) {
  const ans = getGridAnswers(5, rows[i], headers);
  if (ans.length === 0) emptyCountQ5++;
}
console.log("Empty Q5:", emptyCountQ5, "out of", rows.length - 1);
