const fm = FileManager.local();
const filePath = fm.joinPath(fm.documentsDirectory(), "leetcode-log.json");

if (fm.fileExists(filePath)) {
  const content = fm.readString(filePath);
  const log = JSON.parse(content);

  // Sort keys chronologically (ascending)
  const sortedKeys = Object.keys(log).sort((a, b) => {
    return new Date(a) - new Date(b);
  });

  console.log("Sorted keys:", sortedKeys);

  // Build new sorted object
  const sortedLog = {};
  sortedKeys.forEach(key => {
    sortedLog[key] = log[key];
  });

  console.log(sortedLog);
  QuickLook.present(sortedLog);
} else {
  console.log("File does not exist");
}
