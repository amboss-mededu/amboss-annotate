# amboss-annotate
DOM annotation

## testing
Copy the `amboss-phrasio.es.js` file from the build of amboss-phrasio that you want to test against.
Paste it into the `./tests` folder
```sh
npm run dev
npm run cy



//add terms_de_de.json and terms_us_en.json to ./implementation
npm run createTermToIdMap

// load ./index.html with ./implementation/index.js on localhost:3000
npm run dev
```
