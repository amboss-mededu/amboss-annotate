import { AmbossAnchor, annotate } from '../src'
import { AmbossContentCard } from './amboss-phrasio.es'
import mockTermsEn from '../mocks/terms_us_en.json'
import mockTermsDe from '../mocks/terms_de_de.json'

window.customElements.define('amboss-content-card', AmbossContentCard)
window.customElements.define('amboss-anchor', AmbossAnchor)

const annotationOpts = {
    Content: AmbossContentCard,
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
    adaptorMethods: {
        track: async (trackingProperties) => console.info('adaptor track', trackingProperties),
        getTerms: async (locale, token) => locale === 'de' ? mockTermsDe : mockTermsEn,
        getTooltipContent: async (locale, token, id) => {
            console.info('adaptor getTooltipContent', {locale, token, id})
            return {}
        }
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

