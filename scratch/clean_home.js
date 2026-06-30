const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'Home.tsx');

let content = fs.readFileSync(filePath, 'utf8');

// Use regex to remove the AnimatePresence block for selectedWire
const startComment = `\\{\\s*\\/\\*\\s*={10,}\\s*\\n\\s*نافذة الطلب المنبثقة \\(Modal\\)\\s*\\n\\s*={10,}\\s*\\*\\/\\s*\\}`;
const regexStr = startComment + `[\\s\\S]*?<\\/AnimatePresence>`;

const regex = new RegExp(regexStr);

if (regex.test(content)) {
  const newContent = content.replace(regex, '');
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log("Successfully removed the selectedWire modal block!");
} else {
  console.log("Could not find the target modal block using Regex.");
}
