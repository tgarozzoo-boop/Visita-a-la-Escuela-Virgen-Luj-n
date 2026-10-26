# Ejecutar dentro de la carpeta del sitio (clic derecho en la carpeta > "Abrir en Terminal")
# 1) Renombra imágenes: extensión en minúscula, sin espacios, paréntesis ni ñ
# 2) Revisa que todo src/href de los .html exista con las MAYÚSCULAS/minúsculas exactas

$enie = [string][char]0xF1
Get-ChildItem -File | Where-Object { $_.Extension -match '^\.(jpe?g|png|gif|webp)$' } | ForEach-Object {
    $base = $_.BaseName -replace ' \(', '_' -replace '\)', '' -replace ' ', '_' -replace $enie, 'n'
    $nuevo = $base + $_.Extension.ToLower()
    if ($nuevo -cne $_.Name) {
        $tmp = $_.Name + '.tmp'
        Rename-Item -LiteralPath $_.FullName -NewName $tmp          # paso intermedio (Windows ignora mayúsculas)
        Rename-Item -LiteralPath ($_.FullName + '.tmp') -NewName $nuevo
        Write-Host "Renombrado: $($_.Name) -> $nuevo"
    }
}

Write-Host "`n--- Verificación ---"
$archivos = Get-ChildItem -File | ForEach-Object { $_.Name }
$faltan = 0
Get-ChildItem *.html | ForEach-Object {
    $pagina = $_.Name
    $texto = Get-Content -LiteralPath $_.FullName -Raw -Encoding UTF8
    [regex]::Matches($texto, '(?:src|href)="([^"#:]+)"') | ForEach-Object {
        $ref = [uri]::UnescapeDataString($_.Groups[1].Value)
        if (-not ($archivos -ccontains $ref)) { Write-Host "$pagina -> NO ENCONTRADO: $ref"; $faltan++ }
    }
}
if ($faltan -eq 0) { Write-Host "Todo correcto: no falta ningún archivo." }
