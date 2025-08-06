const fm = FileManager.local();
const filePath = fm.joinPath(fm.documentsDirectory(), "leetcode-log.json");

if (!fm.fileExists(filePath)) {
  console.log("File does not exist");
  QuickLook.present("No log file found.");
  return;
}

try {
  const content = fm.readString(filePath);
  const log = JSON.parse(content);

  // sort dates ascending
  const sortedDates = Object.keys(log).sort((a, b) => new Date(a) - new Date(b));

  let output = "Date       | Problems Solved\n";
  output += "--------------------------\n";
  for (const date of sortedDates) {
    output += `${date} | ${log[date]}\n`;
  }

  console.log(output);
  QuickLook.present(output);

} catch (e) {
  console.error("Failed to read or parse log:", e);
  QuickLook.present("Failed to read or parse log file.");
}
