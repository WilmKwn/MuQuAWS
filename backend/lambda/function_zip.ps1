$jsDirectory = "C:/Users/willi/Documents/Projects/PersonalProjects/WebApps/MuQu/backend/lambda"
$zipDirectory = "C:/Users/willi/Documents/Projects/PersonalProjects/WebApps/MuQu/backend/lambda/zipped"
$tempDirectory = "C:/Users/willi/Documents/Projects/PersonalProjects/WebApps/MuQu/backend/lambda/temp"

$jsFiles = Get-ChildItem -Path $jsDirectory -Filter *.js

Add-Type -AssemblyName System.IO.Compression.FileSystem

foreach ($jsFile in $jsFiles) {
    $zipFilePath = Join-Path -Path $zipDirectory -ChildPath ($jsFile.BaseName + ".zip")

    # Create a temporary directory
    New-Item -ItemType Directory -Path $tempDirectory

    # Copy the JS file to the temporary directory
    Copy-Item -Path $jsFile.FullName -Destination $tempDirectory

    # Remove existing zip file if it exists
    if (Test-Path $zipFilePath) {
        Remove-Item $zipFilePath
        Start-Sleep -Seconds 1
    }

    # Zip the temporary directory
    [System.IO.Compression.ZipFile]::CreateFromDirectory($tempDirectory, $zipFilePath)

    # Delete the temporary directory
    Remove-Item -Recurse -Force -Path $tempDirectory
}

Write-Host "Success!"
