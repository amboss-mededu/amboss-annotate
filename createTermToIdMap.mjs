import fetch from 'node-fetch'
import fs from 'fs'

const regExEN = /^(NAM|ICH|ICD|MET|AI|LANGUAGE|INSIGHT|MEAN|FISH|MEN|STD|SAM|MG|AS|PIP|CHANGELOG|STATISTICS|PREP|STAT|TIP|PRES)$/gi
const regExDE = /^(MEN)/gi

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

function createTermListFromData(data, lang) {
  const regEx = lang === 'en' ? regExEN : regExDE

  return data.reduce((acc, cur) => {
    const { id, title, synonyms } = cur

    let newCur = {}

    if (!regEx.test(title) && title.length > 3) {
      newCur = { [title.replace('+', '\\+').toUpperCase()]: id }
    }

    synonyms.forEach((s) => {
      if (!regEx.test(s) && s.length > 3) {
        newCur = { ...newCur, [s.replace('+', '\\+').toUpperCase()]: id }
      }
    })

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
      const termList = await createTermListFromData(normalisedData, lang)

      fs.writeFile(`./src/terms_${lang === 'de' ? 'de' : 'us'}_${lang}.json`, JSON.stringify(termList), (err) =>
        err
          ? console.error(`Error writing terms_${lang === 'de' ? 'de' : 'us'}_${lang}`, err)
          : console.log(`terms_${lang === 'de' ? 'de' : 'us'}_${lang} successfully saved!`)
      )
    })
    .catch((e) => console.error(e))
})
