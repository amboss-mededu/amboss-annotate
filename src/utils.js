import phrasiosUS from './phrasios_us.json'
import phrasiosDE from './phrasios_de.json'

function generateHref({ particleEid, articleEid, title, locale, campaign }) {
  const replaceSpacesWithUnderscores = (str) => str.replace(/ /g, '_')
  const urlify = (str) =>
      encodeURIComponent(replaceSpacesWithUnderscores(str)).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16))
  const utmString = `?utm_campaign=${campaign}&utm_term=${urlify(title)}`
  const anchorString = particleEid ? `#${particleEid}` : ''
  // https://next.amboss.com/us/article/4N03Yg?utm_campaign=aaas&utm_term=FAST#Zefeb92d093a9fbf8b7c983722bdbb10d
  return `https://next.amboss.com/${locale}/article/${articleEid}${utmString}${anchorString}`
}

function normalisePhrasio(phrasioRAW, locale, campaign='') {
  const destinations = Array.isArray(phrasioRAW.destinations) ? phrasioRAW.destinations : []
  return {
    title: phrasioRAW.title || '',
    subtitle: phrasioRAW.etymology || '',
    body: phrasioRAW.description || '',
    destinations: destinations.map((d) => ({
      label: d.label,
      href: generateHref({
        particleEid: d.particleEid || '',
        articleEid: d.articleEid || '',
        title: phrasioRAW.title || '',
        locale,
        campaign,
      }),
    })),
  }
}

export const getContent = async (id, locale) => normalisePhrasio(locale === 'de' ? phrasiosDE[id] : phrasiosUS[id], locale)

export async function track(trackingProperties) {
  console.info('annotation adaptor track', trackingProperties)
}
