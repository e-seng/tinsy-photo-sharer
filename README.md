# tinsy photo sharer
### made by e-seng

## motivation

after travelling with some friends to Vancouver, I took a lot of photos on my
camera and realized I had no reasonable way of sharing them with my friends. I
had already sent some through Discord, but I wanted everyone to see all of my
blurry, out of focus shots in the off chance they wanted to save them in full
quality. thus, the tinsy photo sharer was born.

I could be using Google Drive or something, but I wanted something I could host
locally... and I like developing things I guess.

## usage

```bash
$ docker build -t tinsy-photo-sharer.
$ docker run -v <directory with photos>:/var/www/public/images/full -v <place to cache thumbnails>:/var/www/public/images/thumbnails -p 8080:8080 --rm --name tinsy-photo-sharer tinsy-photo-sharer
```
