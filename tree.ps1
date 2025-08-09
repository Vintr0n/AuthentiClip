Get-ChildItem -Recurse -Force | Where-Object {
    $_.FullName -notmatch '\\node_modules\\' -and
    $_.FullName -notmatch '\\.git\\'
} | ForEach-Object {
    $_.FullName.Replace((Get-Location).Path, '.') 
} > tree.txt
