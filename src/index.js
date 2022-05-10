import { annotate, getIdsFromText } from "./annotate";
import { ContentCard } from '@amboss-mededu/amboss-phrasio';
import AnnotationAnchor from "./anchor-custom-element";
import {getContent, track} from './utils';
import {CARD_TAG_NAME, MATCH_WRAPPER_CONTENT_ID_ATTR, MATCH_WRAPPER_TAG_NAME} from './consts'

const annotationOptionDefaults = {
    Content: ContentCard,
    Anchor: AnnotationAnchor,
    shouldAnnotate: true,
    locale: 'us',
    annotationVariant: 'underline',
    theme: 'dark-theme',
}

async function initAnnotation() {
  if (!window.annotationOptions) window.annotationOptions = {}
  if (!window.annotationOptions.Content)
    window.annotationOptions = annotationOptionDefaults

  if(window.customElements.get(CARD_TAG_NAME) === undefined)
    window.customElements.define(CARD_TAG_NAME, ContentCard)

  if(window.customElements.get(MATCH_WRAPPER_TAG_NAME) === undefined)
    window.customElements.define(MATCH_WRAPPER_TAG_NAME, AnnotationAnchor)

    const contentCard = new window.annotationOptions.Content(getContent, track)
    contentCard.setAttribute('data-locale', window.annotationOptions.locale)
    contentCard.setAttribute('data-theme', window.annotationOptions.theme)
    contentCard.setAttribute(MATCH_WRAPPER_CONTENT_ID_ATTR, '')
    document.body.appendChild(contentCard)

  return true
}

export { annotate, initAnnotation, getIdsFromText };
