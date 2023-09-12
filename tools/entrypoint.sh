#!/bin/bash
export APP_ROOT=$APP_ROOT
sudo -E /generate_images.sh &
source /home/node/.bashrc
exec npm run serve
