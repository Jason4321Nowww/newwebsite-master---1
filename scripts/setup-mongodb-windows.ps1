# ============================================================
#  MongoDB Auto-Start + Memory Cap Setup — Windows
#  Run this script as Administrator (right-click → Run with PowerShell as Admin)
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MongoDB Setup Script — Windows" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── 1. Check admin rights ────────────────────────────────────
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: Please right-click this script and choose 'Run as Administrator'." -ForegroundColor Red
    pause
    exit 1
}

# ── 2. Find MongoDB config file ──────────────────────────────
Write-Host "Locating MongoDB config..." -ForegroundColor Yellow
$cfgPath = Get-ChildItem "C:\Program Files\MongoDB\Server\*\bin\mongod.cfg" -ErrorAction SilentlyContinue | Sort-Object -Descending | Select-Object -First 1 -ExpandProperty FullName

if (-not $cfgPath) {
    Write-Host "ERROR: mongod.cfg not found. Is MongoDB installed?" -ForegroundColor Red
    pause
    exit 1
}

$dataPath = Split-Path (Split-Path $cfgPath) | Join-Path -ChildPath "data"
$logPath  = Split-Path (Split-Path $cfgPath) | Join-Path -ChildPath "log\mongod.log"

Write-Host "Found config: $cfgPath" -ForegroundColor Green

# ── 3. Write config with 0.5 GB memory cap ───────────────────
Write-Host "Applying 0.5 GB WiredTiger cache limit..." -ForegroundColor Yellow

$config = @"
storage:
  dbPath: $dataPath
  wiredTiger:
    engineConfig:
      cacheSizeGB: 0.5

systemLog:
  destination: file
  logAppend: true
  path: $logPath

net:
  port: 27017
  bindIp: 127.0.0.1
"@

Set-Content -Path $cfgPath -Value $config -Encoding UTF8
Write-Host "Config updated." -ForegroundColor Green

# ── 4. Set service to Automatic + start it ───────────────────
Write-Host "Setting MongoDB service to Automatic startup..." -ForegroundColor Yellow
Set-Service -Name "MongoDB" -StartupType Automatic

Write-Host "Starting MongoDB service..." -ForegroundColor Yellow
Start-Service -Name "MongoDB"

# ── 5. Verify ────────────────────────────────────────────────
Start-Sleep -Seconds 2
$svc = Get-Service -Name "MongoDB"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($svc.Status -eq "Running") {
    Write-Host "  MongoDB is RUNNING" -ForegroundColor Green
    Write-Host "  Startup type: Automatic (starts on every boot)" -ForegroundColor Green
    Write-Host "  Memory cap:   0.5 GB WiredTiger cache" -ForegroundColor Green
} else {
    Write-Host "  WARNING: MongoDB status is $($svc.Status)" -ForegroundColor Red
    Write-Host "  Check Windows Event Viewer for details." -ForegroundColor Red
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

pause
