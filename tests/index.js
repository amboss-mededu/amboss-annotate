import {AmbossPhrasio} from '@amboss-mededu/amboss-phrasio'
import {AmbossAnchor, annotate} from '../src'
import mockTermsEn from './mocks/terms_us_en.json'
import mockTermsDe from './mocks/terms_de_de.json'
import {mockPhrasioDe, mockPhrasioEn} from './mocks'

window.customElements.define('amboss-annotation-content', AmbossPhrasio)
window.customElements.define('amboss-anchor', AmbossAnchor)

const opts = {}

const adaptorMethods = {
    track: async (trackingProperties) => console.info('adaptor track', trackingProperties),
    getTerms: async (locale, token) => locale === 'de' ? mockTermsDe : mockTermsEn,
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
    ...opts,
    adaptorMethods: {
        ...adaptorMethods,
        ...opts.adaptorMethods || {}
    },
}

const adaptor = async (message, locale, token) => {
    switch (message.subject) {
        case 'track': {
            return annotationOpts.adaptorMethods.track(message.trackingProperties)
        }
        case 'getTerms': {
            return annotationOpts.adaptorMethods.getTerms(locale, token)
        }
        case 'getTooltipContent': {
            return annotationOpts.adaptorMethods.getTooltipContent(locale, token, message.id)
        }
        default:
            throw new Error('Message requires message.subject')
    }
}
console.log(`!!`, {...annotationOpts, adaptor})
annotate({...annotationOpts, adaptor})

