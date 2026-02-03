Set-StrictMode -Off
$ErrorActionPreference = "Stop"

$JMETER = "C:\Users\YogeshNamdeo\Downloads\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin\jmeter.bat"

# List of JMX files
$JMX_FILES = @(
  	"D:\OneBuilderLoadTestScripts\NewScriptsBuilderV2\New folder\LATEST_HAPPYAPTH_SCENARIOS_BUILDERV2.jmx",
    	"D:\OneBuilderLoadTestScripts\BuilderV2\HappyPathScenarios_OneBuilderV2.jmx"
)

$BASE = "D:\JMeterReports\OBHPS"

# Create base report folder
if (!(Test-Path $BASE)) {
    New-Item -ItemType Directory -Force -Path $BASE | Out-Null
}

foreach ($JMX in $JMX_FILES) {

    $TestName = [System.IO.Path]::GetFileNameWithoutExtension($JMX)

    # Timestamped run folder
    $RUN = Join-Path $BASE ($TestName + "_Run_" + (Get-Date -Format "yyyyMMdd_HHmmss"))
    New-Item -ItemType Directory -Force -Path $RUN | Out-Null

    $JTL = Join-Path $RUN "results.jtl"
    $HTML = Join-Path $RUN "HTML"

    Write-Host "Running JMeter Test: $TestName"

    & $JMETER -n -t $JMX -l $JTL -e -o $HTML

    # Convert HTML to PDF
    & "C:\Users\YogeshNamdeo\Downloads\html_to_pdf.ps1" $HTML

}

# Send final report email
& "C:\Users\YogeshNamdeo\Downloads\send_outlook_report_OBHPS2.ps1" $BASE

Write-Host "ALL JMETER TESTS COMPLETED SUCCESSFULLY."