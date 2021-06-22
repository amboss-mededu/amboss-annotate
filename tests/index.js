import {AmbossAnchor, annotate} from '../src'
import {AmbossPhrasio} from '@amboss-mededu/amboss-phrasio'
import mockTermsEn from './mocks/terms_us_en.json'
import mockTermsDe from './mocks/terms_de_de.json'
import {mockPhrasioDe, mockPhrasioEn} from './mocks'
const BASE_URL_NEXT = 'https://next.amboss.com/'

window.customElements.define('amboss-annotation-content', AmbossPhrasio)
window.customElements.define('amboss-anchor', AmbossAnchor)

const opts = {}

const adaptorMethods = {
    track: async (trackingProperties) => console.info('adaptor track', trackingProperties),
    getTerms: async (locale, token) => locale === 'de' ? mockTermsDe : mockTermsEn,
    generateHref: ({ particleEid, articleEid, title, locale, campaign }) => {
        const replaceSpacesWithUnderscores = (str) => str.replace(/ /g, '_')
        const urlify = (str) => encodeURIComponent(replaceSpacesWithUnderscores(str)).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16))
        const utmString = `?utm_campaign=${campaign}&utm_source=partner-sdk&utm_medium=website&utm_term=${urlify(title)}`
        const anchorString = particleEid ? `#${particleEid}` : ''
        // https://next.amboss.com/us/article/4N03Yg?utm_source=aaas&utm_medium=aaas&utm_campaign=aaas&utm_term=FAST#Zefeb92d093a9fbf8b7c983722bdbb10d
        return `${BASE_URL_NEXT}${locale}/article/${articleEid}${utmString}${anchorString}`
    },
    getTooltipContent: async (locale, token, id) => {
        const phrasio = await locale === 'de' ? mockPhrasioDe : mockPhrasioEn
        const title = phrasio?.data?.phraseGroup.title
        const description = phrasio?.data?.phraseGroup.abstract
        const etymology = phrasio?.data?.phraseGroup.translation
        const destinations = phrasio?.data?.phraseGroup.destinations
        const phrasioId = phrasio?.data?.phraseGroup.eid
        return {
            title,
            description,
            etymology,
            destinations,
            phrasioId
        }
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

const adaptor = async ({ subject, locale, token, trackingProperties, id, hrefProperties }) => {
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
        case 'generateHref': {
            return annotationOpts.adaptorMethods.generateHref({...hrefProperties, locale})
        }
        default:
            throw new Error('Message requires subject')
    }
}

window.adaptor = (message) => adaptor({ ...message, ...annotationOpts });
annotate(annotationOpts)

