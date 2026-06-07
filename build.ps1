<#
.SYNOPSIS
    Empacota a skill advogado-pt num ficheiro .skill (ZIP) para upload no Claude.
.EXAMPLE
    ./build.ps1
    ./build.ps1 -Out dist
#>
param(
    [string]$Out = $null
)

$ErrorActionPreference = "Stop"
$SkillName = "advogado-pt"
$Root = $PSScriptRoot
$ExcludeDirs = @("__pycache__", ".git", ".idea", ".vscode", "dist", "node_modules")
$ExcludeSuffix = @(".pyc", ".skill", ".zip")
$ExcludeNames = @(".DS_Store", "Thumbs.db")

if (-not (Test-Path (Join-Path $Root "SKILL.md"))) {
    throw "SKILL.md não encontrado — corre o script a partir da pasta da skill."
}

$OutDir = if ($Out) { (Resolve-Path -LiteralPath $Out -ErrorAction SilentlyContinue) ?? $Out } else { $Root }
if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir -Force | Out-Null }
$OutPath = Join-Path $OutDir "$SkillName.skill"
if (Test-Path $OutPath) { Remove-Item $OutPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem

$files = Get-ChildItem -Path $Root -Recurse -File | Where-Object {
    $rel = $_.FullName.Substring($Root.Length).TrimStart('\','/')
    $parts = $rel -split '[\\/]'
    ($ExcludeDirs | Where-Object { $parts -contains $_ }).Count -eq 0 -and
    $ExcludeSuffix -notcontains $_.Extension -and
    $ExcludeNames -notcontains $_.Name -and
    $_.FullName -ne $OutPath
}

$zip = [System.IO.Compression.ZipFile]::Open($OutPath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($f in $files) {
        $arc = ($f.FullName.Substring($Root.Length).TrimStart('\','/')) -replace '\\','/'
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $f.FullName, $arc) | Out-Null
    }
} finally {
    $zip.Dispose()
}

$sizeKb = [math]::Round((Get-Item $OutPath).Length / 1KB, 1)
Write-Host "OK: $OutPath"
Write-Host "   $($files.Count) ficheiros, $sizeKb KB"
Write-Host "   Faz upload em Claude -> Settings -> Skills."
