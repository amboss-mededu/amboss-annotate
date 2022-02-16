import { annotate, getPhrasiosFromText } from "./annotate";
import { AmbossContentCard } from '@amboss-mededu/amboss-phrasio'
import AmbossAnchor from "./anchor-custom-element";

function initAnnotation() {
  window.ambossAnnotationAdaptor = {}
  window.ambossAnnotationOptions = {}

  window.ambossAnnotationOptions = {
    Content: AmbossContentCard,
    Anchor: AmbossAnchor,
    shouldAnnotate: true,
    token: '',
    offline: true,
    campaign: '123890',
    locale: 'us',
    annotationVariant: 'underline',
    theme: 'light-theme',
    customBranding: 'no',
  };

  window.customElements.define('amboss-content-card', AmbossContentCard)
  window.customElements.define('amboss-anchor', AmbossAnchor)
}

export { annotate, initAnnotation, getPhrasiosFromText };
