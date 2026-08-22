# PowerShell Helper to download Maven portable if not installed and run Spring Boot
$ErrorActionPreference = "Stop"

$mvnCmd = Get-Command mvn -ErrorAction SilentlyContinue
if (-not $mvnCmd) {
    $mavenDir = "$env:LOCALAPPDATA\apache-maven-3.9.9"
    $mvnBin = "$mavenDir\bin\mvn.cmd"
    
    if (-not (Test-Path $mvnBin)) {
        Write-Host "Maven not found on PATH. Downloading portable Apache Maven 3.9.9..." -ForegroundColor Cyan
        $zipUrl = "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.9/apache-maven-3.9.9-bin.zip"
        $zipFile = "$env:TEMP\apache-maven-3.9.9-bin.zip"
        
        Invoke-WebRequest -Uri $zipUrl -OutFile $zipFile
        Expand-Archive -Path $zipFile -DestinationPath "$env:LOCALAPPDATA" -Force
        Remove-Item $zipFile -Force
        Write-Host "Maven installed to $mavenDir" -ForegroundColor Green
    }
    $env:PATH = "$mavenDir\bin;$env:PATH"
}

Write-Host "Starting Infosys Clinical Operations Platform Backend with Spring Boot 3..." -ForegroundColor Green
mvn spring-boot:run
