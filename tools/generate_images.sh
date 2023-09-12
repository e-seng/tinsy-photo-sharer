#!/bin/bash
# copy files from volume
echo "[*] copying from volume..."
cp -r /mnt/photos/* ${APP_ROOT}/images/full
echo "[*] finished copying!"

# orient images properly
# for image in `ls ${APP_ROOT}/images/full`; do
#   jj
#   mogrify -auto-orient ${APP_ROOT}/images/full/${image}
# done

# smolify the images for preview
for image in `ls ${APP_ROOT}/images/full`; do
  if test ! -f ${APP_ROOT}/images/preview/${image}; then
    # read image orientation
    orientation=$(exiftool -Orientation -n -S ${APP_ROOT}/images/full/${image} | grep -Eo '[0-9]{1,4}')

    # resize image
    ffmpeg\
      -i ${APP_ROOT}/images/full/${image} \
      -vf scale=480:-1 \
      ${APP_ROOT}/images/preview/${image}

    # restore orientation
    exiftool -n -Orientation=$orientation ${APP_ROOT}/images/preview/${image}
  fi
done

# smolify the images for lazy load
for image in `ls ${APP_ROOT}/images/full`; do
  if test ! -f ${APP_ROOT}/images/thumbnails/${image}; then
    # read image orientation
    orientation=$(exiftool -Orientation -n -S ${APP_ROOT}/images/full/${image} | grep -Eo '[0-9]{1,4}')

    # resize image
    ffmpeg\
      -i ${APP_ROOT}/images/full/${image} \
      -vf scale=20:-1 \
      ${APP_ROOT}/images/thumbnails/${image}

    # restore orientation
    exiftool -n -Orientation=$orientation ${APP_ROOT}/images/thumbnails/${image}
  fi
done

