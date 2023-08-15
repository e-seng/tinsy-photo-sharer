FROM debian:latest

SHELL ["/bin/bash", "-l", "-c"]

ARG PORT=8080
ARG WEB_ROOT="/var/www/public"
ARG WEB_URL="http://localhost"

RUN apt-get update;\
    apt-get upgrade -y;\
    apt-get install -y\
      curl\
      sudo\
      exiftool\
      ffmpeg;\
    useradd -m -s /bin/bash -u 1000 node;\
    mkdir -p /var/www/{public,serve}/;\
    mkdir -p /var/www/public/images/{full,thumbnails,preview}/;

COPY tools/.bashrc /home/node

ENV APP_ROOT=$WEB_ROOT
ENV APP_PORT=$PORT
ENV APP_URL=$WEB_URL

ADD package.json package-lock.json index.js .nvmrc /var/www/serve/
ADD public/index.html /var/www/public/
COPY public/css/ /var/www/public/css/
COPY public/js/ /var/www/public/js/

WORKDIR /var/www/serve/
VOLUME [ "/var/www/public/images/preview", "/var/www/public/images/thumbnails" ]

ADD tools/entrypoint.sh /
ADD tools/generate_images.sh /

RUN chown -R node:node /var/www/* /home/node;\
    chmod +s /generate_images.sh

USER node

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
RUN nvm install;\
    nvm use;\
    npm i

CMD ["/entrypoint.sh"]
