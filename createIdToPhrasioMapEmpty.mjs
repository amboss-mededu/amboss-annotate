import fs from 'fs'

const languages = ['en', 'de']

languages.forEach((lang) => {
      fs.writeFile(
        `./src/phrasios_${lang === 'de' ? 'de' : 'us'}.json`,
        JSON.stringify({}),
        (err) =>
          err
            ? console.error(`Error writing phrasios_${lang === 'de' ? 'de' : 'us'}`, err)
            : console.log(`phrasios_${lang === 'de' ? 'de' : 'us'} successfully saved!`)
      )
})
