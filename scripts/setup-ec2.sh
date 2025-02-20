#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install nginx
sudo apt install nginx -y

# Configure nginx
sudo tee /etc/nginx/sites-available/surf-tracker << EOF
server {
    listen 80;
    server_name surf.shanedrice.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/surf-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup PM2 to start on boot
pm2 startup 