// these term maps should be moved to s3
import termsDe from '/src/terms_de_de.json'
import termsEn from '/src/terms_us_en.json'

const getTerms = async (locale) => locale === 'de' ? termsDe : termsEn
// .then((res) => new Map(Object.entries(res)));
// you cannot get a map via the background script so get the array of tuples and create the map here
// };

const filterTermsByText = (terms, text) => {
  if (!terms || !text) throw new Error("filterTermsByText");

  const _text = " " + text.replace(/[.?'"!:;()\n\t\r]+/g, " ") + " ";
  // todo: do I need to clone the map here??????!!!!
  // todo: remove terms from inner text when matched to prevent double work. As 'terms' or ordered by key length desc, this will have to be done backwards to prevent 'diabetes mellitus' from matching 'diabetes' but not 'diabetes mellitus'
  terms.forEach((k, v) => {
    if (v.length <= 4 || !_text.includes(" " + v + " ")) terms.delete(v);
  });

  return terms;
};

const getTermsFromText = (locale, allText) => {
  return getTerms(locale).then((res) => new Map(Object.entries(res))).then((res) => filterTermsByText(res, allText));
};

const getPhrasioIdsFromText = async (locale, allText) => {
  const terms = await getTerms(locale).then((res) => new Map(Object.entries(res))).then((res) => filterTermsByText(res, allText));
  return [...new Set(terms.values())].filter(Boolean)
};

self.onmessage = async function (e) {
const [message, data] = e.data
  switch (message) {
      case 'getTermsFromText':
        // eslint-disable-next-line no-case-declarations
        const result = await getTermsFromText(data.locale, data.text)
        postMessage(['gotTermsFromText', result])
        break;
    case 'getPhrasioIdsFromText':
      // eslint-disable-next-line no-case-declarations
      const phrasioIds = await getPhrasioIdsFromText(data.locale, data.text)
      postMessage(['gotPhrasioIdsFromText', phrasioIds])
      break;
    default:
      throw new Error()
  }
};
