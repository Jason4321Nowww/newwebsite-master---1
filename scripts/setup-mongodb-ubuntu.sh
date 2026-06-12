#!/bin/bash
# ============================================================
#  MongoDB Auto-Start + Memory Cap Setup — Ubuntu / Debian
#  Run with: sudo bash setup-mongodb-ubuntu.sh
# ============================================================

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  MongoDB Setup Script — Ubuntu/Debian  ${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# ── 1. Check root ────────────────────────────────────────────
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}ERROR: Please run as root: sudo bash setup-mongodb-ubuntu.sh${NC}"
    exit 1
fi

# ── 2. Check MongoDB is installed ────────────────────────────
if ! command -v mongod &> /dev/null; then
    echo -e "${RED}MongoDB not found. Installing...${NC}"

    # Import MongoDB public GPG key
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
        gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

    # Add MongoDB repo
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] \
        https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" \
        | tee /etc/apt/sources.list.d/mongodb-org-7.0.list

    apt-get update -qq
    apt-get install -y mongodb-org

    echo -e "${GREEN}MongoDB installed.${NC}"
fi

# ── 3. Apply 0.5 GB memory cap ───────────────────────────────
echo -e "${YELLOW}Applying 0.5 GB WiredTiger cache limit...${NC}"

CFG="/etc/mongod.conf"

# Backup original config
cp "$CFG" "${CFG}.bak" 2>/dev/null || true

cat > "$CFG" << 'EOF'
storage:
  dbPath: /var/lib/mongodb
  wiredTiger:
    engineConfig:
      cacheSizeGB: 0.5

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1

processManagement:
  timeZoneInfo: /usr/share/zoneinfo
EOF

echo -e "${GREEN}Config updated: $CFG${NC}"

# ── 4. Enable + start service ─────────────────────────────────
echo -e "${YELLOW}Enabling MongoDB to start on boot...${NC}"
systemctl enable mongod

echo -e "${YELLOW}Starting MongoDB...${NC}"
systemctl restart mongod

# ── 5. Verify ────────────────────────────────────────────────
sleep 2
STATUS=$(systemctl is-active mongod)

echo ""
echo -e "${CYAN}========================================${NC}"
if [ "$STATUS" = "active" ]; then
    echo -e "${GREEN}  MongoDB is RUNNING${NC}"
    echo -e "${GREEN}  Startup: enabled (starts on every boot)${NC}"
    echo -e "${GREEN}  Memory cap: 0.5 GB WiredTiger cache${NC}"
else
    echo -e "${RED}  WARNING: MongoDB status is '$STATUS'${NC}"
    echo -e "${RED}  Check logs: sudo journalctl -u mongod -n 50${NC}"
fi
echo -e "${CYAN}========================================${NC}"
echo ""
