param(
  [ValidateSet("debug", "release")]
  [string]$BuildType = "debug"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Use short path (8.3 format) to avoid Bengali character issues
$shortPath = cmd /c "for %I in (`"$root`") do @echo %~sI" 2>$null
if (-not $shortPath) { $shortPath = $root }

Write-Host "Building from: $shortPath"

Set-Location $root

# Clean www
if (Test-Path "www") {
  Remove-Item -Recurse -Force "www"
}
New-Item -ItemType Directory -Path "www" | Out-Null

# Copy web assets
Copy-Item "index.html" "www/index.html"
Copy-Item "css" "www/css" -Recurse
Copy-Item "js" "www/js" -Recurse
Copy-Item "resources" "www/resources" -Recurse
Copy-Item "config" "www/config" -Recurse

# Find JDK
$javaCandidates = @(
  "C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot",
  $env:JAVA_HOME
) | Where-Object { $_ -and (Test-Path $_) }

if (-not $javaCandidates) {
  throw "JDK 21 not found. Please install JDK 21 first."
}

$env:JAVA_HOME = $javaCandidates[0]
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

# Sync Capacitor
& "C:\Program Files\nodejs\node.exe" ".\node_modules\@capacitor\cli\bin\capacitor" sync android

# Build with Gradle using short path
Set-Location "$shortPath\android"
if ($BuildType -eq "release") {
  & "$shortPath\android\gradlew.bat" assembleRelease
  Write-Host "✅ Release APK: android\app\build\outputs\apk\release\app-release-unsigned.apk"
} else {
  & "$shortPath\android\gradlew.bat" assembleDebug
  Write-Host "✅ Debug APK: android\app\build\outputs\apk\debug\app-debug.apk"
}