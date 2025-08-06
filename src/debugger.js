const fm = FileManager.local();
const filePath = fm.joinPath(fm.documentsDirectory(), "leetcode-log.json");

if (!fm.fileExists(filePath)) {
  console.log("Log file does not exist.");
  return;
}

const content = fm.readString(filePath);
const log = JSON.parse(content);

// Sort keys chronologically
const sortedDates = Object.keys(log).sort((a, b) => new Date(a) - new Date(b));

// Prepare table data
const tableData = sortedDates.map(date => [date, log[date].toString()]);

// Create table
const table = new UITable();
table.showSeparators = true;

// Header
const header = new UITableRow();
header.isHeader = true;
header.addText("Date");
header.addText("Problems Solved");
table.addRow(header);

// Add rows
for (const [date, count] of tableData) {
  const row = new UITableRow();
  row.addText(date);
  row.addText(count);
  table.addRow(row);
}

// Present table
table.present();
