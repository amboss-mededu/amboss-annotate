import {
  TextNodesFromDOM,
  Match,
  annotateDOM,
} from "@fairfox/adorn";
import {MATCH_WRAPPER_TAG_NAME, PATH_TO_DE_DE_TERMS, PATH_TO_US_EN_TERMS, MATCH_WRAPPER_CONTENT_ID_ATTR, GLOBAL_OPTIONS_OBJECT} from './consts'


export async function annotate(annotationOptions = window[GLOBAL_OPTIONS_OBJECT]) {
  const {
    annotationVariant,
    locale,
    shouldAnnotate,
  } = annotationOptions
  if (annotationVariant === "none" || !shouldAnnotate) return;
  if (!annotationVariant || !locale) throw new Error("annotate");

  const terms = await import(locale === 'de' ? PATH_TO_DE_DE_TERMS : PATH_TO_US_EN_TERMS)
  const match = new Match(new Map(terms.default), null, {
    tag: MATCH_WRAPPER_TAG_NAME,
    getAttrs: id => `${MATCH_WRAPPER_CONTENT_ID_ATTR}="${id}" data-annotation-variant="${annotationVariant}"`
  });
  const textNodesFromDOM = new TextNodesFromDOM(document.body, [MATCH_WRAPPER_TAG_NAME.toUpperCase()]);

  annotateDOM(textNodesFromDOM.walk(document.body), match);
  textNodesFromDOM.watchDOM((ns) => annotateDOM(ns, match));
  textNodesFromDOM.watchScroll((ns) => annotateDOM(ns, match));
}

export async function getIdsFromText(annotationOptions = window[GLOBAL_OPTIONS_OBJECT]) {
  const { locale, annotationVariant } = annotationOptions
  const terms = await import(locale === 'de' ? PATH_TO_DE_DE_TERMS : PATH_TO_US_EN_TERMS )
  const match = new Match(new Map(terms.default), null, {
    tag: MATCH_WRAPPER_TAG_NAME,
    getAttrs: id => `${MATCH_WRAPPER_CONTENT_ID_ATTR}="${id}" data-annotation-variant="${annotationVariant}"`
  });

  return match.extractMatchIds(document.documentElement.innerText)
}
