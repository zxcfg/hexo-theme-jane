
## Run demo

```
npm install -g hexo
npm install
hexo generate -f
hexo server -o
```

## create new post

```
hexo new post-example
```

then edit `source/_post/post-example.md`

## local development

```
hexo generate -f
hexo server -o
```

## deploy to github pages

```
npm run deploy
```

## config

There are some values you should change.

**_config.yaml**

```
title: Jane
description: website description
author: Jane

url: https://username.github.io
root: /repo/

# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repo: git@github.com:username/repo.git // your github repo
  branch: gh-pages

```

**themes/jane/_config.yml**

```
enable_links: false // you can enable or disable links under title

duoshuo_shortname:
disqus_shortname:

google_analytics:
favicon: /images/fav.ico

```