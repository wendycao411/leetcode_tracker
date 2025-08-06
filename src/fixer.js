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

// ========== PROMPT FOR NEW COUNT ==========
const currentCount = log[FIX_DATE] ?? 0;

const countPrompt = new Alert();
countPrompt.title = `Set Count for ${FIX_DATE}`;
countPrompt.message = `Current count: ${currentCount}`;
countPrompt.addTextField("New value", String(currentCount));
countPrompt.addAction("Save");
countPrompt.addCancelAction("Cancel");

const result = await countPrompt.present();
if (result === -1) Script.complete(); // Cancelled

const newValue = parseInt(countPrompt.textFieldValue(0));
if (!isNaN(newValue) && newValue >= 0) {
  log[FIX_DATE] = newValue;

  // ========== SAVE LOG ==========
  fm.writeString(filePath, JSON.stringify(log, null, 2));

  // ========== CONFIRM ==========
  const confirm = new Alert();
  confirm.title = "Log Updated";
  confirm.message = `${FIX_DATE}: ${log[FIX_DATE]}`;
  confirm.addAction("Done");
  await confirm.present();
} else {
  const error = new Alert();
  error.title = "Invalid Input";
  error.message = "Please enter a valid non-negative number.";
  await error.present();
}

Script.complete();
