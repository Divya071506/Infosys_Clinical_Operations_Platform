# Root helper script to start Spring Boot Backend
$ErrorActionPreference = "Stop"

# Check if Maven is installed, if not download portable Maven
$mvnCmd = Get-Command mvn -ErrorAction SilentlyContinue
if (-not $mvnCmd) {
    $mavenDir = "$env:LOCALAPPDATA\apache-maven-3.9.9"
    $mvnBin = "$mavenDir\bin\mvn.cmd"
    
    if (-not (Test-Path $mvnBin)) {
        Write-Host "Maven not found on PATH. Downloading Apache Maven..." -ForegroundColor Cyan
        $zipUrl = "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.9/apache-maven-3.9.9-bin.zip"
        $zipFile = "$env:TEMP\apache-maven-3.9.9-bin.zip"
        
        Invoke-WebRequest -Uri $zipUrl -OutFile $zipFile
        Expand-Archive -Path $zipFile -DestinationPath "$env:LOCALAPPDATA" -Force
        Remove-Item $zipFile -Force
        Write-Host "Maven downloaded to $mavenDir" -ForegroundColor Green
    }
    $env:PATH = "$mavenDir\bin;$env:PATH"
}

Write-Host "Navigating to backend directory..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\backend"

Write-Host "Starting Infosys Clinical Operations Platform Backend on http://localhost:8080..." -ForegroundColor Green
mvn spring-boot:run
