#!/bin/bash
# Auto-configure UFW based on active services
# WARNING: Run this with sudo

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

echo "Configuring UFW Firewall..."

# Reset to default
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Allow SSH only from trusted IPs (example subnet, adjust as needed)
# ufw allow from 192.168.1.0/24 to any port 22
ufw allow ssh

# Allow HTTP/HTTPS for web server
ufw allow 80/tcp
ufw allow 443/tcp

# Allow specific ports for GetNexo services
ufw allow 3000/tcp # Frontend
ufw allow 3006/tcp # Chat API
ufw allow 5678/tcp # N8N

# Allow database only locally or from Docker network range
# Assuming 172.16.0.0/12 is Docker default range
ufw allow from 172.16.0.0/12 to any port 5432 # Postgres
ufw allow from 172.16.0.0/12 to any port 6379 # Redis
ufw allow from 172.16.0.0/12 to any port 27017 # Mongo

echo "Enabling UFW..."
ufw --force enable

echo "✅ Firewall configured successfully."
ufw status verbose
