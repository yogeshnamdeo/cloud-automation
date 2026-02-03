# ================================
# OBHPS Automation - PowerShell
# Cloud-safe version
# ================================

# 🔹 Always start in the script directory
$BASE_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $BASE_DIR

Write-Host "================================"
Write-Host "PowerShell script started"
Write-Host "Base directory: $BASE_DIR"
Write-Host "================================"

# -------------------------------
# Example: Java check
# -------------------------------
Write-Host "Checking Java..."
java -version
if ($LASTEXITCODE -ne 0) {
    Write-Error "Java not found"
    exit 1
}

# -------------------------------
# Example: JMeter execution
# -------------------------------
# UPDATE THESE PATHS AS NEEDED
$JMETER_CMD = "jmeter"   # works if installed in PATH
$JMX_FILE   = "$BASE_DIR\your_test.jmx"
$RESULTS    = "$BASE_DIR\results"
$LOG_FILE   = "$RESULTS\jmeter.log"

# Create results folder if missing
if (!(Test-Path $RESULTS)) {
    New-Item -ItemType Directory -Path $RESULTS | Out-Null
}

Write-Host "Running JMeter..."
& $JMETER_CMD -n `
  -t $JMX_FILE `
  -l "$RESULTS\results.jtl" `
  -j $LOG_FILE

if ($LASTEXITCODE -ne 0) {
    Write-Error "JMeter execution failed"
    exit 1
}

# -------------------------------
# Example: Post-processing / checks
# -------------------------------
Write-Host "Running post execution checks..."
# Your existing logic here (API checks, COMS validation, etc.)

# -------------------------------
# Success
# -------------------------------
Write-Host "================================"
Write-Host "PowerShell script completed successfully"
Write-Host "================================"
exit 0
