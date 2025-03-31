#!/bin/bash

# SSL setup script for Movifi
# This script helps with SSL certificate management

# Load environment variables
if [ -f .env ]; then
    source .env
else
    echo "Error: .env file not found"
    exit 1
fi

# Function to generate a self-signed certificate (for development)
generate_dev_cert() {
    echo "Generating self-signed certificate for development..."
    keytool -genkeypair \
        -alias tomcat \
        -keyalg RSA \
        -keysize 2048 \
        -keystore src/main/resources/keystore.p12 \
        -validity 365 \
        -storetype PKCS12 \
        -storepass "$SSL_KEY_STORE_PASSWORD" \
        -keypass "$SSL_KEY_STORE_PASSWORD" \
        -dname "CN=localhost, OU=Movifi, O=Movifi, L=Unknown, ST=Unknown, C=US"
    
    echo "Development certificate generated successfully"
}

# Function to check certificate expiration
check_cert_expiration() {
    echo "Checking certificate expiration..."
    keytool -list -v \
        -keystore src/main/resources/keystore.p12 \
        -storepass "$SSL_KEY_STORE_PASSWORD" \
        -storetype PKCS12 \
        -alias tomcat
}

# Function to renew certificate
renew_cert() {
    echo "Renewing certificate..."
    # Backup existing certificate
    timestamp=$(date +%Y%m%d_%H%M%S)
    cp src/main/resources/keystore.p12 "src/main/resources/keystore.p12.backup.$timestamp"
    
    # Generate new certificate
    generate_dev_cert
}

# Main script
case "$1" in
    "generate-dev")
        generate_dev_cert
        ;;
    "check")
        check_cert_expiration
        ;;
    "renew")
        renew_cert
        ;;
    *)
        echo "Usage: $0 {generate-dev|check|renew}"
        exit 1
        ;;
esac 