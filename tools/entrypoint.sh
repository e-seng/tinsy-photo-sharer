#!/bin/bash
source /home/node/.bashrc
bash /generate_images.sh &
exec npm run serve
