#!/bin/bash

# Database setup script for Movifi
# This script helps with database initialization and maintenance

# Load environment variables
if [ -f .env ]; then
    source .env
else
    echo "Error: .env file not found"
    exit 1
fi

# Function to check if MySQL is running
check_mysql() {
    if ! mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" --silent; then
        echo "Error: Cannot connect to MySQL server"
        exit 1
    fi
}

# Function to create database if it doesn't exist
create_database() {
    echo "Creating database if it doesn't exist..."
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
}

# Function to backup database
backup_database() {
    echo "Creating database backup..."
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_file="backup_${timestamp}.sql"
    mysqldump -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" "$DB_NAME" > "backups/$backup_file"
    echo "Backup created: $backup_file"
}

# Function to restore database from backup
restore_database() {
    if [ -z "$1" ]; then
        echo "Error: Please specify backup file to restore"
        exit 1
    fi
    
    echo "Restoring database from backup: $1"
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" "$DB_NAME" < "$1"
}

# Main script
case "$1" in
    "setup")
        check_mysql
        create_database
        echo "Database setup completed successfully"
        ;;
    "backup")
        check_mysql
        backup_database
        ;;
    "restore")
        check_mysql
        restore_database "$2"
        ;;
    *)
        echo "Usage: $0 {setup|backup|restore [backup_file]}"
        exit 1
        ;;
esac 