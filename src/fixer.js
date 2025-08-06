// ========== CONFIG ==========
const FILE_NAME = "leetcode-log.json";
const fm = FileManager.local();
const filePath = fm.joinPath(fm.documentsDirectory(), FILE_NAME);

// ========== LOAD LOG ==========
let log = {};
if (fm.fileExists(filePath)) {
  try {
    log = JSON.parse(fm.readString(filePath));
  } catch (e) {
    console.error("Error reading log file", e);
  }
}

// ========== PROMPT FOR DATE ==========
const datePrompt = new Alert();
datePrompt.title = "Fix a Past Date";
datePrompt.message = "Enter the date to adjust (YYYY-MM-DD):";
datePrompt.addTextField("e.g. 2025-07-17");
datePrompt.addAction("Next");
await datePrompt.present();
const FIX_DATE = datePrompt.textFieldValue(0);

// ========== SHOW CURRENT COUNT ==========
const currentCount = log[FIX_DATE] ?? 0;

const adjustPrompt = new Alert();
adjustPrompt.title = `Adjust Count for ${FIX_DATE}`;
adjustPrompt.message = `Current count: ${currentCount}`;
adjustPrompt.addAction("＋ Add 1");
if (currentCount > 0) adjustPrompt.addAction("－ Subtract 1");
adjustPrompt.addCancelAction("Cancel");

const response = await adjustPrompt.present();

if (response === 0) {
  log[FIX_DATE] = currentCount + 1;
} else if (response === 1 && currentCount > 0) {
  log[FIX_DATE] = currentCount - 1;
} else {
  Script.complete(); // User cancelled or no action needed
}

// ========== SAVE LOG ==========
fm.writeString(filePath, JSON.stringify(log, null, 2));

// ========== CONFIRM ==========
const confirm = new Alert();
confirm.title = "Log Updated";
confirm.message = `${FIX_DATE}: ${log[FIX_DATE]}`;
await confirm.present();

Script.complete();
