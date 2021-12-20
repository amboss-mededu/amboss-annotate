import {
  wrapTextContainingTerms,
  scrollThrottle,
  getTermsFromTextWithWorker,
  getTextFromVisibleTextNodes,
  getAllTextFromPage
} from "./utils";
import {setupMutationObserver} from './mutationObserver'

export async function annotate({
  annotationVariant,
  theme,
  locale,
  shouldAnnotate,
  campaign,
  customBranding,
}) {
  if (annotationVariant === "none" || !shouldAnnotate) return;
  if (!annotationVariant || !locale) throw new Error("annotate");

  let allText, wordcount;

  if (!document.getElementsByTagName("amboss-content-card").length) {
    const content = document.createElement("amboss-content-card");
    document.body.appendChild(content);
  }

  // setup mutation observer
  const { mutationObserver, rootNode, mutationConfig } = setupMutationObserver(
    document.body,
    async () => {
      allText = await getTextFromVisibleTextNodes();
      wordcount = allText.length;
      getTermsFromTextWithWorker(locale, allText, (data) => {
        wrapTextContainingTerms({
          termsForPage: data,
          locale,
          annotationVariant,
          theme,
          campaign,
          customBranding,
        })
      });
    }
  );

  // initial annotation
  async function initialAnnotation() {
    const prev = wordcount;
    const txt = await getTextFromVisibleTextNodes();
    allText = txt || allText;
    wordcount = allText.length;
    if (wordcount > 500) {
      if (prev !== wordcount) {
        getTermsFromTextWithWorker(locale, allText, (data) => {
          wrapTextContainingTerms({
            termsForPage: data,
            locale,
            annotationVariant,
            theme,
            campaign,
            customBranding
          })
        });
      } else {
        setTimeout(() => {
          mutationObserver.observe(rootNode, mutationConfig);
        }, 1000);
        clearInterval(initInt);
      }
    }
  }
  const initInt = setInterval(initialAnnotation, 200);

  // setup scroll observer
  scrollThrottle(mutationObserver, async (req) => {
    allText = await getTextFromVisibleTextNodes();
    getTermsFromTextWithWorker(locale, allText, (data) => {
    wrapTextContainingTerms({
      termsForPage: data,
      locale,
      annotationVariant,
      theme,
      campaign,
      customBranding
  });
  });
    wordcount = allText.length;
    window.cancelAnimationFrame(req);
    mutationObserver.observe(rootNode, mutationConfig);
  });

  return undefined;
}

export async function getPhrasiosFromText(
  text = getAllTextFromPage(),
  termsInText = getTermsFromTextWithWorker(text)
) {
  if (!termsInText) return []

  return await termsInText.then((res) =>
    Promise.all([...new Set(res.values())].filter(Boolean))
  )
}
