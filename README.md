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

## Link to the phrasio build assets for faster local development
`ln -s /Users/ajt/projects/amboss-phrasio/dist/amboss-phrasio.es.js /Users/ajt/projects/amboss-annotate/node_modules/@amboss-mededu/amboss-phrasio/dist/amboss-phrasio.es.js`
`ln -s /Users/ajt/projects/amboss-phrasio/dist/amboss-phrasio.umd.js /Users/ajt/projects/amboss-annotate/node_modules/@amboss-mededu/amboss-phrasio/dist/amboss-phrasio.umd.js`
