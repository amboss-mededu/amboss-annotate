import {
  wrapTextContainingTerms,
  scrollThrottle,
  getTermsFromText,
  getTextFromVisibleTextNodes,
  getAllTextFromPage
} from "./utils";

function setupMutationObserver(rootNode, annotateCB) {
  function mutationCB(mutations, observer) {
    for (const mutation of mutations) {
      if (
        mutation.type === "childList" &&
        mutation.addedNodes[0] &&
        mutation.addedNodes[0].nodeName !== "AMBOSS-ANCHOR" &&
        mutation.previousSibling &&
        mutation.previousSibling.nodeName !== "AMBOSS-ANCHOR"
      ) {
        annotateCB();
      }

      if (
        mutation.type === "attributes" &&
        mutation.target.nodeName !== "amboss-content-card"
      ) {
        annotateCB();
      }
    }
  }

  const mutationObserver = new MutationObserver(mutationCB);
  const mutationConfig = {
    attributes: true,
    attributeFilter: ["style"],
    childList: true,
    characterData: false,
    subtree: true,
  };

  return { mutationObserver, rootNode, mutationConfig };
}

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

  let allText, wordcount, allTermsForWholePage;

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
      allTermsForWholePage = await getTermsFromText(allText);
      await wrapTextContainingTerms({
        termsForPage: allTermsForWholePage,
        locale,
        annotationVariant,
        theme,
        campaign,
        customBranding
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
        allTermsForWholePage = await getTermsFromText(allText);
        await wrapTextContainingTerms({
          termsForPage: allTermsForWholePage,
          locale,
          annotationVariant,
          theme,
          campaign,
          customBranding
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
    allTermsForWholePage = await getTermsFromText(allText);
    await wrapTextContainingTerms({
      termsForPage: allTermsForWholePage,
      locale,
      annotationVariant,
      theme,
      campaign,
      customBranding
  });
    wordcount = allText.length;
    window.cancelAnimationFrame(req);
    mutationObserver.observe(rootNode, mutationConfig);
  });

  return undefined;
}

export async function getPhrasiosFromText(
  text = getAllTextFromPage(),
  termsInText = getTermsFromText(text)
) {
  if (!termsInText) return []

  return await termsInText.then((res) =>
    Promise.all([...new Set(res.values())].filter(Boolean))
  )
}
