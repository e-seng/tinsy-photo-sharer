#!/bin/bash
source /home/node/.bashrc

# smolify the images
for image in `ls ${APP_ROOT}/images/full`; do
  if test ! -f ${APP_ROOT}/images/thumbnails/${image}; then
    ffmpeg -i ${APP_ROOT}/images/full/${image} \
      -vf scale=20:-1 \
      ${APP_ROOT}/images/thumbnails/${image}
  fi
done

exec npm run serve
