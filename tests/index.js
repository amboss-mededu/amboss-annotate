import {AmbossAnchor, annotate} from '../src'
// import {AmbossPhrasio} from '@amboss-mededu/amboss-phrasio'
import mockTermsEn from './mocks/terms_us_en.json'
import mockTermsDe from './mocks/terms_de_de.json'
import {mockPhrasioDe, mockPhrasioEn} from './mocks'
const BASE_URL_NEXT = 'https://next.amboss.com/'

function generateHref({
                          particleEid,
                          articleEid,
                          title,
                          locale,
                          campaign = 'browser_plugin',
                          source = 'test',
                          medium = 'browser_plugin',
                      }) {
    const replaceSpacesWithUnderscores = (str) => str.replace(/ /g, '_')
    const urlify = (str) =>
      encodeURIComponent(replaceSpacesWithUnderscores(str)).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16))
    const utmString = `?utm_campaign=${campaign}&utm_source=${source}&utm_medium=${medium}&utm_term=${urlify(title)}`
    const anchorString = particleEid ? `#${particleEid}` : ''
    // https://next.amboss.com/us/article/4N03Yg?utm_source=aaas&utm_medium=aaas&utm_campaign=aaas&utm_term=FAST#Zefeb92d093a9fbf8b7c983722bdbb10d
    return `${BASE_URL_NEXT}${locale}/article/${articleEid}${utmString}${anchorString}`
}

async function fetchPhrasioFromApi({ locale, campaign = '', token = '', phrasioId, SHOULD_MOCK=false }) {
    if (locale !== 'de' && locale !== 'us') console.error(`locale === ${locale} in fetchPhrasio`)
    if(SHOULD_MOCK) {
        return locale === 'de' ? mockPhrasioDe : mockPhrasioEn
    }
    return fetch(`https://nextapi${locale}.amboss.com/`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
        },
        body: `{\"query\":\"{phraseGroup(eid: \\\"${phrasioId}\\\") {\\neid\\ntitle\\nabstract\\ntranslation\\nsynonyms\\ndestinations {\\nlabel\\narticleEid\\nparticleEid\\nanchor}\\nmedia {\\ntitle\\neid\\ncanonicalUrl\\ncopyright {\\nhtml}}}}\\n\"}`,
    })
      .then((response) => response.json())
      .catch((err) => console.error('!! err in fetchPhrasioFromApi', err))
}

function normaliseRawPhrasio(phrasioRAW, locale, campaign) {
  const destinations = Array.isArray(phrasioRAW?.data?.phraseGroup?.destinations)
    ? phrasioRAW.data.phraseGroup.destinations
    : []
  const media = Array.isArray(phrasioRAW?.data?.phraseGroup?.media) ? phrasioRAW.data.phraseGroup.media : []
  return {
    phrasioId: phrasioRAW?.data?.phraseGroup.eid || '',
    title: phrasioRAW?.data?.phraseGroup.title || '',
    subtitle: phrasioRAW?.data?.phraseGroup.translation || '',
    body: phrasioRAW?.data?.phraseGroup.abstract || '',
    media: media.map((m) => ({
      eid: m.eid,
      copyright: m?.copyright?.html,
      title: m.title,
      href: m.canonicalUrl,
    })),
    destinations: destinations.map((d) => ({
      label: d.label,
      href: generateHref({
        particleEid: d.particleEid || '',
        articleEid: d.articleEid || '',
        title: phrasioRAW?.data?.phraseGroup.title || '',
        locale,
        campaign,
      }),
    })),
  }
}

class AmbossPhrasio extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      const getAttrs = (el) => el.getAttributeNames().map((attr) => ({[attr]: el.getAttribute(attr)}))
      console.log(`!!`, getAttrs(this))
        this.shadowRoot.innerHTML = `<div id="amboss-annotation-arrow" data-popper-arrow>
            <div id="buffer"></div>
          </div><div style="background-color: lightgrey">${JSON.stringify(getAttrs(this))}</div>`
    }
}

window.customElements.define('amboss-annotation-content', AmbossPhrasio)
window.customElements.define('amboss-anchor', AmbossAnchor)

const opts = {}

const adaptorMethods = {
    track: async (trackingProperties) => console.info('adaptor track', trackingProperties),
    getTerms: async (locale, token) => locale === 'de' ? mockTermsDe : mockTermsEn,
    getTooltipContent: async (locale, token, id) => {
        fetchPhrasioFromApi({ locale, phrasioId: id, SHOULD_MOCK: true }).then((phrasio) =>
          normaliseRawPhrasio(phrasio, locale, '')
        )

    }
}

const annotationOpts = {
    Content: AmbossPhrasio,
    Anchor: AmbossAnchor,
    shouldAnnotate: true,
    annotationVariant: 'underline',
    useGlossary: 'no',
    theme: 'light-theme',
    locale: 'us',
    campaign: '123890',
    token: '1234567890',
    customBranding: 'no',
    languages: {
        en: true,
        de: true,
        es: false,
        it: false,
        pt: false,
        fr: false,
        pl: false,
    },
    ...opts,
    adaptorMethods: {
        ...adaptorMethods,
        ...opts.adaptorMethods || {}
    },
}

const adaptor = async ({ subject, locale, token, trackingProperties, id }) => {
    switch (subject) {
        case 'track': {
            return annotationOpts.adaptorMethods.track(trackingProperties)
        }
        case 'getTerms': {
            return annotationOpts.adaptorMethods.getTerms(locale, token)
        }
        case 'getTooltipContent': {
            return annotationOpts.adaptorMethods.getTooltipContent(locale, token, id)
        }
        default:
            throw new Error('Message requires subject')
    }
}

window.adaptor = (message) => adaptor({ ...message, ...annotationOpts });
annotate(annotationOpts)

