# Tellustek-GDS-Data-Compare

Data Studio [community visualizations][community viz] allow you to write custom
JavaScript visualizations for [Google Data Studio][datastudio].

## Pre-Sequence

1. 安裝 [NodeJS](https://nodejs.org/)
1. 安裝 [gsutil tool](https://cloud.google.com/storage/docs/gsutil_install), 並設定憑證


## Setup

1. npm install
1. 設定 package.json 中 dsccViz 物件

## How to Start

File        | Location                           | Documentation
----------  | ---------------------------------- | --------------------
Entry Point | `src/index.js`                     | 
Vue App     | `src/components/App.vue`           | 
helpers     | `src/helpers/index.js`             | 
### 本地開發

To develop locally:

1.  Run `npm run start`

### Deployment:

Build the "dev" (devMode is true) visualization and deploy

```bash
npm run dev
```

Build the "prod" (devMode is false) visualization and deploy

```bash
npm run prod
```

## Scripts

The `build` and `deploy` scripts can be found in the `./scripts/bin` directory.

[community viz]: http://developers.google.com/datastudio/visualization
[datastudio]: https://datastudio.google.com
[manifest reference]: https://http://developers.google.com/datastudio/visualization/manifest-reference
[config reference]: https://http://developers.google.com/datastudio/visualization/config-reference
[write viz code]: https://developers.google.com/datastudio/visualization/write-viz
[ds-component]: https://developers.google.com/datastudio/visualization/library-reference
[caching]: https://developers.google.com/datastudio/visualization/caching
