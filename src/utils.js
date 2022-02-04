import throttle from "lodash.throttle";

// Set up worker
const myWorker = new Worker("src/worker.js", {type: 'module'});

export const getTermsFromTextWithWorker = (locale, text, cb) => {
  myWorker.postMessage(['getTermsFromText', { locale, text }])

  myWorker.onmessage = function(e) {
    console.log("Message received from worker", e.data[0]);
    if (e.data[0] === 'gotTermsFromText') {
      cb(e.data[1])
    }
  };
}

function isTextNodeInViewport(n, range) {
  const r = range.getBoundingClientRect();
  return (
    !!r &&
    r.width > 0 &&
    r.height > 0 &&
    r.bottom >= 0 &&
    r.right >= 0 &&
    r.top <= document.documentElement.clientHeight &&
    r.left <= document.documentElement.clientWidth
  );
}

function relDiff(a, b) {
  return 100 * Math.abs((a - b) / ((a + b) / 2));
}

export function scrollThrottle(mutObs, cb) {
  let lastKnownScrollPosition = 0;

  function scrollHandler() {
    const prev = lastKnownScrollPosition;
    lastKnownScrollPosition = window.scrollY;
    const diff = relDiff(prev, lastKnownScrollPosition);
    if (diff < 0.5) return;
    mutObs.disconnect();
    window.requestAnimationFrame(cb);
  }

  // if you don't include 'true' as the 3rd arg it will not work on many evil sites
  document.addEventListener("scroll", throttle(scrollHandler, 500), true);
}

// setup regex variables to use in walkerFilter
const nodeReg =
  /(head|script|style|meta|noscript|input|img|svg|cite|button|path|d|defs)/i;
const elReg = /(amboss-)/i;
function getAllVisibleTextNodes(n = document.body) {
  // setup range variable to use in walkerFilter
  const range = document.createRange();

  let outside = 0;

  function walkerFilter(node) {
    range.selectNode(node);
    const a = isTextNodeInViewport(node, range);
    const b = !nodeReg.test(node.parentNode.tagName);
    const c = !elReg.test(node.parentElement.tagName);
    // const d = !node.parentElement.classList.value.includes('amboss-ignore')
    // const e = !node.parentNode.hidden
    const f = node.textContent.trim().length > 3;
    const shouldAccept = a && b && c && f;

    if (!a) outside++;
    if (a) outside = 0;
    if (shouldAccept && outside < 50) {
      return NodeFilter.FILTER_ACCEPT;
    } else {
      return NodeFilter.FILTER_REJECT;
    }
  }

  const walker = n.ownerDocument.createTreeWalker(n, NodeFilter.SHOW_TEXT, walkerFilter);
  const textNodes = [];

  while (outside < 50 && walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  range.detach();
  return textNodes;
}

function wrapTextNode(node, regex, contentId) {
  if (!node || !regex || !contentId)
    throw new Error("wrapTextNode");
  if (node.parentElement.classList.value.includes("amboss-ignore")) return;

  const parentNode = node.parentNode;
  const nextSibling = node.nextSibling;
  const doc = node.ownerDocument;
  let hits;

  if (regex.global) {
    while (node && (hits = regex.exec(node.nodeValue))) {
      regex.lastIndex = 0;
      node = handleResult(node, hits, contentId);
    }
  } else if ((hits = regex.exec(node.nodeValue))) {
    handleResult(node, hits, contentId);
  }

  function handleResult(node, hits, contentId) {
    // store the original text from the node
    const orig = node.nodeValue;

    // todo: use newNode = textNode.splitText(offset) ??
    // replace the text in the node with the text that comes before the match
    node.nodeValue = orig.slice(0, hits.index);

    const anchor = doc.createElement("amboss-anchor");
    anchor.setAttribute("data-content-id", contentId);
    anchor.setAttribute("data-annotation-variant", window.ambossAnnotationOptions.annotationVariant);
    anchor.appendChild(doc.createTextNode(hits[0]));

    // insert amboss-anchor before the next sibling of the text node
    parentNode.insertBefore(anchor, nextSibling);

    // delete text from the beginning of the match for the length of the match (ie delete the matched text)
    const rest = orig.slice(hits.index + hits[0].length);

    // if there is text in 'rest' insert it before the next sibling of the text node
    const result =
      rest && parentNode.insertBefore(doc.createTextNode(rest), nextSibling);

    // return node to continue parsing if there are more than 4 chars (w/o whitespace) after the amboss-anchor
    if (rest.trim().length > 4) return result;
  }
}

export function getTextFromVisibleTextNodes() {
  return Array.from(getAllVisibleTextNodes())
    .reduce((acc, cur) => acc + cur.textContent + " ", " ")
    .replaceAll("/", " ")
    .toUpperCase();
}

export function wrapTextContainingTerms({
  termsForPage,
  locale,
  allVisibleTextNodes = getAllVisibleTextNodes()
}) {
  if (!termsForPage || !locale || !allVisibleTextNodes)
    throw new Error("wrapTextContainingTerms");

  termsForPage.forEach((k, v) => {
    const matcher =
      locale === "us"
        ? new RegExp(`(?<=^|[\\n "/])(${v})(s|es|'s)?(?=$|[\\n /,.:;"])`, "gi")
        : new RegExp(`(?<=^|[\\n "/])(${v})(?=$|[\\n /,.:;"])`, "gi");

    // todo: may need to put this in a `while` to ensure all matches are collected, if wrapping the nodes directly
    allVisibleTextNodes.forEach((n) => {
      if (matcher.test(n.nodeValue)) {
        // https://stackoverflow.com/questions/1520800/why-does-a-regexp-with-global-flag-give-wrong-results
        matcher.lastIndex = 0;
        wrapTextNode(n, matcher, k);
      }
    });
  });
}

export function getAllTextFromPage() {
  let text = document.documentElement.innerText.replace(/\d\d:\d\d:\d\d/, '')
  // el.innerText seems to return '' for shadowdom
  // @todo ??????
  Array.from(document.getElementsByTagName('AMBOSS-ANCHOR')).forEach((el) => (text += ` ${el.textContent}`))
  return text.replaceAll('/', ' ').toUpperCase()
}
