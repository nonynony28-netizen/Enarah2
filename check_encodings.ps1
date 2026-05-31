$files = Get-ChildItem -Path "C:\Users\HP\.gemini\antigravity-ide\scratch\Enarah2\src\pages\" -Filter "*.tsx"
foreach ($file in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $bom = ""
    if ($bytes.Length -ge 2) {
        if ($bytes[0] -eq 0xFE -and $bytes[1] -eq 0xFF) { $bom = "UTF-16 BE" }
        elseif ($bytes[0] -eq 0xFF -and $bytes[1] -eq 0xFE) { $bom = "UTF-16 LE" }
        elseif ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) { $bom = "UTF-8 BOM" }
        else { $bom = "UTF-8 or ANSI" }
    }
    Write-Host "$($file.Name): $bom (First 10 bytes: $($bytes[0..9] -join ', '))"
}
