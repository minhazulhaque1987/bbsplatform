const fs = require('fs');

const html = fs.readFileSync('www/index.html', 'utf8');

// The scripts are loaded in a certain order in the HTML file.
console.log("Checking index.html for script loading:");
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('js/phc_')) {
    console.log(`Line ${i+1}: ${l.trim()}`);
  }
});
