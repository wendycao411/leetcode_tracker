const fm = FileManager.local();
const filePath = fm.joinPath(fm.documentsDirectory(), "leetcode-log.json");

if (fm.fileExists(filePath)) {
  const content = fm.readString(filePath);
  const log = JSON.parse(content);

  // Sort keys chronologically and build a new object
  const sortedLog = {};
  Object.keys(log)
    .sort((a, b) => new Date(a) - new Date(b))
    .forEach(key => {
      sortedLog[key] = log[key];
    });

  console.log(sortedLog);
  QuickLook.present(sortedLog);
} else {
  console.log("File does not exist");
}
