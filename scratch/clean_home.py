import os

file_path = r"C:\Users\HP\.gemini\antigravity-ide\scratch\Enarah2\src\pages\Home.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if "نافذة الطلب المنبثقة (Modal)" in line:
        # Search backwards for the comment header start
        j = i
        while j >= 0:
            if "==========================" in lines[j]:
                start_idx = j - 1
                break
            j -= 1
        
        # Search forwards for the next closing AnimatePresence
        k = i
        while k < len(lines):
            if "</AnimatePresence>" in lines[k]:
                end_idx = k + 1
                break
            k += 1
        break

if start_idx != -1 and end_idx != -1:
    print(f"Removing lines from {start_idx + 1} to {end_idx + 1}")
    new_lines = lines[:start_idx] + lines[end_idx:]
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print("Success!")
else:
    print(f"Could not find indices. start_idx={start_idx}, end_idx={end_idx}")
