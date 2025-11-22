@echo off
chcp 65001 >nul
echo ========================================
echo YQFAIBTRIP DEMO 一键启动脚本
echo ========================================
echo.

:: 检查Node.js是否安装
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] 检查Node.js版本...
node --version
echo.

:: 检查是否在项目根目录
if not exist "package.json" (
    echo [错误] 未找到package.json，请确保在项目根目录执行此脚本
    pause
    exit /b 1
)

:: 检查node_modules是否存在
if not exist "node_modules" (
    echo [2/4] 首次运行，正在安装依赖...
    echo 这可能需要几分钟，请耐心等待...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
    echo.
    echo [成功] 依赖安装完成！
    echo.
) else (
    echo [2/4] 依赖已安装，跳过...
    echo.
)

:: 检查src目录
if not exist "src" (
    echo [错误] 未找到src目录，请确保项目文件完整
    pause
    exit /b 1
)

echo [3/4] 检查项目文件...
if exist "src\App.tsx" (
    echo [成功] 项目文件完整
) else (
    echo [错误] 未找到src\App.tsx，请确保项目文件完整
    pause
    exit /b 1
)
echo.

echo [4/4] 启动开发服务器...
echo.
echo ========================================
echo 项目将在 http://localhost:3000 启动
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.
echo 测试账号:
echo   Email: test@example.com
echo   Password: 123456
echo.
echo 正在启动...
echo.

call npm start






