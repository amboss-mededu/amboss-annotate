import '@webcomponents/webcomponentsjs'
import {
    TextNodesFromDOM,
    Match,
    annotateDOM
} from "@fairfox/adorn";
import { ContentCard } from '@amboss-mededu/amboss-phrasio';
import AnnotationAnchor from "./anchor-custom-element";
import termsDe from './terms_de_de.json'
import termsUsEn from './terms_us_en.json'
import phrasiosUs from './phrasios_us.json'
import phrasiosDe from './phrasios_de.json'
import {
    CARD_TAG_NAME,
    MATCH_WRAPPER_CONTENT_ID_ATTR,
    MATCH_WRAPPER_TAG_NAME
} from './consts'

export function generateHref({ particleEid, articleEid, title, locale, campaign }) {
    const replaceSpacesWithUnderscores = (str) => str.replace(/ /g, '_')
    const urlify = (str) =>
        encodeURIComponent(replaceSpacesWithUnderscores(str)).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16))
    const utmString = `?utm_campaign=${campaign}&utm_term=${urlify(title)}`
    const anchorString = particleEid ? `#${particleEid}` : ''
    // https://next.amboss.com/us/article/4N03Yg?utm_campaign=aaas&utm_term=FAST#Zefeb92d093a9fbf8b7c983722bdbb10d
    return `https://next.amboss.com/${locale}/article/${articleEid}${utmString}${anchorString}`
}

export function normalisePhrasio(phrasioRAW, locale, campaign='') {
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

const defaultOpts = {
    locale: 'us',
    annotationVariant: 'underline',
    theme: 'light-theme',
    campaign: '',
    track: (trackingProperties) => console.info('annotation track', trackingProperties),
    getPhrasios: async (locale) => locale === 'de' ? phrasiosDe : phrasiosUs,
    getTerms: async (locale) => locale === 'de' ? termsDe : termsUsEn
}

const createOptions = async (passedInOptions, win) => {
    const opts = {...defaultOpts, ...win.ambossAnnotationAdaptor || [], ...passedInOptions}
    opts.getContent = async (id) => opts.getPhrasios(opts.locale).then((phrasios) => phrasios[id] && normalisePhrasio(phrasios[id], opts.locale, opts.campaign))
    win.ambossAnnotationAdaptor = opts
    return opts
}

export async function initAnnotation(passedInOptions, win) {
    const opts = await createOptions(passedInOptions, win)

    // create the tooltip content component and place in the DOM
    if (!win.customElements.get(CARD_TAG_NAME)) {
        win.customElements.define(CARD_TAG_NAME, ContentCard)
    }

    if (!win.document.getElementsByTagName(CARD_TAG_NAME).length) {
        const contentCard = win.document.createElement(CARD_TAG_NAME)
        contentCard.track = opts.track
        contentCard.getContent = opts.getContent
        contentCard.setAttribute('data-locale', opts.locale)
        contentCard.setAttribute('data-theme', opts.theme)
        contentCard.setAttribute(MATCH_WRAPPER_CONTENT_ID_ATTR, '')
        win.document.body.appendChild(contentCard)
    }

    if (!win.customElements.get(MATCH_WRAPPER_TAG_NAME))
        win.customElements.define(MATCH_WRAPPER_TAG_NAME, AnnotationAnchor)

    if (!win.document.getElementsByTagName(MATCH_WRAPPER_TAG_NAME).length) {
        const annotationAnchor = win.document.createElement(MATCH_WRAPPER_TAG_NAME)
        win.document.body.appendChild(annotationAnchor)
    }

    return createMatch(opts, win)
}

export async function createMatch(passedInOptions, win) {
    const opts = await createOptions(passedInOptions, win)

    const terms = await opts.getTerms(opts.locale)
    return new Match(new Map(terms), null, {
        tag: MATCH_WRAPPER_TAG_NAME,
        element: AnnotationAnchor,
        getAttrs: id => [[MATCH_WRAPPER_CONTENT_ID_ATTR, id], ['data-annotation-variant', opts.annotationVariant]],
        elementMethods: [['track', opts.track]],
        shouldSkipChars: true
    })
}

export async function annotate(match) {
    const textNodesFromDOM = new TextNodesFromDOM(document.body, [MATCH_WRAPPER_TAG_NAME.toUpperCase()]);
    annotateDOM(textNodesFromDOM.walk(document.body), match);
    textNodesFromDOM.watchDOM((ns) => annotateDOM(ns, match));
    textNodesFromDOM.watchScroll((ns) => annotateDOM(ns, match));
}

export async function getIdsFromText(match) {
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText
    const text = document.body.textContent
    return match.extractMatchIds(text)
}

export { ContentCard, AnnotationAnchor }
