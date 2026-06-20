@echo off
rem Generates web-optimized WebP + thumbnails for every image under assets\images.
rem Safe to re-run any time you add new renders — only new images are processed.
cd /d "%~dp0"
python optimize-images.py
echo.
echo Done. Press any key to close.
pause >nul
