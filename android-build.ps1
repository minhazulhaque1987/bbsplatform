param(
  [ValidateSet("debug", "release")]
  [string]$BuildType = "debug"
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if (Test-Path "www") {
  Remove-Item -Recurse -Force "www"
}
New-Item -ItemType Directory -Path "www" | Out-Null

Copy-Item "index.html" "www/index.html"
Copy-Item "css" "www/css" -Recurse
Copy-Item "js" "www/js" -Recurse
Copy-Item "resources" "www/resources" -Recurse
Copy-Item "config" "www/config" -Recurse

$javaCandidates = @(
  "C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot",
  $env:JAVA_HOME
) | Where-Object { $_ -and (Test-Path $_) }

if (-not $javaCandidates) {
  throw "JDK 21 not found. Please install JDK 21 first."
}

$env:JAVA_HOME = $javaCandidates[0]
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

& "C:\Program Files\nodejs\node.exe" ".\node_modules\@capacitor\cli\bin\capacitor" sync android

Set-Location ".\android"
if ($BuildType -eq "release") {
  .\gradlew.bat assembleRelease
  Write-Host "Release APK: android\app\build\outputs\apk\release\app-release-unsigned.apk"
} else {
  .\gradlew.bat assembleDebug
  Write-Host "Debug APK: android\app\build\outputs\apk\debug\app-debug.apk"
}
