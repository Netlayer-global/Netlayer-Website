# Netlayer — Deployment Guide (Ubuntu, static IP)

This is a **static website** (HTML/CSS/JS, no build step). You can host it with Nginx
on any Ubuntu server. Below are two options:

- **Option A — Nginx (recommended)**: production-grade, runs on port 80 (or any custom port), survives reboots.
- **Option B — Quick test**: Python's built-in server, good for a fast check only.

Assume your server's static IP is `YOUR_SERVER_IP` (replace it everywhere).

---

## 0. One-time: prerequisites on the server

SSH into the server:

```bash
ssh youruser@YOUR_SERVER_IP
```

Install git (and Nginx for Option A):

```bash
sudo apt update
sudo apt install -y git nginx
```

---

## 1. Pull the code from GitHub

```bash
# Pick a location for the site
sudo mkdir -p /var/www
cd /var/www

# Clone the repo
sudo git clone https://github.com/Netlayer-global/Netlayer-Website.git netlayer
cd netlayer
```

To update later (pull new changes):

```bash
cd /var/www/netlayer
sudo git pull origin main
```

---

## Option A — Nginx (recommended)

### A1. Create an Nginx site config

This serves the site on the standard web port **80** (so it loads at
`http://YOUR_SERVER_IP` with no port number). To use a different port instead,
change every `80` below to your chosen port (e.g. `8080`).

```bash
sudo nano /etc/nginx/sites-available/netlayer
```

Paste this:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name YOUR_SERVER_IP;

    root /var/www/netlayer;
    index index.html;

    # serve real pages; allow extensionless URLs (e.g. /ip-transit -> ip-transit.html)
    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # cache static assets
    location ~* \.(css|js|svg|woff2?|png|jpg|jpeg|gif|ico)$ {
        expires 7d;
        add_header Cache-Control "public";
    }
}
```

Save (Ctrl+O, Enter) and exit (Ctrl+X).

### A2. Enable the site and reload

```bash
# Enable it
sudo ln -s /etc/nginx/sites-available/netlayer /etc/nginx/sites-enabled/

# Remove the default site so it doesn't clash on port 80
sudo rm -f /etc/nginx/sites-enabled/default

# Test the config, then reload
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl enable nginx   # start on boot
```

### A3. Open the firewall for port 80

If `ufw` is active:

```bash
sudo ufw allow 80/tcp
sudo ufw reload
```

> If you're on a cloud provider (AWS, GCP, Azure, Oracle, DigitalOcean, etc.),
> also open **port 80 (HTTP)** in the provider's **Security Group / firewall** dashboard.

### A4. Open the site

```
http://YOUR_SERVER_IP
```

No port number needed.

---

## Option B — Quick test with Python (no Nginx)

Good for a quick look; not ideal for production (stops when you log out unless you use the service below).

```bash
cd /var/www/netlayer
sudo python3 -m http.server 80 --bind 0.0.0.0
```

Open `http://YOUR_SERVER_IP`. Press Ctrl+C to stop.
(Binding to port 80 needs `sudo`. For an unprivileged test, use `8080` instead and open `http://YOUR_SERVER_IP:8080`.)

### Make Python server run permanently (systemd)

```bash
sudo nano /etc/systemd/system/netlayer.service
```

Paste:

```ini
[Unit]
Description=Netlayer static site
After=network.target

[Service]
WorkingDirectory=/var/www/netlayer
ExecStart=/usr/bin/python3 -m http.server 80 --bind 0.0.0.0
Restart=always
User=root

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now netlayer
sudo systemctl status netlayer      # check it's running
sudo ufw allow 80/tcp               # open firewall
```

---

## Updating the site after a new push

```bash
cd /var/www/netlayer
sudo git pull origin main
# Nginx serves files directly — nothing to restart.
# If using the Python systemd service: sudo systemctl restart netlayer
```

---

## Optional — domain + free HTTPS (Let's Encrypt)

If you point a domain at `YOUR_SERVER_IP`, you can add HTTPS in minutes:

```bash
sudo apt install -y certbot python3-certbot-nginx
# set server_name to your domain in the nginx config first, listen 80
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot auto-renews. Your site will then be available at `https://yourdomain.com`.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Can't reach the site | Confirm firewall (`ufw`) **and** cloud security group allow your port |
| `nginx -t` fails | Re-check the config file for typos; fix and retest |
| 403 Forbidden | Run `sudo chown -R www-data:www-data /var/www/netlayer` |
| Port already in use | Pick another port, or `sudo lsof -i :80` to see what's using it |
| Changes not showing | Hard-refresh (Ctrl+Shift+R); assets cache for 7 days |
