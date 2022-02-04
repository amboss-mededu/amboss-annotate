export function setupMutationObserver(rootNode, annotateCB) {
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
