import { annotate, getPhrasiosFromText } from "./annotate";
import { AmbossContentCard } from '@amboss-mededu/amboss-phrasio'
import AmbossAnchor from "./anchor-custom-element";
// these phrasio maps should be moved to s3
import phrasiosDE from './phrasios_de.json'
import phrasiosUS from './phrasios_us.json'

async function getTooltipContentLocal(locale, contentId, campaign = '') {
  if (locale !== 'de' && locale !== 'us') return undefined;
  if (!contentId) return undefined;

  const phrasio = locale === 'us' ? phrasiosUS[contentId] : phrasiosDE[contentId]
  if (!phrasio) {
    console.error('phrasio', phrasio)
    console.error('contentId', contentId)
    return undefined
  }

  function generateHref({ particleEid, articleEid, title, locale, campaign }) {
    const replaceSpacesWithUnderscores = (str) => str.replace(/ /g, '_')
    const urlify = (str) =>
      encodeURIComponent(replaceSpacesWithUnderscores(str)).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16))
    const utmString = `?utm_campaign=${campaign}&utm_term=${urlify(title)}`
    const anchorString = particleEid ? `#${particleEid}` : ''
    // https://next.amboss.com/us/article/4N03Yg?utm_campaign=aaas&utm_term=FAST#Zefeb92d093a9fbf8b7c983722bdbb10d
    return `https://next.amboss.com/${locale}/article/${articleEid}${utmString}${anchorString}`
  }

  function normalisePhrasio(phrasioRAW, locale, campaign) {
    const destinations = Array.isArray(phrasioRAW.destinations) ? phrasioRAW.destinations : []

    return {
      title: phrasioRAW.title || '',
      subtitle: phrasioRAW.etymology || '',
      body: phrasioRAW.description || '',
      media: [],
      destinations: destinations.map((d) => ({
        label: d.label,
        href: generateHref({
          particleEid: d.anchor || '',
          articleEid: d.lc_xid || '',
          title: phrasioRAW.title || '',
          locale,
          campaign,
        }),
      })),
    }
  }

  return normalisePhrasio(phrasio, locale, campaign)
}

async function getTooltipContentApi(token = '', locale, contentId, campaign = '') {
  if (locale !== 'de' && locale !== 'us') return undefined;
  if (!contentId) return undefined;

  function generateHref({ particleEid, articleEid, title, locale, campaign }) {
    const replaceSpacesWithUnderscores = (str) => str.replace(/ /g, '_')
    const urlify = (str) =>
      encodeURIComponent(replaceSpacesWithUnderscores(str)).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16))
    const utmString = `?utm_campaign=${campaign}&utm_term=${urlify(title)}`
    const anchorString = particleEid ? `#${particleEid}` : ''
    // https://next.amboss.com/us/article/4N03Yg?utm_campaign=aaas&utm_term=FAST#Zefeb92d093a9fbf8b7c983722bdbb10d
    return `https://next.amboss.com/${locale}/article/${articleEid}${utmString}${anchorString}`
  }

  function normalisePhrasio(phrasioRAW, locale, campaign) {
    const destinations = Array.isArray(phrasioRAW.destinations) ? phrasioRAW.destinations : []
    const media = Array.isArray(phrasioRAW.media) ? phrasioRAW.media : []
    return {
      title: phrasioRAW.title || '',
      subtitle: phrasioRAW.translation || '',
      body: phrasioRAW.abstract || '',
      media: media.map((m) => ({
        eid: m.eid,
        copyright: m.copyright.html,
        title: m.title,
        href: m.canonicalUrl,
      })),
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

  const bodyWithMedia = `{"query":"{phraseGroup(eid: \\"${contentId}\\") {title\\nabstract\\ntranslation\\ndestinations {\\nlabel\\narticleEid\\nparticleEid}\\nmedia {\\ntitle\\neid\\ncanonicalUrl\\ncopyright {\\nhtml}}}}"}`

  const fetchPhrasioWithMedia = (body) => fetch(`https://www.labamboss.com/${locale}/api/graphql`, {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "authorization": `Bearer ${token}`,
    },
    "body": body
  })

  return fetchPhrasioWithMedia(bodyWithMedia).then(async (res) => {
      const { data, errors } = await res.json()
      if (!Array.isArray(errors) && data && data.phraseGroup) {
        return normalisePhrasio(data.phraseGroup, locale, campaign)
      } else if (data === null) {
          console.error(errors)
          return undefined
      }
    })
    .catch(console.error);
}

function initTooltips() {
  window.ambossAnnotationAdaptor.getTooltipContent = async (contentId) => {
    const {locale, token, campaign, offline} = window.ambossAnnotationOptions;
    console.info('adaptor getTooltipContent', {locale, token, campaign, contentId})

    return offline ? getTooltipContentLocal(locale, contentId, campaign) : getTooltipContentApi(token, locale, contentId, campaign)
  }
  window.customElements.define('amboss-content-card', AmbossContentCard)
  window.customElements.define('amboss-anchor', AmbossAnchor)
}

export { annotate, initTooltips, getPhrasiosFromText, AmbossContentCard, AmbossAnchor };
