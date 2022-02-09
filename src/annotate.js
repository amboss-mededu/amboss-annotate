import {
  wrapTextContainingTerms,
  scrollThrottle,
  getTermsFromTextWithWorker,
  getTextFromVisibleTextNodes,
  getAllTextFromPage,
  getPhrasioIdsFromTextWithWorker
} from "./utils";
import {setupMutationObserver} from './mutationObserver'

export async function annotate(ambossAnnotationOptions = window.ambossAnnotationOptions) {
  const {
    annotationVariant,
    locale,
    shouldAnnotate,
  } = ambossAnnotationOptions
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
    });
  });
    wordcount = allText.length;
    window.cancelAnimationFrame(req);
    mutationObserver.observe(rootNode, mutationConfig);
  });

  return undefined;
}

function cbFunctionWrapper(text) {
  return new Promise((resolve) => {
    getPhrasioIdsFromTextWithWorker(window.ambossAnnotationOptions.locale, text, (data) => resolve(data));
  });
}

export async function getPhrasiosFromText(
  text = getAllTextFromPage()
) {
  if (!text) return []
  const listOfPhrasioIds = await cbFunctionWrapper(text)
  return listOfPhrasioIds
}
