import {
    TextNodesFromDOM,
    Match,
    annotateDOM,
} from "@fairfox/adorn";
import { ContentCard } from '@amboss-mededu/amboss-phrasio';
import AnnotationAnchor from "./anchor-custom-element";
import {
    CARD_TAG_NAME,
    MATCH_WRAPPER_CONTENT_ID_ATTR,
    MATCH_WRAPPER_TAG_NAME,
    __PATH_TO_DE_DE_TERMS,
    __PATH_TO_US_EN_TERMS,
    __PATH_TO_PHRASIOS_US,
    __PATH_TO_PHRASIOS_DE
} from './consts'

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

export const track = (trackingProperties) => console.info('annotation track', trackingProperties)

const defaultOpts = {
    locale: 'us',
    annotationVariant: 'underline',
    theme: 'light-theme',
    PATH_TO_DE_DE_TERMS: __PATH_TO_DE_DE_TERMS,
    PATH_TO_US_EN_TERMS: __PATH_TO_US_EN_TERMS,
    PATH_TO_PHRASIOS_US: __PATH_TO_PHRASIOS_US,
    PATH_TO_PHRASIOS_DE: __PATH_TO_PHRASIOS_DE
}

export async function initAnnotation(passedInOptions) {
    const opts = {...defaultOpts, ...passedInOptions}
    const {locale, theme, PATH_TO_PHRASIOS_DE, PATH_TO_PHRASIOS_US } = opts

    // initial setup of custom elements
    if(window.customElements.get(CARD_TAG_NAME) === undefined)
        window.customElements.define(CARD_TAG_NAME, ContentCard)

    if(window.customElements.get(MATCH_WRAPPER_TAG_NAME) === undefined)
        window.customElements.define(MATCH_WRAPPER_TAG_NAME, AnnotationAnchor)

    // create the tooltip content component and place in the DOM
    const phrasios = await import(locale === 'de' ? PATH_TO_PHRASIOS_DE : PATH_TO_PHRASIOS_US)
    const getContent = async (id) => normalisePhrasio(phrasios.default[id], locale)

    const contentCard = new ContentCard(getContent, track)
    contentCard.setAttribute('data-locale', locale)
    contentCard.setAttribute('data-theme', theme)
    contentCard.setAttribute(MATCH_WRAPPER_CONTENT_ID_ATTR, '')
    document.body.appendChild(contentCard)

    // set up Match
    return createMatch(opts)
}

export async function createMatch(passedInOptions) {
    const opts = {...defaultOpts, ...passedInOptions}
    const {locale, annotationVariant, PATH_TO_DE_DE_TERMS, PATH_TO_US_EN_TERMS } = opts
    const terms = await import(locale === 'de' ? PATH_TO_DE_DE_TERMS : PATH_TO_US_EN_TERMS)
    return new Match(new Map(terms.default), null, {
        tag: MATCH_WRAPPER_TAG_NAME,
        getAttrs: id => `${MATCH_WRAPPER_CONTENT_ID_ATTR}="${id}" data-annotation-variant="${annotationVariant}"`
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
