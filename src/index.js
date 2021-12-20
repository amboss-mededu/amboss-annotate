import { annotate, getPhrasiosFromText } from "./annotate";
import { AmbossContentCard } from '@amboss-mededu/amboss-phrasio'
import AmbossAnchor from "./anchor-custom-element";

function initTooltips(annotationOpts) {
  window.ambossAnnotation.getTooltipContentViaApi = async (contentId) => {
    const {locale, token} = annotationOpts;
    console.info('adaptor getTooltipContent', {locale, token, contentId})

    function generateHref({
      particleEid,
      articleEid,
      title,
      locale,
      campaign,
    }) {
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

    const response = await fetch("https://master.graphql-gateway.us.qa.medicuja.de/graphql", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`,
        },
        "body": `{"query":"{phraseGroup(eid: \\"${contentId}\\") {title\\nabstract\\ntranslation\\ndestinations {\\nlabel\\narticleEid\\nparticleEid}\\nmedia {\\ntitle\\neid\\ncanonicalUrl\\ncopyright {\\nhtml}}}}\\n"}`
    })
      .then(async (res) => {
          const { data } = await res.json()
          return normalisePhrasio(data.phraseGroup, locale, annotationOpts.campaign)
      })
      .catch(console.error);

    return response
}
  window.customElements.define('amboss-content-card', AmbossContentCard)
  window.customElements.define('amboss-anchor', AmbossAnchor)
}

export { annotate, initTooltips, getPhrasiosFromText, AmbossContentCard, AmbossAnchor };
