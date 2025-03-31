@echo off
setlocal enabledelayedexpansion

:: Database setup script for Movifi
:: This script helps with database initialization and maintenance

:: Load environment variables
if exist .env (
    for /f "tokens=*" %%a in (.env) do (
        set "%%a"
    )
) else (
    echo Error: .env file not found
    exit /b 1
)

:: Function to check if MySQL is running
:check_mysql
mysqladmin ping -h"%DB_HOST%" -P"%DB_PORT%" -u"%DB_USERNAME%" -p"%DB_PASSWORD%" --silent
if errorlevel 1 (
    echo Error: Cannot connect to MySQL server
    exit /b 1
)
goto :eof

:: Function to create database if it doesn't exist
:create_database
echo Creating database if it doesn't exist...
mysql -h"%DB_HOST%" -P"%DB_PORT%" -u"%DB_USERNAME%" -p"%DB_PASSWORD%" -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;"
goto :eof

:: Function to backup database
:backup_database
echo Creating database backup...
set timestamp=%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set backup_file=backup_%timestamp%.sql
if not exist backups mkdir backups
mysqldump -h"%DB_HOST%" -P"%DB_PORT%" -u"%DB_USERNAME%" -p"%DB_PASSWORD%" "%DB_NAME%" > "backups\%backup_file%"
echo Backup created: %backup_file%
goto :eof

:: Function to restore database from backup
:restore_database
if "%1"=="" (
    echo Error: Please specify backup file to restore
    exit /b 1
)
echo Restoring database from backup: %1
mysql -h"%DB_HOST%" -P"%DB_PORT%" -u"%DB_USERNAME%" -p"%DB_PASSWORD%" "%DB_NAME%" < %1
goto :eof

:: Main script
if "%1"=="setup" (
    call :check_mysql
    call :create_database
    echo Database setup completed successfully
) else if "%1"=="backup" (
    call :check_mysql
    call :backup_database
) else if "%1"=="restore" (
    call :check_mysql
    call :restore_database %2
) else (
    echo Usage: %0 {setup^|backup^|restore [backup_file]}
    exit /b 1
) 