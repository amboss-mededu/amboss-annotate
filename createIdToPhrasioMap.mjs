import fetch from 'node-fetch'
import fs from 'fs'

const onlyWithDescriptions = true

function normaliseData(data, lang) {
  return data.reduce((acc, cur) => {
    // return early if only want with descriptions and there's no description
    if (onlyWithDescriptions && !cur.description) return acc

    if (cur.synonyms.length) {
      // filter out excluded terms from synonym list with en plural / genitive s rules
      if (lang === 'en' && cur.synonyms.length) {
        const regExPlural = new RegExp(`${cur.title}(s|es|'s)?`, 'i')
        cur.synonyms = cur.synonyms.filter((s) => !regExPlural.test(s))
      }
    }

    acc.push(cur)
    return acc
  }, [])
}

function filterAndObjectifyPhrasios(normalisedData) {
  return normalisedData.reduce((acc, cur) => {
    const { id, title, description, etymology, destinations } = cur
    const newCur = {
      [id]: {
        title,
        etymology,
        description,
        destinations,
      },
    }
    return { ...acc, ...newCur }
  }, {})
}

const languages = ['en', 'de']

languages.forEach((lang) => {
  fetch(
    `https://s3-eu-west-1.amazonaws.com/anki-amboss-production.amboss.com/offline/${
      lang === 'de' ? 'de' : 'us'
    }/index.json`
  )
    .then((result) => result.json())
    .then(async (data) => {
      const normalisedData = await normaliseData(data, lang)
      const phrasiosFilteredAndObjectified = await filterAndObjectifyPhrasios(normalisedData)

      fs.writeFile(
        `./src/phrasios_${lang === 'de' ? 'de' : 'us'}.json`,
        JSON.stringify(phrasiosFilteredAndObjectified),
        (err) =>
          err
            ? console.error(`Error writing phrasios_${lang === 'de' ? 'de' : 'us'}`, err)
            : console.log(`phrasios_${lang === 'de' ? 'de' : 'us'} successfully saved!`)
      )
    })
    .catch(console.error)
})
