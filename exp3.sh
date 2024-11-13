#!/bin/bash

sudo apt-get update
sudo apt-get install git
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source $HOME/.bashrc
nvm install 21
nvm use 21

curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
sudo apt-get update
sudo apt-get install redis
sudo service redis-server start

git clone https://github.com/davhsi/notification-redis.git
cd notification-redis
npm install
node server.js
