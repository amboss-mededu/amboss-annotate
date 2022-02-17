import { annotate, getPhrasiosFromText } from "./annotate";
import { AmbossContentCard } from '@amboss-mededu/amboss-phrasio'
import AmbossAnchor from "./anchor-custom-element";

function initAnnotation() {
  if (!window.ambossAnnotationAdaptor) window.ambossAnnotationAdaptor = {}
  if (!window.ambossAnnotationOptions) window.ambossAnnotationOptions = {}
  if (!window.ambossAnnotationOptions.Content) {
    window.ambossAnnotationOptions = {
      Content: AmbossContentCard,
      Anchor: AmbossAnchor,
      shouldAnnotate: true,
      token: '',
      offline: true,
      campaign: '',
      locale: 'unset',
      annotationVariant: 'underline',
      theme: 'light-theme',
      customBranding: 'no',
    };
  }

  if(window.customElements.get('amboss-content-card') === undefined)
    window.customElements.define('amboss-content-card', AmbossContentCard)

  if(window.customElements.get('amboss-anchor') === undefined)
    window.customElements.define('amboss-anchor', AmbossAnchor)
}

export { annotate, initAnnotation, getPhrasiosFromText };
