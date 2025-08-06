// ========== CONFIG ==========
const EVENT_NAME = "LeetCode";
const DAYS_TO_TRACK = 180;
const MS_PER_DAY = 86400000;
const BG_COLOR = new Color("#1e1e1e");
const FILE_NAME = "leetcode-log.json";

// Heatmap thresholds & colors (adjust as needed)
const HEATMAP = [
  { threshold: 0, color: new Color("#2f2f2f") }, // dark gray
  { threshold: 1, color: new Color("#9be9a8") }, // light green
  { threshold: 3, color: new Color("#40c463") }, // medium green
  { threshold: 5, color: new Color("#30a14e") }, // darker green
  { threshold: 8, color: new Color("#216e39") }, // darkest green
];

const fm = FileManager.local();
const filePath = fm.joinPath(fm.documentsDirectory(), FILE_NAME);

// ========== HELPERS ==========
function formatDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getColorForCount(count) {
  for (let i = HEATMAP.length - 1; i >= 0; i--) {
    if (count >= HEATMAP[i].threshold) {
      return HEATMAP[i].color;
    }
  }
  return HEATMAP[0].color;
}

// ========== TIME ==========
const NOW = new Date();
const END_DATE = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate());
const START_DATE = new Date(END_DATE.getTime() - (DAYS_TO_TRACK - 1) * MS_PER_DAY);
const TODAY_KEY = formatDateKey(END_DATE);

// ========== LOAD DATA ==========
let log = {};
if (fm.fileExists(filePath)) {
  try {
    log = JSON.parse(fm.readString(filePath));
  } catch (e) {
    console.error("Log read error", e);
  }
}

// ========== MANUAL MODE ==========
if (!config.runsInWidget) {
  const todayCount = log[TODAY_KEY] ?? 0;

  const alert = new Alert();
  alert.title = EVENT_NAME;
  alert.message = `Today's count: ${todayCount}`;
  alert.addAction("＋ Add 1");
  if (todayCount > 0) alert.addAction("－ Subtract 1");
  alert.addCancelAction("Cancel");

  const response = await alert.present();

  if (response === 0) {
    log[TODAY_KEY] = todayCount + 1;
  } else if (response === 1 && todayCount > 0) {
    log[TODAY_KEY] = todayCount - 1;
  }

  fm.writeString(filePath, JSON.stringify(log, null, 2));

  const confirm = new Alert();
  confirm.title = "Updated";
  confirm.message = `${TODAY_KEY}: ${log[TODAY_KEY]}`;
  await confirm.present();

  Script.complete();
}

// ========== WIDGET UI ==========
const widget = new ListWidget();
widget.backgroundColor = BG_COLOR;
widget.setPadding(10, 10, 10, 10);

// Title
const titleStack = widget.addStack();
titleStack.centerAlignContent();
titleStack.addSpacer();
const title = titleStack.addText(EVENT_NAME);
title.font = Font.boldSystemFont(14);
title.textColor = Color.white();
titleStack.addSpacer();

widget.addSpacer(6);

// Heatmap Grid
const gridRow = widget.addStack();
gridRow.spacing = 2;
gridRow.addSpacer(0);

const totalWeeks = Math.ceil(DAYS_TO_TRACK / 7);

for (let week = 0; week < totalWeeks; week++) {
  const col = gridRow.addStack();
  col.layoutVertically();
  col.spacing = 2;

  for (let dow = 0; dow < 7; dow++) {
    const dayIndex = week * 7 + dow;
    const date = new Date(START_DATE.getTime() + dayIndex * MS_PER_DAY);
    if (date > END_DATE) break;

    const key = formatDateKey(date);
    const count = log[key] ?? 0;

    const cell = col.addStack();
    cell.size = new Size(10, 10);
    cell.backgroundColor = getColorForCount(count);
    cell.cornerRadius = 2;
  }
}

// ========== STREAK ==========
function calculateStreak(log, endDate) {
  let streak = 0;
  for (let i = 0; i < DAYS_TO_TRACK; i++) {
    const date = new Date(endDate.getTime() - i * MS_PER_DAY);
    const key = formatDateKey(date);
    if ((log[key] ?? 0) > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

const streak = calculateStreak(log, END_DATE);
widget.addSpacer(10);
const streakRow = widget.addStack();
streakRow.addSpacer();
const streakText = streakRow.addText(`Streak: ${streak}`);
streakText.font = Font.systemFont(10);
streakText.textColor = Color.white();

// Done
Script.setWidget(widget);
Script.complete();
