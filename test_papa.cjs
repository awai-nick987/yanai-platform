const Papa = require('papaparse');
const fs = require('fs');

const text = fs.readFileSync('sheet.csv', 'utf8');

Papa.parse(text, {
  header: false,
  skipEmptyLines: true,
  complete: (results) => {
    const rawRows = results.data;
    console.log("Total rows parsed by Papa:", rawRows.length);
    
    // Check how many have q1 mapped
    let emptyCount = 0;
    const mapping = { q1: 1, q2: 2, q3: 3, q4: 4 }; // Assuming detectColumnMapping gives this
    
    for (let i = 1; i < rawRows.length; i++) {
      const r = rawRows[i];
      const q1 = r[1] ? r[1].trim() : "";
      if (!q1) emptyCount++;
    }
    console.log("Empty Q1 count:", emptyCount);
  }
});
