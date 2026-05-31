$content = Get-Content -Path "C:\Users\HP\.gemini\antigravity-ide\scratch\Enarah2\src\App.tsx" -Raw
$lines = $content -split "`r`n"
if ($lines.Length -lt 2) {
    $lines = $content -split "`n"
}
for ($i = 9; $i -lt 15; $i++) {
    $line = $lines[$i]
    Write-Host "Line $($i+1): $line"
    $codes = [char[]]$line | ForEach-Object { [int]$_ }
    Write-Host "Codes: $($codes -join ', ')"
}
