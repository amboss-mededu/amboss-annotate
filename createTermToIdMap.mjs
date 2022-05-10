import fetch from 'node-fetch'
import fs from 'fs'

const dedupList = (list) => Array.from(new Set(list));
const diffLists = (dedupedList, list) => {
  const duplicates = []
  for (let i = 0; i < list.length; i++) {
      if (list[i] !== dedupedList[i]) {
        duplicates.push(...list.splice(i, 1))
      }
  }
  return duplicates
}
const areKWListsValid = (insensitive, sensitive) => {
  if (insensitive === null && sensitive === null)
    throw new Error('please provide a case-sensitive and/or case-insensitive kw map');

  const cs = [];
  if (sensitive !== null) sensitive.forEach((strList) => strList.forEach((s) => cs.push(s)));
  // check for duplicates in cs as there should be none
  // duplicates in lowerCaseCs CAN exist (checking for ['AbcD', 'abCD'] but not ['abcd'])
  const dedupedCS = dedupList(cs)
  if (dedupedCS.length !== cs.length) {
    throw new Error(`case-sensitive map contains duplicates => ${JSON.stringify(diffLists(dedupedCS, cs))}`);
  }

  const lowercaseCi = [];
  if (insensitive !== null)
    insensitive.forEach((strList) => strList.forEach((s) => {
      // console.log('|> s ===> ', s);
        lowercaseCi.push(s.toLowerCase())
    }
));
  // check for duplicates in lowercaseCi as there should be none
  const dedupedLowercaseCi = dedupList(lowercaseCi)
  if (dedupedLowercaseCi.length !== lowercaseCi.length) {
    throw new Error(`lower-cased case-insensitive map contains duplicates => ${JSON.stringify(diffLists(dedupedLowercaseCi, lowercaseCi))}`);
  }

  const lowercaseCs = cs.map((s) => s.toLowerCase());
  const mergedLists = [...dedupList(lowercaseCs), ...lowercaseCi];
  // check for duplicates in merged lowercaseCi and dedupedLowercaseCs as there should be none
  const dedupedMergedLists = dedupList(mergedLists)
  if (dedupedMergedLists.length !== mergedLists.length) {
     diffLists(dedupedMergedLists, mergedLists)
    throw new Error(`merged lower-cased case-insensitive list and deduped lower-cased case-sensitive map contains duplicates => ${JSON.stringify(diffLists(dedupedMergedLists, mergedLists))}`);
  }
  return true;
}

const regEx = /^(LANGUAGE|INSIGHT|MEAN|FISH|CHANGELOG|STATISTICS|PREP|STAT|PRES)$/gi

function createLowercaseTermListFromData(data, lang) {
  return data.filter(_ => _.title.length > 3 && _.description).reduce((acc, cur) => {
    const title = cur.title.toLowerCase()
    if (lang === 'en' && regEx.test(title)) return acc

    const synonyms = cur.synonyms.map(s => s.toLowerCase())
    const cleanedSynonyms = synonyms.filter(s => s.length > 3 && !regEx.test(s))
    const cleanedSynonymsWithoutENPlurals = cleanedSynonyms.filter(d => d !== `${title}s` && d !== `${title}es` && !cleanedSynonyms.some((s => d === `${s}s` || d === `${s}es`)))

    const deepDedupedSynonyms = cleanedSynonymsWithoutENPlurals.reduce((sAcc, sCur) => {
      let matches = 0
      data.forEach(i => {
        if (i.title.toLowerCase() === sCur) {
          matches++
          return
        }
        if (i.synonyms.some(s => s.toLowerCase() === sCur)) {
          matches++
        }
      })
      if (matches > 1) return sAcc

      return [...sAcc, sCur]
    }, [])

    const combinedList = Array.from(new Set([title, ...deepDedupedSynonyms]))

    const newCur = [cur.id, combinedList.filter(Boolean)]
    if (newCur[1].length) return [...acc, newCur]
    return acc
  }, [])
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
      const termList = await createLowercaseTermListFromData(data, lang)
      areKWListsValid(new Map(termList), null)
      fs.writeFile(`./src/terms_${lang === 'de' ? 'de' : 'us'}_${lang}.json`, JSON.stringify(termList), (err) =>
        err
          ? console.error(`Error writing terms_${lang === 'de' ? 'de' : 'us'}_${lang}`, err)
          : console.log(`terms_${lang === 'de' ? 'de' : 'us'}_${lang} successfully saved!`)
      )
    })
    .catch(console.error)
})
