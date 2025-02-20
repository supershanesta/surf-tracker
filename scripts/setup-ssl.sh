#!/bin/bash

# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d surf.shanedrice.com

# Auto-renewal
sudo certbot renew --dry-run 