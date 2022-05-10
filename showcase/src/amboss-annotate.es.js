var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var FUNC_ERROR_TEXT = "Expected a function";
var NAN = 0 / 0;
var symbolTag = "[object Symbol]";
var reTrim = /^\s+|\s+$/g;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function("return this")();
var objectProto = Object.prototype;
var objectToString = objectProto.toString;
var nativeMax = Math.max, nativeMin = Math.min;
var now = function() {
  return root.Date.now();
};
function debounce$1(func, wait, options) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    var args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result2 = wait - timeSinceLastCall;
    return maxing ? nativeMin(result2, maxWait - timeSinceLastInvoke) : result2;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now());
  }
  function debounced() {
    var time = now(), isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
function throttle(func, wait, options) {
  var leading = true, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = "leading" in options ? !!options.leading : leading;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  return debounce$1(func, wait, {
    "leading": leading,
    "maxWait": wait,
    "trailing": trailing
  });
}
function isObject(value) {
  var type = typeof value;
  return !!value && (type == "object" || type == "function");
}
function isObjectLike(value) {
  return !!value && typeof value == "object";
}
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, "");
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var lodash_throttle = throttle;
const blob$1 = typeof window !== "undefined" && window.Blob && new Blob([atob(encodedJs$1)], { type: "text/javascript;charset=utf-8" });
function WorkerWrapper$1() {
  const objURL = blob$1 && (window.URL || window.webkitURL).createObjectURL(blob$1);
  try {
    return objURL ? new Worker(objURL) : new Worker("data:application/javascript;base64," + encodedJs$1, { type: "module" });
  } finally {
    objURL && (window.URL || window.webkitURL).revokeObjectURL(objURL);
  }
}
const encodedJs = "KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2FzeW5jIGZ1bmN0aW9uIGgobyxhLGkscyl7aWYoYSE9PSJkZSImJmEhPT0idXMifHwhaSlyZXR1cm47ZnVuY3Rpb24gdSh7cGFydGljbGVFaWQ6dCxhcnRpY2xlRWlkOm4sdGl0bGU6cixsb2NhbGU6YyxjYW1wYWlnbjpkfSl7Y29uc3QgZT1sPT5sLnJlcGxhY2UoLyAvZywiXyIpLGY9YD91dG1fY2FtcGFpZ249JHtkfSZ1dG1fdGVybT0keyhsPT5lbmNvZGVVUklDb21wb25lbnQoZShsKSkucmVwbGFjZSgvWyEnKCkqXS9nLGc9PiIlIitnLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKSkocil9YCx5PXQ/YCMke3R9YDoiIjtyZXR1cm5gaHR0cHM6Ly9uZXh0LmFtYm9zcy5jb20vJHtjfS9hcnRpY2xlLyR7bn0ke2Z9JHt5fWB9ZnVuY3Rpb24gcCh0LG4scil7Y29uc3QgYz1BcnJheS5pc0FycmF5KHQuZGVzdGluYXRpb25zKT90LmRlc3RpbmF0aW9uczpbXSxkPUFycmF5LmlzQXJyYXkodC5tZWRpYSk/dC5tZWRpYTpbXTtyZXR1cm57dGl0bGU6dC50aXRsZXx8IiIsc3VidGl0bGU6dC50cmFuc2xhdGlvbnx8IiIsYm9keTp0LmFic3RyYWN0fHwiIixtZWRpYTpkLm1hcChlPT4oe2VpZDplLmVpZCxjb3B5cmlnaHQ6ZS5jb3B5cmlnaHQuaHRtbCx0aXRsZTplLnRpdGxlLGhyZWY6ZS5jYW5vbmljYWxVcmx9KSksZGVzdGluYXRpb25zOmMubWFwKGU9Pih7bGFiZWw6ZS5sYWJlbCxocmVmOnUoe3BhcnRpY2xlRWlkOmUucGFydGljbGVFaWR8fCIiLGFydGljbGVFaWQ6ZS5hcnRpY2xlRWlkfHwiIix0aXRsZTp0LnRpdGxlfHwiIixsb2NhbGU6bixjYW1wYWlnbjpyfSl9KSl9fWNvbnN0IG09YHsicXVlcnkiOiJ7cGhyYXNlR3JvdXAoZWlkOiBcXCIke2l9XFwiKSB7dGl0bGVcXG5hYnN0cmFjdFxcbnRyYW5zbGF0aW9uXFxuZGVzdGluYXRpb25zIHtcXG5sYWJlbFxcbmFydGljbGVFaWRcXG5wYXJ0aWNsZUVpZH1cXG5tZWRpYSB7XFxudGl0bGVcXG5laWRcXG5jYW5vbmljYWxVcmxcXG5jb3B5cmlnaHQge1xcbmh0bWx9fX19In1gO3JldHVybih0PT5mZXRjaChgaHR0cHM6Ly93d3cubGFiYW1ib3NzLmNvbS8ke2F9L2FwaS9ncmFwaHFsYCx7bWV0aG9kOiJQT1NUIixoZWFkZXJzOnsiQ29udGVudC1UeXBlIjoiYXBwbGljYXRpb24vanNvbiIsYXV0aG9yaXphdGlvbjpgQmVhcmVyICR7b31gfSxib2R5OnR9KSkobSkudGhlbihhc3luYyB0PT57Y29uc3R7ZGF0YTpuLGVycm9yczpyfT1hd2FpdCB0Lmpzb24oKTtpZighQXJyYXkuaXNBcnJheShyKSYmbiYmbi5waHJhc2VHcm91cClyZXR1cm4gcChuLnBocmFzZUdyb3VwLGEscyk7aWYobj09PW51bGwpe2NvbnNvbGUuZXJyb3Iocik7cmV0dXJufX0pLmNhdGNoKGNvbnNvbGUuZXJyb3IpfXNlbGYuYWRkRXZlbnRMaXN0ZW5lcigibWVzc2FnZSIsYXN5bmMgbz0+e2NvbnN0W2EsaV09by5kYXRhO2lmKGE9PT0iZ2V0UGhyYXNpb1dpdGhJZEZyb21BcGkiKXtjb25zdCBzPWF3YWl0IGgoaS50b2tlbixpLmxvY2FsZSxpLmNvbnRlbnRJZCxpLmNhbXBhaWduKTtwb3N0TWVzc2FnZShbImdvdFBocmFzaW9XaXRoSWQiLHNdKX19KX0pKCk7Cg==";
const blob = typeof window !== "undefined" && window.Blob && new Blob([atob(encodedJs)], { type: "text/javascript;charset=utf-8" });
function WorkerWrapper() {
  const objURL = blob && (window.URL || window.webkitURL).createObjectURL(blob);
  try {
    return objURL ? new Worker(objURL) : new Worker("data:application/javascript;base64," + encodedJs, { type: "module" });
  } finally {
    objURL && (window.URL || window.webkitURL).revokeObjectURL(objURL);
  }
}
const myWebWorker = new WorkerWrapper$1();
const myServiceWorker = new WorkerWrapper();
const getTermsFromTextWithWorker = (locale, text, cb) => {
  myWebWorker.postMessage(["getTermsFromText", { locale, text }]);
  myWebWorker.onmessage = function(e2) {
    if (e2.data[0] === "gotTermsFromText") {
      cb(e2.data[1]);
    }
  };
};
async function track(trackingProperties) {
  console.info("annotation adaptor track", trackingProperties);
}
function getPhrasioIdsFromTextWithWorkerPromiseWrapper(text) {
  return new Promise((resolve) => {
    getPhrasioIdsFromTextWithServiceWorker(window.annotationOptions.locale, text, (data) => resolve(data));
  });
}
const getPhrasioIdsFromTextWithServiceWorker = (locale, text, cb) => {
  myServiceWorker.postMessage(["getPhrasioIdsFromText", { locale, text }]);
  myServiceWorker.onmessage = function(e2) {
    if (e2.data[0] === "gotPhrasioIdsFromText") {
      cb(e2.data[1]);
    }
  };
};
function getPhrasioWithIdFromWorkerPromiseWrapper(contentId) {
  return new Promise((resolve) => {
    getPhrasioWithIdFromServiceWorker(window.annotationOptions.token, window.annotationOptions.locale, contentId, window.annotationOptions.campaign, (data) => resolve(data));
  });
}
const getPhrasioWithIdFromServiceWorker = (token, locale, contentId, campaign, cb) => {
  myServiceWorker.postMessage(["getPhrasioWithIdFromApi", { token, locale, contentId, campaign }]);
  myServiceWorker.onmessage = function(e2) {
    if (e2.data[0] === "gotPhrasioWithId") {
      cb(e2.data[1]);
    }
  };
};
function isTextNodeInViewport(n2, range2) {
  const r2 = range2.getBoundingClientRect();
  return !!r2 && r2.width > 0 && r2.height > 0 && r2.bottom >= 0 && r2.right >= 0 && r2.top <= document.documentElement.clientHeight && r2.left <= document.documentElement.clientWidth;
}
function relDiff(a2, b2) {
  return 100 * Math.abs((a2 - b2) / ((a2 + b2) / 2));
}
function scrollThrottle(mutObs, cb) {
  let lastKnownScrollPosition = 0;
  function scrollHandler() {
    const prev = lastKnownScrollPosition;
    lastKnownScrollPosition = window.scrollY;
    const diff = relDiff(prev, lastKnownScrollPosition);
    if (diff < 0.5)
      return;
    mutObs.disconnect();
    window.requestAnimationFrame(cb);
  }
  document.addEventListener("scroll", lodash_throttle(scrollHandler, 500), true);
}
const nodeReg = /(head|script|style|meta|noscript|input|img|svg|cite|button|path|d|defs)/i;
const range = document.createRange();
function walkerFilter(node) {
  range.selectNode(node);
  const a2 = isTextNodeInViewport(node, range);
  const b2 = !nodeReg.test(node.parentNode.tagName);
  const c2 = node.textContent.trim().length > 3;
  const d2 = !node.parentElement.classList.value.includes("amboss-ignore");
  const shouldAccept = a2 && b2 && c2 && d2;
  if (shouldAccept)
    return NodeFilter.FILTER_ACCEPT;
  return NodeFilter.FILTER_REJECT;
}
async function getVisibleTextNodes(n2 = document.body) {
  const walker = n2.ownerDocument.createTreeWalker(n2, NodeFilter.SHOW_TEXT, walkerFilter);
  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }
  range.detach();
  return textNodes;
}
function handleResult(node, hits, contentId, parentNode, nextSibling, doc) {
  const orig = node.nodeValue;
  node.nodeValue = orig.slice(0, hits.index);
  const anchor = doc.createElement("amboss-anchor");
  anchor.setAttribute("data-content-id", contentId);
  anchor.setAttribute("data-annotation-variant", window.annotationOptions.annotationVariant);
  anchor.appendChild(doc.createTextNode(hits[0]));
  parentNode.insertBefore(anchor, nextSibling);
  const rest = orig.slice(hits.index + hits[0].length);
  const result = rest && parentNode.insertBefore(doc.createTextNode(rest), nextSibling);
  if (rest.trim().length > 4)
    return result;
}
function wrapTextNode(node, regex, contentId) {
  if (!node || !regex || !contentId)
    throw new Error("wrapTextNode");
  if (node.parentElement.classList.value.includes("amboss-ignore"))
    return;
  const parentNode = node.parentNode;
  const nextSibling = node.nextSibling;
  const doc = node.ownerDocument;
  let hits;
  if (regex.global) {
    while (node && (hits = regex.exec(node.nodeValue))) {
      regex.lastIndex = 0;
      node = handleResult(node, hits, contentId, parentNode, nextSibling, doc);
    }
  } else if (hits = regex.exec(node.nodeValue)) {
    handleResult(node, hits, contentId, parentNode, nextSibling, doc);
  }
}
function getTextFromVisibleTextNodes(textNodes) {
  return Array.from(textNodes).reduce((acc, cur) => acc + cur.textContent + " ", " ").replaceAll("/", " ").toUpperCase();
}
function wrapTextContainingTerms({
  termsForPage,
  locale,
  textNodes
}) {
  if (!termsForPage || !locale || !textNodes)
    throw new Error("wrapTextContainingTerms");
  termsForPage.forEach((k2, v2) => {
    const matcher = locale === "us" ? new RegExp(`(?<=^|[\\n "/])(${v2})(s|es|'s)?(?=$|[\\n /,.:;"])`, "gi") : new RegExp(`(?<=^|[\\n "/])(${v2})(?=$|[\\n /,.:;"])`, "gi");
    textNodes.forEach((n2) => {
      if (matcher.test(n2.nodeValue)) {
        matcher.lastIndex = 0;
        wrapTextNode(n2, matcher, k2);
      }
    });
  });
}
function getAllTextFromPage() {
  let text = document.documentElement.innerText.replace(/\d\d:\d\d:\d\d/, "");
  Array.from(document.getElementsByTagName("AMBOSS-ANCHOR")).forEach((el) => text += ` ${el.textContent}`);
  return text.replaceAll("/", " ").toUpperCase();
}
function setupMutationObserver(rootNode, annotateCB) {
  function mutationCB(mutations, observer) {
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes[0] && mutation.addedNodes[0].nodeName !== "AMBOSS-ANCHOR" && mutation.previousSibling && mutation.previousSibling.nodeName !== "AMBOSS-ANCHOR" && mutation.previousSibling.nodeName !== "AMBOSS-CONTENT-CARD") {
        annotateCB(mutation.addedNodes);
      }
      if (mutation.type === "attributes" && mutation.target.nodeName !== "AMBOSS-ANCHOR" && mutation.target.nodeName !== "AMBOSS-CONTENT-CARD") {
        annotateCB([mutation.target]);
      }
    }
  }
  const mutationObserver = new MutationObserver(mutationCB);
  const mutationConfig = {
    attributes: true,
    attributeFilter: ["style"],
    childList: true,
    characterData: false,
    subtree: true
  };
  return { mutationObserver, rootNode, mutationConfig };
}
async function annotate(annotationOptions = window.annotationOptions) {
  const {
    annotationVariant,
    locale,
    shouldAnnotate
  } = annotationOptions;
  if (annotationVariant === "none" || !shouldAnnotate)
    return;
  if (!annotationVariant || !locale)
    throw new Error("annotate");
  let allText, wordcount;
  if (!document.getElementsByTagName("amboss-content-card").length) {
    const content = document.createElement("amboss-content-card");
    document.body.appendChild(content);
  }
  const { mutationObserver, rootNode, mutationConfig } = setupMutationObserver(document.body, async (textNodes) => {
    const textNodesToParse = textNodes || await getVisibleTextNodes();
    allText = await getTextFromVisibleTextNodes(textNodesToParse);
    wordcount = allText.length;
    getTermsFromTextWithWorker(locale, allText, (data) => {
      wrapTextContainingTerms({
        termsForPage: data,
        locale,
        textNodes
      });
    });
  });
  async function initialAnnotation() {
    const prev = wordcount;
    const textNodes = await getVisibleTextNodes();
    const txt = await getTextFromVisibleTextNodes(textNodes);
    allText = txt || allText;
    wordcount = allText.length;
    if (wordcount > 500) {
      if (prev !== wordcount) {
        getTermsFromTextWithWorker(locale, allText, (data) => {
          wrapTextContainingTerms({
            termsForPage: data,
            locale,
            textNodes
          });
        });
      } else {
        setTimeout(() => {
          mutationObserver.observe(rootNode, mutationConfig);
        }, 1e3);
        clearInterval(initInt);
      }
    }
  }
  const initInt = setInterval(initialAnnotation, 200);
  scrollThrottle(mutationObserver, async (requestedAnimationFrame) => {
    const textNodes = await getVisibleTextNodes();
    const txt = await getTextFromVisibleTextNodes(textNodes);
    getTermsFromTextWithWorker(locale, txt, (data) => {
      wrapTextContainingTerms({
        termsForPage: data,
        locale,
        textNodes
      });
    });
    wordcount = allText.length;
    window.cancelAnimationFrame(requestedAnimationFrame);
    mutationObserver.observe(rootNode, mutationConfig);
  });
  return void 0;
}
async function getPhrasiosFromText(text = getAllTextFromPage()) {
  if (!text)
    return [];
  const listOfPhrasioIds = await getPhrasioIdsFromTextWithWorkerPromiseWrapper(text);
  return listOfPhrasioIds;
}
var n, l$1, u$1, i$1, t$1, r$2, o$1, f$1, e$2 = {}, c$1 = [], s$1 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
function a$1(n2, l2) {
  for (var u2 in l2)
    n2[u2] = l2[u2];
  return n2;
}
function h$1(n2) {
  var l2 = n2.parentNode;
  l2 && l2.removeChild(n2);
}
function v$1(l2, u2, i2) {
  var t2, r2, o2, f2 = {};
  for (o2 in u2)
    o2 == "key" ? t2 = u2[o2] : o2 == "ref" ? r2 = u2[o2] : f2[o2] = u2[o2];
  if (arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : i2), typeof l2 == "function" && l2.defaultProps != null)
    for (o2 in l2.defaultProps)
      f2[o2] === void 0 && (f2[o2] = l2.defaultProps[o2]);
  return y$1(l2, f2, t2, r2, null);
}
function y$1(n2, i2, t2, r2, o2) {
  var f2 = { type: n2, props: i2, key: t2, ref: r2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: o2 == null ? ++u$1 : o2 };
  return o2 == null && l$1.vnode != null && l$1.vnode(f2), f2;
}
function p$1() {
  return { current: null };
}
function d$1(n2) {
  return n2.children;
}
function _$2(n2, l2) {
  this.props = n2, this.context = l2;
}
function k$2(n2, l2) {
  if (l2 == null)
    return n2.__ ? k$2(n2.__, n2.__.__k.indexOf(n2) + 1) : null;
  for (var u2; l2 < n2.__k.length; l2++)
    if ((u2 = n2.__k[l2]) != null && u2.__e != null)
      return u2.__e;
  return typeof n2.type == "function" ? k$2(n2) : null;
}
function b$1(n2) {
  var l2, u2;
  if ((n2 = n2.__) != null && n2.__c != null) {
    for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++)
      if ((u2 = n2.__k[l2]) != null && u2.__e != null) {
        n2.__e = n2.__c.base = u2.__e;
        break;
      }
    return b$1(n2);
  }
}
function m$1(n2) {
  (!n2.__d && (n2.__d = true) && t$1.push(n2) && !g$2.__r++ || o$1 !== l$1.debounceRendering) && ((o$1 = l$1.debounceRendering) || r$2)(g$2);
}
function g$2() {
  for (var n2; g$2.__r = t$1.length; )
    n2 = t$1.sort(function(n3, l2) {
      return n3.__v.__b - l2.__v.__b;
    }), t$1 = [], n2.some(function(n3) {
      var l2, u2, i2, t2, r2, o2;
      n3.__d && (r2 = (t2 = (l2 = n3).__v).__e, (o2 = l2.__P) && (u2 = [], (i2 = a$1({}, t2)).__v = t2.__v + 1, j$2(o2, t2, i2, l2.__n, o2.ownerSVGElement !== void 0, t2.__h != null ? [r2] : null, u2, r2 == null ? k$2(t2) : r2, t2.__h), z$1(u2, t2), t2.__e != r2 && b$1(t2)));
    });
}
function w$2(n2, l2, u2, i2, t2, r2, o2, f2, s2, a2) {
  var h2, v2, p2, _2, b2, m2, g2, w2 = i2 && i2.__k || c$1, A2 = w2.length;
  for (u2.__k = [], h2 = 0; h2 < l2.length; h2++)
    if ((_2 = u2.__k[h2] = (_2 = l2[h2]) == null || typeof _2 == "boolean" ? null : typeof _2 == "string" || typeof _2 == "number" || typeof _2 == "bigint" ? y$1(null, _2, null, null, _2) : Array.isArray(_2) ? y$1(d$1, { children: _2 }, null, null, null) : _2.__b > 0 ? y$1(_2.type, _2.props, _2.key, null, _2.__v) : _2) != null) {
      if (_2.__ = u2, _2.__b = u2.__b + 1, (p2 = w2[h2]) === null || p2 && _2.key == p2.key && _2.type === p2.type)
        w2[h2] = void 0;
      else
        for (v2 = 0; v2 < A2; v2++) {
          if ((p2 = w2[v2]) && _2.key == p2.key && _2.type === p2.type) {
            w2[v2] = void 0;
            break;
          }
          p2 = null;
        }
      j$2(n2, _2, p2 = p2 || e$2, t2, r2, o2, f2, s2, a2), b2 = _2.__e, (v2 = _2.ref) && p2.ref != v2 && (g2 || (g2 = []), p2.ref && g2.push(p2.ref, null, _2), g2.push(v2, _2.__c || b2, _2)), b2 != null ? (m2 == null && (m2 = b2), typeof _2.type == "function" && _2.__k === p2.__k ? _2.__d = s2 = x$2(_2, s2, n2) : s2 = P$1(n2, _2, p2, w2, b2, s2), typeof u2.type == "function" && (u2.__d = s2)) : s2 && p2.__e == s2 && s2.parentNode != n2 && (s2 = k$2(p2));
    }
  for (u2.__e = m2, h2 = A2; h2--; )
    w2[h2] != null && (typeof u2.type == "function" && w2[h2].__e != null && w2[h2].__e == u2.__d && (u2.__d = k$2(i2, h2 + 1)), N$1(w2[h2], w2[h2]));
  if (g2)
    for (h2 = 0; h2 < g2.length; h2++)
      M$1(g2[h2], g2[++h2], g2[++h2]);
}
function x$2(n2, l2, u2) {
  for (var i2, t2 = n2.__k, r2 = 0; t2 && r2 < t2.length; r2++)
    (i2 = t2[r2]) && (i2.__ = n2, l2 = typeof i2.type == "function" ? x$2(i2, l2, u2) : P$1(u2, i2, i2, t2, i2.__e, l2));
  return l2;
}
function A$2(n2, l2) {
  return l2 = l2 || [], n2 == null || typeof n2 == "boolean" || (Array.isArray(n2) ? n2.some(function(n3) {
    A$2(n3, l2);
  }) : l2.push(n2)), l2;
}
function P$1(n2, l2, u2, i2, t2, r2) {
  var o2, f2, e2;
  if (l2.__d !== void 0)
    o2 = l2.__d, l2.__d = void 0;
  else if (u2 == null || t2 != r2 || t2.parentNode == null)
    n:
      if (r2 == null || r2.parentNode !== n2)
        n2.appendChild(t2), o2 = null;
      else {
        for (f2 = r2, e2 = 0; (f2 = f2.nextSibling) && e2 < i2.length; e2 += 2)
          if (f2 == t2)
            break n;
        n2.insertBefore(t2, r2), o2 = r2;
      }
  return o2 !== void 0 ? o2 : t2.nextSibling;
}
function C$1(n2, l2, u2, i2, t2) {
  var r2;
  for (r2 in u2)
    r2 === "children" || r2 === "key" || r2 in l2 || H$1(n2, r2, null, u2[r2], i2);
  for (r2 in l2)
    t2 && typeof l2[r2] != "function" || r2 === "children" || r2 === "key" || r2 === "value" || r2 === "checked" || u2[r2] === l2[r2] || H$1(n2, r2, l2[r2], u2[r2], i2);
}
function $$1(n2, l2, u2) {
  l2[0] === "-" ? n2.setProperty(l2, u2) : n2[l2] = u2 == null ? "" : typeof u2 != "number" || s$1.test(l2) ? u2 : u2 + "px";
}
function H$1(n2, l2, u2, i2, t2) {
  var r2;
  n:
    if (l2 === "style")
      if (typeof u2 == "string")
        n2.style.cssText = u2;
      else {
        if (typeof i2 == "string" && (n2.style.cssText = i2 = ""), i2)
          for (l2 in i2)
            u2 && l2 in u2 || $$1(n2.style, l2, "");
        if (u2)
          for (l2 in u2)
            i2 && u2[l2] === i2[l2] || $$1(n2.style, l2, u2[l2]);
      }
    else if (l2[0] === "o" && l2[1] === "n")
      r2 = l2 !== (l2 = l2.replace(/Capture$/, "")), l2 = l2.toLowerCase() in n2 ? l2.toLowerCase().slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + r2] = u2, u2 ? i2 || n2.addEventListener(l2, r2 ? T$2 : I$1, r2) : n2.removeEventListener(l2, r2 ? T$2 : I$1, r2);
    else if (l2 !== "dangerouslySetInnerHTML") {
      if (t2)
        l2 = l2.replace(/xlink[H:h]/, "h").replace(/sName$/, "s");
      else if (l2 !== "href" && l2 !== "list" && l2 !== "form" && l2 !== "tabIndex" && l2 !== "download" && l2 in n2)
        try {
          n2[l2] = u2 == null ? "" : u2;
          break n;
        } catch (n3) {
        }
      typeof u2 == "function" || (u2 != null && (u2 !== false || l2[0] === "a" && l2[1] === "r") ? n2.setAttribute(l2, u2) : n2.removeAttribute(l2));
    }
}
function I$1(n2) {
  this.l[n2.type + false](l$1.event ? l$1.event(n2) : n2);
}
function T$2(n2) {
  this.l[n2.type + true](l$1.event ? l$1.event(n2) : n2);
}
function j$2(n2, u2, i2, t2, r2, o2, f2, e2, c2) {
  var s2, h2, v2, y2, p2, k2, b2, m2, g2, x2, A2, P2 = u2.type;
  if (u2.constructor !== void 0)
    return null;
  i2.__h != null && (c2 = i2.__h, e2 = u2.__e = i2.__e, u2.__h = null, o2 = [e2]), (s2 = l$1.__b) && s2(u2);
  try {
    n:
      if (typeof P2 == "function") {
        if (m2 = u2.props, g2 = (s2 = P2.contextType) && t2[s2.__c], x2 = s2 ? g2 ? g2.props.value : s2.__ : t2, i2.__c ? b2 = (h2 = u2.__c = i2.__c).__ = h2.__E : ("prototype" in P2 && P2.prototype.render ? u2.__c = h2 = new P2(m2, x2) : (u2.__c = h2 = new _$2(m2, x2), h2.constructor = P2, h2.render = O$1), g2 && g2.sub(h2), h2.props = m2, h2.state || (h2.state = {}), h2.context = x2, h2.__n = t2, v2 = h2.__d = true, h2.__h = []), h2.__s == null && (h2.__s = h2.state), P2.getDerivedStateFromProps != null && (h2.__s == h2.state && (h2.__s = a$1({}, h2.__s)), a$1(h2.__s, P2.getDerivedStateFromProps(m2, h2.__s))), y2 = h2.props, p2 = h2.state, v2)
          P2.getDerivedStateFromProps == null && h2.componentWillMount != null && h2.componentWillMount(), h2.componentDidMount != null && h2.__h.push(h2.componentDidMount);
        else {
          if (P2.getDerivedStateFromProps == null && m2 !== y2 && h2.componentWillReceiveProps != null && h2.componentWillReceiveProps(m2, x2), !h2.__e && h2.shouldComponentUpdate != null && h2.shouldComponentUpdate(m2, h2.__s, x2) === false || u2.__v === i2.__v) {
            h2.props = m2, h2.state = h2.__s, u2.__v !== i2.__v && (h2.__d = false), h2.__v = u2, u2.__e = i2.__e, u2.__k = i2.__k, u2.__k.forEach(function(n3) {
              n3 && (n3.__ = u2);
            }), h2.__h.length && f2.push(h2);
            break n;
          }
          h2.componentWillUpdate != null && h2.componentWillUpdate(m2, h2.__s, x2), h2.componentDidUpdate != null && h2.__h.push(function() {
            h2.componentDidUpdate(y2, p2, k2);
          });
        }
        h2.context = x2, h2.props = m2, h2.state = h2.__s, (s2 = l$1.__r) && s2(u2), h2.__d = false, h2.__v = u2, h2.__P = n2, s2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s, h2.getChildContext != null && (t2 = a$1(a$1({}, t2), h2.getChildContext())), v2 || h2.getSnapshotBeforeUpdate == null || (k2 = h2.getSnapshotBeforeUpdate(y2, p2)), A2 = s2 != null && s2.type === d$1 && s2.key == null ? s2.props.children : s2, w$2(n2, Array.isArray(A2) ? A2 : [A2], u2, i2, t2, r2, o2, f2, e2, c2), h2.base = u2.__e, u2.__h = null, h2.__h.length && f2.push(h2), b2 && (h2.__E = h2.__ = null), h2.__e = false;
      } else
        o2 == null && u2.__v === i2.__v ? (u2.__k = i2.__k, u2.__e = i2.__e) : u2.__e = L$1(i2.__e, u2, i2, t2, r2, o2, f2, c2);
    (s2 = l$1.diffed) && s2(u2);
  } catch (n3) {
    u2.__v = null, (c2 || o2 != null) && (u2.__e = e2, u2.__h = !!c2, o2[o2.indexOf(e2)] = null), l$1.__e(n3, u2, i2);
  }
}
function z$1(n2, u2) {
  l$1.__c && l$1.__c(u2, n2), n2.some(function(u3) {
    try {
      n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
        n3.call(u3);
      });
    } catch (n3) {
      l$1.__e(n3, u3.__v);
    }
  });
}
function L$1(l2, u2, i2, t2, r2, o2, f2, c2) {
  var s2, a2, v2, y2 = i2.props, p2 = u2.props, d2 = u2.type, _2 = 0;
  if (d2 === "svg" && (r2 = true), o2 != null) {
    for (; _2 < o2.length; _2++)
      if ((s2 = o2[_2]) && "setAttribute" in s2 == !!d2 && (d2 ? s2.localName === d2 : s2.nodeType === 3)) {
        l2 = s2, o2[_2] = null;
        break;
      }
  }
  if (l2 == null) {
    if (d2 === null)
      return document.createTextNode(p2);
    l2 = r2 ? document.createElementNS("http://www.w3.org/2000/svg", d2) : document.createElement(d2, p2.is && p2), o2 = null, c2 = false;
  }
  if (d2 === null)
    y2 === p2 || c2 && l2.data === p2 || (l2.data = p2);
  else {
    if (o2 = o2 && n.call(l2.childNodes), a2 = (y2 = i2.props || e$2).dangerouslySetInnerHTML, v2 = p2.dangerouslySetInnerHTML, !c2) {
      if (o2 != null)
        for (y2 = {}, _2 = 0; _2 < l2.attributes.length; _2++)
          y2[l2.attributes[_2].name] = l2.attributes[_2].value;
      (v2 || a2) && (v2 && (a2 && v2.__html == a2.__html || v2.__html === l2.innerHTML) || (l2.innerHTML = v2 && v2.__html || ""));
    }
    if (C$1(l2, p2, y2, r2, c2), v2)
      u2.__k = [];
    else if (_2 = u2.props.children, w$2(l2, Array.isArray(_2) ? _2 : [_2], u2, i2, t2, r2 && d2 !== "foreignObject", o2, f2, o2 ? o2[0] : i2.__k && k$2(i2, 0), c2), o2 != null)
      for (_2 = o2.length; _2--; )
        o2[_2] != null && h$1(o2[_2]);
    c2 || ("value" in p2 && (_2 = p2.value) !== void 0 && (_2 !== y2.value || _2 !== l2.value || d2 === "progress" && !_2) && H$1(l2, "value", _2, y2.value, false), "checked" in p2 && (_2 = p2.checked) !== void 0 && _2 !== l2.checked && H$1(l2, "checked", _2, y2.checked, false));
  }
  return l2;
}
function M$1(n2, u2, i2) {
  try {
    typeof n2 == "function" ? n2(u2) : n2.current = u2;
  } catch (n3) {
    l$1.__e(n3, i2);
  }
}
function N$1(n2, u2, i2) {
  var t2, r2;
  if (l$1.unmount && l$1.unmount(n2), (t2 = n2.ref) && (t2.current && t2.current !== n2.__e || M$1(t2, null, u2)), (t2 = n2.__c) != null) {
    if (t2.componentWillUnmount)
      try {
        t2.componentWillUnmount();
      } catch (n3) {
        l$1.__e(n3, u2);
      }
    t2.base = t2.__P = null;
  }
  if (t2 = n2.__k)
    for (r2 = 0; r2 < t2.length; r2++)
      t2[r2] && N$1(t2[r2], u2, typeof n2.type != "function");
  i2 || n2.__e == null || h$1(n2.__e), n2.__e = n2.__d = void 0;
}
function O$1(n2, l2, u2) {
  return this.constructor(n2, u2);
}
function S$1(u2, i2, t2) {
  var r2, o2, f2;
  l$1.__ && l$1.__(u2, i2), o2 = (r2 = typeof t2 == "function") ? null : t2 && t2.__k || i2.__k, f2 = [], j$2(i2, u2 = (!r2 && t2 || i2).__k = v$1(d$1, null, [u2]), o2 || e$2, e$2, i2.ownerSVGElement !== void 0, !r2 && t2 ? [t2] : o2 ? null : i2.firstChild ? n.call(i2.childNodes) : null, f2, !r2 && t2 ? t2 : o2 ? o2.__e : i2.firstChild, r2), z$1(f2, u2);
}
function q$2(n2, l2) {
  S$1(n2, l2, q$2);
}
function B$1(l2, u2, i2) {
  var t2, r2, o2, f2 = a$1({}, l2.props);
  for (o2 in u2)
    o2 == "key" ? t2 = u2[o2] : o2 == "ref" ? r2 = u2[o2] : f2[o2] = u2[o2];
  return arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : i2), y$1(l2.type, f2, t2 || l2.key, r2 || l2.ref, null);
}
function D$1(n2, l2) {
  var u2 = { __c: l2 = "__cC" + f$1++, __: n2, Consumer: function(n3, l3) {
    return n3.children(l3);
  }, Provider: function(n3) {
    var u3, i2;
    return this.getChildContext || (u3 = [], (i2 = {})[l2] = this, this.getChildContext = function() {
      return i2;
    }, this.shouldComponentUpdate = function(n4) {
      this.props.value !== n4.value && u3.some(m$1);
    }, this.sub = function(n4) {
      u3.push(n4);
      var l3 = n4.componentWillUnmount;
      n4.componentWillUnmount = function() {
        u3.splice(u3.indexOf(n4), 1), l3 && l3.call(n4);
      };
    }), n3.children;
  } };
  return u2.Provider.__ = u2.Consumer.contextType = u2;
}
n = c$1.slice, l$1 = { __e: function(n2, l2) {
  for (var u2, i2, t2; l2 = l2.__; )
    if ((u2 = l2.__c) && !u2.__)
      try {
        if ((i2 = u2.constructor) && i2.getDerivedStateFromError != null && (u2.setState(i2.getDerivedStateFromError(n2)), t2 = u2.__d), u2.componentDidCatch != null && (u2.componentDidCatch(n2), t2 = u2.__d), t2)
          return u2.__E = u2;
      } catch (l3) {
        n2 = l3;
      }
  throw n2;
} }, u$1 = 0, i$1 = function(n2) {
  return n2 != null && n2.constructor === void 0;
}, _$2.prototype.setState = function(n2, l2) {
  var u2;
  u2 = this.__s != null && this.__s !== this.state ? this.__s : this.__s = a$1({}, this.state), typeof n2 == "function" && (n2 = n2(a$1({}, u2), this.props)), n2 && a$1(u2, n2), n2 != null && this.__v && (l2 && this.__h.push(l2), m$1(this));
}, _$2.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), m$1(this));
}, _$2.prototype.render = d$1, t$1 = [], r$2 = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, g$2.__r = 0, f$1 = 0;
var preact_module = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  render: S$1,
  hydrate: q$2,
  createElement: v$1,
  h: v$1,
  Fragment: d$1,
  createRef: p$1,
  get isValidElement() {
    return i$1;
  },
  Component: _$2,
  cloneElement: B$1,
  createContext: D$1,
  toChildArray: A$2,
  get options() {
    return l$1;
  }
});
function getAugmentedNamespace(n2) {
  if (n2.__esModule)
    return n2;
  var a2 = Object.defineProperty({}, "__esModule", { value: true });
  Object.keys(n2).forEach(function(k2) {
    var d2 = Object.getOwnPropertyDescriptor(n2, k2);
    Object.defineProperty(a2, k2, d2.get ? d2 : {
      enumerable: true,
      get: function() {
        return n2[k2];
      }
    });
  });
  return a2;
}
var build = { exports: {} };
var t, u, r$1, o = 0, i = [], c = l$1.__b, f = l$1.__r, e$1 = l$1.diffed, a = l$1.__c, v = l$1.unmount;
function m(t2, r2) {
  l$1.__h && l$1.__h(u, t2, o || r2), o = 0;
  var i2 = u.__H || (u.__H = { __: [], __h: [] });
  return t2 >= i2.__.length && i2.__.push({}), i2.__[t2];
}
function l(n2) {
  return o = 1, p(w$1, n2);
}
function p(n2, r2, o2) {
  var i2 = m(t++, 2);
  return i2.t = n2, i2.__c || (i2.__ = [o2 ? o2(r2) : w$1(void 0, r2), function(n3) {
    var t2 = i2.t(i2.__[0], n3);
    i2.__[0] !== t2 && (i2.__ = [t2, i2.__[1]], i2.__c.setState({}));
  }], i2.__c = u), i2.__;
}
function y(r2, o2) {
  var i2 = m(t++, 3);
  !l$1.__s && k$1(i2.__H, o2) && (i2.__ = r2, i2.__H = o2, u.__H.__h.push(i2));
}
function h(r2, o2) {
  var i2 = m(t++, 4);
  !l$1.__s && k$1(i2.__H, o2) && (i2.__ = r2, i2.__H = o2, u.__h.push(i2));
}
function s(n2) {
  return o = 5, d(function() {
    return { current: n2 };
  }, []);
}
function _$1(n2, t2, u2) {
  o = 6, h(function() {
    typeof n2 == "function" ? n2(t2()) : n2 && (n2.current = t2());
  }, u2 == null ? u2 : u2.concat(n2));
}
function d(n2, u2) {
  var r2 = m(t++, 7);
  return k$1(r2.__H, u2) && (r2.__ = n2(), r2.__H = u2, r2.__h = n2), r2.__;
}
function A$1(n2, t2) {
  return o = 8, d(function() {
    return n2;
  }, t2);
}
function F$1(n2) {
  var r2 = u.context[n2.__c], o2 = m(t++, 9);
  return o2.c = n2, r2 ? (o2.__ == null && (o2.__ = true, r2.sub(u)), r2.props.value) : n2.__;
}
function T$1(t2, u2) {
  l$1.useDebugValue && l$1.useDebugValue(u2 ? u2(t2) : t2);
}
function q$1(n2) {
  var r2 = m(t++, 10), o2 = l();
  return r2.__ = n2, u.componentDidCatch || (u.componentDidCatch = function(n3) {
    r2.__ && r2.__(n3), o2[1](n3);
  }), [o2[0], function() {
    o2[1](void 0);
  }];
}
function x$1() {
  for (var t2; t2 = i.shift(); )
    if (t2.__P)
      try {
        t2.__H.__h.forEach(g$1), t2.__H.__h.forEach(j$1), t2.__H.__h = [];
      } catch (u2) {
        t2.__H.__h = [], l$1.__e(u2, t2.__v);
      }
}
l$1.__b = function(n2) {
  u = null, c && c(n2);
}, l$1.__r = function(n2) {
  f && f(n2), t = 0;
  var r2 = (u = n2.__c).__H;
  r2 && (r2.__h.forEach(g$1), r2.__h.forEach(j$1), r2.__h = []);
}, l$1.diffed = function(t2) {
  e$1 && e$1(t2);
  var o2 = t2.__c;
  o2 && o2.__H && o2.__H.__h.length && (i.push(o2) !== 1 && r$1 === l$1.requestAnimationFrame || ((r$1 = l$1.requestAnimationFrame) || function(n2) {
    var t3, u2 = function() {
      clearTimeout(r2), b && cancelAnimationFrame(t3), setTimeout(n2);
    }, r2 = setTimeout(u2, 100);
    b && (t3 = requestAnimationFrame(u2));
  })(x$1)), u = null;
}, l$1.__c = function(t2, u2) {
  u2.some(function(t3) {
    try {
      t3.__h.forEach(g$1), t3.__h = t3.__h.filter(function(n2) {
        return !n2.__ || j$1(n2);
      });
    } catch (r2) {
      u2.some(function(n2) {
        n2.__h && (n2.__h = []);
      }), u2 = [], l$1.__e(r2, t3.__v);
    }
  }), a && a(t2, u2);
}, l$1.unmount = function(t2) {
  v && v(t2);
  var u2, r2 = t2.__c;
  r2 && r2.__H && (r2.__H.__.forEach(function(n2) {
    try {
      g$1(n2);
    } catch (n3) {
      u2 = n3;
    }
  }), u2 && l$1.__e(u2, r2.__v));
};
var b = typeof requestAnimationFrame == "function";
function g$1(n2) {
  var t2 = u, r2 = n2.__c;
  typeof r2 == "function" && (n2.__c = void 0, r2()), u = t2;
}
function j$1(n2) {
  var t2 = u;
  n2.__c = n2.__(), u = t2;
}
function k$1(n2, t2) {
  return !n2 || n2.length !== t2.length || t2.some(function(t3, u2) {
    return t3 !== n2[u2];
  });
}
function w$1(n2, t2) {
  return typeof t2 == "function" ? t2(n2) : t2;
}
function C(n2, t2) {
  for (var e2 in t2)
    n2[e2] = t2[e2];
  return n2;
}
function S(n2, t2) {
  for (var e2 in n2)
    if (e2 !== "__source" && !(e2 in t2))
      return true;
  for (var r2 in t2)
    if (r2 !== "__source" && n2[r2] !== t2[r2])
      return true;
  return false;
}
function E(n2) {
  this.props = n2;
}
function g(n2, t2) {
  function e2(n3) {
    var e3 = this.props.ref, r3 = e3 == n3.ref;
    return !r3 && e3 && (e3.call ? e3(null) : e3.current = null), t2 ? !t2(this.props, n3) || !r3 : S(this.props, n3);
  }
  function r2(t3) {
    return this.shouldComponentUpdate = e2, v$1(n2, t3);
  }
  return r2.displayName = "Memo(" + (n2.displayName || n2.name) + ")", r2.prototype.isReactComponent = true, r2.__f = true, r2;
}
(E.prototype = new _$2()).isPureReactComponent = true, E.prototype.shouldComponentUpdate = function(n2, t2) {
  return S(this.props, n2) || S(this.state, t2);
};
var w = l$1.__b;
l$1.__b = function(n2) {
  n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), w && w(n2);
};
var R = typeof Symbol != "undefined" && Symbol.for && Symbol.for("react.forward_ref") || 3911;
function x(n2) {
  function t2(t3, e2) {
    var r2 = C({}, t3);
    return delete r2.ref, n2(r2, (e2 = t3.ref || e2) && (typeof e2 != "object" || "current" in e2) ? e2 : null);
  }
  return t2.$$typeof = R, t2.render = t2, t2.prototype.isReactComponent = t2.__f = true, t2.displayName = "ForwardRef(" + (n2.displayName || n2.name) + ")", t2;
}
var N = function(n2, t2) {
  return n2 == null ? null : A$2(A$2(n2).map(t2));
}, k = { map: N, forEach: N, count: function(n2) {
  return n2 ? A$2(n2).length : 0;
}, only: function(n2) {
  var t2 = A$2(n2);
  if (t2.length !== 1)
    throw "Children.only";
  return t2[0];
}, toArray: A$2 }, A = l$1.__e;
l$1.__e = function(n2, t2, e2) {
  if (n2.then) {
    for (var r2, u2 = t2; u2 = u2.__; )
      if ((r2 = u2.__c) && r2.__c)
        return t2.__e == null && (t2.__e = e2.__e, t2.__k = e2.__k), r2.__c(n2, t2);
  }
  A(n2, t2, e2);
};
var O = l$1.unmount;
function L() {
  this.__u = 0, this.t = null, this.__b = null;
}
function U(n2) {
  var t2 = n2.__.__c;
  return t2 && t2.__e && t2.__e(n2);
}
function F(n2) {
  var t2, e2, r2;
  function u2(u3) {
    if (t2 || (t2 = n2()).then(function(n3) {
      e2 = n3.default || n3;
    }, function(n3) {
      r2 = n3;
    }), r2)
      throw r2;
    if (!e2)
      throw t2;
    return v$1(e2, u3);
  }
  return u2.displayName = "Lazy", u2.__f = true, u2;
}
function M() {
  this.u = null, this.o = null;
}
l$1.unmount = function(n2) {
  var t2 = n2.__c;
  t2 && t2.__R && t2.__R(), t2 && n2.__h === true && (n2.type = null), O && O(n2);
}, (L.prototype = new _$2()).__c = function(n2, t2) {
  var e2 = t2.__c, r2 = this;
  r2.t == null && (r2.t = []), r2.t.push(e2);
  var u2 = U(r2.__v), o2 = false, i2 = function() {
    o2 || (o2 = true, e2.__R = null, u2 ? u2(l2) : l2());
  };
  e2.__R = i2;
  var l2 = function() {
    if (!--r2.__u) {
      if (r2.state.__e) {
        var n3 = r2.state.__e;
        r2.__v.__k[0] = function n4(t4, e3, r3) {
          return t4 && (t4.__v = null, t4.__k = t4.__k && t4.__k.map(function(t5) {
            return n4(t5, e3, r3);
          }), t4.__c && t4.__c.__P === e3 && (t4.__e && r3.insertBefore(t4.__e, t4.__d), t4.__c.__e = true, t4.__c.__P = r3)), t4;
        }(n3, n3.__c.__P, n3.__c.__O);
      }
      var t3;
      for (r2.setState({ __e: r2.__b = null }); t3 = r2.t.pop(); )
        t3.forceUpdate();
    }
  }, c2 = t2.__h === true;
  r2.__u++ || c2 || r2.setState({ __e: r2.__b = r2.__v.__k[0] }), n2.then(i2, i2);
}, L.prototype.componentWillUnmount = function() {
  this.t = [];
}, L.prototype.render = function(n2, t2) {
  if (this.__b) {
    if (this.__v.__k) {
      var e2 = document.createElement("div"), r2 = this.__v.__k[0].__c;
      this.__v.__k[0] = function n3(t3, e3, r3) {
        return t3 && (t3.__c && t3.__c.__H && (t3.__c.__H.__.forEach(function(n4) {
          typeof n4.__c == "function" && n4.__c();
        }), t3.__c.__H = null), (t3 = C({}, t3)).__c != null && (t3.__c.__P === r3 && (t3.__c.__P = e3), t3.__c = null), t3.__k = t3.__k && t3.__k.map(function(t4) {
          return n3(t4, e3, r3);
        })), t3;
      }(this.__b, e2, r2.__O = r2.__P);
    }
    this.__b = null;
  }
  var u2 = t2.__e && v$1(d$1, null, n2.fallback);
  return u2 && (u2.__h = null), [v$1(d$1, null, t2.__e ? null : n2.children), u2];
};
var T = function(n2, t2, e2) {
  if (++e2[1] === e2[0] && n2.o.delete(t2), n2.props.revealOrder && (n2.props.revealOrder[0] !== "t" || !n2.o.size))
    for (e2 = n2.u; e2; ) {
      for (; e2.length > 3; )
        e2.pop()();
      if (e2[1] < e2[0])
        break;
      n2.u = e2 = e2[2];
    }
};
function D(n2) {
  return this.getChildContext = function() {
    return n2.context;
  }, n2.children;
}
function I(n2) {
  var t2 = this, e2 = n2.i;
  t2.componentWillUnmount = function() {
    S$1(null, t2.l), t2.l = null, t2.i = null;
  }, t2.i && t2.i !== e2 && t2.componentWillUnmount(), n2.__v ? (t2.l || (t2.i = e2, t2.l = { nodeType: 1, parentNode: e2, childNodes: [], appendChild: function(n3) {
    this.childNodes.push(n3), t2.i.appendChild(n3);
  }, insertBefore: function(n3, e3) {
    this.childNodes.push(n3), t2.i.appendChild(n3);
  }, removeChild: function(n3) {
    this.childNodes.splice(this.childNodes.indexOf(n3) >>> 1, 1), t2.i.removeChild(n3);
  } }), S$1(v$1(D, { context: t2.context }, n2.__v), t2.l)) : t2.l && t2.componentWillUnmount();
}
function W(n2, t2) {
  return v$1(I, { __v: n2, i: t2 });
}
(M.prototype = new _$2()).__e = function(n2) {
  var t2 = this, e2 = U(t2.__v), r2 = t2.o.get(n2);
  return r2[0]++, function(u2) {
    var o2 = function() {
      t2.props.revealOrder ? (r2.push(u2), T(t2, n2, r2)) : u2();
    };
    e2 ? e2(o2) : o2();
  };
}, M.prototype.render = function(n2) {
  this.u = null, this.o = new Map();
  var t2 = A$2(n2.children);
  n2.revealOrder && n2.revealOrder[0] === "b" && t2.reverse();
  for (var e2 = t2.length; e2--; )
    this.o.set(t2[e2], this.u = [1, 0, this.u]);
  return n2.children;
}, M.prototype.componentDidUpdate = M.prototype.componentDidMount = function() {
  var n2 = this;
  this.o.forEach(function(t2, e2) {
    T(n2, e2, t2);
  });
};
var j = typeof Symbol != "undefined" && Symbol.for && Symbol.for("react.element") || 60103, P = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, V = typeof document != "undefined", z = function(n2) {
  return (typeof Symbol != "undefined" && typeof Symbol() == "symbol" ? /fil|che|rad/i : /fil|che|ra/i).test(n2);
};
function B(n2, t2, e2) {
  return t2.__k == null && (t2.textContent = ""), S$1(n2, t2), typeof e2 == "function" && e2(), n2 ? n2.__c : null;
}
function $(n2, t2, e2) {
  return q$2(n2, t2), typeof e2 == "function" && e2(), n2 ? n2.__c : null;
}
_$2.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(n2) {
  Object.defineProperty(_$2.prototype, n2, { configurable: true, get: function() {
    return this["UNSAFE_" + n2];
  }, set: function(t2) {
    Object.defineProperty(this, n2, { configurable: true, writable: true, value: t2 });
  } });
});
var H = l$1.event;
function Z() {
}
function Y() {
  return this.cancelBubble;
}
function q() {
  return this.defaultPrevented;
}
l$1.event = function(n2) {
  return H && (n2 = H(n2)), n2.persist = Z, n2.isPropagationStopped = Y, n2.isDefaultPrevented = q, n2.nativeEvent = n2;
};
var G, J = { configurable: true, get: function() {
  return this.class;
} }, K = l$1.vnode;
l$1.vnode = function(n2) {
  var t2 = n2.type, e2 = n2.props, r2 = e2;
  if (typeof t2 == "string") {
    var u2 = t2.indexOf("-") === -1;
    for (var o2 in r2 = {}, e2) {
      var i2 = e2[o2];
      V && o2 === "children" && t2 === "noscript" || o2 === "value" && "defaultValue" in e2 && i2 == null || (o2 === "defaultValue" && "value" in e2 && e2.value == null ? o2 = "value" : o2 === "download" && i2 === true ? i2 = "" : /ondoubleclick/i.test(o2) ? o2 = "ondblclick" : /^onchange(textarea|input)/i.test(o2 + t2) && !z(e2.type) ? o2 = "oninput" : /^onfocus$/i.test(o2) ? o2 = "onfocusin" : /^onblur$/i.test(o2) ? o2 = "onfocusout" : /^on(Ani|Tra|Tou|BeforeInp|Compo)/.test(o2) ? o2 = o2.toLowerCase() : u2 && P.test(o2) ? o2 = o2.replace(/[A-Z0-9]/, "-$&").toLowerCase() : i2 === null && (i2 = void 0), r2[o2] = i2);
    }
    t2 == "select" && r2.multiple && Array.isArray(r2.value) && (r2.value = A$2(e2.children).forEach(function(n3) {
      n3.props.selected = r2.value.indexOf(n3.props.value) != -1;
    })), t2 == "select" && r2.defaultValue != null && (r2.value = A$2(e2.children).forEach(function(n3) {
      n3.props.selected = r2.multiple ? r2.defaultValue.indexOf(n3.props.value) != -1 : r2.defaultValue == n3.props.value;
    })), n2.props = r2, e2.class != e2.className && (J.enumerable = "className" in e2, e2.className != null && (r2.class = e2.className), Object.defineProperty(r2, "className", J));
  }
  n2.$$typeof = j, K && K(n2);
};
var Q = l$1.__r;
l$1.__r = function(n2) {
  Q && Q(n2), G = n2.__c;
};
var X = { ReactCurrentDispatcher: { current: { readContext: function(n2) {
  return G.__n[n2.__c].props.value;
} } } }, nn = "17.0.2";
function tn(n2) {
  return v$1.bind(null, n2);
}
function en(n2) {
  return !!n2 && n2.$$typeof === j;
}
function rn(n2) {
  return en(n2) ? B$1.apply(null, arguments) : n2;
}
function un(n2) {
  return !!n2.__k && (S$1(null, n2), true);
}
function on(n2) {
  return n2 && (n2.base || n2.nodeType === 1 && n2) || null;
}
var ln = function(n2, t2) {
  return n2(t2);
}, cn = function(n2, t2) {
  return n2(t2);
}, fn = d$1;
var compat_module = { useState: l, useReducer: p, useEffect: y, useLayoutEffect: h, useRef: s, useImperativeHandle: _$1, useMemo: d, useCallback: A$1, useContext: F$1, useDebugValue: T$1, version: "17.0.2", Children: k, render: B, hydrate: $, unmountComponentAtNode: un, createPortal: W, createElement: v$1, createContext: D$1, createFactory: tn, cloneElement: rn, createRef: p$1, Fragment: d$1, isValidElement: en, findDOMNode: on, Component: _$2, PureComponent: E, memo: g, forwardRef: x, flushSync: cn, unstable_batchedUpdates: ln, StrictMode: d$1, Suspense: L, SuspenseList: M, lazy: F, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: X };
var compat_module$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": compat_module,
  version: nn,
  Children: k,
  render: B,
  hydrate: $,
  unmountComponentAtNode: un,
  createPortal: W,
  createFactory: tn,
  cloneElement: rn,
  isValidElement: en,
  findDOMNode: on,
  PureComponent: E,
  memo: g,
  forwardRef: x,
  flushSync: cn,
  unstable_batchedUpdates: ln,
  StrictMode: fn,
  Suspense: L,
  SuspenseList: M,
  lazy: F,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: X,
  createElement: v$1,
  createContext: D$1,
  createRef: p$1,
  Fragment: d$1,
  Component: _$2,
  useState: l,
  useReducer: p,
  useEffect: y,
  useLayoutEffect: h,
  useRef: s,
  useImperativeHandle: _$1,
  useMemo: d,
  useCallback: A$1,
  useContext: F$1,
  useDebugValue: T$1,
  useErrorBoundary: q$1
});
var require$$0$1 = /* @__PURE__ */ getAugmentedNamespace(compat_module$1);
(function(module, exports) {
  !function(e2, t2) {
    module.exports = t2(require$$0$1);
  }(window, function(e2) {
    return function(e3) {
      var t2 = {};
      function r2(n2) {
        if (t2[n2])
          return t2[n2].exports;
        var o2 = t2[n2] = { i: n2, l: false, exports: {} };
        return e3[n2].call(o2.exports, o2, o2.exports, r2), o2.l = true, o2.exports;
      }
      return r2.m = e3, r2.c = t2, r2.d = function(e4, t3, n2) {
        r2.o(e4, t3) || Object.defineProperty(e4, t3, { enumerable: true, get: n2 });
      }, r2.r = function(e4) {
        typeof Symbol != "undefined" && Symbol.toStringTag && Object.defineProperty(e4, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e4, "__esModule", { value: true });
      }, r2.t = function(e4, t3) {
        if (1 & t3 && (e4 = r2(e4)), 8 & t3)
          return e4;
        if (4 & t3 && typeof e4 == "object" && e4 && e4.__esModule)
          return e4;
        var n2 = Object.create(null);
        if (r2.r(n2), Object.defineProperty(n2, "default", { enumerable: true, value: e4 }), 2 & t3 && typeof e4 != "string")
          for (var o2 in e4)
            r2.d(n2, o2, function(t4) {
              return e4[t4];
            }.bind(null, o2));
        return n2;
      }, r2.n = function(e4) {
        var t3 = e4 && e4.__esModule ? function() {
          return e4.default;
        } : function() {
          return e4;
        };
        return r2.d(t3, "a", t3), t3;
      }, r2.o = function(e4, t3) {
        return Object.prototype.hasOwnProperty.call(e4, t3);
      }, r2.p = "", r2(r2.s = 12);
    }([function(t2, r2) {
      t2.exports = e2;
    }, function(e3, t2, r2) {
      Object.defineProperty(t2, "__esModule", { value: true });
      var n2 = r2(0), o2 = r2(9);
      t2.default = function e4(t3, r3, a2) {
        return r3 === void 0 && (r3 = 0), a2 === void 0 && (a2 = []), n2.Children.toArray(t3).reduce(function(t4, i2, l2) {
          return o2.isFragment(i2) ? t4.push.apply(t4, e4(i2.props.children, r3 + 1, a2.concat(i2.key || l2))) : n2.isValidElement(i2) ? t4.push(n2.cloneElement(i2, { key: a2.concat(String(i2.key)).join(".") })) : typeof i2 != "string" && typeof i2 != "number" || t4.push(i2), t4;
        }, []);
      };
    }, function(e3) {
      e3.exports = JSON.parse('[{"category":"breakpoint","name":"small","value":576,"variableName":"$breakpoint-small"},{"category":"breakpoint","name":"medium","value":768,"variableName":"$breakpoint-medium"},{"category":"breakpoint","name":"large","value":1280,"variableName":"$breakpoint-large"}]');
    }, function(e3) {
      e3.exports = JSON.parse('{"a":{"s":"16px","m":"24px","l":"48px"}}');
    }, function(e3, t2, r2) {
      var n2 = r2(7), o2 = { childContextTypes: true, contextType: true, contextTypes: true, defaultProps: true, displayName: true, getDefaultProps: true, getDerivedStateFromError: true, getDerivedStateFromProps: true, mixins: true, propTypes: true, type: true }, a2 = { name: true, length: true, prototype: true, caller: true, callee: true, arguments: true, arity: true }, i2 = { $$typeof: true, compare: true, defaultProps: true, displayName: true, propTypes: true, type: true }, l2 = {};
      function s2(e4) {
        return n2.isMemo(e4) ? i2 : l2[e4.$$typeof] || o2;
      }
      l2[n2.ForwardRef] = { $$typeof: true, render: true, defaultProps: true, displayName: true, propTypes: true }, l2[n2.Memo] = i2;
      var c2 = Object.defineProperty, d2 = Object.getOwnPropertyNames, u2 = Object.getOwnPropertySymbols, f2 = Object.getOwnPropertyDescriptor, h2 = Object.getPrototypeOf, p2 = Object.prototype;
      e3.exports = function e4(t3, r3, n3) {
        if (typeof r3 != "string") {
          if (p2) {
            var o3 = h2(r3);
            o3 && o3 !== p2 && e4(t3, o3, n3);
          }
          var i3 = d2(r3);
          u2 && (i3 = i3.concat(u2(r3)));
          for (var l3 = s2(t3), v2 = s2(r3), g2 = 0; g2 < i3.length; ++g2) {
            var b2 = i3[g2];
            if (!(a2[b2] || n3 && n3[b2] || v2 && v2[b2] || l3 && l3[b2])) {
              var w2 = f2(r3, b2);
              try {
                c2(t3, b2, w2);
              } catch (e5) {
              }
            }
          }
        }
        return t3;
      };
    }, function(e3) {
      e3.exports = JSON.parse('{"alert-circle":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-alert-circle\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"></circle><line x1=\\"12\\" y1=\\"8\\" x2=\\"12\\" y2=\\"12\\"></line><line x1=\\"12\\" y1=\\"16\\" x2=\\"12.01\\" y2=\\"16\\"></line></svg>","alert-triangle":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-alert-triangle\\"><path d=\\"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z\\"></path><line x1=\\"12\\" y1=\\"9\\" x2=\\"12\\" y2=\\"13\\"></line><line x1=\\"12\\" y1=\\"17\\" x2=\\"12.01\\" y2=\\"17\\"></line></svg>","align-left":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-align-left\\"><line x1=\\"17\\" y1=\\"10\\" x2=\\"3\\" y2=\\"10\\"></line><line x1=\\"21\\" y1=\\"6\\" x2=\\"3\\" y2=\\"6\\"></line><line x1=\\"21\\" y1=\\"14\\" x2=\\"3\\" y2=\\"14\\"></line><line x1=\\"17\\" y1=\\"18\\" x2=\\"3\\" y2=\\"18\\"></line></svg>","arrow-left":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-arrow-left\\"><line x1=\\"19\\" y1=\\"12\\" x2=\\"5\\" y2=\\"12\\"></line><polyline points=\\"12 19 5 12 12 5\\"></polyline></svg>","arrow-right":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-arrow-right\\"><line x1=\\"5\\" y1=\\"12\\" x2=\\"19\\" y2=\\"12\\"></line><polyline points=\\"12 5 19 12 12 19\\"></polyline></svg>","article":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M4 2h16v20H4zM16 6H8M14 10H8\\"/><path d=\\"M8 14h8v4H8z\\"/></svg>","auditor":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><circle cx=\\"6\\" cy=\\"7\\" r=\\"4\\"/><circle cx=\\"18\\" cy=\\"7\\" r=\\"4\\"/><path d=\\"M10 7h4M23 15.3c-.7.9-1.8 1.6-3.1 1.6-1.4 0-2.7-.7-3.3-1.8h0c-.4-.7-1.2-1.3-2.1-1.3-1.3 0-2.4 1-2.4 2.2 0 .3.1.6.2.9h0c.7 2 2.8 3.5 5.3 3.5 2.9 0 5.4-2.3 5.4-5.1h0zM1 15.3c.7.9 1.8 1.6 3.1 1.6 1.4 0 2.7-.7 3.3-1.8h0c.4-.7 1.2-1.3 2.1-1.3 1.3 0 2.4 1 2.4 2.2 0 .3-.1.6-.2.9h0c-.7 2-2.8 3.5-5.3 3.5-2.9 0-5.4-2.3-5.4-5.1h0z\\"/></svg>","bar-chart-2":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-bar-chart-2\\"><line x1=\\"18\\" y1=\\"20\\" x2=\\"18\\" y2=\\"10\\"></line><line x1=\\"12\\" y1=\\"20\\" x2=\\"12\\" y2=\\"4\\"></line><line x1=\\"6\\" y1=\\"20\\" x2=\\"6\\" y2=\\"14\\"></line></svg>","bell":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-bell\\"><path d=\\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\\"></path><path d=\\"M13.73 21a2 2 0 0 1-3.46 0\\"></path></svg>","book":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-book\\"><path d=\\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20\\"></path><path d=\\"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z\\"></path></svg>","book-open":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-book-open\\"><path d=\\"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z\\"></path><path d=\\"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z\\"></path></svg>","bookmark":"<svg width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","box":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-box\\"><path d=\\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\\"></path><polyline points=\\"3.27 6.96 12 12.01 20.73 6.96\\"></polyline><line x1=\\"12\\" y1=\\"22.08\\" x2=\\"12\\" y2=\\"12\\"></line></svg>","bubble":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M20 3H6c-1.1 0-2 .9-2 2v5l-3 2 3 2v5c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z\\"/></svg>","bubble-check":"<svg width=\\"24\\" height=\\"24\\" fill=\\"currentColor\\" viewBox=\\"0 0 24 24\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M2.803 12l1.752 1.168c.278.186.445.499.445.832v5c0 .552.449 1 1 1h14a1 1 0 001-1V5c0-.551-.448-1-1-1H6c-.551 0-1 .449-1 1v5c0 .334-.167.646-.445.832L2.803 12zM20 22H6c-1.654 0-3-1.345-3-3v-4.464L.446 12.832a1 1 0 010-1.664L3 9.465V5c0-1.654 1.346-3 3-3h14c1.655 0 3 1.346 3 3v14c0 1.655-1.345 3-3 3z\\" stroke=\\"none\\"/>\\n  <path d=\\"M17 9l-6 6-2.5-2.5\\" fill=\\"none\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","bubble-image":"<svg width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M15.9 7.7a1.301 1.301 0 0 1 0 2.6A1.302 1.302 0 0 1 14.6 9c0-.717.583-1.3 1.3-1.3Zm0 4.6c1.82 0 3.3-1.48 3.3-3.3 0-1.82-1.48-3.3-3.3-3.3A3.304 3.304 0 0 0 12.6 9c0 1.82 1.48 3.3 3.3 3.3ZM6 20c-.551 0-1-.448-1-1v-2.586l3-3 5.293 5.293a.997.997 0 0 0 1.414 0l2.263-2.263 3.233 3.515c-.068.015-.131.041-.203.041H6Zm-3.197-8 1.752-1.168C4.833 10.646 5 10.334 5 10V5c0-.552.449-1 1-1h14a1 1 0 0 1 1 1v12.871l-3.264-3.548a1 1 0 0 0-1.443-.03L14 16.586l-5.293-5.294a1.03 1.03 0 0 0-1.414 0l-2.362 2.363a1.004 1.004 0 0 0-.376-.487L2.803 12ZM20 2H6C4.346 2 3 3.345 3 5v4.464L.445 11.167a1.002 1.002 0 0 0 0 1.665L3 14.535V19c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3V5c0-1.655-1.346-3-3-3Z\\" fill=\\"currentColor\\"/>\\n</svg>","bubble-pill":"<svg width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M20 2c1.654 0 3 1.345 3 3v14c0 1.654-1.346 3-3 3H6c-1.654 0-3-1.346-3-3v-4.465L.445 12.832a1.001 1.001 0 0 1 0-1.665L3 9.464V5c0-1.655 1.346-3 3-3h14Zm1 17V5a1 1 0 0 0-1-1H6c-.551 0-1 .448-1 1v5c0 .334-.167.646-.445.832L2.803 12l1.752 1.168c.278.186.445.498.445.832v5c0 .552.449 1 1 1h14a1 1 0 0 0 1-1ZM15.117 6.487a3.161 3.161 0 0 1 2.426 1.044c1.26 1.4 1.244 3.497-.036 4.776-.018.018-.041.023-.06.04-.016.018-.022.042-.04.06l-4 4c-.021.021-.05.028-.073.048-.024.027-.037.062-.065.088-.72.648-1.595.971-2.445.971a3.15 3.15 0 0 1-2.367-1.045c-1.26-1.399-1.243-3.497.036-4.777.018-.017.04-.023.06-.039.016-.019.022-.043.04-.06l4-4c.022-.022.05-.03.074-.05.025-.027.036-.06.065-.087a3.696 3.696 0 0 1 2.385-.969Zm.976 4.405c.527-.526.512-1.416-.036-2.023a1.172 1.172 0 0 0-.9-.382 1.72 1.72 0 0 0-1.087.456c-.01.01-.023.011-.034.02-.011.013-.016.031-.03.044L12.715 10.3l1.986 1.985 1.293-1.292c.018-.018.04-.024.059-.039.017-.02.022-.044.04-.062Zm-4.1 4.1 1.293-1.293-1.986-1.985-1.293 1.293c-.018.017-.04.023-.06.04-.015.018-.021.042-.04.06-.527.527-.511 1.415.037 2.024.554.615 1.437.42 1.987-.074.01-.009.022-.01.032-.019.012-.015.017-.032.03-.046Z\\" fill=\\"currentColor\\"/>\\n</svg>","bubble-text":"<svg width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"m2.803 12 1.752 1.168c.278.186.445.499.445.832v5c0 .552.449 1 1 1h14a1 1 0 0 0 1-1V5c0-.551-.448-1-1-1H6c-.551 0-1 .449-1 1v5c0 .334-.167.646-.445.832L2.803 12ZM20 22H6c-1.654 0-3-1.345-3-3v-4.464L.446 12.832a1 1 0 0 1 0-1.664L3 9.465V5c0-1.654 1.346-3 3-3h14c1.655 0 3 1.346 3 3v14c0 1.655-1.345 3-3 3Zm-4.2-7H8a1 1 0 1 1 0-2h7.8a1 1 0 1 1 0 2Zm2.2-4H8a1 1 0 0 1 0-2h10a1 1 0 1 1 0 2Z\\" fill=\\"currentColor\\"/>\\n</svg>","bulb":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M14 10h-4M12 10v7.9M16 17.9v-4.1c1.6-1.2 2.6-3.1 2.6-5.2 0-3.7-3-6.6-6.6-6.6S5.4 4.9 5.4 8.6c0 2.1 1 4 2.6 5.2v4.1h8zM8 17.9l2 4.1h4l2-4.1\\"/></svg>","calculator":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M4 7h16M7.9 10.5h0M11.9 10.5h0M15.9 10.5h0M7.9 14.5h0M11.9 14.5h0M15.9 14.5h0M8 18.5h3.9M15.9 18.5h0M18 22H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2z\\"/></svg>","check":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-check\\"><polyline points=\\"20 6 9 17 4 12\\"></polyline></svg>","check-circle":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-check-circle\\"><path d=\\"M22 11.08V12a10 10 0 1 1-5.93-9.14\\"></path><polyline points=\\"22 4 12 14.01 9 11.01\\"></polyline></svg>","check-square":"<svg width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"m8 11 3 3L22 3\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M20 12v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>","checkmark-circle-filled":"<svg width=\\"24\\" height=\\"24\\" fill=\\"currentColor\\" viewBox=\\"0 0 24 24\\" stroke=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11zm5.7-13.3l-7 7c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3l-3-3c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l2.3 2.3 6.3-6.3c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4z\\"/>\\n</svg>\\n","chevron-down":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-chevron-down\\"><polyline points=\\"6 9 12 15 18 9\\"></polyline></svg>","chevron-left":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-chevron-left\\"><polyline points=\\"15 18 9 12 15 6\\"></polyline></svg>","chevron-right":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-chevron-right\\"><polyline points=\\"9 18 15 12 9 6\\"></polyline></svg>","chevron-up":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-chevron-up\\"><polyline points=\\"18 15 12 9 6 15\\"></polyline></svg>","clipboard":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-clipboard\\"><path d=\\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\\"></path><rect x=\\"8\\" y=\\"2\\" width=\\"8\\" height=\\"4\\" rx=\\"1\\" ry=\\"1\\"></rect></svg>","coffee":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-coffee\\"><path d=\\"M18 8h1a4 4 0 0 1 0 8h-1\\"></path><path d=\\"M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z\\"></path><line x1=\\"6\\" y1=\\"1\\" x2=\\"6\\" y2=\\"4\\"></line><line x1=\\"10\\" y1=\\"1\\" x2=\\"10\\" y2=\\"4\\"></line><line x1=\\"14\\" y1=\\"1\\" x2=\\"14\\" y2=\\"4\\"></line></svg>","collapse":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M15 20.3L12 18l-3 2.3M12 22v-4M9 3.7L12 6l3-2.3M12 2v4M5 10h14M5 14h14\\"/></svg>","compass":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-compass\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"></circle><polygon points=\\"16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76\\"></polygon></svg>","copy":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-copy\\"><rect x=\\"9\\" y=\\"9\\" width=\\"13\\" height=\\"13\\" rx=\\"2\\" ry=\\"2\\"></rect><path d=\\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\\"></path></svg>","corner-down-left":"<svg width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M9 10L4 15L9 20\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M20 4V11C20 13.2091 18.2091 15 16 15H4\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","corner-down-right":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-corner-down-right\\"><polyline points=\\"15 10 20 15 15 20\\"></polyline><path d=\\"M4 4v7a4 4 0 0 0 4 4h12\\"></path></svg>","download":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-download\\"><path d=\\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\\"></path><polyline points=\\"7 10 12 15 17 10\\"></polyline><line x1=\\"12\\" y1=\\"15\\" x2=\\"12\\" y2=\\"3\\"></line></svg>","edit-3":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-edit-3\\"><path d=\\"M12 20h9\\"></path><path d=\\"M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z\\"></path></svg>","edit-3-filled":"<svg width=\\"24\\" height=\\"24\\" fill=\\"currentColor\\" viewBox=\\"0 0 24 24\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M12 20h9\\" fill=\\"none\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M18 2.83c-.695 0-1.362.276-1.854.768l-12.5 12.5a.5.5 0 00-.131.232l-1 4a.5.5 0 00.606.606l4-1a.5.5 0 00.233-.131l12.5-12.5A2.62 2.62 0 0018 2.83z\\" stroke=\\"none\\"/>\\n</svg>\\n","education":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\">\\n  <path clip-rule=\\"evenodd\\" d=\\"M12 2 1 8l11 6 11-6-11-6Z\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" />\\n  <path d=\\"M5 11v7l7 4.5 7-4.5v-7\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" />\\n  <path d=\\"M23 8v8\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" />\\n</svg>\\n","expand":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M9 19.7l3 2.3 3-2.3M12 18v4M15 4.3L12 2 9 4.3M12 6V2M5 10h14M5 14h14\\"/></svg>","external-link":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-external-link\\"><path d=\\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\\"></path><polyline points=\\"15 3 21 3 21 9\\"></polyline><line x1=\\"10\\" y1=\\"14\\" x2=\\"21\\" y2=\\"3\\"></line></svg>","eye":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-eye\\"><path d=\\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\\"></path><circle cx=\\"12\\" cy=\\"12\\" r=\\"3\\"></circle></svg>","eye-off":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-eye-off\\"><path d=\\"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24\\"></path><line x1=\\"1\\" y1=\\"1\\" x2=\\"23\\" y2=\\"23\\"></line></svg>","face-happy":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\"\\n     stroke-width=\\"2\\"\\n     stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\">\\n    <circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"/>\\n    <path d=\\"M16 14.7c-2.2 2.2-5.8 2.2-8 0M8.9 9.4h0M15.1 9.4h0\\"/>\\n</svg>\\n","face-neutral":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\"\\n     stroke-width=\\"2\\"\\n     stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\">\\n    <path d=\\"M8.9 9.4h0M15.1 9.4h0\\"/>\\n    <circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"/>\\n    <path d=\\"M16 15.5H8\\"/>\\n</svg>\\n","face-sad":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\"\\n     stroke-width=\\"2\\"\\n     stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\">\\n    <path d=\\"M8.9 9.4h0M15.1 9.4h0\\"/>\\n    <circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"/>\\n    <path d=\\"M8 16.3c2.2-2.2 5.8-2.2 8 0\\"/>\\n</svg>\\n","file-text":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-file-text\\"><path d=\\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\\"></path><polyline points=\\"14 2 14 8 20 8\\"></polyline><line x1=\\"16\\" y1=\\"13\\" x2=\\"8\\" y2=\\"13\\"></line><line x1=\\"16\\" y1=\\"17\\" x2=\\"8\\" y2=\\"17\\"></line><polyline points=\\"10 9 9 9 8 9\\"></polyline></svg>","filled-dot":"<svg width=\\"24\\" height=\\"24\\" fill=\\"currentColor\\" viewBox=\\"0 0 24 24\\" stroke=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <circle cx=\\"12\\" cy=\\"12\\" r=\\"4\\"/>\\n</svg>\\n","flag":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-flag\\"><path d=\\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z\\"></path><line x1=\\"4\\" y1=\\"22\\" x2=\\"4\\" y2=\\"15\\"></line></svg>","flag-filled":"<svg width=\\"24\\" height=\\"24\\" fill=\\"currentColor\\" viewBox=\\"0 0 24 24\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v12z\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M4 22v-7\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","flask":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M4.4 21h15.2c1.1 0 1.8-1.2 1.3-2.2L14.3 7.3V3H9.7v4.3L3.1 18.8c-.5 1 .2 2.2 1.3 2.2zM8.5 3h7M5 16h14\\"/></svg>","flowchart":"<svg width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\"><path clip-rule=\\"evenodd\\" d=\\"M2 5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5ZM17 5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V5ZM17 15a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-4Z\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M17 7h-5M7 7h5m5 11h-3a2 2 0 0 1-2-2V7\\" stroke-width=\\"2\\"/></svg>","folder":"<svg width=\\"24\\" height=\\"24\\" fill=\\"none\\" viewBox=\\"0 0 24 24\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M3.6 8a.58.58 0 0 0-.6.6v11.2c0 .348.252.6.6.6h12.8a.58.58 0 0 0 .6-.6V11a.58.58 0 0 0-.6-.6H9.2c-.334 0-.646-.168-.832-.446L7.065 8H3.6Zm12.8 14.4H3.6A2.572 2.572 0 0 1 1 19.8V8.6C1 7.142 2.142 6 3.6 6h4c.334 0 .646.167.832.444L9.735 8.4H16.4c1.458 0 2.6 1.143 2.6 2.6v8.8c0 1.459-1.142 2.6-2.6 2.6ZM22 21a1 1 0 0 1-1-1V3H9v1a1 1 0 0 1-2 0V2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1ZM18 7h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z\\" fill=\\"currentColor\\"/>\\n</svg>\\n","folder-check-filled":"<svg width=\\"24\\" height=\\"24\\" fill=\\"currentColor\\" viewBox=\\"0 0 24 24\\" stroke=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M1 5a3 3 0 013-3h5a1 1 0 01.832.445L11.535 5H20a3 3 0 013 3v11a3 3 0 01-3 3H4a3 3 0 01-3-3V5zm15.707 5.707a1 1 0 00-1.414-1.414L10 14.586l-1.793-1.793a1 1 0 00-1.414 1.414l2.5 2.5a1 1 0 001.414 0l6-6z\\"/>\\n</svg>\\n","folder-plus":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-folder-plus\\"><path d=\\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\\"></path><line x1=\\"12\\" y1=\\"11\\" x2=\\"12\\" y2=\\"17\\"></line><line x1=\\"9\\" y1=\\"14\\" x2=\\"15\\" y2=\\"14\\"></line></svg>","gift":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\"><path d=\\"M20.7992 11.9999V22.9999H3.19922V11.9999\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M23 6.49988H1V11.9999H23V6.49988Z\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M11.9995 22.9999V6.49988\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M12.0003 6.5H7.05029C6.32095 6.5 5.62147 6.21027 5.10575 5.69454C4.59002 5.17882 4.30029 4.47935 4.30029 3.75C4.30029 3.02065 4.59002 2.32118 5.10575 1.80546C5.62147 1.28973 6.32095 1 7.05029 1C10.9003 1 12.0003 6.5 12.0003 6.5Z\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M11.9995 6.5H16.9495C17.6789 6.5 18.3783 6.21027 18.8941 5.69454C19.4098 5.17882 19.6995 4.47935 19.6995 3.75C19.6995 3.02065 19.4098 2.32118 18.8941 1.80546C18.3783 1.28973 17.6789 1 16.9495 1C13.0995 1 11.9995 6.5 11.9995 6.5Z\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/></svg>","hammer-filled":"<svg width=\\"24\\" height=\\"24\\" fill=\\"currentColor\\" viewBox=\\"0 0 24 24\\" stroke=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M15.741 3.293l6 6c.48.479.743 1.103.743 1.757 0 .654-.263 1.278-.743 1.758l-1.399 1.399a2.482 2.482 0 01-1.758.738 2.479 2.479 0 01-1.756-.737l-1.711-1.693-8.582 8.581a.997.997 0 01-1.414 0l-2.828-2.828a1 1 0 010-1.415l8.559-8.559-3.621-3.583A.998.998 0 017.934 3h7.1c.266 0 .52.105.707.293z\\"/>\\n</svg>\\n","headphones":"<svg width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M3 18v-6a9 9 0 0 1 18 0v6\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M21 14h1a1 1 0 0 0-1-1v1ZM3 14v-1a1 1 0 0 0-1 1h1Zm17 5a1 1 0 0 1-1 1v2a3 3 0 0 0 3-3h-2Zm-1 1h-1v2h1v-2Zm-1 0a1 1 0 0 1-1-1h-2a3 3 0 0 0 3 3v-2Zm-1-1v-3h-2v3h2Zm0-3a1 1 0 0 1 1-1v-2a3 3 0 0 0-3 3h2Zm1-1h3v-2h-3v2Zm2-1v5h2v-5h-2ZM2 19a3 3 0 0 0 3 3v-2a1 1 0 0 1-1-1H2Zm3 3h1v-2H5v2Zm1 0a3 3 0 0 0 3-3H7a1 1 0 0 1-1 1v2Zm3-3v-3H7v3h2Zm0-3a3 3 0 0 0-3-3v2a1 1 0 0 1 1 1h2Zm-3-3H3v2h3v-2Zm-4 1v5h2v-5H2Z\\" fill=\\"currentColor\\"/>\\n</svg>","help-circle":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-help-circle\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"></circle><path d=\\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\\"></path><line x1=\\"12\\" y1=\\"17\\" x2=\\"12.01\\" y2=\\"17\\"></line></svg>","home":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-home\\"><path d=\\"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\\"></path><polyline points=\\"9 22 9 12 15 12 15 22\\"></polyline></svg>","image":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-image\\"><rect x=\\"3\\" y=\\"3\\" width=\\"18\\" height=\\"18\\" rx=\\"2\\" ry=\\"2\\"></rect><circle cx=\\"8.5\\" cy=\\"8.5\\" r=\\"1.5\\"></circle><polyline points=\\"21 15 16 10 5 21\\"></polyline></svg>","institution":"<svg viewBox=\\"0 0 24 24\\" width=\\"24\\" height=\\"24\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\"><path d=\\"M9.5 11.5h5\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\"/><path d=\\"M17.75 9.582V19.75a1 1 0 0 1-1 1h-9.5a1 1 0 0 1-1-1V9.582a1 1 0 0 1 .42-.815l4.75-3.378a1 1 0 0 1 1.16 0l4.75 3.378a1 1 0 0 1 .42.815Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/><path d=\\"M13.875 21v-5.25h-3.75V21\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M4.8 12H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-.8M12.195 4.874V2M12.5 3.5 15 3\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\"/></svg>\\n","layers":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-layers\\"><polygon points=\\"12 2 2 7 12 12 22 7 12 2\\"></polygon><polyline points=\\"2 17 12 22 22 17\\"></polyline><polyline points=\\"2 12 12 17 22 12\\"></polyline></svg>","link":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-link\\"><path d=\\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\\"></path><path d=\\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\\"></path></svg>","list":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-list\\"><line x1=\\"8\\" y1=\\"6\\" x2=\\"21\\" y2=\\"6\\"></line><line x1=\\"8\\" y1=\\"12\\" x2=\\"21\\" y2=\\"12\\"></line><line x1=\\"8\\" y1=\\"18\\" x2=\\"21\\" y2=\\"18\\"></line><line x1=\\"3\\" y1=\\"6\\" x2=\\"3.01\\" y2=\\"6\\"></line><line x1=\\"3\\" y1=\\"12\\" x2=\\"3.01\\" y2=\\"12\\"></line><line x1=\\"3\\" y1=\\"18\\" x2=\\"3.01\\" y2=\\"18\\"></line></svg>","loader":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-loader\\"><line x1=\\"12\\" y1=\\"2\\" x2=\\"12\\" y2=\\"6\\"></line><line x1=\\"12\\" y1=\\"18\\" x2=\\"12\\" y2=\\"22\\"></line><line x1=\\"4.93\\" y1=\\"4.93\\" x2=\\"7.76\\" y2=\\"7.76\\"></line><line x1=\\"16.24\\" y1=\\"16.24\\" x2=\\"19.07\\" y2=\\"19.07\\"></line><line x1=\\"2\\" y1=\\"12\\" x2=\\"6\\" y2=\\"12\\"></line><line x1=\\"18\\" y1=\\"12\\" x2=\\"22\\" y2=\\"12\\"></line><line x1=\\"4.93\\" y1=\\"19.07\\" x2=\\"7.76\\" y2=\\"16.24\\"></line><line x1=\\"16.24\\" y1=\\"7.76\\" x2=\\"19.07\\" y2=\\"4.93\\"></line></svg>","mail":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-mail\\"><path d=\\"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z\\"></path><polyline points=\\"22,6 12,13 2,6\\"></polyline></svg>","maximize":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-maximize\\"><path d=\\"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3\\"></path></svg>","maximize-2":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-maximize-2\\"><polyline points=\\"15 3 21 3 21 9\\"></polyline><polyline points=\\"9 21 3 21 3 15\\"></polyline><line x1=\\"21\\" y1=\\"3\\" x2=\\"14\\" y2=\\"10\\"></line><line x1=\\"3\\" y1=\\"21\\" x2=\\"10\\" y2=\\"14\\"></line></svg>","menu":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-menu\\"><line x1=\\"3\\" y1=\\"12\\" x2=\\"21\\" y2=\\"12\\"></line><line x1=\\"3\\" y1=\\"6\\" x2=\\"21\\" y2=\\"6\\"></line><line x1=\\"3\\" y1=\\"18\\" x2=\\"21\\" y2=\\"18\\"></line></svg>","message-circle":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" viewBox=\\"0 0 24 24\\"><path d=\\"M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z\\"/></svg>","minus":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-minus\\"><line x1=\\"5\\" y1=\\"12\\" x2=\\"19\\" y2=\\"12\\"></line></svg>","more-horizontal":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-more-horizontal\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"1\\"></circle><circle cx=\\"19\\" cy=\\"12\\" r=\\"1\\"></circle><circle cx=\\"5\\" cy=\\"12\\" r=\\"1\\"></circle></svg>","more-vertical":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-more-vertical\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"1\\"></circle><circle cx=\\"12\\" cy=\\"5\\" r=\\"1\\"></circle><circle cx=\\"12\\" cy=\\"19\\" r=\\"1\\"></circle></svg>","percent":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-percent\\"><line x1=\\"19\\" y1=\\"5\\" x2=\\"5\\" y2=\\"19\\"></line><circle cx=\\"6.5\\" cy=\\"6.5\\" r=\\"2.5\\"></circle><circle cx=\\"17.5\\" cy=\\"17.5\\" r=\\"2.5\\"></circle></svg>","pill":"<svg width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n<path d=\\"M4.22214 12.7071C3.28794 13.6455 2.76413 14.9161 2.76563 16.2403C2.76712 17.5644 3.2938 18.8339 4.23012 19.7702C5.16643 20.7065 6.43591 21.2331 7.76005 21.2346C9.08419 21.2361 10.3548 20.7123 11.2932 19.7781L15.5358 15.5355L8.46484 8.46436L4.22214 12.7071Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n<path d=\\"M12.7074 4.2218L8.46484 8.4644L15.5358 15.5355L19.7785 11.2929C20.7162 10.3552 21.243 9.08344 21.243 7.75735C21.243 6.43126 20.7162 5.15948 19.7785 4.2218C18.8409 3.28411 17.5691 2.75732 16.243 2.75732C14.9169 2.75732 13.6451 3.28411 12.7074 4.2218V4.2218Z\\" fill=\\"currentColor\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","play-circle":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-play-circle\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"></circle><polygon points=\\"10 8 16 12 10 16 10 8\\"></polygon></svg>","play-filled":"<svg width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\"><path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M7.04162 4.24458C7.68377 3.894 8.4661 3.92202 9.08151 4.31764L18.4148 10.3176C18.9873 10.6856 19.3333 11.3195 19.3333 12C19.3333 12.6805 18.9873 13.3144 18.4148 13.6824L9.08151 19.6824C8.4661 20.078 7.68377 20.106 7.04162 19.7554C6.39948 19.4048 6 18.7316 6 18V6C6 5.26839 6.39948 4.59516 7.04162 4.24458Z\\"/></svg>","plus":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-plus\\"><line x1=\\"12\\" y1=\\"5\\" x2=\\"12\\" y2=\\"19\\"></line><line x1=\\"5\\" y1=\\"12\\" x2=\\"19\\" y2=\\"12\\"></line></svg>","plus-circle":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-plus-circle\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"></circle><line x1=\\"12\\" y1=\\"8\\" x2=\\"12\\" y2=\\"16\\"></line><line x1=\\"8\\" y1=\\"12\\" x2=\\"16\\" y2=\\"12\\"></line></svg>","plus-circle-filled":"<svg width=\\"24\\" height=\\"24\\" fill=\\"currentColor\\" viewBox=\\"0 0 24 24\\" stroke=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm11-5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H8a1 1 0 110-2h3V8a1 1 0 011-1z\\"/>\\n</svg>\\n","quiz":"<svg width=\\"22\\" height=\\"22\\" viewBox=\\"0 0 22 22\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M6.8 12.0999C7.352 12.0999 7.8 12.5469 7.8 13.0999C7.8 13.6529 7.352 14.0999 6.8 14.0999C3.05 14.0999 0 11.0049 0 7.1999C0 3.3869 2.987 0.399902 6.8 0.399902C10.55 0.399902 13.6 3.4509 13.6 7.1999C13.6 7.7519 13.153 8.1999 12.6 8.1999C12.047 8.1999 11.6 7.7519 11.6 7.1999C11.6 4.5539 9.446 2.3999 6.8 2.3999C4.109 2.3999 2 4.5089 2 7.1999C2 9.9479 4.109 12.0999 6.8 12.0999ZM5.8 4.7C5.8 4.148 6.248 3.7 6.8 3.7C7.352 3.7 7.8 4.148 7.8 4.7V6.785L8.807 7.793C9.198 8.183 9.198 8.816 8.807 9.207C8.612 9.402 8.356 9.5 8.1 9.5C7.844 9.5 7.589 9.402 7.393 9.207L6.093 7.907C5.905 7.72 5.8 7.465 5.8 7.2V4.7ZM13.0998 17.1859L10.9138 14.9999L17.4008 8.51389L19.5858 10.6999L13.0998 17.1859ZM10.6858 19.5999H8.49979V17.4149L9.49979 16.4149L11.6858 18.5999L10.6858 19.5999ZM21.7068 9.99291L18.1078 6.39291C17.9198 6.20591 17.6658 6.09991 17.4008 6.09991C17.1348 6.09991 16.8808 6.20591 16.6938 6.39291L6.79279 16.2929C6.60579 16.4809 6.49979 16.7349 6.49979 16.9999V20.5999C6.49979 21.1529 6.94779 21.5999 7.49979 21.5999H11.0998C11.3658 21.5999 11.6198 21.4949 11.8078 21.3069L21.7068 11.4069C22.0978 11.0169 22.0978 10.3839 21.7068 9.99291Z\\" fill=\\"currentColor\\"/>\\n</svg>\\n","reset":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-rotate-ccw\\"><polyline points=\\"1 4 1 10 7 10\\"></polyline><path d=\\"M3.51 15a9 9 0 1 0 2.13-9.36L1 10\\"></path></svg>","rotate-cw":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-rotate-cw\\"><polyline points=\\"23 4 23 10 17 10\\"></polyline><path d=\\"M20.49 15a9 9 0 1 1-2.12-9.36L23 10\\"></path></svg>","search":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-search\\"><circle cx=\\"11\\" cy=\\"11\\" r=\\"8\\"></circle><line x1=\\"21\\" y1=\\"21\\" x2=\\"16.65\\" y2=\\"16.65\\"></line></svg>","search-list":"<svg width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\"><path d=\\"M4 6h16M15 12h5M16 18h4\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path clip-rule=\\"evenodd\\" d=\\"M7.125 19.5a4.375 4.375 0 100-8.75 4.375 4.375 0 000 8.75z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M13.25 21.25l-3.033-3.033\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/></svg>","settings":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-settings\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"3\\"></circle><path d=\\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\\"></path></svg>","share":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-share\\"><path d=\\"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8\\"></path><polyline points=\\"16 6 12 2 8 6\\"></polyline><line x1=\\"12\\" y1=\\"2\\" x2=\\"12\\" y2=\\"15\\"></line></svg>","shopping-bag":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-shopping-bag\\"><path d=\\"M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z\\"></path><line x1=\\"3\\" y1=\\"6\\" x2=\\"21\\" y2=\\"6\\"></line><path d=\\"M16 10a4 4 0 0 1-8 0\\"></path></svg>","show-all":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n    <path\\n        d=\\"M13.333 2H4c-.733 0-1.333.6-1.333 1.333v3.334L.667 8l2 1.333v3.334C2.667 13.4 3.267 14 4 14h9.333c.734 0 1.334-.6 1.334-1.333V3.333c0-.733-.6-1.333-1.334-1.333z\\"\\n        stroke=\\"currentColor\\" stroke-width=\\"1.333\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" />\\n    <path\\n        d=\\"M9.693 9.673H7.64l-.393 1.174H6L8.12 5.16h1.087l2.126 5.687h-1.246l-.394-1.174zm-1.74-.953h1.42L8.66 6.593 7.953 8.72z\\"\\n        fill=\\"currentColor\\" />\\n</svg>\\n","sliders":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-sliders\\"><line x1=\\"4\\" y1=\\"21\\" x2=\\"4\\" y2=\\"14\\"></line><line x1=\\"4\\" y1=\\"10\\" x2=\\"4\\" y2=\\"3\\"></line><line x1=\\"12\\" y1=\\"21\\" x2=\\"12\\" y2=\\"12\\"></line><line x1=\\"12\\" y1=\\"8\\" x2=\\"12\\" y2=\\"3\\"></line><line x1=\\"20\\" y1=\\"21\\" x2=\\"20\\" y2=\\"16\\"></line><line x1=\\"20\\" y1=\\"12\\" x2=\\"20\\" y2=\\"3\\"></line><line x1=\\"1\\" y1=\\"14\\" x2=\\"7\\" y2=\\"14\\"></line><line x1=\\"9\\" y1=\\"8\\" x2=\\"15\\" y2=\\"8\\"></line><line x1=\\"17\\" y1=\\"16\\" x2=\\"23\\" y2=\\"16\\"></line></svg>","smartzoom":"<svg width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"m7.593 15.164-1.7-1a1 1 0 0 1 1.013-1.724l1.701.999a1.002 1.002 0 0 1-1.014 1.725Zm7.288-8.6C17.989 7.917 20 10.926 20 14.401c0 4.676-3.504 8.372-8.151 8.6H5a1 1 0 1 1 0-1.999h6.8c3.514-.173 6.2-3.01 6.2-6.6 0-2.997-1.954-5.543-4.862-6.336a1 1 0 0 1-.598-1.475l1.076-1.817-2.545-1.42-3.695 6.37 2.561 1.43 1.103-1.862a1 1 0 0 1 1.082-.466c2.653.603 4.578 2.948 4.578 5.575 0 3.143-2.656 5.8-5.8 5.8a5.764 5.764 0 0 1-3.791-1.4H5a1 1 0 1 1 0-2h2.5c.265 0 .52.106.707.293a3.78 3.78 0 0 0 2.693 1.107c2.06 0 3.8-1.74 3.8-3.8 0-1.474-.953-2.815-2.345-3.406l-1.195 2.016a.998.998 0 0 1-1.347.363l-4.3-2.4A1.003 1.003 0 0 1 5.135 9.6l4.701-8.1a.996.996 0 0 1 1.352-.37l4.299 2.4a1.002 1.002 0 0 1 .373 1.382l-.979 1.653Z\\" fill=\\"currentColor\\"/>\\n</svg>","sort":"<svg width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M6 5v15M11 15l-5 5-5-5M18 19V4M13 9l5-5 5 5\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>","star":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-star\\"><polygon points=\\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\\"></polygon></svg>","stethoscope":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\">\\n    <path d=\\"M13.1 2.5h2.3v4.6c0 3.2-2.6 5.7-5.7 5.7S4 10.2 4 7.1V2.5h2.3\\"/>\\n    <circle cx=\\"17.7\\" cy=\\"15\\" r=\\"2.3\\"/>\\n    <path d=\\"M17.7 17.5c0 2.2-1.8 4-4 4s-4-1.8-4-4M9.7 17.5v-4\\"/>\\n</svg>\\n","tag":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-tag\\"><path d=\\"M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z\\"></path><line x1=\\"7\\" y1=\\"7\\" x2=\\"7.01\\" y2=\\"7\\"></line></svg>","text-zoom-reset":"<svg width=\\"24\\" height=\\"24\\" fill=\\"currentColor\\" stroke=\\"none\\" viewBox=\\"0 0 24 24\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M12.509 18H9.454l-.9-2H4.447l-.9 2H1.354l4.234-9.41h1.824l3.56 7.91 4.607-10.89h1.842L22.663 18H20.49l-1.269-3h-5.444l-1.269 3zM6.5 11.437L7.654 14H5.347L6.5 11.437zM18.376 13L16.5 8.566 14.624 13h3.752z\\"/>\\n</svg>\\n","thumbs-up":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-thumbs-up\\"><path d=\\"M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3\\"></path></svg>","timer-off":"\\n<svg width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\"><path d=\\"M6.848 6.88a8 8 0 1 0 11.275 11.27M19.748 15A8 8 0 0 0 10 5.252M15.5 9.5l-.5.5\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M12 5V2\\"  stroke-width=\\"2\\"/><path d=\\"M10 2h4\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\"/><path d=\\"m4 4 17 17\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/></svg>","timer-on":"<svg width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\"><path d=\\"M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM15 10l-3 3\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M12 5V2\\" stroke-width=\\"2\\"/><path d=\\"M10 2h4\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\"/></svg>","trash-2":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-trash-2\\"><polyline points=\\"3 6 5 6 21 6\\"></polyline><path d=\\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\\"></path><line x1=\\"10\\" y1=\\"11\\" x2=\\"10\\" y2=\\"17\\"></line><line x1=\\"14\\" y1=\\"11\\" x2=\\"14\\" y2=\\"17\\"></line></svg>","user":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-user\\"><path d=\\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\\"></path><circle cx=\\"12\\" cy=\\"7\\" r=\\"4\\"></circle></svg>","users":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-users\\"><path d=\\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\\"></path><circle cx=\\"9\\" cy=\\"7\\" r=\\"4\\"></circle><path d=\\"M23 21v-2a4 4 0 0 0-3-3.87\\"></path><path d=\\"M16 3.13a4 4 0 0 1 0 7.75\\"></path></svg>","watch":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-watch\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"7\\"></circle><polyline points=\\"12 9 12 12 13.5 13.5\\"></polyline><path d=\\"M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83\\"></path></svg>","wifi":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-wifi\\"><path d=\\"M5 12.55a11 11 0 0 1 14.08 0\\"></path><path d=\\"M1.42 9a16 16 0 0 1 21.16 0\\"></path><path d=\\"M8.53 16.11a6 6 0 0 1 6.95 0\\"></path><line x1=\\"12\\" y1=\\"20\\" x2=\\"12.01\\" y2=\\"20\\"></line></svg>","wifi-off":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-wifi-off\\"><line x1=\\"1\\" y1=\\"1\\" x2=\\"23\\" y2=\\"23\\"></line><path d=\\"M16.72 11.06A10.94 10.94 0 0 1 19 12.55\\"></path><path d=\\"M5 12.55a10.94 10.94 0 0 1 5.17-2.39\\"></path><path d=\\"M10.71 5.05A16 16 0 0 1 22.58 9\\"></path><path d=\\"M1.42 9a15.91 15.91 0 0 1 4.7-2.88\\"></path><path d=\\"M8.53 16.11a6 6 0 0 1 6.95 0\\"></path><line x1=\\"12\\" y1=\\"20\\" x2=\\"12.01\\" y2=\\"20\\"></line></svg>","x":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" class=\\"feather feather-x\\"><line x1=\\"18\\" y1=\\"6\\" x2=\\"6\\" y2=\\"18\\"></line><line x1=\\"6\\" y1=\\"6\\" x2=\\"18\\" y2=\\"18\\"></line></svg>","x-circle-filled":"<svg width=\\"24\\" height=\\"24\\" fill=\\"currentColor\\" viewBox=\\"0 0 24 24\\" stroke=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11zm4.707-15.707a1 1 0 010 1.414L13.414 12l3.293 3.293a1 1 0 01-1.414 1.414L12 13.414l-3.293 3.293a1 1 0 01-1.414-1.414L10.586 12 7.293 8.707a1 1 0 011.414-1.414L12 10.586l3.293-3.293a1 1 0 011.414 0z\\"/>\\n</svg>\\n"}');
    }, function(e3) {
      e3.exports = JSON.parse('{"alert-circle":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <circle cx=\\"8\\" cy=\\"8\\" r=\\"7\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <circle cx=\\"8\\" cy=\\"11\\" r=\\"1\\" fill=\\"currentColor\\"/>\\n  <path d=\\"M8 4v5\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n</svg>","alert-triangle":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path clip-rule=\\"evenodd\\" d=\\"M6.854 1.691 1.18 11.846c-.239.442-.24.986-.004 1.43.236.442.673.718 1.15.724h11.349a1.328 1.328 0 0 0 1.15-.725 1.526 1.526 0 0 0-.005-1.43L9.146 1.692A1.324 1.324 0 0 0 8 1c-.468 0-.903.262-1.146.691Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M8 5v4\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n  <rect x=\\"7\\" y=\\"10\\" width=\\"2\\" height=\\"2\\" rx=\\"1\\" fill=\\"currentColor\\"/>\\n</svg>","align-left":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\"><path d=\\"M2 8h8M2 12h10M2 4h12\\"  stroke-width=\\"2\\"/></svg>","arrow-left":"<svg width=\\"16\\" height=\\"16\\" fill=\\"none\\" viewBox=\\"0 0 16 16\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M4 8h10\\" stroke-width=\\"2\\" stroke-linejoin=\\"bevel\\"/>\\n  <path d=\\"M7 12L3 8l4-4\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","arrow-right":"<svg width=\\"16\\" height=\\"16\\" fill=\\"none\\" viewBox=\\"0 0 16 16\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M2 8h10\\" stroke-width=\\"2\\" stroke-linejoin=\\"bevel\\"/>\\n  <path d=\\"M9 4l4 4-4 4\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","article":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n    <rect x=\\"3\\" y=\\"2\\" width=\\"10\\" height=\\"12\\" rx=\\"1\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n    <path d=\\"M5 5h6M5 8h4M5 11h5\\" stroke-width=\\"2\\"/>\\n</svg>\\n","auditor":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <circle cx=\\"4\\" cy=\\"5\\" r=\\"3\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <circle cx=\\"12\\" cy=\\"5\\" r=\\"3\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <path d=\\"M7 5h2\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M14.807 10.79A.667.667 0 0 1 16 11.2c0 2.205-1.953 4.067-4.267 4.067-1.562 0-2.957-.758-3.734-1.943-.78 1.188-2.172 1.943-3.732 1.943C1.954 15.267 0 13.405 0 11.2a.667.667 0 0 1 1.193-.41c.19.244.719.81 1.54.81.688 0 1.337-.343 1.615-.853.424-.742 1.2-1.214 1.985-1.214A2.32 2.32 0 0 1 8 10.25a2.322 2.322 0 0 1 1.667-.716c.785 0 1.562.472 1.978 1.204.286.52.935.863 1.622.863.822 0 1.351-.566 1.54-.81Z\\" fill=\\"currentColor\\"/>\\n</svg>","bar-chart-2":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M5 10a1 1 0 0 0-2 0h2Zm4-7a1 1 0 0 0-2 0h2Zm4 4a1 1 0 1 0-2 0h2Zm-8 7v-4H3v4h2Zm4 0V3H7v11h2Zm4 0V7h-2v7h2Z\\" fill=\\"currentColor\\"/>\\n</svg>","bell":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M12 5.6c0-.955-.421-1.87-1.172-2.546C10.078 2.38 9.061 2 8 2c-1.06 0-2.078.38-2.828 1.054C4.422 3.73 4 4.645 4 5.6 4 9.8 2 11 2 11h12s-2-1.2-2-5.4ZM9.153 14a1.333 1.333 0 0 1-2.306 0\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>","bookmark":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path clip-rule=\\"evenodd\\" d=\\"m13 14-5-3.333L3 14V3.333C3 2.597 3.64 2 4.429 2h7.142C12.361 2 13 2.597 13 3.333V14Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>","box":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path clip-rule=\\"evenodd\\" d=\\"m8.623 1.136 5.6 2.6c.476.22.777.671.777 1.165v6.197c0 .493-.301.944-.777 1.163l-5.6 2.602a1.496 1.496 0 0 1-1.253 0l-5.6-2.601c-.475-.223-.774-.677-.77-1.17V4.9c0-.494.301-.945.777-1.164l5.6-2.601a1.496 1.496 0 0 1 1.246 0Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"m1 4.5 7 3 7-3\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M8 8v7\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n</svg>","bubble":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M4 2a1 1 0 0 0-1 1v3.222L1.638 7.67c-.091.097-.236.17-.255.3a.206.206 0 0 0 0 .06c.02.13.164.203.255.3L3 9.778V13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>","bubble-check":"<svg width=\\"16\\" height=\\"16\\" fill=\\"none\\" stroke=\\"currentColor\\" viewBox=\\"0 0 16 16\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M4 2a1 1 0 00-1 1v3.222L1.5 7.817a.2.2 0 000 .366L3 9.778V13a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1H4z\\" stroke-width=\\"2\\"/>\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M7.828 10.844L12.5 6.172 11.344 5 7.828 8.5 6.672 7.344 5.5 8.5l2.328 2.344z\\" stroke=\\"none\\" fill=\\"currentColor\\"/>\\n</svg>\\n","bubble-image":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M4 2a1 1 0 0 0-1 1v3.222L1.638 7.67c-.091.097-.236.17-.255.3a.206.206 0 0 0 0 .06c.02.13.164.203.255.3L3 9.778V13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <circle cx=\\"10.5\\" cy=\\"5.5\\" r=\\"1.5\\" fill=\\"currentColor\\"/>\\n  <path d=\\"m3 11 3-3 3 3 2-1.5 4 3.5\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n</svg>","bubble-pill":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M4 2a1 1 0 0 0-1 1v3.222L1.5 7.817a.2.2 0 0 0 0 .366L3 9.778V13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <path d=\\"M11.488 5.568A1.737 1.737 0 0 0 10.16 5c-.472.01-.937.197-1.306.528-.016.014-.022.032-.035.047-.013.01-.029.015-.041.027l-2.19 2.176c-.01.01-.014.023-.023.033-.01.009-.023.012-.033.021-.7.697-.71 1.838-.02 2.6A1.73 1.73 0 0 0 7.809 11c.466 0 .945-.176 1.34-.528.015-.014.022-.034.035-.048.013-.011.028-.015.04-.027l2.19-2.176c.01-.01.014-.023.022-.032.01-.01.024-.012.033-.022.701-.696.71-1.837.02-2.599Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M10.314 9.314 8 7l-.314-.314-1.1 1.092-.012.018a.086.086 0 0 1-.01.015.089.089 0 0 1-.015.01.078.078 0 0 0-.018.011c-.7.697-.71 1.838-.02 2.6A1.73 1.73 0 0 0 7.809 11c.466 0 .945-.176 1.34-.528a.13.13 0 0 0 .02-.027c.004-.008.01-.015.015-.021a.116.116 0 0 1 .018-.012c.008-.004.015-.008.022-.015l1.09-1.083Z\\" fill=\\"currentColor\\"/>\\n</svg>","bubble-text":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M4 2a1 1 0 0 0-1 1v3.222L1.638 7.67c-.091.097-.236.17-.255.3a.206.206 0 0 0 0 .06c.02.13.164.203.255.3L3 9.778V13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M6 6h6m-6 4h5\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n</svg>","bulb":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M8 1a5 5 0 0 0-3.384 8.681c.232.213.384.504.384.819v2.086a1 1 0 0 0 .293.707l1.414 1.414a1 1 0 0 0 .707.293h1.172a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 0 0 .293-.707V10.5c0-.315.152-.606.384-.819A5 5 0 0 0 8 1Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <path d=\\"M6.5 6h3M8 7v4.5M5 12h6\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>","calculator":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M2 2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M4 6a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0ZM8 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm3 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM8 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM5 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm5 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm-5-1a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2H5Z\\" fill=\\"currentColor\\"/>\\n  <path fill=\\"currentColor\\" d=\\"M2 1h12v3H2z\\"/>\\n</svg>","check-circle":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M14 7.895V8.5a6.5 6.5 0 1 1-3.854-5.941\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M14.667 2.667 7.333 10l-2-2\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>","check-square":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M5 7.5 7.5 10l7-8\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M14 8v4.667c0 .736-.597 1.333-1.333 1.333H3.333A1.333 1.333 0 0 1 2 12.667V3.333C2 2.597 2.597 2 3.333 2H10\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>","checkmark-circle-filled":"<svg width=\\"16\\" height=\\"16\\" fill=\\"currentColor\\" viewBox=\\"0 0 16 16\\" stroke=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M12.95 12.95a7 7 0 11-9.9-9.9 7 7 0 019.9 9.9zM12 6.203L7.016 11 4 8.08l1.25-1.187 1.766 1.7L10.767 5 12 6.203z\\"/>\\n</svg>\\n","chevron-down":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"m4 6 4 4 4-4\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>","chevron-left":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M10 12 6 8l4-4\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>","chevron-right":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"m6 12 4-4-4-4\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>","chevron-up":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M12 10 8 6l-4 4\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>","clipboard":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\"><path d=\\"M10.5 2h1.25c.69 0 1.25.597 1.25 1.333v9.334c0 .736-.56 1.333-1.25 1.333h-7.5C3.56 14 3 13.403 3 12.667V3.333C3 2.597 3.56 2 4.25 2H5.5\\"  stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/><path clip-rule=\\"evenodd\\" d=\\"M6 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V2Z\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/></svg>","collapse":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M2 6h12M2 10h12\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"bevel\\"/>\\n  <path d=\\"m8 12 3 3H5l3-3ZM8 4 5 1h6L8 4Z\\" fill=\\"currentColor\\"/>\\n</svg>","corner-down-left":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"m7 14-4-4 4-4\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M13 3v4.333A2.667 2.667 0 0 1 10.333 10H4\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"square\\" stroke-linejoin=\\"round\\"/>\\n</svg>","corner-down-right":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"m9 6 4 4-4 4\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M3 3v4.333A2.667 2.667 0 0 0 5.667 10H12\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"square\\" stroke-linejoin=\\"round\\"/>\\n</svg>","download":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M2 9v2.6c0 .773.56 1.4 1.25 1.4h9.5c.69 0 1.25-.627 1.25-1.4V9\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M8 8V1\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"bevel\\"/>\\n  <path d=\\"M11 6 8 9 5 6\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>","edit-3":"<svg width=\\"16\\" height=\\"16\\" stroke=\\"currentColor\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M8 14h7\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M10.45 3.438a1.494 1.494 0 112.113 2.112l-7.746 7.746L2 14l.704-2.817 7.746-7.745z\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","edit-3-filled":"<svg width=\\"16\\" height=\\"16\\" fill=\\"currentColor\\" stroke=\\"none\\" viewBox=\\"0 0 16 16\\"  xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M8 14h7\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M11.932 2c-.529 0-1.036.21-1.41.584L1.776 11.33a.5.5 0 00-.131.232l-.623 2.493a.7.7 0 00.848.85l2.494-.624a.5.5 0 00.232-.132l8.746-8.745A1.994 1.994 0 0011.932 2z\\" fill=\\"currentColor\\" stroke=\\"none\\" />\\n</svg>\\n","education":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n    <path clip-rule=\\"evenodd\\" d=\\"M8 2 1 5.5 8 9l7-3.5L8 2Z\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n    <path d=\\"M4 7v5.511L8 14.5l4-1.989V7\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n    <path d=\\"M15 5.5v5\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\"/>\\n</svg>\\n","eye":"<svg width=\\"16\\" height=\\"16\\" fill=\\"none\\" stroke=\\"currentColor\\" viewBox=\\"0 0 16 16\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path clip-rule=\\"evenodd\\" d=\\"M1 8s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path clip-rule=\\"evenodd\\" d=\\"M8 10a2 2 0 100-4 2 2 0 000 4z\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","eye-off":"<svg width=\\"17\\" height=\\"16\\" fill=\\"currentColor\\" stroke=\\"none\\" viewBox=\\"0 0 16 16\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M12.3 12.57l2.286 2.344L16 13.5 2.914.086 1.5 1.5l2.013 2.064c-.537.395-1.007.826-1.407 1.245a13.327 13.327 0 00-1.65 2.135 2 2 0 000 2.112c.053.084.111.176.176.275.332.505.826 1.18 1.474 1.86C3.387 12.531 5.381 14 8 14c1.707 0 3.148-.623 4.3-1.43zm-1.42-1.455l-.868-.89a3 3 0 01-4.187-4.292l-.899-.92c-.509.345-.968.753-1.373 1.177A11.328 11.328 0 002.155 8c.044.07.093.149.148.232.284.432.705 1.007 1.25 1.577C4.66 10.97 6.165 12 8 12c1.078 0 2.043-.356 2.88-.885zM7.225 7.368A1 1 0 008.613 8.79L7.224 7.369zm-.016-5.323l2.146 2.146c1.231.35 2.271 1.14 3.092 2A11.335 11.335 0 0113.845 8a10.71 10.71 0 01-.269.412l1.435 1.435a13.582 13.582 0 00.533-.791 2 2 0 000-2.112 13.315 13.315 0 00-1.65-2.135C12.613 3.468 10.618 2 8 2c-.27 0-.534.016-.79.045z\\"/>\\n</svg>\\n","expand":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M2 6H14\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"bevel\\"/>\\n  <path d=\\"M2 10H14\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"bevel\\"/>\\n  <path d=\\"M8 16L5 13H11L8 16Z\\" fill=\\"currentColor\\"/>\\n  <path d=\\"M8 -2.38498e-08L11 3L5 3L8 -2.38498e-08Z\\" fill=\\"currentColor\\"/>\\n</svg>\\n","external-link":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M12 9v3.667c0 .736-.597 1.333-1.333 1.333H3.333A1.333 1.333 0 0 1 2 12.667V5.333C2 4.597 2.597 4 3.333 4H7M9 2h5v5M7 9l7-7\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>","face-happy":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <circle cx=\\"8\\" cy=\\"8\\" r=\\"7\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <path d=\\"M11 9.75c-.85.788-1.885 1.25-3 1.25s-2.15-.462-3-1.25\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\"/>\\n  <circle cx=\\"6\\" cy=\\"6\\" r=\\"1\\" fill=\\"currentColor\\"/>\\n  <circle cx=\\"10\\" cy=\\"6\\" r=\\"1\\" fill=\\"currentColor\\"/>\\n</svg>","face-neutral":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <circle cx=\\"8\\" cy=\\"8\\" r=\\"7\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <circle cx=\\"6\\" cy=\\"6\\" r=\\"1\\" fill=\\"currentColor\\"/>\\n  <circle cx=\\"10\\" cy=\\"6\\" r=\\"1\\" fill=\\"currentColor\\"/>\\n  <path d=\\"M5 10h6\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>","face-sad":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <circle cx=\\"8\\" cy=\\"8\\" r=\\"7\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <path d=\\"M5 10.5c.85-.788 1.885-1.25 3-1.25s2.15.462 3 1.25\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\"/>\\n  <circle cx=\\"6\\" cy=\\"6\\" r=\\"1\\" fill=\\"currentColor\\"/>\\n  <circle cx=\\"10\\" cy=\\"6\\" r=\\"1\\" fill=\\"currentColor\\"/>\\n</svg>","file-text":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M5 8h6\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <path d=\\"M5 5h2\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M5 11h6M12 15H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.172a1 1 0 0 1 .707.293l2.828 2.828a1 1 0 0 1 .293.707V14a1 1 0 0 1-1 1Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <path d=\\"M9 1v4h4\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>","filled-dot":"<svg width=\\"16\\" height=\\"16\\" fill=\\"currentColor\\" stroke=\\"none\\" viewBox=\\"0 0 16 16\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <circle cx=\\"8\\" cy=\\"8\\" r=\\"4\\"/>\\n</svg>\\n","flag":"<svg width=\\"16\\" height=\\"16\\" stroke=\\"currentColor\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M3 10s.625-.667 2.5-.667 3.125 1.334 5 1.334S13 10 13 10V3s-.625.667-2.5.667-3.125-1.334-5-1.334S3 3 3 3v7z\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M3 15v-5\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","flag-filled":"<svg width=\\"16\\" height=\\"16\\" fill=\\"currentColor\\" stroke=\\"none\\" viewBox=\\"0 0 16 16\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M5.5 1.333c-1.058 0-1.819.19-2.346.414-.262.112-.461.23-.607.334a2.202 2.202 0 00-.236.194l-.04.041A1 1 0 002 3v12h2v-4.438c.268-.105.744-.229 1.5-.229.704 0 1.306.245 2.108.587l.053.023c.752.32 1.696.724 2.839.724 1.058 0 1.819-.189 2.346-.414.262-.112.461-.23.607-.334a2.215 2.215 0 00.236-.194l.04-.041A1 1 0 0014 10V3a1 1 0 00-1.707-.71c-.03.02-.104.069-.232.124-.255.108-.744.253-1.561.253-.704 0-1.306-.245-2.108-.587l-.053-.023c-.752-.32-1.696-.724-2.839-.724z\\" />\\n</svg>\\n","flowchart":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path clip-rule=\\"evenodd\\" d=\\"M1 3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3ZM12 3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3ZM12 11a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-2Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M12 4H8M4 4h4m4 8h-2a2 2 0 0 1-2-2V4\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n</svg>","folder":"<svg width=\\"16\\" height=\\"16\\" fill=\\"none\\" viewBox=\\"0 0 16 16\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M7 2h7v11a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2h2Z\\" fill=\\"currentColor\\"/>\\n  <path d=\\"M8 4h5\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <path d=\\"M12 13.788c0 .321-.129.63-.358.857-.23.227-.54.355-.864.355H2.222c-.324 0-.635-.128-.864-.355A1.207 1.207 0 0 1 1 13.788V6.212c0-.321.129-.63.358-.857.23-.227.54-.355.864-.355h2.903l1.222 2h4.43c.325 0 .636.128.865.355.23.227.358.536.358.857v5.576Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","folder-plus":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M14 11.667A1.334 1.334 0 0 1 12.667 13H3.333A1.334 1.334 0 0 1 2 11.667V2.333A1.333 1.333 0 0 1 3.333 1H6.5l1.333 2h4.834A1.333 1.333 0 0 1 14 4.333v7.334Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M8 5v6M5 8h6\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","folder-check-filled":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M3.333 0A2.333 2.333 0 0 0 1 2.333v9.334A2.333 2.333 0 0 0 3.333 14h9.334A2.333 2.333 0 0 0 15 11.667V4.333A2.333 2.333 0 0 0 12.667 2H8.369L7.332.445A1 1 0 0 0 6.5 0H3.333ZM11.5 6.172l-4.672 4.672L4 8l1.172-1.156L6.828 8.5 10.344 5 11.5 6.172Z\\" fill=\\"currentColor\\"/>\\n</svg>","hammer-filled":"<svg width=\\"16\\" height=\\"16\\" fill=\\"currentColor\\" stroke=\\"none\\" viewBox=\\"0 0 16 16\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M14.494 6.195l-4-4A.664.664 0 0010.023 2H5.289a.666.666 0 00-.468 1.14l2.414 2.39-5.706 5.705a.666.666 0 000 .944l1.885 1.885a.667.667 0 00.943 0l5.721-5.72 1.14 1.128c.329.327.75.491 1.171.491.422 0 .843-.164 1.172-.492l.933-.932c.32-.32.495-.736.495-1.172 0-.436-.175-.852-.495-1.172z\\"/>\\n</svg>\\n","headphones":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M2 12V8a6 6 0 1 1 12 0v4\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M14 9h1a1 1 0 0 0-1-1v1ZM3.333 14v1-1Zm1.334 0v-1 1Zm0-5V8v1ZM2 9V8a1 1 0 0 0-1 1h1Zm11 3.667c0 .184-.15.333-.333.333v2A2.333 2.333 0 0 0 15 12.667h-2Zm-.333.333h-1.334v2h1.334v-2Zm-1.334 0a.333.333 0 0 1-.333-.333H9A2.333 2.333 0 0 0 11.333 15v-2ZM11 12.667v-2.334H9v2.334h2Zm0-2.334c0-.184.15-.333.333-.333V8A2.333 2.333 0 0 0 9 10.333h2Zm.333-.333H14V8h-2.667v2ZM13 9v3.667h2V9h-2ZM1 12.667A2.333 2.333 0 0 0 3.333 15v-2A.333.333 0 0 1 3 12.667H1ZM3.333 15h1.334v-2H3.333v2Zm1.334 0A2.333 2.333 0 0 0 7 12.667H5c0 .184-.15.333-.333.333v2ZM7 12.667v-2.334H5v2.334h2Zm0-2.334A2.333 2.333 0 0 0 4.667 8v2c.184 0 .333.15.333.333h2ZM4.667 8H2v2h2.667V8ZM1 9v3.667h2V9H1Z\\" fill=\\"currentColor\\"/>\\n</svg>","help-circle":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <circle cx=\\"8\\" cy=\\"8\\" r=\\"7\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <path d=\\"M6.25 6.168c.141-.39.42-.718.786-.927.367-.21.798-.286 1.217-.216.42.07.8.282 1.074.598.274.315.424.715.423 1.128C9.75 7.917 7.949 8.5 7.949 8.5M8 11h.007\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>","home":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path clip-rule=\\"evenodd\\" d=\\"m2 6 6-5 6 5v6.7c0 .718-.597 1.3-1.333 1.3H3.333C2.597 14 2 13.418 2 12.7V6Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M6 14V8h4v6\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>","image":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path clip-rule=\\"evenodd\\" d=\\"M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M5.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z\\" fill=\\"currentColor\\"/>\\n  <path d=\\"m14 11-4-4-7 7\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>","layers":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path clip-rule=\\"evenodd\\" d=\\"m8 1.5-7 3 7 3 7-3-7-3Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"m1 8 7 3 7-3M1 11.5l7 3 7-3\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\">\\n</svg>","link":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M6.667 8.605a3.478 3.478 0 0 0 5.244.376l2.087-2.087A3.478 3.478 0 0 0 9.08 1.976l-1.196 1.19\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M9.308 7.391a3.478 3.478 0 0 0-5.245-.375L1.976 9.102a3.478 3.478 0 0 0 4.918 4.918l1.19-1.19\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>","list":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M6 8h8M6 12h8M6 4h8\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <circle cx=\\"3\\" cy=\\"4\\" r=\\"1\\" fill=\\"currentColor\\"/>\\n  <circle cx=\\"3\\" cy=\\"8\\" r=\\"1\\" fill=\\"currentColor\\"/>\\n  <circle cx=\\"3\\" cy=\\"12\\" r=\\"1\\" fill=\\"currentColor\\"/>\\n</svg>","loader":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M8 1v3M8 12v3M3 3l2 2M11 11l2 2M1 8h3M12 8h3M3 13l2-2M11 5l2-2\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>","maximize":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M6 2H3.333C2.597 2 2 2.597 2 3.333V6M14 6V3.333C14 2.597 13.403 2 12.667 2H10M10 14h2.667c.736 0 1.333-.597 1.333-1.333V10M2 10v2.667C2 13.403 2.597 14 3.333 14H6\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n</svg>","maximize-2":"<svg width=\\"16\\" height=\\"16\\" fill=\\"none\\" viewBox=\\"0 0 16 16\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M10 2h4v4\\" stroke-width=\\"2\\" stroke-linecap=\\"square\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M14 2L9 7\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M6 14H2v-4\\" stroke-width=\\"2\\" stroke-linecap=\\"square\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M2 14l5-5\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","menu":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M2 8h12M2 12h12M2 4h12\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n</svg>","minus":"<svg width=\\"16\\" height=\\"16\\" fill=\\"none\\" stroke=\\"currentColor\\" viewBox=\\"0 0 16 16\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M3 8h10\\" stroke-width=\\"2\\" stroke-linejoin=\\"bevel\\"/>\\n</svg>\\n","more-horizontal":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M4 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z\\" fill=\\"currentColor\\"/>\\n</svg>","more-vertical":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M8 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z\\" fill=\\"currentColor\\"/>\\n</svg>","percent":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"m12.667 3.333-9.334 9.334M4.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM11.5 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>","pill":"\\n<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\"><path d=\\"M2.815 8.471a3.333 3.333 0 0 0 4.714 4.714l2.828-2.828-4.714-4.714L2.815 8.47Z\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/><path d=\\"M8.471 2.815 5.643 5.643l4.714 4.714 2.828-2.828a3.333 3.333 0 0 0-4.714-4.714Z\\" fill=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/></svg>","play-circle":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path clip-rule=\\"evenodd\\" d=\\"M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M6 5.809a.5.5 0 0 1 .724-.447l4.382 2.19a.5.5 0 0 1 0 .895l-4.382 2.191A.5.5 0 0 1 6 10.191V5.809Z\\" fill=\\"currentColor\\"/>\\n</svg>","play-filled":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M3.86 2.183a1.792 1.792 0 0 1 1.682.055l7.7 4.5C13.714 7.014 14 7.49 14 8s-.286.986-.758 1.262l-7.7 4.5a1.793 1.793 0 0 1-1.683.055C3.33 13.554 3 13.049 3 12.5v-9c0-.549.33-1.054.86-1.317Z\\" fill=\\"currentColor\\"/>\\n</svg>","plus":"<svg width=\\"16\\" height=\\"16\\" stroke=\\"currentColor\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M3 8h10M8 3v10\\" stroke-width=\\"2\\" stroke-linejoin=\\"bevel\\"/>\\n</svg>\\n","plus-circle":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <circle cx=\\"8\\" cy=\\"8\\" r=\\"7\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <path d=\\"M8 5v6M5 8h6\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","plus-circle-filled":"<svg width=\\"16\\" height=\\"16\\" fill=\\"currentColor\\" stroke=\\"none\\" viewBox=\\"0 0 16 16\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M8 15A7 7 0 108 1a7 7 0 000 14zm-1-4V9H5V7h2V5h2v2h2v2H9v2H7z\\" />\\n</svg>\\n","reset":"<svg width=\\"16\\" height=\\"16\\" fill=\\"none\\" viewBox=\\"0 0 16 16\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M2 3v4h4\\" stroke-width=\\"2\\" stroke-linecap=\\"square\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M3.394 9.661a5 5 0 101.184-5.2L3 6.04\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","rotate-cw":"<svg width=\\"16\\" height=\\"16\\" fill=\\"none\\" viewBox=\\"0 0 16 16\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M14 3v4h-4\\" stroke-width=\\"2\\" stroke-linecap=\\"square\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M12.606 9.661a5 5 0 11-1.184-5.2L13 6.04\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","search":"<svg width=\\"16\\" height=\\"16\\" fill=\\"none\\" viewBox=\\"0 0 16 16\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n    <path clip-rule=\\"evenodd\\" d=\\"M6.667 11.333a4.667 4.667 0 1 0 0-9.333 4.667 4.667 0 0 0 0 9.333Z\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n    <path d=\\"m14 14-3.567-3.567\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","share":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M2 7v4.6c0 .773.56 1.4 1.25 1.4h9.5c.69 0 1.25-.627 1.25-1.4V7\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M8 10V3\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"bevel\\"/>\\n  <path d=\\"m5 5 3-3 3 3\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>","show-all":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M4 2a1 1 0 0 0-1 1v3.222L1.638 7.67c-.091.097-.236.17-.255.3a.206.206 0 0 0 0 .06c.02.13.164.203.255.3L3 9.778V13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M8 4h2l3 8h-2l-.667-2H7.667L7 12H5l3-8Zm.333 4h1.334L9 6l-.667 2Z\\" fill=\\"currentColor\\"/>\\n</svg>","smartzoom":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M4.182 5.768a1 1 0 0 0 .05 1.414l.266.248-.828.887a.25.25 0 0 0 .013.353l2.012 1.876a.25.25 0 0 0 .353-.013l.827-.887.283.263a1 1 0 0 0 1.413-.05l2.69-2.885a3.5 3.5 0 1 1-4.37 5.359L6.593 12H2v4h7c3.028 0 5.307-2.245 5.867-4.793a5.494 5.494 0 0 0-2.221-5.72l.698-.748a1 1 0 0 0-.05-1.413L10.368.598a1 1 0 0 0-1.413.05l-4.773 5.12Zm2.145.633L7.79 7.764l3.409-3.657-1.463-1.364-3.41 3.658Z\\" fill=\\"currentColor\\"/>\\n</svg>","sort":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M4 3v9\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"bevel\\"/>\\n  <path d=\\"m7 10-3 3-3-3\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n  <path d=\\"M12 13V4\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"bevel\\"/>\\n  <path d=\\"m9 6 3-3 3 3\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n</svg>","stethoscope":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M5.286 1H3v3a4 4 0 1 0 8 0V1H8.714\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <path d=\\"M13 12a3 3 0 1 1-6 0V8\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n  <circle cx=\\"13\\" cy=\\"11\\" r=\\"2\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"/>\\n</svg>","text-zoom-reset":"<svg width=\\"16\\" height=\\"16\\" fill=\\"currentColor\\" stroke=\\"none\\" viewBox=\\"0 0 16 16\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M8.477 13H5.824l-.563-1.5H2.738L2.176 13H.574l2.724-7.263h1.404l2.19 5.84 3.18-7.948h1.857L15.677 13h-2.154l-.8-2H9.277l-.8 2zM4 8.136L4.699 10H3.301L4 8.136zM11.923 9L11 6.693 10.077 9h1.846z\\"/>\\n</svg>\\n","thumbs-up":"<svg width=\\"17\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M10.305 6.02h-1a1 1 0 0 0 1 1v-1Zm0-2.4h1-1Zm-1.84-1.8v-1a1 1 0 0 0-.914.596l.915.404ZM6 7.4l-.915-.404A1 1 0 0 0 5 7.4h1ZM6 14H5a1 1 0 0 0 1 1v-1Zm6.914 0 .011-1h-.01v1Zm1.226-1.02.988.153-.988-.153ZM15 7.4l-.988-.153L15 7.4Zm-1.226-1.38v1h.011l-.01-1ZM6 14v1a1 1 0 0 0 1-1H6Zm0-7h1a1 1 0 0 0-1-1v1Zm5.305-.98v-2.4h-2v2.4h2Zm0-2.4c0-1.566-1.292-2.8-2.84-2.8v2c.484 0 .84.378.84.8h2ZM7.55 1.416l-2.466 5.58 1.83.808 2.465-5.58-1.829-.808ZM5 7.4V14h2V7.4H5ZM6 15h6.914v-2H6v2Zm6.903 0a2.218 2.218 0 0 0 2.225-1.867l-1.976-.306c-.013.084-.097.174-.227.173l-.022 2Zm2.226-1.868.86-5.58-1.977-.304-.86 5.58 1.977.304Zm.86-5.579a2.183 2.183 0 0 0-.528-1.785l-1.496 1.329c.04.045.055.1.047.15l1.976.306Zm-.528-1.785a2.237 2.237 0 0 0-1.698-.748l.022 2c.074 0 .14.03.18.077l1.496-1.329Zm-1.687-.748h-3.47v2h3.47v-2ZM6 13H3.6v2H6v-2Zm-2.4 0a.827.827 0 0 1-.509-.155.31.31 0 0 1-.082-.092c-.01-.017-.009-.024-.009-.026H1C1 14.184 2.39 15 3.6 15v-2Zm-.6-.273V8.273H1v4.454h2Zm0-4.454c0-.002 0-.01.009-.026a.31.31 0 0 1 .082-.092c.1-.08.277-.155.509-.155V6C2.39 6 1 6.816 1 8.273h2ZM3.6 8H6V6H3.6v2ZM5 7v7h2V7H5Z\\" fill=\\"currentColor\\"/>\\n</svg>","timer-off":"\\n<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\"><path d=\\"M6 1a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2v.07a7.002 7.002 0 0 1 5.381 9.811l-1.558-1.558a5 5 0 0 0-6.146-6.146L5.119 2.619A6.95 6.95 0 0 1 7 2.07V2a1 1 0 0 1-1-1Z\\" /><path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M2.394 4.808.586 3 2 1.586 15 14.58 13.58 16l-1.388-1.394a7 7 0 0 1-9.799-9.799Zm8.363 8.364-6.929-6.93a5 5 0 0 0 6.929 6.929Z\\" /><path d=\\"m10.29 7.79.417-.416A1 1 0 0 0 9.293 5.96l-.417.416 1.415 1.414Z\\" /></svg>","timer-on":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\"><path d=\\"M10.707 7.374A1 1 0 0 0 9.293 5.96l-2 2a1 1 0 0 0 1.414 1.414l2-2Z\\" /><path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M7 0a1 1 0 0 0 0 2v.07A7.002 7.002 0 0 0 8 16 7 7 0 0 0 9 2.07V2a1 1 0 0 0 0-2H7ZM3 9a5 5 0 1 1 10 0A5 5 0 0 1 3 9Z\\" /></svg>","user":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M14 15v-1.333A2.667 2.667 0 0 0 11.333 11H4.667A2.667 2.667 0 0 0 2 13.667V15\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n  <path clip-rule=\\"evenodd\\" d=\\"M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>","users":"<svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path d=\\"M10 9a4.07 4.07 0 0 1-.219-.006 5.5 5.5 0 0 0 1.502-2.46C11.721 6.167 12 5.616 12 5s-.279-1.167-.717-1.534a5.5 5.5 0 0 0-1.502-2.46A4 4 0 1 1 10 9ZM16 15h-2v-1.333A5.307 5.307 0 0 0 12.524 10c1.981.014 3.476 1.711 3.476 3.667V15Z\\" fill=\\"currentColor\\"/>\\n  <path d=\\"M11 15v-1.333C11 12.194 9.88 11 8.5 11h-5C2.12 11 1 12.194 1 13.667V15\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linejoin=\\"round\\"/>\\n  <path clip-rule=\\"evenodd\\" d=\\"M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"/>\\n</svg>","x":"<svg width=\\"16\\" height=\\"16\\" fill=\\"none\\" viewBox=\\"0 0 16 16\\" stroke=\\"currentColor\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n    <path d=\\"m12 4-8 8M4 4l8 8\\" stroke-width=\\"2\\" stroke-linecap=\\"square\\" stroke-linejoin=\\"round\\"/>\\n</svg>\\n","x-circle-filled":"<svg width=\\"16\\" height=\\"16\\" fill=\\"currentColor\\" viewBox=\\"0 0 16 16\\" stroke=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\">\\n  <path fill-rule=\\"evenodd\\" clip-rule=\\"evenodd\\" d=\\"M3.05 12.95a7 7 0 109.9-9.9 7 7 0 00-9.9 9.9zm1.45-2.864L6.586 8 4.5 5.914 5.914 4.5 8 6.586 10.086 4.5 11.5 5.914 9.414 8l2.086 2.086-1.414 1.414L8 9.414 5.914 11.5 4.5 10.086z\\"/>\\n</svg>\\n"}');
    }, function(e3, t2, r2) {
      e3.exports = r2(8);
    }, function(e3, t2, r2) {
      /** @license React v16.13.1
      * react-is.production.min.js
      *
      * Copyright (c) Facebook, Inc. and its affiliates.
      *
      * This source code is licensed under the MIT license found in the
      * LICENSE file in the root directory of this source tree.
      */
      var n2 = typeof Symbol == "function" && Symbol.for, o2 = n2 ? Symbol.for("react.element") : 60103, a2 = n2 ? Symbol.for("react.portal") : 60106, i2 = n2 ? Symbol.for("react.fragment") : 60107, l2 = n2 ? Symbol.for("react.strict_mode") : 60108, s2 = n2 ? Symbol.for("react.profiler") : 60114, c2 = n2 ? Symbol.for("react.provider") : 60109, d2 = n2 ? Symbol.for("react.context") : 60110, u2 = n2 ? Symbol.for("react.async_mode") : 60111, f2 = n2 ? Symbol.for("react.concurrent_mode") : 60111, h2 = n2 ? Symbol.for("react.forward_ref") : 60112, p2 = n2 ? Symbol.for("react.suspense") : 60113, v2 = n2 ? Symbol.for("react.suspense_list") : 60120, g2 = n2 ? Symbol.for("react.memo") : 60115, b2 = n2 ? Symbol.for("react.lazy") : 60116, w2 = n2 ? Symbol.for("react.block") : 60121, m2 = n2 ? Symbol.for("react.fundamental") : 60117, y2 = n2 ? Symbol.for("react.responder") : 60118, k2 = n2 ? Symbol.for("react.scope") : 60119;
      function x2(e4) {
        if (typeof e4 == "object" && e4 !== null) {
          var t3 = e4.$$typeof;
          switch (t3) {
            case o2:
              switch (e4 = e4.type) {
                case u2:
                case f2:
                case i2:
                case s2:
                case l2:
                case p2:
                  return e4;
                default:
                  switch (e4 = e4 && e4.$$typeof) {
                    case d2:
                    case h2:
                    case b2:
                    case g2:
                    case c2:
                      return e4;
                    default:
                      return t3;
                  }
              }
            case a2:
              return t3;
          }
        }
      }
      function C2(e4) {
        return x2(e4) === f2;
      }
      t2.AsyncMode = u2, t2.ConcurrentMode = f2, t2.ContextConsumer = d2, t2.ContextProvider = c2, t2.Element = o2, t2.ForwardRef = h2, t2.Fragment = i2, t2.Lazy = b2, t2.Memo = g2, t2.Portal = a2, t2.Profiler = s2, t2.StrictMode = l2, t2.Suspense = p2, t2.isAsyncMode = function(e4) {
        return C2(e4) || x2(e4) === u2;
      }, t2.isConcurrentMode = C2, t2.isContextConsumer = function(e4) {
        return x2(e4) === d2;
      }, t2.isContextProvider = function(e4) {
        return x2(e4) === c2;
      }, t2.isElement = function(e4) {
        return typeof e4 == "object" && e4 !== null && e4.$$typeof === o2;
      }, t2.isForwardRef = function(e4) {
        return x2(e4) === h2;
      }, t2.isFragment = function(e4) {
        return x2(e4) === i2;
      }, t2.isLazy = function(e4) {
        return x2(e4) === b2;
      }, t2.isMemo = function(e4) {
        return x2(e4) === g2;
      }, t2.isPortal = function(e4) {
        return x2(e4) === a2;
      }, t2.isProfiler = function(e4) {
        return x2(e4) === s2;
      }, t2.isStrictMode = function(e4) {
        return x2(e4) === l2;
      }, t2.isSuspense = function(e4) {
        return x2(e4) === p2;
      }, t2.isValidElementType = function(e4) {
        return typeof e4 == "string" || typeof e4 == "function" || e4 === i2 || e4 === f2 || e4 === s2 || e4 === l2 || e4 === p2 || e4 === v2 || typeof e4 == "object" && e4 !== null && (e4.$$typeof === b2 || e4.$$typeof === g2 || e4.$$typeof === c2 || e4.$$typeof === d2 || e4.$$typeof === h2 || e4.$$typeof === m2 || e4.$$typeof === y2 || e4.$$typeof === k2 || e4.$$typeof === w2);
      }, t2.typeOf = x2;
    }, function(e3, t2, r2) {
      e3.exports = r2(10);
    }, function(e3, t2, r2) {
      /** @license React v16.13.1
      * react-is.production.min.js
      *
      * Copyright (c) Facebook, Inc. and its affiliates.
      *
      * This source code is licensed under the MIT license found in the
      * LICENSE file in the root directory of this source tree.
      */
      var n2 = typeof Symbol == "function" && Symbol.for, o2 = n2 ? Symbol.for("react.element") : 60103, a2 = n2 ? Symbol.for("react.portal") : 60106, i2 = n2 ? Symbol.for("react.fragment") : 60107, l2 = n2 ? Symbol.for("react.strict_mode") : 60108, s2 = n2 ? Symbol.for("react.profiler") : 60114, c2 = n2 ? Symbol.for("react.provider") : 60109, d2 = n2 ? Symbol.for("react.context") : 60110, u2 = n2 ? Symbol.for("react.async_mode") : 60111, f2 = n2 ? Symbol.for("react.concurrent_mode") : 60111, h2 = n2 ? Symbol.for("react.forward_ref") : 60112, p2 = n2 ? Symbol.for("react.suspense") : 60113, v2 = n2 ? Symbol.for("react.suspense_list") : 60120, g2 = n2 ? Symbol.for("react.memo") : 60115, b2 = n2 ? Symbol.for("react.lazy") : 60116, w2 = n2 ? Symbol.for("react.block") : 60121, m2 = n2 ? Symbol.for("react.fundamental") : 60117, y2 = n2 ? Symbol.for("react.responder") : 60118, k2 = n2 ? Symbol.for("react.scope") : 60119;
      function x2(e4) {
        if (typeof e4 == "object" && e4 !== null) {
          var t3 = e4.$$typeof;
          switch (t3) {
            case o2:
              switch (e4 = e4.type) {
                case u2:
                case f2:
                case i2:
                case s2:
                case l2:
                case p2:
                  return e4;
                default:
                  switch (e4 = e4 && e4.$$typeof) {
                    case d2:
                    case h2:
                    case b2:
                    case g2:
                    case c2:
                      return e4;
                    default:
                      return t3;
                  }
              }
            case a2:
              return t3;
          }
        }
      }
      function C2(e4) {
        return x2(e4) === f2;
      }
      t2.AsyncMode = u2, t2.ConcurrentMode = f2, t2.ContextConsumer = d2, t2.ContextProvider = c2, t2.Element = o2, t2.ForwardRef = h2, t2.Fragment = i2, t2.Lazy = b2, t2.Memo = g2, t2.Portal = a2, t2.Profiler = s2, t2.StrictMode = l2, t2.Suspense = p2, t2.isAsyncMode = function(e4) {
        return C2(e4) || x2(e4) === u2;
      }, t2.isConcurrentMode = C2, t2.isContextConsumer = function(e4) {
        return x2(e4) === d2;
      }, t2.isContextProvider = function(e4) {
        return x2(e4) === c2;
      }, t2.isElement = function(e4) {
        return typeof e4 == "object" && e4 !== null && e4.$$typeof === o2;
      }, t2.isForwardRef = function(e4) {
        return x2(e4) === h2;
      }, t2.isFragment = function(e4) {
        return x2(e4) === i2;
      }, t2.isLazy = function(e4) {
        return x2(e4) === b2;
      }, t2.isMemo = function(e4) {
        return x2(e4) === g2;
      }, t2.isPortal = function(e4) {
        return x2(e4) === a2;
      }, t2.isProfiler = function(e4) {
        return x2(e4) === s2;
      }, t2.isStrictMode = function(e4) {
        return x2(e4) === l2;
      }, t2.isSuspense = function(e4) {
        return x2(e4) === p2;
      }, t2.isValidElementType = function(e4) {
        return typeof e4 == "string" || typeof e4 == "function" || e4 === i2 || e4 === f2 || e4 === s2 || e4 === l2 || e4 === p2 || e4 === v2 || typeof e4 == "object" && e4 !== null && (e4.$$typeof === b2 || e4.$$typeof === g2 || e4.$$typeof === c2 || e4.$$typeof === d2 || e4.$$typeof === h2 || e4.$$typeof === m2 || e4.$$typeof === y2 || e4.$$typeof === k2 || e4.$$typeof === w2);
      }, t2.typeOf = x2;
    }, function(e3, t2) {
      function r2() {
        return e3.exports = r2 = Object.assign || function(e4) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = arguments[t3];
            for (var n2 in r3)
              Object.prototype.hasOwnProperty.call(r3, n2) && (e4[n2] = r3[n2]);
          }
          return e4;
        }, e3.exports.default = e3.exports, e3.exports.__esModule = true, r2.apply(this, arguments);
      }
      e3.exports = r2, e3.exports.default = e3.exports, e3.exports.__esModule = true;
    }, function(e3, t2, r2) {
      r2.r(t2), r2.d(t2, "dark", function() {
        return Ta;
      }), r2.d(t2, "light", function() {
        return _a;
      }), r2.d(t2, "ThemeProvider", function() {
        return Se;
      }), r2.d(t2, "CacheProvider", function() {
        return je;
      }), r2.d(t2, "createCache", function() {
        return ce;
      }), r2.d(t2, "Card", function() {
        return Lr;
      }), r2.d(t2, "CardBox", function() {
        return Ir;
      }), r2.d(t2, "Box", function() {
        return At;
      }), r2.d(t2, "Inline", function() {
        return wt;
      }), r2.d(t2, "Stack", function() {
        return st;
      }), r2.d(t2, "H1", function() {
        return Ct;
      }), r2.d(t2, "H2", function() {
        return jt;
      }), r2.d(t2, "H3", function() {
        return Ot;
      }), r2.d(t2, "H4", function() {
        return Mt;
      }), r2.d(t2, "H5", function() {
        return zt;
      }), r2.d(t2, "H6", function() {
        return St;
      }), r2.d(t2, "Text", function() {
        return Bt;
      }), r2.d(t2, "TextClamped", function() {
        return _r;
      }), r2.d(t2, "StyledText", function() {
        return qr;
      }), r2.d(t2, "Link", function() {
        return Kr;
      }), r2.d(t2, "Icon", function() {
        return er;
      }), r2.d(t2, "Button", function() {
        return hr;
      }), r2.d(t2, "Divider", function() {
        return Vt;
      }), r2.d(t2, "Column", function() {
        return cn2;
      }), r2.d(t2, "Columns", function() {
        return dn;
      }), r2.d(t2, "Tabs", function() {
        return mn;
      }), r2.d(t2, "Badge", function() {
        return kn;
      }), r2.d(t2, "SearchResult", function() {
        return zn;
      }), r2.d(t2, "ToggleButton", function() {
        return Tn;
      }), r2.d(t2, "DropdownMenu", function() {
        return jr;
      }), r2.d(t2, "FormFieldGroup", function() {
        return $n;
      }), r2.d(t2, "Input", function() {
        return Yn;
      }), r2.d(t2, "Checkbox", function() {
        return no;
      }), r2.d(t2, "Toggle", function() {
        return vo;
      }), r2.d(t2, "Radio", function() {
        return xo;
      }), r2.d(t2, "RadioButton", function() {
        return Eo;
      }), r2.d(t2, "Textarea", function() {
        return Lo;
      }), r2.d(t2, "Select", function() {
        return la;
      }), r2.d(t2, "SubThemeProvider", function() {
        return pa;
      }), r2.d(t2, "PictogramButton", function() {
        return Ca;
      }), r2.d(t2, "MediaViewerBar", function() {
        return Ma;
      }), r2.d(t2, "SegmentedProgressBar", function() {
        return Aa;
      }), r2.d(t2, "ProgressBar", function() {
        return Ia;
      }), r2.d(t2, "Container", function() {
        return Ra;
      });
      var n2 = { fontFamily: { lato: "Lato, -apple-system, BlinkMacSystemFont, segoe ui, avenir next, avenir, 'helvetica neue', helvetica, ubuntu, roboto, noto, arial, sans-serif" }, opacity: { button: { disabled: 0.3 }, form: { disabled: "0.35" } }, shadow: { card: { a: "0px 0.3px 0.6px rgba(0, 0, 0, 0.0035), 0px 2px 5px rgba(0, 0, 0, 0.07)", b: "0px 0.5px 2.5px rgba(0, 0, 0, 0.16), 0px 4px 20px rgba(0, 0, 0, 0.2)", c: "0px 0.5px 2.5px rgba(0, 0, 0, 0.16), 0px 4px 20px rgba(0, 0, 0, 0.2)", d: "0px 4px 14px rgba(0, 0, 0, 0.12), 0px 32px 112px rgba(0, 0, 0, 0.24)" } }, size: { dimension: { checkbox: { m: "24px" }, radio: { m: "24px" }, radioPoint: { m: "10px" }, toggle: { height: { s: "16px", m: "24px" }, width: { s: "28px", m: "40px" } }, textarea: { minHeight: { m: "36px" } }, togglePoint: { s: "8px", m: "16px" }, toggleButton: { height: { m: "32px" } }, dropdownMenu: { width: "120px" }, mediaViewerBar: { separator: { width: "1px" } } }, borderRadius: { button: { m: "4px" }, container: { m: "12px" }, card: { m: "12px" }, input: { s: "4px" }, textarea: { s: "4px" }, dropdown: { s: "4px", m: "8px" }, checkbox: { m: "4px" }, radio: { m: "12px" }, toggle: { s: "8px", m: "16px" }, badge: { m: "24px" }, toggleButton: { m: "16px" }, progressBar: "4px" }, spacing: { zero: "0px", xxs: "4px", xs: "8px", s: "12px", m: "16px", l: "24px", xl: "32px", xxl: "48px" }, letterSpacing: { badge: { m: "1px" } }, font: { button: { m: "14px" }, icon: { s: "16px", m: "24px", l: "48px" }, link: { xs: "10px", s: "12px", m: "14px", l: "16px" }, badge: { m: "12px" }, toggleButton: { m: "14px" }, text: { xs: "12px", s: "14px", m: "16px" }, header: { xxs: "12px", xs: "16px", s: "18px", m: "20px", l: "23px", xl: "26px" } }, lineHeight: { button: { m: "16px" }, link: { xs: "16px", s: "18px", m: "20px", l: "22px" }, badge: { m: "16px" }, toggleButton: { m: "16px" }, text: { xs: "18px", s: "20px", m: "24px" }, header: { xxs: "16px", xs: "20px", s: "22px", m: "24px", l: "28px", xl: "32px" } } }, weight: { normal: 400, bold: 700, black: 900, inherit: "inherit" } }, o2 = { dark: { variables: n2, values: { color: { background: { layer_1: "#1e2125", layer_2: "#24282d", layer_3: "#282c34", layer_4: "#393e47", button: { primary: { base: "#28816b", hover: "#41a48a", active: "#233d3d", disabled: "rgba(40, 129, 107, 0.3)" }, secondary: { base: "transparent", hover: "rgba(147, 151, 159, 0.08)", active: "transparent", disabled: "transparent" }, tertiary: { base: "transparent", hover: "rgba(147, 151, 159, 0.08)", active: "rgba(147, 151, 159, 0.08)", disabled: "transparent" } }, input: { default: "#1a1c1c" }, textarea: { default: "#1a1c1c" }, checkbox: { default: "#24282d", checked: "#28816b", checkedHover: "#41a48a" }, dropdown: { active: "#393e47" }, toggle: { default: "#757a84", checked: "#28816b", highlighted: "#f9f4a9" }, togglePoint: { default: "#ced1d6" }, radio: { default: "#24282d", checked: "#24282d", checkedHover: "#24282d" }, tabs: { header: "#282c34", buttonActive: "#24282d", buttonHover: "#393e47" }, badge: { default: "transparent", green: "transparent", blue: "transparent", yellow: "transparent", brand: "transparent", purple: "transparent", red: "transparent", gray: "transparent" }, toggleButton: { default: "transparent", active: "#607585", activeHover: "#40515e" } }, icon: { checkbox: { default: "#ced1d6" }, radio: { default: "#28816b" } }, header: { primary: "#b9bcc3", secondary: "#93979f" }, text: { primary: "#41a48a", secondary: "#ced1d6", tertiary: "#93979f", lightPrimary: "#d8dade", info: "#6e95cf", error: "#d07c7c", warning: "#4d412c", placeholder: "#b9bcc3", link: { primary: "#41a48a", secondary: "#ced1d6", tertiary: "#93979f", lightPrimary: "#d8dade", primaryHover: "#a6f2dd", secondaryHover: "#d8dade", tertiaryHover: "#d8dade" }, button: { primary: { base: "#d8dade", hover: "#d8dade", active: "#d8dade", disabled: "rgba(216, 218, 222, 0.3)" }, secondary: { base: "#d8dade", hover: "#d8dade", active: "#d8dade", disabled: "rgba(216, 218, 222, 0.3)" }, tertiary: { base: "#d8dade", hover: "#d8dade", active: "#ffffff", disabled: "rgba(216, 218, 222, 0.3)" } }, badge: { default: "#ced1d6", green: "#41a48a", blue: "#6e95cf", yellow: "#cbac76", brand: "#62b2bc", purple: "#ad97f7", red: "#d07c7c", gray: "#93979f" }, toggleButton: { default: "#ffffff", active: "#ffffff" } }, divider: { primary: "#32363e" }, segementedProgressBar: { monochrome: "#ced1d6", success: "#28816b", warning: "#a4792d", alert: "#a45355", inProgress: "#5b5f67" }, border: { primary: "#32363e", tabs: { buttonActive: "#b9bcc3" }, button: { secondary: { base: "#32363e", hover: "#40454f", active: "#40454f", disabled: "rgba(50, 54, 62, 0.3)" } }, input: { default: "#757a84", active: "#93979f", error: "#d07c7c" }, textarea: { default: "#757a84", active: "#93979f", error: "#d07c7c" }, checkbox: { default: "#5b5f67", defaultHover: "#28816b" }, radio: { default: "#5b5f67", defaultHover: "#28816b" }, toggle: { default: "#757a84", checked: "#28816b", highlighted: "#f9f4a9", hover: "#41a48a" }, badge: { default: "#393e47", green: "#393e47", blue: "#393e47", yellow: "#393e47", brand: "#393e47", purple: "#393e47", red: "#393e47", gray: "#393e47" }, toggleButton: { default: "#e0e6eb", defaultHover: "#a3b2bd", active: "#607585", activeHover: "#40515e" } } }, subThemes: { dimmed: { color: { background: { layer_1: "#314554", layer_2: "#40515e", button: { primary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" }, secondary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" }, tertiary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" } } }, header: { primary: "#ffffff", secondary: "#ffffff" }, text: { primary: "#ffffff", secondary: "#ffffff", tertiary: "#e0e6eb", error: "#ee6160", link: { primary: "#ffffff", secondary: "#ffffff", tertiary: "#e0e6eb", primaryHover: "#e0e6eb", secondaryHover: "#e0e6eb", tertiaryHover: "#a3b2bd" }, button: { primary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" }, secondary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" }, tertiary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" } } }, divider: { primary: "#e0e6eb" }, border: { button: { secondary: { base: "transparent", hover: "transparent", active: "transparent", disabled: "transparent" } } } } }, error: { color: { background: { layer_2: "#a45355", button: { primary: { base: "#ffffff", hover: "rgba(255, 255, 255, 0.8)", active: "rgba(255, 255, 255, 0.6)", disabled: "rgba(255, 255, 255, 0.6)" }, secondary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" }, tertiary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" } } }, header: { primary: "#ffffff", secondary: "#ffffff" }, text: { primary: "#ffffff", secondary: "#ffffff", tertiary: "#ced1d6", error: "#d07c7c", link: { primary: "#ffffff", secondary: "#ffffff", tertiary: "#ced1d6", primaryHover: "#d8dade", secondaryHover: "#d8dade", tertiaryHover: "#b9bcc3" }, button: { primary: { base: "#312b31", hover: "#312b31", active: "#312b31", disabled: "rgba(49, 43, 49, 0.3)" }, secondary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" }, tertiary: { base: "#d8dade", hover: "#d8dade", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" } } }, divider: { primary: "#ced1d6" }, border: { button: { secondary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "#ffffff" } } } } }, info: { color: { background: { layer_2: "#29364c", button: { primary: { base: "#ffffff", hover: "rgba(255, 255, 255, 0.8)", active: "rgba(255, 255, 255, 0.6)", disabled: "rgba(255, 255, 255, 0.6)" }, secondary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" }, tertiary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" } } }, header: { primary: "#ffffff", secondary: "#ffffff" }, text: { primary: "#ffffff", secondary: "#ffffff", tertiary: "#e0e6eb", info: "#6e95cf", error: "#ee6160", link: { primary: "#ffffff", secondary: "#ffffff", tertiary: "#e0e6eb", primaryHover: "#e0e6eb", secondaryHover: "#e0e6eb", tertiaryHover: "#a3b2bd" }, button: { primary: { base: "#1c427d", hover: "#1c427d", active: "#1c427d", disabled: "rgba(28, 66, 125, 0.3)" }, secondary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" }, tertiary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" } } }, divider: { primary: "#e0e6eb" }, border: { button: { secondary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "#ffffff" } } } } }, success: { color: { background: { layer_2: "#28816b", button: { primary: { base: "#ffffff", hover: "rgba(255, 255, 255, 0.8)", active: "rgba(255, 255, 255, 0.6)", disabled: "rgba(255, 255, 255, 0.6)" }, secondary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" }, tertiary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" } } }, header: { primary: "#ffffff", secondary: "#ffffff" }, text: { primary: "#ffffff", secondary: "#ffffff", tertiary: "#ced1d6", error: "#d07c7c", link: { primary: "#ffffff", secondary: "#ffffff", tertiary: "#ced1d6", primaryHover: "#d8dade", secondaryHover: "#d8dade", tertiaryHover: "#b9bcc3" }, button: { primary: { base: "#262e33", hover: "#262e33", active: "#262e33", disabled: "rgba(28, 66, 125, 0.3)" }, secondary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" }, tertiary: { base: "#d8dade", hover: "#d8dade", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" } } }, divider: { primary: "#ced1d6" }, border: { button: { secondary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "#ffffff" } } } } } } } }, light: { variables: n2, values: { color: { background: { layer_1: "#ffffff", layer_2: "#ffffff", layer_3: "#ffffff", layer_4: "#ffffff", button: { primary: { base: "#0fa980", hover: "#0b8363", active: "#0a5c45", disabled: "rgba(15, 169, 128, 0.3)" }, secondary: { base: "transparent", hover: "rgba(96, 117, 133, 0.08)", active: "transparent", disabled: "transparent" }, tertiary: { base: "transparent", hover: "rgba(96, 117, 133, 0.08)", active: "rgba(96, 117, 133, 0.08)", disabled: "transparent" } }, input: { default: "#ffffff" }, textarea: { default: "#ffffff" }, checkbox: { default: "#ffffff", checked: "#0fa980", checkedHover: "#0b8363" }, dropdown: { active: "#eef2f5" }, toggle: { default: "#a3b2bd", checked: "#0fa980", highlighted: "#faf5b8" }, togglePoint: { default: "#ffffff" }, radio: { default: "#ffffff", checked: "#ffffff", checkedHover: "#ffffff" }, tabs: { header: "#f5f7f9", buttonActive: "#ffffff", buttonHover: "#eef2f5" }, badge: { default: "#ffffff", green: "#e8f8f4", blue: "#e7effe", yellow: "#fef3e1", brand: "#e7f6f8", purple: "#f2effb", red: "#fde8e8", gray: "#eef2f5" }, toggleButton: { default: "transparent", active: "#607585", activeHover: "#40515e" } }, icon: { checkbox: { default: "#ffffff" }, radio: { default: "#0fa980" } }, header: { primary: "#1a1c1c", secondary: "#607585" }, text: { primary: "#0b8363", secondary: "#1a1c1c", tertiary: "#607585", lightPrimary: "#ffffff", info: "#295dae", error: "#dc4847", warning: "#df9411", placeholder: "#a3b2bd", link: { primary: "#0b8363", secondary: "#1a1c1c", tertiary: "#607585", lightPrimary: "#ffffff", primaryHover: "#0a5c45", secondaryHover: "#1a1c1c", tertiaryHover: "#40515e" }, button: { primary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" }, secondary: { base: "#40515e", hover: "#40515e", active: "#40515e", disabled: "rgba(64, 81, 94, 0.3)" }, tertiary: { base: "#40515e", hover: "#40515e", active: "#1a1c1c", disabled: "rgba(64, 81, 94, 0.3)" } }, badge: { default: "#1a1c1c", green: "#0b8363", blue: "#295dae", yellow: "#9a6304", brand: "#067c89", purple: "#5d44ab", red: "#c02725", gray: "#607585" }, toggleButton: { default: "#40515e", active: "#ffffff" } }, divider: { primary: "#e0e6eb" }, segementedProgressBar: { monochrome: "#607585", success: "#39d6ac", warning: "#f1d56b", alert: "#f07575", inProgress: "#e0e6eb" }, border: { primary: "#e0e6eb", tabs: { buttonActive: "#607585" }, button: { secondary: { base: "#a3b2bd", hover: "#607585", active: "#40515e", disabled: "rgba(163, 178, 189, 0.3)" } }, input: { default: "#a3b2bd", active: "#607585", error: "#dc4847" }, textarea: { default: "#a3b2bd", active: "#a3b2bd", error: "#dc4847" }, checkbox: { default: "#e0e6eb", defaultHover: "#0fa980" }, radio: { default: "#e0e6eb", defaultHover: "#0fa980" }, toggle: { default: "#a3b2bd", checked: "#0fa980", highlighted: "#faf5b8", hover: "#0a5c45" }, badge: { default: "#e0e6eb", green: "#e8f8f4", blue: "#e7effe", yellow: "#fef3e1", brand: "#e7f6f8", purple: "#f2effb", red: "#fde8e8", gray: "#eef2f5" }, toggleButton: { default: "#e0e6eb", defaultHover: "#a3b2bd", active: "#607585", activeHover: "#40515e" } } }, subThemes: { dimmed: { color: { background: { layer_1: "#314554", layer_2: "#40515e", button: { primary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" }, secondary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" }, tertiary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" } } }, header: { primary: "#ffffff", secondary: "#ffffff" }, text: { primary: "#ffffff", secondary: "#ffffff", tertiary: "#e0e6eb", error: "#ee6160", link: { primary: "#ffffff", secondary: "#ffffff", tertiary: "#e0e6eb", primaryHover: "#e0e6eb", secondaryHover: "#e0e6eb", tertiaryHover: "#a3b2bd" }, button: { primary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" }, secondary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" }, tertiary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" } } }, divider: { primary: "#e0e6eb" }, border: { button: { secondary: { base: "transparent", hover: "transparent", active: "transparent", disabled: "transparent" } } } } }, error: { color: { background: { layer_2: "#ee6160", button: { primary: { base: "#ffffff", hover: "rgba(255, 255, 255, 0.8)", active: "rgba(255, 255, 255, 0.6)", disabled: "rgba(255, 255, 255, 0.6)" }, secondary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" }, tertiary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" } } }, header: { primary: "#ffffff", secondary: "#ffffff" }, text: { primary: "#ffffff", secondary: "#ffffff", tertiary: "#e0e6eb", error: "#ee6160", link: { primary: "#ffffff", secondary: "#ffffff", tertiary: "#e0e6eb", primaryHover: "#e0e6eb", secondaryHover: "#e0e6eb", tertiaryHover: "#a3b2bd" }, button: { primary: { base: "#c02725", hover: "#c02725", active: "#c02725", disabled: "rgba(192, 39, 37, 0.3)" }, secondary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" }, tertiary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" } } }, divider: { primary: "#e0e6eb" }, border: { button: { secondary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "#ffffff" } } } } }, info: { color: { background: { layer_2: "#295dae", button: { primary: { base: "#ffffff", hover: "rgba(255, 255, 255, 0.8)", active: "rgba(255, 255, 255, 0.6)", disabled: "rgba(255, 255, 255, 0.6)" }, secondary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" }, tertiary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" } } }, header: { primary: "#ffffff", secondary: "#ffffff" }, text: { primary: "#ffffff", secondary: "#ffffff", tertiary: "#e0e6eb", info: "#d2e2f9", error: "#ee6160", link: { primary: "#ffffff", secondary: "#ffffff", tertiary: "#e0e6eb", primaryHover: "#e0e6eb", secondaryHover: "#e0e6eb", tertiaryHover: "#a3b2bd" }, button: { primary: { base: "#1c427d", hover: "#1c427d", active: "#1c427d", disabled: "rgba(28, 66, 125, 0.3)" }, secondary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" }, tertiary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" } } }, divider: { primary: "#e0e6eb" }, border: { button: { secondary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "#ffffff" } } } } }, success: { color: { background: { layer_2: "#0fa980", button: { primary: { base: "#ffffff", hover: "rgba(255, 255, 255, 0.8)", active: "rgba(255, 255, 255, 0.6)", disabled: "rgba(255, 255, 255, 0.6)" }, secondary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" }, tertiary: { base: "transparent", hover: "rgba(255, 255, 255, 0.08)", active: "transparent", disabled: "transparent" } } }, header: { primary: "#ffffff", secondary: "#ffffff" }, text: { primary: "#ffffff", secondary: "#ffffff", tertiary: "#e0e6eb", error: "#ee6160", link: { primary: "#ffffff", secondary: "#ffffff", tertiary: "#e0e6eb", primaryHover: "#e0e6eb", secondaryHover: "#e0e6eb", tertiaryHover: "#a3b2bd" }, button: { primary: { base: "#0a5c45", hover: "#0a5c45", active: "#0a5c45", disabled: "rgba(10, 92, 69, 0.3)" }, secondary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" }, tertiary: { base: "#d8dade", hover: "#d8dade", active: "#ffffff", disabled: "rgba(255, 255, 255, 0.6)" } } }, divider: { primary: "#e0e6eb" }, border: { button: { secondary: { base: "#ffffff", hover: "#ffffff", active: "#ffffff", disabled: "#ffffff" } } } } } } } } }, a2 = r2(0), i2 = r2.n(a2);
      var l2 = function() {
        function e4(e5) {
          var t4 = this;
          this._insertTag = function(e6) {
            var r3;
            r3 = t4.tags.length === 0 ? t4.insertionPoint ? t4.insertionPoint.nextSibling : t4.prepend ? t4.container.firstChild : t4.before : t4.tags[t4.tags.length - 1].nextSibling, t4.container.insertBefore(e6, r3), t4.tags.push(e6);
          }, this.isSpeedy = e5.speedy === void 0 || e5.speedy, this.tags = [], this.ctr = 0, this.nonce = e5.nonce, this.key = e5.key, this.container = e5.container, this.prepend = e5.prepend, this.insertionPoint = e5.insertionPoint, this.before = null;
        }
        var t3 = e4.prototype;
        return t3.hydrate = function(e5) {
          e5.forEach(this._insertTag);
        }, t3.insert = function(e5) {
          this.ctr % (this.isSpeedy ? 65e3 : 1) == 0 && this._insertTag(function(e6) {
            var t5 = document.createElement("style");
            return t5.setAttribute("data-emotion", e6.key), e6.nonce !== void 0 && t5.setAttribute("nonce", e6.nonce), t5.appendChild(document.createTextNode("")), t5.setAttribute("data-s", ""), t5;
          }(this));
          var t4 = this.tags[this.tags.length - 1];
          if (this.isSpeedy) {
            var r3 = function(e6) {
              if (e6.sheet)
                return e6.sheet;
              for (var t5 = 0; t5 < document.styleSheets.length; t5++)
                if (document.styleSheets[t5].ownerNode === e6)
                  return document.styleSheets[t5];
            }(t4);
            try {
              r3.insertRule(e5, r3.cssRules.length);
            } catch (e6) {
            }
          } else
            t4.appendChild(document.createTextNode(e5));
          this.ctr++;
        }, t3.flush = function() {
          this.tags.forEach(function(e5) {
            return e5.parentNode && e5.parentNode.removeChild(e5);
          }), this.tags = [], this.ctr = 0;
        }, e4;
      }(), s2 = "-ms-", c2 = "-moz-", d2 = "-webkit-", u2 = "comm", f2 = "rule", h2 = "decl", p2 = Math.abs, v2 = String.fromCharCode, g2 = Object.assign;
      function b2(e4) {
        return e4.trim();
      }
      function w2(e4, t3, r3) {
        return e4.replace(t3, r3);
      }
      function m2(e4, t3) {
        return e4.indexOf(t3);
      }
      function y2(e4, t3) {
        return 0 | e4.charCodeAt(t3);
      }
      function k2(e4, t3, r3) {
        return e4.slice(t3, r3);
      }
      function x2(e4) {
        return e4.length;
      }
      function C2(e4) {
        return e4.length;
      }
      function j2(e4, t3) {
        return t3.push(e4), e4;
      }
      function O2(e4, t3) {
        return e4.map(t3).join("");
      }
      var M2 = 1, z2 = 1, S2 = 0, E2 = 0, P2 = 0, H2 = "";
      function B2(e4, t3, r3, n3, o3, a3, i3) {
        return { value: e4, root: t3, parent: r3, type: n3, props: o3, children: a3, line: M2, column: z2, length: i3, return: "" };
      }
      function A2(e4, t3) {
        return g2(B2("", null, null, "", null, null, 0), e4, { length: -e4.length }, t3);
      }
      function L2() {
        return P2 = E2 > 0 ? y2(H2, --E2) : 0, z2--, P2 === 10 && (z2 = 1, M2--), P2;
      }
      function I2() {
        return P2 = E2 < S2 ? y2(H2, E2++) : 0, z2++, P2 === 10 && (z2 = 1, M2++), P2;
      }
      function Z2() {
        return y2(H2, E2);
      }
      function V2() {
        return E2;
      }
      function R2(e4, t3) {
        return k2(H2, e4, t3);
      }
      function T2(e4) {
        switch (e4) {
          case 0:
          case 9:
          case 10:
          case 13:
          case 32:
            return 5;
          case 33:
          case 43:
          case 44:
          case 47:
          case 62:
          case 64:
          case 126:
          case 59:
          case 123:
          case 125:
            return 4;
          case 58:
            return 3;
          case 34:
          case 39:
          case 40:
          case 91:
            return 2;
          case 41:
          case 93:
            return 1;
        }
        return 0;
      }
      function _2(e4) {
        return M2 = z2 = 1, S2 = x2(H2 = e4), E2 = 0, [];
      }
      function $2(e4) {
        return H2 = "", e4;
      }
      function D2(e4) {
        return b2(R2(E2 - 1, function e5(t3) {
          for (; I2(); )
            switch (P2) {
              case t3:
                return E2;
              case 34:
              case 39:
                t3 !== 34 && t3 !== 39 && e5(P2);
                break;
              case 40:
                t3 === 41 && e5(t3);
                break;
              case 92:
                I2();
            }
          return E2;
        }(e4 === 91 ? e4 + 2 : e4 === 40 ? e4 + 1 : e4)));
      }
      function F2(e4) {
        for (; (P2 = Z2()) && P2 < 33; )
          I2();
        return T2(e4) > 2 || T2(P2) > 3 ? "" : " ";
      }
      function W2(e4, t3) {
        for (; --t3 && I2() && !(P2 < 48 || P2 > 102 || P2 > 57 && P2 < 65 || P2 > 70 && P2 < 97); )
          ;
        return R2(e4, V2() + (t3 < 6 && Z2() == 32 && I2() == 32));
      }
      function q2(e4, t3) {
        for (; I2() && e4 + P2 !== 57 && (e4 + P2 !== 84 || Z2() !== 47); )
          ;
        return "/*" + R2(t3, E2 - 1) + "*" + v2(e4 === 47 ? e4 : I2());
      }
      function N2(e4) {
        for (; !T2(Z2()); )
          I2();
        return R2(e4, E2);
      }
      function U2(e4) {
        return $2(function e5(t3, r3, n3, o3, a3, i3, l3, s3, c3) {
          var d3 = 0, u3 = 0, f3 = l3, h3 = 0, p3 = 0, g3 = 0, b3 = 1, y3 = 1, k3 = 1, C3 = 0, O3 = "", M3 = a3, z3 = i3, S3 = o3, E3 = O3;
          for (; y3; )
            switch (g3 = C3, C3 = I2()) {
              case 40:
                if (g3 != 108 && E3.charCodeAt(f3 - 1) == 58) {
                  m2(E3 += w2(D2(C3), "&", "&\f"), "&\f") != -1 && (k3 = -1);
                  break;
                }
              case 34:
              case 39:
              case 91:
                E3 += D2(C3);
                break;
              case 9:
              case 10:
              case 13:
              case 32:
                E3 += F2(g3);
                break;
              case 92:
                E3 += W2(V2() - 1, 7);
                continue;
              case 47:
                switch (Z2()) {
                  case 42:
                  case 47:
                    j2(X2(q2(I2(), V2()), r3, n3), c3);
                    break;
                  default:
                    E3 += "/";
                }
                break;
              case 123 * b3:
                s3[d3++] = x2(E3) * k3;
              case 125 * b3:
              case 59:
              case 0:
                switch (C3) {
                  case 0:
                  case 125:
                    y3 = 0;
                  case 59 + u3:
                    p3 > 0 && x2(E3) - f3 && j2(p3 > 32 ? Y2(E3 + ";", o3, n3, f3 - 1) : Y2(w2(E3, " ", "") + ";", o3, n3, f3 - 2), c3);
                    break;
                  case 59:
                    E3 += ";";
                  default:
                    if (j2(S3 = G2(E3, r3, n3, d3, u3, a3, s3, O3, M3 = [], z3 = [], f3), i3), C3 === 123)
                      if (u3 === 0)
                        e5(E3, r3, S3, S3, M3, i3, f3, s3, z3);
                      else
                        switch (h3) {
                          case 100:
                          case 109:
                          case 115:
                            e5(t3, S3, S3, o3 && j2(G2(t3, S3, S3, 0, 0, a3, s3, O3, a3, M3 = [], f3), z3), a3, z3, f3, s3, o3 ? M3 : z3);
                            break;
                          default:
                            e5(E3, S3, S3, S3, [""], z3, 0, s3, z3);
                        }
                }
                d3 = u3 = p3 = 0, b3 = k3 = 1, O3 = E3 = "", f3 = l3;
                break;
              case 58:
                f3 = 1 + x2(E3), p3 = g3;
              default:
                if (b3 < 1) {
                  if (C3 == 123)
                    --b3;
                  else if (C3 == 125 && b3++ == 0 && L2() == 125)
                    continue;
                }
                switch (E3 += v2(C3), C3 * b3) {
                  case 38:
                    k3 = u3 > 0 ? 1 : (E3 += "\f", -1);
                    break;
                  case 44:
                    s3[d3++] = (x2(E3) - 1) * k3, k3 = 1;
                    break;
                  case 64:
                    Z2() === 45 && (E3 += D2(I2())), h3 = Z2(), u3 = f3 = x2(O3 = E3 += N2(V2())), C3++;
                    break;
                  case 45:
                    g3 === 45 && x2(E3) == 2 && (b3 = 0);
                }
            }
          return i3;
        }("", null, null, null, [""], e4 = _2(e4), 0, [0], e4));
      }
      function G2(e4, t3, r3, n3, o3, a3, i3, l3, s3, c3, d3) {
        for (var u3 = o3 - 1, h3 = o3 === 0 ? a3 : [""], v3 = C2(h3), g3 = 0, m3 = 0, y3 = 0; g3 < n3; ++g3)
          for (var x3 = 0, j3 = k2(e4, u3 + 1, u3 = p2(m3 = i3[g3])), O3 = e4; x3 < v3; ++x3)
            (O3 = b2(m3 > 0 ? h3[x3] + " " + j3 : w2(j3, /&\f/g, h3[x3]))) && (s3[y3++] = O3);
        return B2(e4, t3, r3, o3 === 0 ? f2 : l3, s3, c3, d3);
      }
      function X2(e4, t3, r3) {
        return B2(e4, t3, r3, u2, v2(P2), k2(e4, 2, -2), 0);
      }
      function Y2(e4, t3, r3, n3) {
        return B2(e4, t3, r3, h2, k2(e4, 0, n3), k2(e4, n3 + 1, -1), n3);
      }
      function J2(e4, t3) {
        switch (function(e5, t4) {
          return (((t4 << 2 ^ y2(e5, 0)) << 2 ^ y2(e5, 1)) << 2 ^ y2(e5, 2)) << 2 ^ y2(e5, 3);
        }(e4, t3)) {
          case 5103:
            return d2 + "print-" + e4 + e4;
          case 5737:
          case 4201:
          case 3177:
          case 3433:
          case 1641:
          case 4457:
          case 2921:
          case 5572:
          case 6356:
          case 5844:
          case 3191:
          case 6645:
          case 3005:
          case 6391:
          case 5879:
          case 5623:
          case 6135:
          case 4599:
          case 4855:
          case 4215:
          case 6389:
          case 5109:
          case 5365:
          case 5621:
          case 3829:
            return d2 + e4 + e4;
          case 5349:
          case 4246:
          case 4810:
          case 6968:
          case 2756:
            return d2 + e4 + c2 + e4 + s2 + e4 + e4;
          case 6828:
          case 4268:
            return d2 + e4 + s2 + e4 + e4;
          case 6165:
            return d2 + e4 + s2 + "flex-" + e4 + e4;
          case 5187:
            return d2 + e4 + w2(e4, /(\w+).+(:[^]+)/, d2 + "box-$1$2" + s2 + "flex-$1$2") + e4;
          case 5443:
            return d2 + e4 + s2 + "flex-item-" + w2(e4, /flex-|-self/, "") + e4;
          case 4675:
            return d2 + e4 + s2 + "flex-line-pack" + w2(e4, /align-content|flex-|-self/, "") + e4;
          case 5548:
            return d2 + e4 + s2 + w2(e4, "shrink", "negative") + e4;
          case 5292:
            return d2 + e4 + s2 + w2(e4, "basis", "preferred-size") + e4;
          case 6060:
            return d2 + "box-" + w2(e4, "-grow", "") + d2 + e4 + s2 + w2(e4, "grow", "positive") + e4;
          case 4554:
            return d2 + w2(e4, /([^-])(transform)/g, "$1" + d2 + "$2") + e4;
          case 6187:
            return w2(w2(w2(e4, /(zoom-|grab)/, d2 + "$1"), /(image-set)/, d2 + "$1"), e4, "") + e4;
          case 5495:
          case 3959:
            return w2(e4, /(image-set\([^]*)/, d2 + "$1$`$1");
          case 4968:
            return w2(w2(e4, /(.+:)(flex-)?(.*)/, d2 + "box-pack:$3" + s2 + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + d2 + e4 + e4;
          case 4095:
          case 3583:
          case 4068:
          case 2532:
            return w2(e4, /(.+)-inline(.+)/, d2 + "$1$2") + e4;
          case 8116:
          case 7059:
          case 5753:
          case 5535:
          case 5445:
          case 5701:
          case 4933:
          case 4677:
          case 5533:
          case 5789:
          case 5021:
          case 4765:
            if (x2(e4) - 1 - t3 > 6)
              switch (y2(e4, t3 + 1)) {
                case 109:
                  if (y2(e4, t3 + 4) !== 45)
                    break;
                case 102:
                  return w2(e4, /(.+:)(.+)-([^]+)/, "$1" + d2 + "$2-$3$1" + c2 + (y2(e4, t3 + 3) == 108 ? "$3" : "$2-$3")) + e4;
                case 115:
                  return ~m2(e4, "stretch") ? J2(w2(e4, "stretch", "fill-available"), t3) + e4 : e4;
              }
            break;
          case 4949:
            if (y2(e4, t3 + 1) !== 115)
              break;
          case 6444:
            switch (y2(e4, x2(e4) - 3 - (~m2(e4, "!important") && 10))) {
              case 107:
                return w2(e4, ":", ":" + d2) + e4;
              case 101:
                return w2(e4, /(.+:)([^;!]+)(;|!.+)?/, "$1" + d2 + (y2(e4, 14) === 45 ? "inline-" : "") + "box$3$1" + d2 + "$2$3$1" + s2 + "$2box$3") + e4;
            }
            break;
          case 5936:
            switch (y2(e4, t3 + 11)) {
              case 114:
                return d2 + e4 + s2 + w2(e4, /[svh]\w+-[tblr]{2}/, "tb") + e4;
              case 108:
                return d2 + e4 + s2 + w2(e4, /[svh]\w+-[tblr]{2}/, "tb-rl") + e4;
              case 45:
                return d2 + e4 + s2 + w2(e4, /[svh]\w+-[tblr]{2}/, "lr") + e4;
            }
            return d2 + e4 + s2 + e4 + e4;
        }
        return e4;
      }
      function K2(e4, t3) {
        for (var r3 = "", n3 = C2(e4), o3 = 0; o3 < n3; o3++)
          r3 += t3(e4[o3], o3, e4, t3) || "";
        return r3;
      }
      function Q2(e4, t3, r3, n3) {
        switch (e4.type) {
          case "@import":
          case h2:
            return e4.return = e4.return || e4.value;
          case u2:
            return "";
          case "@keyframes":
            return e4.return = e4.value + "{" + K2(e4.children, n3) + "}";
          case f2:
            e4.value = e4.props.join(",");
        }
        return x2(r3 = K2(e4.children, n3)) ? e4.return = e4.value + "{" + r3 + "}" : "";
      }
      function ee(e4) {
        return function(t3) {
          t3.root || (t3 = t3.return) && e4(t3);
        };
      }
      var te = function(e4) {
        var t3 = new WeakMap();
        return function(r3) {
          if (t3.has(r3))
            return t3.get(r3);
          var n3 = e4(r3);
          return t3.set(r3, n3), n3;
        };
      };
      var re = function(e4) {
        var t3 = {};
        return function(r3) {
          return t3[r3] === void 0 && (t3[r3] = e4(r3)), t3[r3];
        };
      }, ne = function(e4, t3, r3) {
        for (var n3 = 0, o3 = 0; n3 = o3, o3 = Z2(), n3 === 38 && o3 === 12 && (t3[r3] = 1), !T2(o3); )
          I2();
        return R2(e4, E2);
      }, oe = function(e4, t3) {
        return $2(function(e5, t4) {
          var r3 = -1, n3 = 44;
          do {
            switch (T2(n3)) {
              case 0:
                n3 === 38 && Z2() === 12 && (t4[r3] = 1), e5[r3] += ne(E2 - 1, t4, r3);
                break;
              case 2:
                e5[r3] += D2(n3);
                break;
              case 4:
                if (n3 === 44) {
                  e5[++r3] = Z2() === 58 ? "&\f" : "", t4[r3] = e5[r3].length;
                  break;
                }
              default:
                e5[r3] += v2(n3);
            }
          } while (n3 = I2());
          return e5;
        }(_2(e4), t3));
      }, ae = new WeakMap(), ie = function(e4) {
        if (e4.type === "rule" && e4.parent && !(e4.length < 1)) {
          for (var t3 = e4.value, r3 = e4.parent, n3 = e4.column === r3.column && e4.line === r3.line; r3.type !== "rule"; )
            if (!(r3 = r3.parent))
              return;
          if ((e4.props.length !== 1 || t3.charCodeAt(0) === 58 || ae.get(r3)) && !n3) {
            ae.set(e4, true);
            for (var o3 = [], a3 = oe(t3, o3), i3 = r3.props, l3 = 0, s3 = 0; l3 < a3.length; l3++)
              for (var c3 = 0; c3 < i3.length; c3++, s3++)
                e4.props[s3] = o3[l3] ? a3[l3].replace(/&\f/g, i3[c3]) : i3[c3] + " " + a3[l3];
          }
        }
      }, le = function(e4) {
        if (e4.type === "decl") {
          var t3 = e4.value;
          t3.charCodeAt(0) === 108 && t3.charCodeAt(2) === 98 && (e4.return = "", e4.value = "");
        }
      }, se = [function(e4, t3, r3, n3) {
        if (e4.length > -1 && !e4.return)
          switch (e4.type) {
            case h2:
              e4.return = J2(e4.value, e4.length);
              break;
            case "@keyframes":
              return K2([A2(e4, { value: w2(e4.value, "@", "@" + d2) })], n3);
            case f2:
              if (e4.length)
                return O2(e4.props, function(t4) {
                  switch (function(e5, t5) {
                    return (e5 = t5.exec(e5)) ? e5[0] : e5;
                  }(t4, /(::plac\w+|:read-\w+)/)) {
                    case ":read-only":
                    case ":read-write":
                      return K2([A2(e4, { props: [w2(t4, /:(read-\w+)/, ":-moz-$1")] })], n3);
                    case "::placeholder":
                      return K2([A2(e4, { props: [w2(t4, /:(plac\w+)/, ":" + d2 + "input-$1")] }), A2(e4, { props: [w2(t4, /:(plac\w+)/, ":-moz-$1")] }), A2(e4, { props: [w2(t4, /:(plac\w+)/, s2 + "input-$1")] })], n3);
                  }
                  return "";
                });
          }
      }], ce = function(e4) {
        var t3 = e4.key;
        if (t3 === "css") {
          var r3 = document.querySelectorAll("style[data-emotion]:not([data-s])");
          Array.prototype.forEach.call(r3, function(e5) {
            e5.getAttribute("data-emotion").indexOf(" ") !== -1 && (document.head.appendChild(e5), e5.setAttribute("data-s", ""));
          });
        }
        var n3 = e4.stylisPlugins || se;
        var o3, a3, i3 = {}, s3 = [];
        o3 = e4.container || document.head, Array.prototype.forEach.call(document.querySelectorAll('style[data-emotion^="' + t3 + ' "]'), function(e5) {
          for (var t4 = e5.getAttribute("data-emotion").split(" "), r4 = 1; r4 < t4.length; r4++)
            i3[t4[r4]] = true;
          s3.push(e5);
        });
        var c3 = [ie, le];
        var d3, u3 = [Q2, ee(function(e5) {
          d3.insert(e5);
        })], f3 = function(e5) {
          var t4 = C2(e5);
          return function(r4, n4, o4, a4) {
            for (var i4 = "", l3 = 0; l3 < t4; l3++)
              i4 += e5[l3](r4, n4, o4, a4) || "";
            return i4;
          };
        }(c3.concat(n3, u3));
        a3 = function(e5, t4, r4, n4) {
          d3 = r4, K2(U2(e5 ? e5 + "{" + t4.styles + "}" : t4.styles), f3), n4 && (h3.inserted[t4.name] = true);
        };
        var h3 = { key: t3, sheet: new l2({ key: t3, container: o3, nonce: e4.nonce, speedy: e4.speedy, prepend: e4.prepend, insertionPoint: e4.insertionPoint }), nonce: e4.nonce, inserted: i3, registered: {}, insert: a3 };
        return h3.sheet.hydrate(s3), h3;
      };
      function de() {
        return (de = Object.assign || function(e4) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = arguments[t3];
            for (var n3 in r3)
              Object.prototype.hasOwnProperty.call(r3, n3) && (e4[n3] = r3[n3]);
          }
          return e4;
        }).apply(this, arguments);
      }
      r2(4);
      var ue = function(e4) {
        for (var t3, r3 = 0, n3 = 0, o3 = e4.length; o3 >= 4; ++n3, o3 -= 4)
          t3 = 1540483477 * (65535 & (t3 = 255 & e4.charCodeAt(n3) | (255 & e4.charCodeAt(++n3)) << 8 | (255 & e4.charCodeAt(++n3)) << 16 | (255 & e4.charCodeAt(++n3)) << 24)) + (59797 * (t3 >>> 16) << 16), r3 = 1540483477 * (65535 & (t3 ^= t3 >>> 24)) + (59797 * (t3 >>> 16) << 16) ^ 1540483477 * (65535 & r3) + (59797 * (r3 >>> 16) << 16);
        switch (o3) {
          case 3:
            r3 ^= (255 & e4.charCodeAt(n3 + 2)) << 16;
          case 2:
            r3 ^= (255 & e4.charCodeAt(n3 + 1)) << 8;
          case 1:
            r3 = 1540483477 * (65535 & (r3 ^= 255 & e4.charCodeAt(n3))) + (59797 * (r3 >>> 16) << 16);
        }
        return (((r3 = 1540483477 * (65535 & (r3 ^= r3 >>> 13)) + (59797 * (r3 >>> 16) << 16)) ^ r3 >>> 15) >>> 0).toString(36);
      }, fe = { animationIterationCount: 1, borderImageOutset: 1, borderImageSlice: 1, borderImageWidth: 1, boxFlex: 1, boxFlexGroup: 1, boxOrdinalGroup: 1, columnCount: 1, columns: 1, flex: 1, flexGrow: 1, flexPositive: 1, flexShrink: 1, flexNegative: 1, flexOrder: 1, gridRow: 1, gridRowEnd: 1, gridRowSpan: 1, gridRowStart: 1, gridColumn: 1, gridColumnEnd: 1, gridColumnSpan: 1, gridColumnStart: 1, msGridRow: 1, msGridRowSpan: 1, msGridColumn: 1, msGridColumnSpan: 1, fontWeight: 1, lineHeight: 1, opacity: 1, order: 1, orphans: 1, tabSize: 1, widows: 1, zIndex: 1, zoom: 1, WebkitLineClamp: 1, fillOpacity: 1, floodOpacity: 1, stopOpacity: 1, strokeDasharray: 1, strokeDashoffset: 1, strokeMiterlimit: 1, strokeOpacity: 1, strokeWidth: 1 }, he = /[A-Z]|^ms/g, pe = /_EMO_([^_]+?)_([^]*?)_EMO_/g, ve = function(e4) {
        return e4.charCodeAt(1) === 45;
      }, ge = function(e4) {
        return e4 != null && typeof e4 != "boolean";
      }, be = re(function(e4) {
        return ve(e4) ? e4 : e4.replace(he, "-$&").toLowerCase();
      }), we = function(e4, t3) {
        switch (e4) {
          case "animation":
          case "animationName":
            if (typeof t3 == "string")
              return t3.replace(pe, function(e5, t4, r3) {
                return ye = { name: t4, styles: r3, next: ye }, t4;
              });
        }
        return fe[e4] === 1 || ve(e4) || typeof t3 != "number" || t3 === 0 ? t3 : t3 + "px";
      };
      function me(e4, t3, r3) {
        if (r3 == null)
          return "";
        if (r3.__emotion_styles !== void 0)
          return r3;
        switch (typeof r3) {
          case "boolean":
            return "";
          case "object":
            if (r3.anim === 1)
              return ye = { name: r3.name, styles: r3.styles, next: ye }, r3.name;
            if (r3.styles !== void 0) {
              var n3 = r3.next;
              if (n3 !== void 0)
                for (; n3 !== void 0; )
                  ye = { name: n3.name, styles: n3.styles, next: ye }, n3 = n3.next;
              return r3.styles + ";";
            }
            return function(e5, t4, r4) {
              var n4 = "";
              if (Array.isArray(r4))
                for (var o4 = 0; o4 < r4.length; o4++)
                  n4 += me(e5, t4, r4[o4]) + ";";
              else
                for (var a4 in r4) {
                  var i4 = r4[a4];
                  if (typeof i4 != "object")
                    t4 != null && t4[i4] !== void 0 ? n4 += a4 + "{" + t4[i4] + "}" : ge(i4) && (n4 += be(a4) + ":" + we(a4, i4) + ";");
                  else if (!Array.isArray(i4) || typeof i4[0] != "string" || t4 != null && t4[i4[0]] !== void 0) {
                    var l3 = me(e5, t4, i4);
                    switch (a4) {
                      case "animation":
                      case "animationName":
                        n4 += be(a4) + ":" + l3 + ";";
                        break;
                      default:
                        n4 += a4 + "{" + l3 + "}";
                    }
                  } else
                    for (var s3 = 0; s3 < i4.length; s3++)
                      ge(i4[s3]) && (n4 += be(a4) + ":" + we(a4, i4[s3]) + ";");
                }
              return n4;
            }(e4, t3, r3);
          case "function":
            if (e4 !== void 0) {
              var o3 = ye, a3 = r3(e4);
              return ye = o3, me(e4, t3, a3);
            }
            break;
        }
        if (t3 == null)
          return r3;
        var i3 = t3[r3];
        return i3 !== void 0 ? i3 : r3;
      }
      var ye, ke = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
      var xe = function(e4, t3, r3) {
        if (e4.length === 1 && typeof e4[0] == "object" && e4[0] !== null && e4[0].styles !== void 0)
          return e4[0];
        var n3 = true, o3 = "";
        ye = void 0;
        var a3 = e4[0];
        a3 == null || a3.raw === void 0 ? (n3 = false, o3 += me(r3, t3, a3)) : o3 += a3[0];
        for (var i3 = 1; i3 < e4.length; i3++)
          o3 += me(r3, t3, e4[i3]), n3 && (o3 += a3[i3]);
        ke.lastIndex = 0;
        for (var l3, s3 = ""; (l3 = ke.exec(o3)) !== null; )
          s3 += "-" + l3[1];
        return { name: ue(o3) + s3, styles: o3, next: ye };
      }, Ce = Object(a2.createContext)(typeof HTMLElement != "undefined" ? ce({ key: "css" }) : null);
      var je = Ce.Provider, Oe = function(e4) {
        return Object(a2.forwardRef)(function(t3, r3) {
          var n3 = Object(a2.useContext)(Ce);
          return e4(t3, n3, r3);
        });
      }, Me = Object(a2.createContext)({});
      var ze = te(function(e4) {
        return te(function(t3) {
          return function(e5, t4) {
            return typeof t4 == "function" ? t4(e5) : de({}, e5, t4);
          }(e4, t3);
        });
      }), Se = function(e4) {
        var t3 = Object(a2.useContext)(Me);
        return e4.theme !== t3 && (t3 = ze(t3)(e4.theme)), Object(a2.createElement)(Me.Provider, { value: t3 }, e4.children);
      };
      var Ee = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/, Pe = re(function(e4) {
        return Ee.test(e4) || e4.charCodeAt(0) === 111 && e4.charCodeAt(1) === 110 && e4.charCodeAt(2) < 91;
      });
      function He(e4, t3, r3) {
        var n3 = "";
        return r3.split(" ").forEach(function(r4) {
          e4[r4] !== void 0 ? t3.push(e4[r4] + ";") : n3 += r4 + " ";
        }), n3;
      }
      var Be = function(e4, t3, r3) {
        var n3 = e4.key + "-" + t3.name;
        if (r3 === false && e4.registered[n3] === void 0 && (e4.registered[n3] = t3.styles), e4.inserted[t3.name] === void 0) {
          var o3 = t3;
          do {
            e4.insert(t3 === o3 ? "." + n3 : "", o3, e4.sheet, true);
            o3 = o3.next;
          } while (o3 !== void 0);
        }
      }, Ae = /[A-Z]|^ms/g, Le = /_EMO_([^_]+?)_([^]*?)_EMO_/g, Ie = function(e4) {
        return e4.charCodeAt(1) === 45;
      }, Ze = function(e4) {
        return e4 != null && typeof e4 != "boolean";
      }, Ve = re(function(e4) {
        return Ie(e4) ? e4 : e4.replace(Ae, "-$&").toLowerCase();
      }), Re = function(e4, t3) {
        switch (e4) {
          case "animation":
          case "animationName":
            if (typeof t3 == "string")
              return t3.replace(Le, function(e5, t4, r3) {
                return _e = { name: t4, styles: r3, next: _e }, t4;
              });
        }
        return fe[e4] === 1 || Ie(e4) || typeof t3 != "number" || t3 === 0 ? t3 : t3 + "px";
      };
      function Te(e4, t3, r3) {
        if (r3 == null)
          return "";
        if (r3.__emotion_styles !== void 0)
          return r3;
        switch (typeof r3) {
          case "boolean":
            return "";
          case "object":
            if (r3.anim === 1)
              return _e = { name: r3.name, styles: r3.styles, next: _e }, r3.name;
            if (r3.styles !== void 0) {
              var n3 = r3.next;
              if (n3 !== void 0)
                for (; n3 !== void 0; )
                  _e = { name: n3.name, styles: n3.styles, next: _e }, n3 = n3.next;
              return r3.styles + ";";
            }
            return function(e5, t4, r4) {
              var n4 = "";
              if (Array.isArray(r4))
                for (var o4 = 0; o4 < r4.length; o4++)
                  n4 += Te(e5, t4, r4[o4]) + ";";
              else
                for (var a4 in r4) {
                  var i4 = r4[a4];
                  if (typeof i4 != "object")
                    t4 != null && t4[i4] !== void 0 ? n4 += a4 + "{" + t4[i4] + "}" : Ze(i4) && (n4 += Ve(a4) + ":" + Re(a4, i4) + ";");
                  else if (!Array.isArray(i4) || typeof i4[0] != "string" || t4 != null && t4[i4[0]] !== void 0) {
                    var l3 = Te(e5, t4, i4);
                    switch (a4) {
                      case "animation":
                      case "animationName":
                        n4 += Ve(a4) + ":" + l3 + ";";
                        break;
                      default:
                        n4 += a4 + "{" + l3 + "}";
                    }
                  } else
                    for (var s3 = 0; s3 < i4.length; s3++)
                      Ze(i4[s3]) && (n4 += Ve(a4) + ":" + Re(a4, i4[s3]) + ";");
                }
              return n4;
            }(e4, t3, r3);
          case "function":
            if (e4 !== void 0) {
              var o3 = _e, a3 = r3(e4);
              return _e = o3, Te(e4, t3, a3);
            }
            break;
        }
        if (t3 == null)
          return r3;
        var i3 = t3[r3];
        return i3 !== void 0 ? i3 : r3;
      }
      var _e, $e = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
      var De = function(e4, t3, r3) {
        if (e4.length === 1 && typeof e4[0] == "object" && e4[0] !== null && e4[0].styles !== void 0)
          return e4[0];
        var n3 = true, o3 = "";
        _e = void 0;
        var a3 = e4[0];
        a3 == null || a3.raw === void 0 ? (n3 = false, o3 += Te(r3, t3, a3)) : o3 += a3[0];
        for (var i3 = 1; i3 < e4.length; i3++)
          o3 += Te(r3, t3, e4[i3]), n3 && (o3 += a3[i3]);
        $e.lastIndex = 0;
        for (var l3, s3 = ""; (l3 = $e.exec(o3)) !== null; )
          s3 += "-" + l3[1];
        return { name: ue(o3) + s3, styles: o3, next: _e };
      }, Fe = Pe, We = function(e4) {
        return e4 !== "theme";
      }, qe = function(e4) {
        return typeof e4 == "string" && e4.charCodeAt(0) > 96 ? Fe : We;
      }, Ne = function(e4, t3, r3) {
        var n3;
        if (t3) {
          var o3 = t3.shouldForwardProp;
          n3 = e4.__emotion_forwardProp && o3 ? function(t4) {
            return e4.__emotion_forwardProp(t4) && o3(t4);
          } : o3;
        }
        return typeof n3 != "function" && r3 && (n3 = e4.__emotion_forwardProp), n3;
      }, Ue = function e4(t3, r3) {
        var n3, o3, i3 = t3.__emotion_real === t3, l3 = i3 && t3.__emotion_base || t3;
        r3 !== void 0 && (n3 = r3.label, o3 = r3.target);
        var s3 = Ne(t3, r3, i3), c3 = s3 || qe(l3), d3 = !c3("as");
        return function() {
          var u3 = arguments, f3 = i3 && t3.__emotion_styles !== void 0 ? t3.__emotion_styles.slice(0) : [];
          if (n3 !== void 0 && f3.push("label:" + n3 + ";"), u3[0] == null || u3[0].raw === void 0)
            f3.push.apply(f3, u3);
          else {
            f3.push(u3[0][0]);
            for (var h3 = u3.length, p3 = 1; p3 < h3; p3++)
              f3.push(u3[p3], u3[0][p3]);
          }
          var v3 = Oe(function(e5, t4, r4) {
            var n4 = d3 && e5.as || l3, i4 = "", u4 = [], h4 = e5;
            if (e5.theme == null) {
              for (var p4 in h4 = {}, e5)
                h4[p4] = e5[p4];
              h4.theme = Object(a2.useContext)(Me);
            }
            typeof e5.className == "string" ? i4 = He(t4.registered, u4, e5.className) : e5.className != null && (i4 = e5.className + " ");
            var v4 = De(f3.concat(u4), t4.registered, h4);
            Be(t4, v4, typeof n4 == "string");
            i4 += t4.key + "-" + v4.name, o3 !== void 0 && (i4 += " " + o3);
            var g3 = d3 && s3 === void 0 ? qe(n4) : c3, b3 = {};
            for (var w3 in e5)
              d3 && w3 === "as" || g3(w3) && (b3[w3] = e5[w3]);
            return b3.className = i4, b3.ref = r4, Object(a2.createElement)(n4, b3);
          });
          return v3.displayName = n3 !== void 0 ? n3 : "Styled(" + (typeof l3 == "string" ? l3 : l3.displayName || l3.name || "Component") + ")", v3.defaultProps = t3.defaultProps, v3.__emotion_real = v3, v3.__emotion_base = l3, v3.__emotion_styles = f3, v3.__emotion_forwardProp = s3, Object.defineProperty(v3, "toString", { value: function() {
            return "." + o3;
          } }), v3.withComponent = function(t4, n4) {
            return e4(t4, de({}, r3, n4, { shouldForwardProp: Ne(v3, n4, true) })).apply(void 0, f3);
          }, v3;
        };
      }, Ge = r2(1), Xe = r2.n(Ge), Ye = r2(2);
      function Je(e4, t3) {
        return function(e5) {
          if (Array.isArray(e5))
            return e5;
        }(e4) || function(e5, t4) {
          var r3 = e5 == null ? null : typeof Symbol != "undefined" && e5[Symbol.iterator] || e5["@@iterator"];
          if (r3 == null)
            return;
          var n3, o3, a3 = [], i3 = true, l3 = false;
          try {
            for (r3 = r3.call(e5); !(i3 = (n3 = r3.next()).done) && (a3.push(n3.value), !t4 || a3.length !== t4); i3 = true)
              ;
          } catch (e6) {
            l3 = true, o3 = e6;
          } finally {
            try {
              i3 || r3.return == null || r3.return();
            } finally {
              if (l3)
                throw o3;
            }
          }
          return a3;
        }(e4, t3) || function(e5, t4) {
          if (!e5)
            return;
          if (typeof e5 == "string")
            return Ke(e5, t4);
          var r3 = Object.prototype.toString.call(e5).slice(8, -1);
          r3 === "Object" && e5.constructor && (r3 = e5.constructor.name);
          if (r3 === "Map" || r3 === "Set")
            return Array.from(e5);
          if (r3 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3))
            return Ke(e5, t4);
        }(e4, t3) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
      }
      function Ke(e4, t3) {
        (t3 == null || t3 > e4.length) && (t3 = e4.length);
        for (var r3 = 0, n3 = new Array(t3); r3 < t3; r3++)
          n3[r3] = e4[r3];
        return n3;
      }
      var Qe, et, tt = (Qe = ["@media (max-width: ".concat(Ye[1].value, "px)"), "@media (min-width: ".concat(Ye[1].value, "px) and (max-width: ").concat(Ye[2].value, "px)"), "@media (min-width: ".concat(Ye[2].value, "px)")], et = Qe, function(e4) {
        var t3 = {};
        return et.forEach(function(e5) {
          t3[e5] = {};
        }), t3["@media screen"] = {}, Object.entries(e4).forEach(function(e5) {
          var r3 = Je(e5, 2), n3 = r3[0], o3 = Je(r3[1], 2), a3 = o3[0], i3 = o3[1];
          if (Array.isArray(a3)) {
            var l3 = a3[0], s3 = a3[1] || a3[0], c3 = a3[2] || a3[1] || a3[0], d3 = Je(et, 3), u3 = d3[0], f3 = d3[1], h3 = d3[2];
            t3[u3][n3] = i3[l3], t3[f3][n3] = i3[s3], t3[h3][n3] = i3[c3];
          } else
            t3["@media screen"][n3] = i3[a3];
        }), t3;
      });
      function rt(e4, t3) {
        var r3 = Object.keys(e4);
        if (Object.getOwnPropertySymbols) {
          var n3 = Object.getOwnPropertySymbols(e4);
          t3 && (n3 = n3.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e4, t4).enumerable;
          })), r3.push.apply(r3, n3);
        }
        return r3;
      }
      function nt(e4) {
        for (var t3 = 1; t3 < arguments.length; t3++) {
          var r3 = arguments[t3] != null ? arguments[t3] : {};
          t3 % 2 ? rt(Object(r3), true).forEach(function(t4) {
            ot(e4, t4, r3[t4]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r3)) : rt(Object(r3)).forEach(function(t4) {
            Object.defineProperty(e4, t4, Object.getOwnPropertyDescriptor(r3, t4));
          });
        }
        return e4;
      }
      function ot(e4, t3, r3) {
        return t3 in e4 ? Object.defineProperty(e4, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t3] = r3, e4;
      }
      var at = { space: "xs", "data-e2e-test-id": void 0 }, it = Ue("div", { target: "earxui51" })(function(e4) {
        var t3 = e4.alignItems;
        return nt(nt({}, tt({ alignItems: [t3, { left: "flex-start", right: "flex-end", center: "center", spaceBetween: "space-between" }] })), {}, { display: "flex", flexDirection: "column" });
      }, ""), lt = Ue("div", { target: "earxui50" })(function(e4) {
        var t3 = e4.theme, r3 = e4.space;
        return nt(nt({}, tt({ marginTop: [r3, t3.variables.size.spacing] })), {}, { "&:first-of-type": { marginTop: 0 }, "&:empty": { marginTop: 0 } });
      }, "");
      function st(e4) {
        var t3 = e4.children, r3 = e4.space, n3 = e4.alignItems, o3 = e4["data-e2e-test-id"];
        return i2.a.createElement(it, { "data-e2e-test-id": o3, alignItems: n3 }, i2.a.Children.map(Xe()(t3), function(e5) {
          return e5 && i2.a.createElement(lt, { space: r3 }, e5);
        }));
      }
      function ct(e4, t3) {
        var r3 = Object.keys(e4);
        if (Object.getOwnPropertySymbols) {
          var n3 = Object.getOwnPropertySymbols(e4);
          t3 && (n3 = n3.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e4, t4).enumerable;
          })), r3.push.apply(r3, n3);
        }
        return r3;
      }
      function dt(e4) {
        for (var t3 = 1; t3 < arguments.length; t3++) {
          var r3 = arguments[t3] != null ? arguments[t3] : {};
          t3 % 2 ? ct(Object(r3), true).forEach(function(t4) {
            ut(e4, t4, r3[t4]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r3)) : ct(Object(r3)).forEach(function(t4) {
            Object.defineProperty(e4, t4, Object.getOwnPropertyDescriptor(r3, t4));
          });
        }
        return e4;
      }
      function ut(e4, t3, r3) {
        return t3 in e4 ? Object.defineProperty(e4, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t3] = r3, e4;
      }
      function ft(e4, t3) {
        return function(e5) {
          if (Array.isArray(e5))
            return e5;
        }(e4) || function(e5, t4) {
          var r3 = e5 == null ? null : typeof Symbol != "undefined" && e5[Symbol.iterator] || e5["@@iterator"];
          if (r3 == null)
            return;
          var n3, o3, a3 = [], i3 = true, l3 = false;
          try {
            for (r3 = r3.call(e5); !(i3 = (n3 = r3.next()).done) && (a3.push(n3.value), !t4 || a3.length !== t4); i3 = true)
              ;
          } catch (e6) {
            l3 = true, o3 = e6;
          } finally {
            try {
              i3 || r3.return == null || r3.return();
            } finally {
              if (l3)
                throw o3;
            }
          }
          return a3;
        }(e4, t3) || function(e5, t4) {
          if (!e5)
            return;
          if (typeof e5 == "string")
            return ht(e5, t4);
          var r3 = Object.prototype.toString.call(e5).slice(8, -1);
          r3 === "Object" && e5.constructor && (r3 = e5.constructor.name);
          if (r3 === "Map" || r3 === "Set")
            return Array.from(e5);
          if (r3 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3))
            return ht(e5, t4);
        }(e4, t3) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
      }
      function ht(e4, t3) {
        (t3 == null || t3 > e4.length) && (t3 = e4.length);
        for (var r3 = 0, n3 = new Array(t3); r3 < t3; r3++)
          n3[r3] = e4[r3];
        return n3;
      }
      st.defaultProps = at;
      var pt = { alignItems: "left", space: "xs", noWrap: false, vAlignItems: "top", "data-e2e-test-id": void 0 }, vt = function(e4) {
        return Object.entries(e4).map(function(e5) {
          var t3 = ft(e5, 2), r3 = t3[0], n3 = t3[1];
          return [r3, "-".concat(n3)];
        }).reduce(function(e5, t3) {
          var r3 = ft(t3, 2), n3 = r3[0], o3 = r3[1];
          return e5[n3] = o3, e5;
        }, {});
      }, gt = Ue("div", { target: "e1tnky2o1" })(function(e4) {
        var t3 = e4.alignItems, r3 = e4.vAlignItems, n3 = e4.space, o3 = e4.vSpace, a3 = e4.theme, i3 = e4.noWrap;
        return dt(dt({}, tt({ alignItems: [r3, { top: "flex-start", bottom: "flex-end", center: "center", spaceBetween: "space-between" }], justifyContent: [t3, { left: "flex-start", right: "flex-end", center: "center", spaceBetween: "space-between" }], marginLeft: [n3, vt(a3.variables.size.spacing)], marginTop: [o3, vt(a3.variables.size.spacing)] })), {}, { display: "flex", flexDirection: "row", flexWrap: i3 ? "nowrap" : "wrap" });
      }, ""), bt = Ue("div", { target: "e1tnky2o0" })(function(e4) {
        var t3 = e4.theme, r3 = e4.space, n3 = e4.vSpace;
        return dt(dt({}, tt({ marginTop: [n3, t3.variables.size.spacing], marginLeft: [r3, t3.variables.size.spacing] })), {}, { "&:empty": { marginTop: 0, marginLeft: 0 } });
      }, "");
      function wt(e4) {
        var t3 = e4.children, r3 = e4.alignItems, n3 = e4.vAlignItems, o3 = e4.space, a3 = e4.vSpace, l3 = a3 === void 0 ? o3 : a3, s3 = e4.noWrap, c3 = e4["data-e2e-test-id"];
        return i2.a.createElement(gt, { "data-e2e-test-id": c3, alignItems: r3, vAlignItems: n3, space: o3, vSpace: l3, noWrap: s3 }, i2.a.Children.map(Xe()(t3), function(e5) {
          return e5 && i2.a.createElement(bt, { space: o3, vSpace: l3 }, e5);
        }));
      }
      function mt(e4, t3) {
        var r3 = Object.keys(e4);
        if (Object.getOwnPropertySymbols) {
          var n3 = Object.getOwnPropertySymbols(e4);
          t3 && (n3 = n3.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e4, t4).enumerable;
          })), r3.push.apply(r3, n3);
        }
        return r3;
      }
      function yt(e4) {
        for (var t3 = 1; t3 < arguments.length; t3++) {
          var r3 = arguments[t3] != null ? arguments[t3] : {};
          t3 % 2 ? mt(Object(r3), true).forEach(function(t4) {
            kt(e4, t4, r3[t4]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r3)) : mt(Object(r3)).forEach(function(t4) {
            Object.defineProperty(e4, t4, Object.getOwnPropertyDescriptor(r3, t4));
          });
        }
        return e4;
      }
      function kt(e4, t3, r3) {
        return t3 in e4 ? Object.defineProperty(e4, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t3] = r3, e4;
      }
      wt.defaultProps = pt;
      var xt = function(e4) {
        return { color: e4.values.color.header.primary, fontFamily: e4.variables.fontFamily.lato, fontWeight: e4.variables.weight.black, margin: 0 };
      }, Ct = Ue("h1", { target: "e1nyenup5" })(function(e4) {
        var t3 = e4.theme;
        return yt(yt({}, xt(t3)), {}, { fontSize: t3.variables.size.font.header.xl, lineHeight: t3.variables.size.lineHeight.header.xl });
      }, ""), jt = Ue("h2", { target: "e1nyenup4" })(function(e4) {
        var t3 = e4.theme;
        return yt(yt({}, xt(t3)), {}, { fontSize: t3.variables.size.font.header.l, lineHeight: t3.variables.size.lineHeight.header.l });
      }, ""), Ot = Ue("h3", { target: "e1nyenup3" })(function(e4) {
        var t3 = e4.theme;
        return yt(yt({}, xt(t3)), {}, { fontSize: t3.variables.size.font.header.m, lineHeight: t3.variables.size.lineHeight.header.m });
      }, ""), Mt = Ue("h4", { target: "e1nyenup2" })(function(e4) {
        var t3 = e4.theme;
        return yt(yt({}, xt(t3)), {}, { fontSize: t3.variables.size.font.header.s, lineHeight: t3.variables.size.lineHeight.header.s });
      }, ""), zt = Ue("h5", { target: "e1nyenup1" })(function(e4) {
        var t3 = e4.theme;
        return yt(yt({}, xt(t3)), {}, { fontSize: t3.variables.size.font.header.xs, lineHeight: t3.variables.size.lineHeight.header.xs });
      }, ""), St = Ue("h6", { target: "e1nyenup0" })(function(e4) {
        var t3 = e4.theme;
        return yt(yt({}, xt(t3)), {}, { fontSize: t3.variables.size.font.header.xxs, lineHeight: t3.variables.size.lineHeight.header.xxs, letterSpacing: "0.5px", textTransform: "uppercase", color: t3.values.color.header.secondary });
      }, "");
      function Et(e4, t3) {
        var r3 = Object.keys(e4);
        if (Object.getOwnPropertySymbols) {
          var n3 = Object.getOwnPropertySymbols(e4);
          t3 && (n3 = n3.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e4, t4).enumerable;
          })), r3.push.apply(r3, n3);
        }
        return r3;
      }
      function Pt(e4, t3, r3) {
        return t3 in e4 ? Object.defineProperty(e4, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t3] = r3, e4;
      }
      var Ht = { size: "m", weight: "normal", transform: "none", as: "p", variant: "secondary", align: "left", hyphens: "none", "data-e2e-test-id": void 0 }, Bt = Ue("p", { shouldForwardProp: function(e4) {
        return Pe(e4) && e4 !== "transform";
      }, target: "efktmsx0" })(function(e4) {
        var t3 = e4.theme, r3 = e4.align, n3 = e4.weight, o3 = e4.size, a3 = e4.transform, i3 = e4.hyphens, l3 = e4.variant;
        return function(e5) {
          for (var t4 = 1; t4 < arguments.length; t4++) {
            var r4 = arguments[t4] != null ? arguments[t4] : {};
            t4 % 2 ? Et(Object(r4), true).forEach(function(t5) {
              Pt(e5, t5, r4[t5]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e5, Object.getOwnPropertyDescriptors(r4)) : Et(Object(r4)).forEach(function(t5) {
              Object.defineProperty(e5, t5, Object.getOwnPropertyDescriptor(r4, t5));
            });
          }
          return e5;
        }({ fontFamily: t3.variables.fontFamily.lato, margin: 0, textTransform: a3, textAlign: r3, "font-weight": String(t3.variables.weight[n3]), color: t3.values.color.text[l3], fontSize: t3.variables.size.font.text[o3], lineHeight: t3.variables.size.lineHeight.text[o3] }, tt({ hyphens: [i3, { none: "none", auto: "auto", manual: "manual" }] }));
      }, "");
      Bt.defaultProps = Ht;
      var At = Ue("div", { target: "eyueia0" })(function(e4) {
        var t3 = e4.theme, r3 = e4.space, n3 = e4.alignText, o3 = n3 === void 0 ? "left" : n3;
        return tt({ padding: [r3, t3.variables.size.spacing], textAlign: [o3, { left: "left", right: "right", center: "center" }] });
      }, function(e4) {
        var t3 = e4.theme, r3 = e4.vSpace;
        return tt({ paddingTop: [r3, t3.variables.size.spacing], paddingBottom: [r3, t3.variables.size.spacing] });
      }, function(e4) {
        var t3 = e4.theme, r3 = e4.rSpace, n3 = e4.lSpace, o3 = e4.tSpace, a3 = e4.bSpace;
        return tt({ paddingLeft: [n3, t3.variables.size.spacing], paddingRight: [r3, t3.variables.size.spacing], paddingTop: [o3, t3.variables.size.spacing], paddingBottom: [a3, t3.variables.size.spacing] });
      }, "");
      At.defaultProps = { space: "xl" };
      var Lt = Ue("div", { target: "e1m4qkst2" })(function() {
        return { display: "flex", justifyContent: "center", alignItems: "center" };
      }, ""), It = Ue("div", { target: "e1m4qkst1" })(function(e4) {
        return { borderBottomColor: e4.theme.values.color.divider.primary, borderBottomWidth: "1px", borderBottomStyle: "solid", flex: "1" };
      }, ""), Zt = Ue("div", { target: "e1m4qkst0" })(function() {
        return { maxWidth: "50%" };
      }, "");
      function Vt(e4) {
        var t3 = e4.text, r3 = e4["data-e2e-test-id"];
        return t3 ? i2.a.createElement(Lt, { "data-e2e-test-id": r3 }, i2.a.createElement(It, null), t3 && i2.a.createElement(Zt, null, i2.a.createElement(At, { space: "xxl", vSpace: "zero" }, i2.a.createElement(Bt, { variant: "tertiary" }, t3))), i2.a.createElement(It, null)) : i2.a.createElement(It, { "data-e2e-test-id": r3 });
      }
      function Rt() {
        return window;
      }
      function Tt() {
        return document;
      }
      function _t(e4, t3) {
        return function(e5) {
          if (Array.isArray(e5))
            return e5;
        }(e4) || function(e5, t4) {
          var r3 = e5 == null ? null : typeof Symbol != "undefined" && e5[Symbol.iterator] || e5["@@iterator"];
          if (r3 == null)
            return;
          var n3, o3, a3 = [], i3 = true, l3 = false;
          try {
            for (r3 = r3.call(e5); !(i3 = (n3 = r3.next()).done) && (a3.push(n3.value), !t4 || a3.length !== t4); i3 = true)
              ;
          } catch (e6) {
            l3 = true, o3 = e6;
          } finally {
            try {
              i3 || r3.return == null || r3.return();
            } finally {
              if (l3)
                throw o3;
            }
          }
          return a3;
        }(e4, t3) || function(e5, t4) {
          if (!e5)
            return;
          if (typeof e5 == "string")
            return $t(e5, t4);
          var r3 = Object.prototype.toString.call(e5).slice(8, -1);
          r3 === "Object" && e5.constructor && (r3 = e5.constructor.name);
          if (r3 === "Map" || r3 === "Set")
            return Array.from(e5);
          if (r3 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3))
            return $t(e5, t4);
        }(e4, t3) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
      }
      function $t(e4, t3) {
        (t3 == null || t3 > e4.length) && (t3 = e4.length);
        for (var r3 = 0, n3 = new Array(t3); r3 < t3; r3++)
          n3[r3] = e4[r3];
        return n3;
      }
      var Dt = function(e4, t3, r3) {
        var n3 = _t(Object(a2.useState)("down"), 2), o3 = n3[0], i3 = n3[1], l3 = Tt(), s3 = Rt();
        return Object(a2.useLayoutEffect)(function() {
          if (t3)
            if (r3) {
              var n4 = Math.max(l3.documentElement.clientHeight || 0, s3.innerHeight || 0), o4 = t3.current.getBoundingClientRect(), a3 = e4.current.getBoundingClientRect().height;
              if (o4.top - a3 < o4.height)
                return void i3("down");
              o4.top + o4.height > n4 && i3("up");
            } else
              i3("down");
        }, [e4, t3, l3.documentElement.clientHeight, r3, s3.innerHeight]), o3;
      };
      function Ft(e4, t3, r3) {
        var n3 = Tt(), o3 = function(o4) {
          if (r3 && (n3.activeElement === t3.current || t3.current.contains(n3.activeElement))) {
            var a3 = Object.keys(e4).find(function(e5) {
              return e5.split(" ").includes(o4.code);
            });
            if (a3)
              o4.preventDefault(), e4[a3](o4) === false && o4.stopPropagation();
          }
        };
        Object(a2.useEffect)(function() {
          return n3.addEventListener("keydown", o3), function() {
            n3.removeEventListener("keydown", o3);
          };
        });
      }
      r2(11);
      function Wt() {
        for (var e4 = arguments.length, t3 = new Array(e4), r3 = 0; r3 < e4; r3++)
          t3[r3] = arguments[r3];
        return xe(t3);
      }
      var qt = r2(3), Nt = r2(5), Ut = r2(6);
      function Gt(e4, t3) {
        return function(e5) {
          if (Array.isArray(e5))
            return e5;
        }(e4) || function(e5, t4) {
          var r3 = e5 == null ? null : typeof Symbol != "undefined" && e5[Symbol.iterator] || e5["@@iterator"];
          if (r3 == null)
            return;
          var n3, o3, a3 = [], i3 = true, l3 = false;
          try {
            for (r3 = r3.call(e5); !(i3 = (n3 = r3.next()).done) && (a3.push(n3.value), !t4 || a3.length !== t4); i3 = true)
              ;
          } catch (e6) {
            l3 = true, o3 = e6;
          } finally {
            try {
              i3 || r3.return == null || r3.return();
            } finally {
              if (l3)
                throw o3;
            }
          }
          return a3;
        }(e4, t3) || function(e5, t4) {
          if (!e5)
            return;
          if (typeof e5 == "string")
            return Xt(e5, t4);
          var r3 = Object.prototype.toString.call(e5).slice(8, -1);
          r3 === "Object" && e5.constructor && (r3 = e5.constructor.name);
          if (r3 === "Map" || r3 === "Set")
            return Array.from(e5);
          if (r3 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3))
            return Xt(e5, t4);
        }(e4, t3) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
      }
      function Xt(e4, t3) {
        (t3 == null || t3 > e4.length) && (t3 = e4.length);
        for (var r3 = 0, n3 = new Array(t3); r3 < t3; r3++)
          n3[r3] = e4[r3];
        return n3;
      }
      function Yt(e4, t3) {
        var r3 = Object.keys(e4);
        if (Object.getOwnPropertySymbols) {
          var n3 = Object.getOwnPropertySymbols(e4);
          t3 && (n3 = n3.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e4, t4).enumerable;
          })), r3.push.apply(r3, n3);
        }
        return r3;
      }
      function Jt(e4) {
        for (var t3 = 1; t3 < arguments.length; t3++) {
          var r3 = arguments[t3] != null ? arguments[t3] : {};
          t3 % 2 ? Yt(Object(r3), true).forEach(function(t4) {
            Kt(e4, t4, r3[t4]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r3)) : Yt(Object(r3)).forEach(function(t4) {
            Object.defineProperty(e4, t4, Object.getOwnPropertyDescriptor(r3, t4));
          });
        }
        return e4;
      }
      function Kt(e4, t3, r3) {
        return t3 in e4 ? Object.defineProperty(e4, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t3] = r3, e4;
      }
      var Qt = Ue("div", { target: "e1pr7vjj0" })(function(e4) {
        var t3 = e4.theme, r3 = e4.variant, n3 = e4.isHoverable, o3 = e4.parentRef, a3 = e4.parentIsHovered, i3 = e4.size, l3 = e4.as;
        return Jt(Jt(Jt(Jt(Jt({ width: qt.a[i3], height: qt.a[i3], "& > svg": { width: qt.a[i3], height: qt.a[i3] } }, r3 !== "inherit" && Jt({}, t3.values.color.text.link[r3] ? { color: t3.values.color.text.link[r3] } : { color: t3.values.color.text[r3] })), l3 === "span" && { verticalAlign: "middle" }), (a3 || n3) && { cursor: "pointer" }), o3 && { opacity: a3 ? 1 : 0.6 }), n3 && { opacity: 0.6, ":hover": { opacity: 1 } });
      }, ""), er = function(e4) {
        var t3, r3, n3, o3, l3, s3, c3 = e4.name, d3 = e4.hoverable, u3 = d3 !== void 0 && d3, f3 = e4.inline, h3 = f3 !== void 0 && f3, p3 = e4.size, v3 = p3 === void 0 ? "m" : p3, g3 = e4.variant, b3 = g3 === void 0 ? "inherit" : g3, w3 = e4["data-e2e-test-id"], m3 = e4["data-testid"], y3 = typeof u3 == "boolean" && u3, k3 = typeof u3 != "boolean" && u3, x3 = (t3 = k3, r3 = Gt(Object(a2.useState)(false), 2), n3 = r3[0], o3 = r3[1], l3 = function() {
          return o3(true);
        }, s3 = function() {
          return o3(false);
        }, Object(a2.useEffect)(function() {
          if (t3) {
            var e5 = t3.current;
            return e5 ? (e5.addEventListener("mouseover", l3), e5.addEventListener("mouseout", s3), function() {
              e5.removeEventListener("mouseover", l3), e5.removeEventListener("mouseout", s3);
            }) : void 0;
          }
        }, [t3]), t3 ? n3 : null), C3 = h3 ? "span" : "div";
        return i2.a.createElement(Qt, { as: C3, "data-e2e-test-id": w3, "data-testid": m3, "data-variant": b3, variant: b3, isHoverable: y3, parentRef: k3, parentIsHovered: x3, size: v3, dangerouslySetInnerHTML: { __html: v3 === "s" && Ut[c3] || Nt[c3] } });
      }, tr = ["children", "onClick", "onFocus", "onBlur", "type", "variant", "size", "disabled", "loading", "as", "leftIcon", "rightIcon", "fullWidth", "privateProps", "data-e2e-test-id"];
      function rr() {
        return (rr = Object.assign || function(e4) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = arguments[t3];
            for (var n3 in r3)
              Object.prototype.hasOwnProperty.call(r3, n3) && (e4[n3] = r3[n3]);
          }
          return e4;
        }).apply(this, arguments);
      }
      function nr(e4, t3) {
        if (e4 == null)
          return {};
        var r3, n3, o3 = function(e5, t4) {
          if (e5 == null)
            return {};
          var r4, n4, o4 = {}, a4 = Object.keys(e5);
          for (n4 = 0; n4 < a4.length; n4++)
            r4 = a4[n4], t4.indexOf(r4) >= 0 || (o4[r4] = e5[r4]);
          return o4;
        }(e4, t3);
        if (Object.getOwnPropertySymbols) {
          var a3 = Object.getOwnPropertySymbols(e4);
          for (n3 = 0; n3 < a3.length; n3++)
            r3 = a3[n3], t3.indexOf(r3) >= 0 || Object.prototype.propertyIsEnumerable.call(e4, r3) && (o3[r3] = e4[r3]);
        }
        return o3;
      }
      function or(e4, t3) {
        var r3 = Object.keys(e4);
        if (Object.getOwnPropertySymbols) {
          var n3 = Object.getOwnPropertySymbols(e4);
          t3 && (n3 = n3.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e4, t4).enumerable;
          })), r3.push.apply(r3, n3);
        }
        return r3;
      }
      function ar(e4) {
        for (var t3 = 1; t3 < arguments.length; t3++) {
          var r3 = arguments[t3] != null ? arguments[t3] : {};
          t3 % 2 ? or(Object(r3), true).forEach(function(t4) {
            ir(e4, t4, r3[t4]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r3)) : or(Object(r3)).forEach(function(t4) {
            Object.defineProperty(e4, t4, Object.getOwnPropertyDescriptor(r3, t4));
          });
        }
        return e4;
      }
      function ir(e4, t3, r3) {
        return t3 in e4 ? Object.defineProperty(e4, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t3] = r3, e4;
      }
      var lr = Ue("button", { target: "e1vkw3t43" })(function(e4) {
        var t3 = e4.theme, r3 = e4.fullWidth, n3 = e4.size, o3 = e4.squareCorners, a3 = e4.variant;
        return ar(ar(ar(ar(ar(ar(ar(ar({ "&[type='button']": { appearance: "none", MozAppearance: "none", WebkitAppearance: "none" }, display: "inline-block", border: 0, color: t3.values.color.text.button[a3].base, backgroundColor: t3.values.color.background.button[a3].base, textTransform: "none", textDecoration: "none", borderRadius: t3.variables.size.borderRadius.button.m, fontFamily: t3.variables.fontFamily.lato, fontSize: t3.variables.size.font.button.m, lineHeight: t3.variables.size.lineHeight.button.m, fontWeight: t3.variables.weight.bold, cursor: "pointer", "&:hover": { backgroundColor: t3.values.color.background.button[a3].hover, color: t3.values.color.text.button[a3].hover }, "&:active": { backgroundColor: t3.values.color.background.button[a3].active, color: t3.values.color.text.button[a3].active }, "&:disabled": { backgroundColor: t3.values.color.background.button[a3].disabled, color: t3.values.color.text.button[a3].disabled } }, n3 === "s" && { padding: "".concat(t3.variables.size.spacing.xs, " ").concat(t3.variables.size.spacing.m) }), n3 === "m" && { padding: "".concat(t3.variables.size.spacing.s, " ").concat(t3.variables.size.spacing.l) }), n3 === "l" && { padding: "".concat(t3.variables.size.spacing.m, " ").concat(t3.variables.size.spacing.xl) }), a3 === "secondary" && ar(ar(ar({ border: "1px solid", borderColor: t3.values.color.border.button.secondary.base, ":hover": { borderColor: t3.values.color.border.button.secondary.hover }, ":active": { borderColor: t3.values.color.border.button.secondary.active }, ":disabled": { borderColor: t3.values.color.border.button.secondary.disabled } }, n3 === "s" && { padding: "".concat(parseInt(t3.variables.size.spacing.xs, 10) - 1, "px ").concat(parseInt(t3.variables.size.spacing.m, 10) - 1, "px") }), n3 === "m" && { padding: "".concat(parseInt(t3.variables.size.spacing.s, 10) - 1, "px ").concat(parseInt(t3.variables.size.spacing.l, 10) - 1, "px") }), n3 === "l" && { padding: "".concat(parseInt(t3.variables.size.spacing.m, 10) - 1, "px ").concat(parseInt(t3.variables.size.spacing.xl, 10) - 1, "px") })), a3 === "tertiary" && ar(ar(ar({ fontSize: t3.variables.size.font.header.xxs, lineHeight: t3.variables.size.lineHeight.header.xxs, letterSpacing: 0.5, textTransform: "uppercase" }, n3 === "s" && { padding: t3.variables.size.spacing.xs }), n3 === "m" && { padding: t3.variables.size.spacing.s }), n3 === "l" && { padding: t3.variables.size.spacing.m })), r3 && { width: "100%" }), o3 && { borderRadius: 0 }), {}, { "&[disabled], &:disabled": { pointerEvents: "none" } });
      }, ""), sr = Ue("div", { target: "e1vkw3t42" })(function(e4) {
        return e4.loading && { color: "transparent" };
      }, ""), cr = Ue("div", { target: "e1vkw3t41" })(function() {
        return { position: "relative", width: "100%", height: "100%", top: 0, left: "0", display: "flex", justifyContent: "center" };
      }, ""), dr = function() {
        var e4 = Wt.apply(void 0, arguments), t3 = "animation-" + e4.name;
        return { name: t3, styles: "@keyframes " + t3 + "{" + e4.styles + "}", anim: 1, toString: function() {
          return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
        } };
      }({ from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } }), ur = Ue("div", { target: "e1vkw3t40" })(function() {
        return { position: "absolute", animation: "".concat(dr, " 1s infinite linear") };
      }, ""), fr = { type: "button", variant: "primary", size: "m", disabled: false, loading: false, as: "button", fullWidth: false, privateProps: { squareCorners: false }, "data-e2e-test-id": void 0 };
      function hr(e4) {
        var t3 = e4.children, r3 = e4.onClick, n3 = e4.onFocus, o3 = e4.onBlur, a3 = e4.type, l3 = e4.variant, s3 = e4.size, c3 = e4.disabled, d3 = e4.loading, u3 = e4.as, f3 = e4.leftIcon, h3 = e4.rightIcon, p3 = e4.fullWidth, v3 = e4.privateProps, g3 = v3.squareCorners, b3 = v3.alignItems, w3 = v3.rightIconVariant, m3 = e4["data-e2e-test-id"], y3 = nr(e4, tr);
        return i2.a.createElement(lr, rr({ "data-e2e-test-id": m3, as: u3, disabled: c3 || d3, type: u3 === "a" ? void 0 : a3, fullWidth: p3, squareCorners: g3, variant: l3, size: s3, onClick: function(e5) {
          c3 && e5.preventDefault(), r3 && r3(e5);
        }, onFocus: n3, onBlur: o3, "aria-label": f3 || h3 }, y3), d3 && i2.a.createElement(cr, null, i2.a.createElement(ur, null, i2.a.createElement(er, { size: "s", name: "loader", variant: l3, "data-testid": "loader" }))), i2.a.createElement(sr, { loading: d3 ? 1 : 0 }, i2.a.createElement(wt, { vAlignItems: "center", alignItems: b3 || "center", space: "xxs", noWrap: true }, f3 && i2.a.createElement(er, { size: "s", name: f3 }), t3, h3 && i2.a.createElement(er, { size: "s", name: h3, variant: w3 }))));
      }
      function pr(e4, t3) {
        return function(e5) {
          if (Array.isArray(e5))
            return e5;
        }(e4) || function(e5, t4) {
          var r3 = e5 == null ? null : typeof Symbol != "undefined" && e5[Symbol.iterator] || e5["@@iterator"];
          if (r3 == null)
            return;
          var n3, o3, a3 = [], i3 = true, l3 = false;
          try {
            for (r3 = r3.call(e5); !(i3 = (n3 = r3.next()).done) && (a3.push(n3.value), !t4 || a3.length !== t4); i3 = true)
              ;
          } catch (e6) {
            l3 = true, o3 = e6;
          } finally {
            try {
              i3 || r3.return == null || r3.return();
            } finally {
              if (l3)
                throw o3;
            }
          }
          return a3;
        }(e4, t3) || function(e5, t4) {
          if (!e5)
            return;
          if (typeof e5 == "string")
            return vr(e5, t4);
          var r3 = Object.prototype.toString.call(e5).slice(8, -1);
          r3 === "Object" && e5.constructor && (r3 = e5.constructor.name);
          if (r3 === "Map" || r3 === "Set")
            return Array.from(e5);
          if (r3 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3))
            return vr(e5, t4);
        }(e4, t3) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
      }
      function vr(e4, t3) {
        (t3 == null || t3 > e4.length) && (t3 = e4.length);
        for (var r3 = 0, n3 = new Array(t3); r3 < t3; r3++)
          n3[r3] = e4[r3];
        return n3;
      }
      function gr(e4, t3) {
        var r3 = Object.keys(e4);
        if (Object.getOwnPropertySymbols) {
          var n3 = Object.getOwnPropertySymbols(e4);
          t3 && (n3 = n3.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e4, t4).enumerable;
          })), r3.push.apply(r3, n3);
        }
        return r3;
      }
      function br(e4) {
        for (var t3 = 1; t3 < arguments.length; t3++) {
          var r3 = arguments[t3] != null ? arguments[t3] : {};
          t3 % 2 ? gr(Object(r3), true).forEach(function(t4) {
            wr(e4, t4, r3[t4]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r3)) : gr(Object(r3)).forEach(function(t4) {
            Object.defineProperty(e4, t4, Object.getOwnPropertyDescriptor(r3, t4));
          });
        }
        return e4;
      }
      function wr(e4, t3, r3) {
        return t3 in e4 ? Object.defineProperty(e4, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t3] = r3, e4;
      }
      hr.defaultProps = fr;
      var mr = function(e4) {
        return e4 === "separator";
      }, yr = Ue("div", { target: "eexbp0x3" })(function() {
        return { position: "relative", display: "inline-block" };
      }, ""), kr = Ue("div", { target: "eexbp0x2" })(function(e4) {
        var t3 = e4.theme, r3 = e4.verticalPosition;
        return br({ position: "absolute", display: "inline-block", minWidth: t3.variables.size.dimension.dropdownMenu.width, right: 0, zIndex: 1, borderRadius: t3.variables.size.borderRadius.dropdown.m, boxShadow: t3.variables.shadow.card.c, backgroundColor: t3.values.color.background.layer_2, overflow: "hidden", paddingTop: t3.variables.size.spacing.xs, paddingBottom: t3.variables.size.spacing.xs }, r3 === "up" ? { bottom: "100%", marginBottom: t3.variables.size.spacing.xs } : { top: "100%", marginTop: t3.variables.size.spacing.xs });
      }, ""), xr = Ue("ul", { target: "eexbp0x1" })(function() {
        return { margin: 0, padding: 0 };
      }, ""), Cr = Ue("li", { target: "eexbp0x0" })(function() {
        return { margin: 0, padding: 0, width: "100%", listStyleType: "none", whiteSpace: "nowrap" };
      }, "");
      function jr(e4) {
        var t3 = e4.menuItems, r3 = e4.iconName, n3 = e4.size, o3 = e4.disabled, l3 = e4.onMenuOpen, s3 = e4.onMenuClose, c3 = e4["data-e2e-test-id"], d3 = pr(Object(a2.useState)(false), 2), u3 = d3[0], f3 = d3[1], h3 = pr(Object(a2.useState)(-1), 2), p3 = h3[0], v3 = h3[1], g3 = Object(a2.useRef)(null), b3 = Object(a2.useRef)(null), w3 = Object(a2.useRef)(null), m3 = Object(a2.useCallback)(function(e5) {
          f3(true), l3(e5);
        }, [f3, l3]), y3 = Object(a2.useCallback)(function(e5) {
          f3(false), s3(e5);
        }, [f3, s3]), k3 = Object(a2.useCallback)(function(e5) {
          u3 ? y3(e5) : m3(e5);
        }, [u3, m3, y3]);
        !function(e5, t4, r4) {
          var n4 = Rt(), o4 = Object(a2.useCallback)(function(r5) {
            e5 && e5.current && !e5.current.contains(r5.target) && t4(r5);
          }, [t4, e5]);
          Object(a2.useEffect)(function() {
            return r4 && n4.addEventListener("click", o4), function() {
              n4.removeEventListener("click", o4);
            };
          }, [r4, n4, o4]);
        }(g3, y3, u3);
        var x3 = Object(a2.useCallback)(function(e5) {
          e5.relatedTarget && w3.current.contains(e5.relatedTarget) || y3(e5);
        }, [y3]), C3 = t3.map(function(e5) {
          if (mr(e5))
            return e5;
          var t4 = e5;
          return br(br({}, t4), {}, { onSelect: function(e6) {
            t4.onSelect(e6), y3(e6);
          } });
        }), j3 = Dt(b3, w3, u3);
        return Ft({ "ArrowUp ArrowDown": m3 }, b3, !u3), Ft({ Escape: y3, ArrowUp: function() {
          v3(p3 - 1);
        }, ArrowDown: function() {
          v3(p3 + 1);
        } }, g3, u3), Object(a2.useEffect)(function() {
          if (w3 && w3.current) {
            var e5 = w3.current.querySelectorAll("button");
            e5[Math.abs(p3) % e5.length].focus();
          }
        }, [w3, p3]), i2.a.createElement(yr, { "data-e2e-test-id": c3, ref: g3 }, i2.a.createElement("div", { ref: b3 }, i2.a.createElement(hr, { size: n3, leftIcon: r3, variant: "tertiary", onClick: k3, disabled: o3 })), u3 && i2.a.createElement(kr, { verticalPosition: j3, ref: w3 }, i2.a.createElement(xr, { role: "menu" }, C3.map(function(e5, t4) {
          if (mr(e5))
            return i2.a.createElement(Cr, { role: "separator", key: "menuitem-separator-".concat(t4) }, i2.a.createElement(Vt, null));
          var r4 = e5;
          return i2.a.createElement(Cr, { role: "menuitem", key: "menuitem-".concat(r4.label) }, i2.a.createElement(hr, { variant: "tertiary", onClick: r4.onSelect, onBlur: x3, leftIcon: r4.icon, rightIcon: r4.emphasized ? "filled-dot" : void 0, fullWidth: true, privateProps: { squareCorners: true, alignItems: "left", rightIconVariant: "error" } }, r4.label));
        }))));
      }
      var Or = { iconName: "more-horizontal", menuItems: [], size: "m", disabled: false, onMenuOpen: function() {
      }, onMenuClose: function() {
      } };
      function Mr() {
        return (Mr = Object.assign || function(e4) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = arguments[t3];
            for (var n3 in r3)
              Object.prototype.hasOwnProperty.call(r3, n3) && (e4[n3] = r3[n3]);
          }
          return e4;
        }).apply(this, arguments);
      }
      jr.defaultProps = Or;
      var zr = Ue("div", { target: "ehgetke0" })({ padding: "6px 0" }, "");
      function Sr(e4) {
        var t3 = e4.title, r3 = e4.subtitle, n3 = e4.button, o3 = e4.dropdown, a3 = e4["data-e2e-test-id"];
        return i2.a.createElement("div", { "data-e2e-test-id": a3 }, i2.a.createElement(At, { space: ["m", "l", "l"], vSpace: "s", rSpace: "s" }, i2.a.createElement(wt, { alignItems: "spaceBetween", vAlignItems: "top", noWrap: true }, i2.a.createElement(st, { space: "xs" }, t3 && i2.a.createElement(zr, null, i2.a.createElement(zt, null, t3)), r3 && i2.a.createElement(Bt, { size: "xs", as: "span", variant: "tertiary" }, r3)), n3 && i2.a.createElement("div", null, n3), o3 && i2.a.createElement(jr, Mr({}, o3, { size: "s", iconName: "more-horizontal" })))), i2.a.createElement(Vt, null));
      }
      var Er = function(e4, t3, r3) {
        var n3 = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "";
        e4 !== void 0 && e4 === t3 && console.error("value ".concat(JSON.stringify(t3), " is depricated in ").concat(r3, " \n ").concat(n3));
      };
      function Pr(e4, t3) {
        var r3 = Object.keys(e4);
        if (Object.getOwnPropertySymbols) {
          var n3 = Object.getOwnPropertySymbols(e4);
          t3 && (n3 = n3.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e4, t4).enumerable;
          })), r3.push.apply(r3, n3);
        }
        return r3;
      }
      function Hr(e4) {
        for (var t3 = 1; t3 < arguments.length; t3++) {
          var r3 = arguments[t3] != null ? arguments[t3] : {};
          t3 % 2 ? Pr(Object(r3), true).forEach(function(t4) {
            Br(e4, t4, r3[t4]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r3)) : Pr(Object(r3)).forEach(function(t4) {
            Object.defineProperty(e4, t4, Object.getOwnPropertyDescriptor(r3, t4));
          });
        }
        return e4;
      }
      function Br(e4, t3, r3) {
        return t3 in e4 ? Object.defineProperty(e4, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t3] = r3, e4;
      }
      var Ar = Ue("div", { target: "eieabd00" })(function(e4) {
        var t3 = e4.theme, r3 = e4.overflow;
        return Hr(Hr({}, e4.squareCorners ? { borderRadius: 0 } : { borderRadius: t3.variables.size.borderRadius.card.m, "& > *:last-child": { borderBottomLeftRadius: t3.variables.size.borderRadius.card.m, borderBottomRightRadius: t3.variables.size.borderRadius.card.m }, "& > *:first-child": { borderTopLeftRadius: t3.variables.size.borderRadius.card.m, borderTopRightRadius: t3.variables.size.borderRadius.card.m } }), {}, { boxShadow: t3.variables.shadow.card.a, backgroundColor: t3.values.color.background.layer_2, overflow: r3 });
      }, "");
      function Lr(e4) {
        var t3 = e4.title, r3 = e4.subtitle, n3 = e4.button, o3 = e4.dropdown, a3 = e4.children, l3 = e4.overflow, s3 = l3 === void 0 ? "hidden" : l3, c3 = e4.squareCorners, d3 = c3 !== void 0 && c3, u3 = e4["data-e2e-test-id"];
        return Er(r3, r3, "Card", "Subtitle is now a depricated prop, please discuss a workaround with any of UX designers"), Er(n3, n3, "Card", "Button is deprecated, please use dropdown property instead"), i2.a.createElement(Ar, { "data-e2e-test-id": u3, overflow: s3, squareCorners: d3 }, (n3 || o3 || r3 || t3) && i2.a.createElement(Sr, { title: t3, subtitle: r3, button: n3, dropdown: o3 }), a3);
      }
      function Ir(e4) {
        var t3 = e4.children, r3 = e4["data-e2e-test-id"];
        return i2.a.createElement(At, { "data-e2e-test-id": r3, space: ["m", "l", "l"], vSpace: "m" }, t3);
      }
      var Zr = ["lines", "children", "data-e2e-test-id"];
      function Vr() {
        return (Vr = Object.assign || function(e4) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = arguments[t3];
            for (var n3 in r3)
              Object.prototype.hasOwnProperty.call(r3, n3) && (e4[n3] = r3[n3]);
          }
          return e4;
        }).apply(this, arguments);
      }
      function Rr(e4, t3) {
        if (e4 == null)
          return {};
        var r3, n3, o3 = function(e5, t4) {
          if (e5 == null)
            return {};
          var r4, n4, o4 = {}, a4 = Object.keys(e5);
          for (n4 = 0; n4 < a4.length; n4++)
            r4 = a4[n4], t4.indexOf(r4) >= 0 || (o4[r4] = e5[r4]);
          return o4;
        }(e4, t3);
        if (Object.getOwnPropertySymbols) {
          var a3 = Object.getOwnPropertySymbols(e4);
          for (n3 = 0; n3 < a3.length; n3++)
            r3 = a3[n3], t3.indexOf(r3) >= 0 || Object.prototype.propertyIsEnumerable.call(e4, r3) && (o3[r3] = e4[r3]);
        }
        return o3;
      }
      var Tr = Ue("span", { target: "e7ey0cg0" })(function(e4) {
        var t3 = e4.lines, r3 = e4.theme, n3 = e4.size;
        return { display: "-webkit-box", "-webkit-box-orient": "vertical", overflow: "hidden", WebkitLineClamp: t3, maxHeight: t3 * parseInt(r3.variables.size.lineHeight.text[n3], 10) };
      }, "");
      function _r(e4) {
        var t3 = e4.lines, r3 = e4.children, n3 = e4["data-e2e-test-id"], o3 = Rr(e4, Zr);
        return i2.a.createElement(Bt, Vr({ "data-e2e-test-id": n3 }, o3), i2.a.createElement(Tr, { lines: t3, size: o3.size }, r3));
      }
      _r.defaultProps = { lines: 1, size: "m" };
      var $r = Ue("i", { target: "e1v2v1iq1" })({ name: "1jwcxx3", styles: "font-style:italic" }), Dr = Ue("b", { target: "e1v2v1iq0" })({ name: "d3kzo8", styles: "font-weight:bolder" }), Fr = { b: function(e4) {
        var t3 = e4.key, r3 = e4.children;
        return i2.a.createElement(Dr, { key: t3 }, r3);
      }, i: function(e4) {
        var t3 = e4.key, r3 = e4.children;
        return i2.a.createElement($r, { key: t3 }, r3);
      }, p: function(e4) {
        var t3 = e4.key, r3 = e4.children;
        return i2.a.createElement(Bt, { key: t3, as: "p", variant: "secondary" }, r3);
      }, small: function(e4) {
        var t3 = e4.key, r3 = e4.children;
        return i2.a.createElement(Bt, { key: t3, as: "span", variant: "tertiary" }, r3);
      }, sup: function(e4) {
        var t3 = e4.key, r3 = e4.children;
        return i2.a.createElement("sup", { key: t3 }, r3);
      }, sub: function(e4) {
        var t3 = e4.key, r3 = e4.children;
        return i2.a.createElement("sub", { key: t3 }, r3);
      } }, Wr = function e4(t3) {
        if (!t3 || t3.length < 1)
          return null;
        var r3 = function(e5) {
          var t4 = Object.keys(Fr).join("|"), r4 = new RegExp("<(".concat(t4, ")>.*</\\1>")).exec(e5);
          if (!r4)
            return null;
          var n4, o4, a4 = r4[1], i4 = r4.index, l3 = r4.index + a4.length + 2, s3 = 1, c3 = new RegExp("(<".concat(a4, ">)|(</").concat(a4, ">)"), "g"), d3 = c3.exec(e5);
          do {
            if (d3.index > i4 && (d3[1] ? s3 += 1 : d3[2] && (s3 -= 1, o4 = (n4 = d3.index) + d3[2].length)), !(d3 = c3.exec(e5)))
              break;
          } while (s3 > 0);
          return { elementName: a4, prev: e5.slice(0, i4), node: e5.slice(l3, n4), next: e5.slice(o4) };
        }(t3);
        if (!r3)
          return t3;
        var n3 = r3.elementName, o3 = r3.prev, a3 = r3.node, i3 = r3.next;
        return [o3, Fr[n3]({ key: a3, children: e4(a3) }), e4(i3)].filter(function(e5) {
          return e5 !== null && e5 !== "" && !(Array.isArray(e5) && !e5.length);
        });
      };
      function qr(e4) {
        var t3 = e4.children, r3 = e4["data-e2e-test-id"];
        return typeof t3 != "string" ? t3 : i2.a.createElement("span", { "data-e2e-test-id": r3 }, Wr(t3));
      }
      var Nr = ["children", "size", "weight", "variant", "target", "rel", "href", "data-e2e-test-id"];
      function Ur() {
        return (Ur = Object.assign || function(e4) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = arguments[t3];
            for (var n3 in r3)
              Object.prototype.hasOwnProperty.call(r3, n3) && (e4[n3] = r3[n3]);
          }
          return e4;
        }).apply(this, arguments);
      }
      function Gr(e4, t3) {
        if (e4 == null)
          return {};
        var r3, n3, o3 = function(e5, t4) {
          if (e5 == null)
            return {};
          var r4, n4, o4 = {}, a4 = Object.keys(e5);
          for (n4 = 0; n4 < a4.length; n4++)
            r4 = a4[n4], t4.indexOf(r4) >= 0 || (o4[r4] = e5[r4]);
          return o4;
        }(e4, t3);
        if (Object.getOwnPropertySymbols) {
          var a3 = Object.getOwnPropertySymbols(e4);
          for (n3 = 0; n3 < a3.length; n3++)
            r3 = a3[n3], t3.indexOf(r3) >= 0 || Object.prototype.propertyIsEnumerable.call(e4, r3) && (o3[r3] = e4[r3]);
        }
        return o3;
      }
      var Xr = { variant: "secondary", as: "a", "data-e2e-test-id": void 0 }, Yr = function(e4, t3) {
        switch (t3) {
          case "primary":
            return e4.values.color.text.link.primaryHover;
          case "tertiary":
            return e4.values.color.text.link.tertiaryHover;
          case "secondary":
          default:
            return e4.values.color.text.link.secondaryHover;
        }
      }, Jr = Ue("a", { target: "eadqxyf0" })(function(e4) {
        var t3 = e4.theme, r3 = e4.weight, n3 = e4.variant, o3 = e4.size;
        return { textDecoration: "underline", cursor: "pointer", color: t3.values.color.text.link[n3], background: "none", border: "none", padding: 0, "&:hover": { color: Yr(t3, n3) }, fontSize: t3.variables.size.font.link[o3], "font-weight": String(t3.variables.weight[r3]), lineHeight: t3.variables.size.lineHeight.link[o3], fontFamily: t3.variables.fontFamily.lato };
      }, "");
      function Kr(e4) {
        var t3 = e4.children, r3 = e4.size, n3 = e4.weight, o3 = e4.variant, a3 = e4.target, l3 = e4.rel, s3 = e4.href, c3 = e4["data-e2e-test-id"], d3 = Gr(e4, Nr);
        return o3 === "light-primary" && Er(o3, "light-primary", "Link component", "Please consider using SubThemeProvider. \n Delete all mentions of light-primary in DS after."), i2.a.createElement(Jr, Ur({ as: "a", "data-e2e-test-id": c3, href: s3, rel: l3, target: a3, variant: o3, size: r3, weight: n3 }, d3), t3);
      }
      function Qr(e4, t3) {
        return function(e5) {
          if (Array.isArray(e5))
            return e5;
        }(e4) || function(e5, t4) {
          var r3 = e5 == null ? null : typeof Symbol != "undefined" && e5[Symbol.iterator] || e5["@@iterator"];
          if (r3 == null)
            return;
          var n3, o3, a3 = [], i3 = true, l3 = false;
          try {
            for (r3 = r3.call(e5); !(i3 = (n3 = r3.next()).done) && (a3.push(n3.value), !t4 || a3.length !== t4); i3 = true)
              ;
          } catch (e6) {
            l3 = true, o3 = e6;
          } finally {
            try {
              i3 || r3.return == null || r3.return();
            } finally {
              if (l3)
                throw o3;
            }
          }
          return a3;
        }(e4, t3) || function(e5, t4) {
          if (!e5)
            return;
          if (typeof e5 == "string")
            return en2(e5, t4);
          var r3 = Object.prototype.toString.call(e5).slice(8, -1);
          r3 === "Object" && e5.constructor && (r3 = e5.constructor.name);
          if (r3 === "Map" || r3 === "Set")
            return Array.from(e5);
          if (r3 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3))
            return en2(e5, t4);
        }(e4, t3) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
      }
      function en2(e4, t3) {
        (t3 == null || t3 > e4.length) && (t3 = e4.length);
        for (var r3 = 0, n3 = new Array(t3); r3 < t3; r3++)
          n3[r3] = e4[r3];
        return n3;
      }
      function tn2(e4, t3) {
        var r3 = Object.keys(e4);
        if (Object.getOwnPropertySymbols) {
          var n3 = Object.getOwnPropertySymbols(e4);
          t3 && (n3 = n3.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e4, t4).enumerable;
          })), r3.push.apply(r3, n3);
        }
        return r3;
      }
      function rn2(e4) {
        for (var t3 = 1; t3 < arguments.length; t3++) {
          var r3 = arguments[t3] != null ? arguments[t3] : {};
          t3 % 2 ? tn2(Object(r3), true).forEach(function(t4) {
            nn2(e4, t4, r3[t4]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r3)) : tn2(Object(r3)).forEach(function(t4) {
            Object.defineProperty(e4, t4, Object.getOwnPropertyDescriptor(r3, t4));
          });
        }
        return e4;
      }
      function nn2(e4, t3, r3) {
        return t3 in e4 ? Object.defineProperty(e4, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t3] = r3, e4;
      }
      Kr.defaultProps = Xr;
      var on2 = { gap: "zero", alwaysFillSpace: false, alignItems: "left", vAlignItems: "top", "data-e2e-test-id": void 0 }, an = { size: "auto", "data-e2e-test-id": void 0 }, ln2 = new Array(12).fill("").reduce(function(e4, t3, r3) {
        return rn2(rn2({}, e4), {}, nn2({}, r3 + 1, "".concat(100 * (r3 + 1) / 12, "%")));
      }, {}), sn = function(e4) {
        return Object.entries(e4).map(function(e5) {
          var t3 = Qr(e5, 2), r3 = t3[0], n3 = t3[1];
          return [r3, "-".concat(n3)];
        }).reduce(function(e5, t3) {
          var r3 = Qr(t3, 2), n3 = r3[0], o3 = r3[1];
          return e5[n3] = o3, e5;
        }, {});
      }, cn2 = Ue("div", { target: "e1pdebaf1" })(function(e4) {
        var t3 = e4.size, r3 = e4.order;
        return rn2(rn2({}, tt({ width: [t3, rn2(rn2({}, ln2), {}, { fill: "1px" })], flex: [t3, { narrow: "none", auto: "1" }], order: [r3, { first: "-1", last: "1", unset: "0" }], flexShrink: [t3, { fill: 1 }], flexGrow: [t3, { fill: 1 }] })), {}, { boxSizing: "border-box", "&:empty": { width: 0, flex: "none" } });
      }, "");
      cn2.defaultProps = an;
      var dn = Ue("div", { target: "e1pdebaf0" })(function(e4) {
        var t3 = e4.theme, r3 = e4.alignItems, n3 = e4.vAlignItems, o3 = e4.gap;
        return rn2(rn2({ width: "auto", display: "flex", justifyItems: "stretch", justifyContent: "stretch", alignItems: "stretch", flexWrap: "wrap", flexDirection: "row" }, tt({ alignItems: [n3, { top: "flex-start", bottom: "flex-end", center: "center", spaceBetween: "space-between" }], justifyContent: [r3, { left: "flex-start", right: "flex-end", center: "center", spaceBetween: "space-between" }], marginRight: [o3, sn(t3.variables.size.spacing)], marginBottom: [o3, sn(t3.variables.size.spacing)] })), {}, nn2({}, cn2, rn2({}, tt({ marginBottom: [o3, t3.variables.size.spacing], paddingRight: [o3, t3.variables.size.spacing] }))));
      }, function(e4) {
        return e4.alwaysFillSpace && nn2({}, cn2, { "&:last-child": { flexGrow: 1, flexShrink: 1 } });
      }, "");
      dn.defaultProps = on2;
      var un2 = ["header", "as", "iconLeft", "iconRight"];
      function fn22() {
        return (fn22 = Object.assign || function(e4) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = arguments[t3];
            for (var n3 in r3)
              Object.prototype.hasOwnProperty.call(r3, n3) && (e4[n3] = r3[n3]);
          }
          return e4;
        }).apply(this, arguments);
      }
      function hn(e4, t3) {
        if (e4 == null)
          return {};
        var r3, n3, o3 = function(e5, t4) {
          if (e5 == null)
            return {};
          var r4, n4, o4 = {}, a4 = Object.keys(e5);
          for (n4 = 0; n4 < a4.length; n4++)
            r4 = a4[n4], t4.indexOf(r4) >= 0 || (o4[r4] = e5[r4]);
          return o4;
        }(e4, t3);
        if (Object.getOwnPropertySymbols) {
          var a3 = Object.getOwnPropertySymbols(e4);
          for (n3 = 0; n3 < a3.length; n3++)
            r3 = a3[n3], t3.indexOf(r3) >= 0 || Object.prototype.propertyIsEnumerable.call(e4, r3) && (o3[r3] = e4[r3]);
        }
        return o3;
      }
      function pn(e4, t3) {
        var r3 = Object.keys(e4);
        if (Object.getOwnPropertySymbols) {
          var n3 = Object.getOwnPropertySymbols(e4);
          t3 && (n3 = n3.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e4, t4).enumerable;
          })), r3.push.apply(r3, n3);
        }
        return r3;
      }
      function vn(e4) {
        for (var t3 = 1; t3 < arguments.length; t3++) {
          var r3 = arguments[t3] != null ? arguments[t3] : {};
          t3 % 2 ? pn(Object(r3), true).forEach(function(t4) {
            gn(e4, t4, r3[t4]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r3)) : pn(Object(r3)).forEach(function(t4) {
            Object.defineProperty(e4, t4, Object.getOwnPropertyDescriptor(r3, t4));
          });
        }
        return e4;
      }
      function gn(e4, t3, r3) {
        return t3 in e4 ? Object.defineProperty(e4, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t3] = r3, e4;
      }
      var bn = Ue("div", { target: "epth01" })(function(e4) {
        var t3 = e4.theme;
        return { width: "100%", backgroundColor: t3.values.color.background.tabs.header, borderBottom: "".concat(1, "px solid"), borderColor: t3.values.color.border.primary };
      }, ""), wn = Ue("div", { target: "epth00" })(function(e4) {
        var t3 = e4.theme, r3 = e4.active, n3 = e4.isFirst;
        return vn({ position: "relative", margin: 0, backgroundColor: t3.values.color.background.tabs.header, padding: t3.variables.size.spacing.m, color: t3.values.color.text.secondary, fontFamily: t3.variables.fontFamily.lato, fontWeight: t3.variables.weight.bold, fontSize: t3.variables.size.font.text.s, lineHeight: t3.variables.size.lineHeight.text.s, border: 0, boxSizing: "border-box", transition: "background-color 0.15s", display: "block", textDecoration: "none" }, r3 ? vn(vn({ border: "".concat(1, "px solid"), borderTop: 0, paddingLeft: parseInt(t3.variables.size.spacing.m, 10) - 1, paddingRight: parseInt(t3.variables.size.spacing.m, 10) - 1, marginBottom: -1, borderColor: t3.values.color.border.primary, borderBottomColor: t3.values.color.background.tabs.buttonActive, backgroundColor: t3.values.color.background.tabs.buttonActive }, n3 && { borderLeft: 0, paddingLeft: t3.variables.size.spacing.m }), {}, { "&:after": { content: '""', position: "absolute", width: "100%", height: 4, backgroundColor: t3.values.color.border.tabs.buttonActive, borderLeft: "".concat(1, "px solid"), borderRight: "".concat(1, "px solid"), borderColor: t3.values.color.border.tabs.buttonActive, left: -1, top: 0 } }) : { cursor: "pointer", "&:hover": { backgroundColor: t3.values.color.background.tabs.buttonHover } });
      }, "");
      function mn(e4) {
        var t3 = e4.tabs, r3 = e4.activeTab, n3 = r3 === void 0 ? 0 : r3, o3 = e4.children, a3 = e4.onTabSelect, l3 = e4["data-e2e-test-id"];
        return i2.a.createElement(st, { "data-e2e-test-id": l3 }, i2.a.createElement(bn, null, i2.a.createElement(wt, { space: "zero" }, t3.map(function(e5, t4) {
          var r4 = e5.header, o4 = e5.as, l4 = o4 === void 0 ? "button" : o4, s3 = e5.iconLeft, c3 = e5.iconRight, d3 = hn(e5, un2);
          return i2.a.createElement(wn, fn22({ as: l4, key: r4, isFirst: t4 === 0, active: n3 === t4, onClick: function() {
            return a3 && a3(t4);
          } }, d3), i2.a.createElement(wt, { vAlignItems: "center", space: "xxs" }, s3 && i2.a.createElement(er, { size: "s", name: s3 }), r4, c3 && i2.a.createElement(er, { size: "s", name: c3 })));
        }))), o3);
      }
      var yn = Ue("div", { target: "esey7fz0" })(function(e4) {
        var t3 = e4.theme, r3 = e4.color;
        return { borderRadius: t3.variables.size.borderRadius.badge.m, border: "1px solid", display: "inline-block", textTransform: "uppercase", fontFamily: t3.variables.fontFamily.lato, fontSize: t3.variables.size.font.badge.m, lineHeight: t3.variables.size.lineHeight.badge.m, fontWeight: "bold", letterSpacing: t3.variables.size.letterSpacing.badge.m, color: r3 ? t3.values.color.text.badge[r3] : t3.values.color.text.badge.default, backgroundColor: r3 ? t3.values.color.background.badge[r3] : t3.values.color.background.badge.default, borderColor: r3 ? t3.values.color.border.badge[r3] : t3.values.color.border.badge.default };
      }, "");
      function kn(e4) {
        var t3 = e4.text, r3 = e4.color, n3 = r3 === void 0 ? null : r3, o3 = e4.icon, a3 = e4["data-e2e-test-id"];
        return i2.a.createElement(yn, { "data-e2e-test-id": a3, color: n3 }, i2.a.createElement(At, { space: "xs", vSpace: "xxs" }, i2.a.createElement(wt, { vAlignItems: "center", space: "xxs", noWrap: true }, o3 && i2.a.createElement(er, { name: o3, size: "s" }), i2.a.createElement("span", null, t3))));
      }
      var xn = Ue("div", { target: "e1y5sw0i2" })(function() {
        return { position: "relative", textDecoration: "none" };
      }, ""), Cn = Ue("div", { target: "e1y5sw0i1" })(function(e4) {
        return { color: e4.theme.values.color.text.primary };
      }, ""), jn = Ue("div", { target: "e1y5sw0i0" })(function() {
        return { "> a": { textDecoration: "none" }, "&:hover": (e4 = {}, t3 = "".concat(Cn), r3 = { textDecoration: "underline" }, t3 in e4 ? Object.defineProperty(e4, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t3] = r3, e4) };
        var e4, t3, r3;
      }, ""), On = function(e4) {
        var t3 = e4.data, r3 = e4.renderItem;
        return e4.compact ? i2.a.createElement(wt, { space: "l", vSpace: "xs" }, t3 && t3.length && t3.map(function(e5) {
          return r3(e5);
        })) : i2.a.createElement(dn, { gap: "m" }, t3.map(function(e5) {
          return i2.a.createElement(cn2, { "data-e2e-test-id": e5["data-e2e-test-id"], size: [12, 6, 6], key: e5.title }, r3(e5));
        }));
      }, Mn = { icon: null, details: [], body: null, secondaryTargets: [], isExternal: false, labels: [], "data-e2e-test-id": void 0 };
      function zn(e4) {
        var t3 = e4.title, r3 = e4.subtitle, n3 = e4.icon, o3 = e4.details, l3 = e4.body, s3 = e4.secondaryTargets, c3 = e4.link, d3 = e4.labels, u3 = e4["data-e2e-test-id"], f3 = Object(a2.useRef)(null), h3 = s3 && s3.reduce(function(e5, t4) {
          return !t4.body && e5;
        }, true), p3 = c3;
        return i2.a.createElement(xn, { ref: f3 }, i2.a.createElement(At, { alignText: "left", space: "m" }, i2.a.createElement(dn, { gap: "m" }, n3 && i2.a.createElement(cn2, { size: "narrow" }, i2.a.createElement(er, { name: n3, variant: "tertiary" })), i2.a.createElement(cn2, { size: "fill" }, i2.a.createElement(st, { space: "s" }, i2.a.createElement(jn, { "data-e2e-test-id": u3 }, i2.a.createElement(p3, null, i2.a.createElement(st, { space: "xxs" }, i2.a.createElement(dn, { gap: "xxs" }, i2.a.createElement(cn2, { size: [12, 12, "fill"] }, i2.a.createElement(Cn, null, i2.a.createElement(st, { space: "zero" }, i2.a.createElement(_r, { variant: "primary", weight: "bold", lines: 3, hyphens: "auto" }, i2.a.createElement(qr, null, t3)), r3 && i2.a.createElement(_r, { variant: "primary", lines: 3, size: "s" }, i2.a.createElement(qr, null, r3))))), i2.a.createElement(cn2, { size: "narrow" }, d3 && !!d3.length && i2.a.createElement(wt, { space: "xs" }, d3.map(function(e5, t4) {
          return i2.a.createElement(kn, { text: e5, key: "".concat(t4).concat(e5) });
        })))), o3 && !!o3.length && i2.a.createElement(st, { space: "zero" }, o3.slice(0, 3).map(function(e5) {
          return i2.a.createElement(_r, { variant: "secondary", size: "s", key: e5, lines: 3 }, i2.a.createElement(qr, null, e5));
        })), l3 && i2.a.createElement(_r, { size: "s", lines: 2 }, i2.a.createElement(qr, null, l3))))), s3 && !!s3.length && i2.a.createElement(On, { data: s3, compact: h3, renderItem: function(e5) {
          var r4 = e5.title, n4 = e5.link, o4 = e5.body, a3 = e5["data-e2e-test-id"], l4 = n4;
          return i2.a.createElement(jn, { key: t3, "data-e2e-test-id": a3 }, i2.a.createElement(l4, null, i2.a.createElement(Cn, null, i2.a.createElement(_r, { size: "s", variant: "primary", weight: "bold", lines: 3 }, i2.a.createElement(qr, null, r4))), o4 && i2.a.createElement(_r, { size: "s", variant: "secondary", lines: 2 }, i2.a.createElement(qr, null, o4))));
        } }))))));
      }
      function Sn(e4) {
        var t3 = e4.messages, r3 = t3 === void 0 ? [] : t3, n3 = e4["data-e2e-test-id"];
        return r3.length && i2.a.createElement(st, { "data-e2e-test-id": n3, space: "zero" }, r3.map(function(e5) {
          return i2.a.createElement(Bt, { size: "xs", key: e5, variant: "error" }, e5);
        }));
      }
      zn.defaultProps = Mn;
      var En = Ue("span", { target: "ezxuii70" })(function(e4) {
        var t3 = e4.theme;
        return { color: t3.values.color.text.secondary, textTransform: "uppercase", fontWeight: t3.variables.weight.normal };
      }, "");
      function Pn(e4) {
        var t3 = e4.children, r3 = e4.labelHint, n3 = r3 === void 0 ? "" : r3, o3 = e4["data-e2e-test-id"];
        return i2.a.createElement(wt, { "data-e2e-test-id": o3, space: "xxs", vAlignItems: "bottom" }, t3 && i2.a.createElement(St, null, t3), t3 && n3 && i2.a.createElement(St, null, i2.a.createElement(En, null, "(", n3, ")")));
      }
      var Hn = Ue("div", { target: "e1vxz97h0" })(function(e4) {
        var t3 = e4.theme;
        return e4.disabled && "\n    opacity: ".concat(t3.variables.opacity.form.disabled, "\n");
      }, "");
      function Bn(e4) {
        var t3 = e4.label, r3 = t3 === void 0 ? "" : t3, n3 = e4.labelHint, o3 = n3 === void 0 ? "" : n3, a3 = e4.hint, l3 = a3 === void 0 ? "" : a3, s3 = e4.errorMessages, c3 = s3 === void 0 ? [] : s3, d3 = e4.disabled, u3 = d3 !== void 0 && d3, f3 = e4.children, h3 = e4["data-e2e-test-id"];
        return i2.a.createElement(Hn, { "data-e2e-test-id": h3, disabled: u3 }, i2.a.createElement(st, { space: "xxs" }, i2.a.createElement("label", null, i2.a.createElement(st, { space: "xs" }, r3 && i2.a.createElement(Pn, { labelHint: o3 }, r3), f3)), l3 && !c3.length && i2.a.createElement(Bt, { size: "xs" }, l3), !!c3.length && i2.a.createElement(Sn, { messages: c3 })));
      }
      var An = ["label", "name", "value", "checked", "disabled", "onChange", "onClick", "onBlur", "onFocus", "data-e2e-test-id"];
      function Ln() {
        return (Ln = Object.assign || function(e4) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = arguments[t3];
            for (var n3 in r3)
              Object.prototype.hasOwnProperty.call(r3, n3) && (e4[n3] = r3[n3]);
          }
          return e4;
        }).apply(this, arguments);
      }
      function In(e4, t3) {
        if (e4 == null)
          return {};
        var r3, n3, o3 = function(e5, t4) {
          if (e5 == null)
            return {};
          var r4, n4, o4 = {}, a4 = Object.keys(e5);
          for (n4 = 0; n4 < a4.length; n4++)
            r4 = a4[n4], t4.indexOf(r4) >= 0 || (o4[r4] = e5[r4]);
          return o4;
        }(e4, t3);
        if (Object.getOwnPropertySymbols) {
          var a3 = Object.getOwnPropertySymbols(e4);
          for (n3 = 0; n3 < a3.length; n3++)
            r3 = a3[n3], t3.indexOf(r3) >= 0 || Object.prototype.propertyIsEnumerable.call(e4, r3) && (o3[r3] = e4[r3]);
        }
        return o3;
      }
      var Zn = Ue("div", { target: "e1yzh3fz2" })(function() {
        return { display: "inline-block" };
      }, ""), Vn = Ue("input", { target: "e1yzh3fz1" })(function() {
        return { opacity: 0, cursor: "pointer", height: 0, width: 0, position: "absolute" };
      }, ""), Rn = Ue("div", { target: "e1yzh3fz0" })(function(e4) {
        var t3 = e4.theme;
        return { boxSizing: "border-box", borderRadius: t3.variables.size.borderRadius.toggleButton.m, border: "2px solid", height: t3.variables.size.dimension.toggleButton.height.m, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "".concat(t3.variables.size.spacing.zero, " ").concat(t3.variables.size.spacing.m), fontFamily: t3.variables.fontFamily.lato, fontSize: t3.variables.size.font.toggleButton.m, fontWeight: t3.variables.weight.bold, lineHeight: t3.variables.size.lineHeight.toggleButton.m, background: t3.values.color.background.toggleButton.default, borderColor: t3.values.color.border.toggleButton.default, color: t3.values.color.text.toggleButton.default, "input: focus-visible + &": { outlineWidth: "2px", outlineStyle: "solid", outlineColor: "Highlight" }, "@media (-webkit-min-device-pixel-ratio:0)": { "input: focus-visible + &": { outlineColor: "-webkit-focus-ring-color", outlineStyle: "auto" } }, "&:hover": { bordedColor: t3.values.color.border.toggleButton.defaultHover }, "input:checked + &": { borderColor: t3.values.color.border.toggleButton.active, color: t3.values.color.text.toggleButton.active, background: t3.values.color.background.toggleButton.active, "&:hover": { borderColor: t3.values.color.border.toggleButton.activeHover, background: t3.values.color.background.toggleButton.activeHover } }, "input:disabled + &": { pointerEvents: "none" } };
      }, "");
      function Tn(e4) {
        var t3 = e4.label, r3 = e4.name, n3 = e4.value, o3 = n3 === void 0 ? "" : n3, a3 = e4.checked, l3 = a3 === void 0 ? void 0 : a3, s3 = e4.disabled, c3 = s3 !== void 0 && s3, d3 = e4.onChange, u3 = e4.onClick, f3 = e4.onBlur, h3 = e4.onFocus, p3 = e4["data-e2e-test-id"], v3 = In(e4, An);
        return i2.a.createElement(Bn, Ln({ "data-e2e-test-id": p3 }, v3, { disabled: c3 }), i2.a.createElement(Zn, { "data-e2e-test-id": p3 }, i2.a.createElement(Vn, { type: "checkbox", name: r3, value: o3, checked: l3, disabled: c3, onChange: d3, onClick: u3, onBlur: f3, onFocus: h3 }), i2.a.createElement(Rn, null, t3)));
      }
      var _n = Ue("div", { target: "eiobxjh0" })(function(e4) {
        var t3 = e4.theme;
        return { opacity: e4.disabled ? t3.variables.opacity.form.disabled : "" };
      }, "");
      function $n(e4) {
        var t3 = e4.children, r3 = e4.label, n3 = r3 === void 0 ? "" : r3, o3 = e4.labelHint, a3 = o3 === void 0 ? "" : o3, l3 = e4.errorMessages, s3 = l3 === void 0 ? [] : l3, c3 = e4.hint, d3 = c3 === void 0 ? "" : c3, u3 = e4.disabled, f3 = u3 !== void 0 && u3, h3 = e4["data-e2e-test-id"];
        return i2.a.createElement(_n, { disabled: f3, "data-e2e-test-id": h3 }, i2.a.createElement(st, { space: "m" }, n3 && i2.a.createElement(Pn, { labelHint: a3 }, n3), t3, d3 && !s3.length && i2.a.createElement(Bt, { size: "xs" }, d3), !!s3.length && i2.a.createElement(Sn, { messages: s3 })));
      }
      var Dn = ["name", "value", "placeholder", "hasError", "onChange", "onClick", "onBlur", "onFocus", "type", "icon", "tabIndex", "areaLabel", "autoComplete", "privateProps"];
      function Fn(e4, t3) {
        if (e4 == null)
          return {};
        var r3, n3, o3 = function(e5, t4) {
          if (e5 == null)
            return {};
          var r4, n4, o4 = {}, a4 = Object.keys(e5);
          for (n4 = 0; n4 < a4.length; n4++)
            r4 = a4[n4], t4.indexOf(r4) >= 0 || (o4[r4] = e5[r4]);
          return o4;
        }(e4, t3);
        if (Object.getOwnPropertySymbols) {
          var a3 = Object.getOwnPropertySymbols(e4);
          for (n3 = 0; n3 < a3.length; n3++)
            r3 = a3[n3], t3.indexOf(r3) >= 0 || Object.prototype.propertyIsEnumerable.call(e4, r3) && (o3[r3] = e4[r3]);
        }
        return o3;
      }
      var Wn = Ue("div", { target: "e1dohmou2" })(function() {
        return { width: "100%", display: "flex", alignItems: "center", flexDirection: "row", position: "relative", zIndex: 1 };
      }, ""), qn = Ue("div", { target: "e1dohmou1" })(function(e4) {
        return { position: "absolute", right: e4.theme.variables.size.spacing.xs };
      }, ""), Nn = function(e4, t3, r3) {
        return t3 ? "transparent" : r3 ? e4.values.color.border.input.error : e4.values.color.border.input.default;
      }, Un = function(e4, t3) {
        return t3 ? "transparent" : e4.values.color.background.input.default;
      }, Gn = Ue("input", { target: "e1dohmou0" })(function(e4) {
        var t3 = e4.theme, r3 = e4.privateProps, n3 = e4.hasError;
        return { fontFamily: t3.variables.fontFamily.lato, fontSize: t3.variables.size.font.text.m, lineHeight: t3.variables.size.lineHeight.text.m, borderRadius: t3.variables.size.borderRadius.input.s, borderWidth: "1px", borderStyle: "solid", width: "100%", padding: t3.variables.size.spacing.xs, boxSizing: "border-box", color: t3.values.color.text.secondary, borderColor: Nn(t3, r3 == null ? void 0 : r3.isTransparent, n3), backgroundColor: Un(t3, r3 == null ? void 0 : r3.isTransparent), "&.error": { borderColor: t3.values.color.border.input.error }, "&.has-icon": { paddingRight: t3.variables.size.spacing.xs + t3.variables.size.font.icon.m }, "& svg": { pointerEvents: "none" }, "&::placeholder": { color: t3.values.color.text.placeholder, opacity: 1 }, "&:-ms-input-placeholder": { color: t3.values.color.text.placeholder }, "&::-ms-input-placeholder": { color: t3.values.color.text.placeholder } };
      }, ""), Xn = Object(a2.forwardRef)(function(e4, t3) {
        var r3 = e4.name, n3 = e4.value, o3 = e4.placeholder, a3 = e4.hasError, l3 = a3 !== void 0 && a3, s3 = e4.disabled, c3 = e4.onChange, d3 = e4.onClick, u3 = e4.onBlur, f3 = e4.onFocus, h3 = e4.type, p3 = h3 === void 0 ? "text" : h3, v3 = e4.icon, g3 = e4.areaLabel, b3 = e4.tabIndex, w3 = e4.autoComplete, m3 = w3 === void 0 ? "on" : w3, y3 = e4.privateProps, k3 = y3 === void 0 ? {} : y3;
        return i2.a.createElement(Wn, null, i2.a.createElement(Gn, { type: p3, value: n3, placeholder: o3, name: r3, disabled: s3, onClick: d3, onChange: c3, onBlur: u3, onFocus: f3, "aria-label": g3, ref: t3, tabIndex: b3, autoComplete: m3, hasError: l3, privateProps: k3 }), v3 && i2.a.createElement(qn, null, i2.a.createElement(Bt, { as: "span", variant: "tertiary" }, i2.a.createElement(er, { name: v3, size: "m" }))));
      });
      function Yn(e4) {
        var t3 = e4.name, r3 = e4.value, n3 = e4.placeholder, o3 = e4.hasError, a3 = o3 !== void 0 && o3, l3 = e4.onChange, s3 = e4.onClick, c3 = e4.onBlur, d3 = e4.onFocus, u3 = e4.type, f3 = u3 === void 0 ? "text" : u3, h3 = e4.icon, p3 = e4.tabIndex, v3 = e4.areaLabel, g3 = e4.autoComplete, b3 = g3 === void 0 ? "on" : g3, w3 = e4.privateProps, m3 = w3 === void 0 ? {} : w3, y3 = Fn(e4, Dn);
        return i2.a.createElement(Bn, y3, i2.a.createElement(Xn, { name: t3, value: r3, type: f3, icon: h3, placeholder: n3, hasError: a3, disabled: y3.disabled, onChange: l3, onBlur: c3, onFocus: d3, onClick: s3, tabIndex: p3, areaLabel: v3, autoComplete: b3, privateProps: m3 }));
      }
      var Jn = ["name", "value", "checked", "label", "labelHint", "disabled", "onChange", "onClick", "onBlur", "onFocus", "data-e2e-test-id"];
      function Kn() {
        return (Kn = Object.assign || function(e4) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = arguments[t3];
            for (var n3 in r3)
              Object.prototype.hasOwnProperty.call(r3, n3) && (e4[n3] = r3[n3]);
          }
          return e4;
        }).apply(this, arguments);
      }
      function Qn(e4, t3) {
        if (e4 == null)
          return {};
        var r3, n3, o3 = function(e5, t4) {
          if (e5 == null)
            return {};
          var r4, n4, o4 = {}, a4 = Object.keys(e5);
          for (n4 = 0; n4 < a4.length; n4++)
            r4 = a4[n4], t4.indexOf(r4) >= 0 || (o4[r4] = e5[r4]);
          return o4;
        }(e4, t3);
        if (Object.getOwnPropertySymbols) {
          var a3 = Object.getOwnPropertySymbols(e4);
          for (n3 = 0; n3 < a3.length; n3++)
            r3 = a3[n3], t3.indexOf(r3) >= 0 || Object.prototype.propertyIsEnumerable.call(e4, r3) && (o3[r3] = e4[r3]);
        }
        return o3;
      }
      var eo = Ue("div", { target: "es2dog22" })(function(e4) {
        var t3 = e4.theme;
        return { userSelect: "none", display: "block", position: "relative", width: t3.variables.size.dimension.checkbox.m, height: t3.variables.size.dimension.checkbox.m, boxSizing: "border-box" };
      }, ""), to = Ue("input", { target: "es2dog21" })(function() {
        return { opacity: 0, cursor: "pointer", height: 0, width: 0, position: "absolute" };
      }, ""), ro = Ue("span", { target: "es2dog20" })(function(e4) {
        var t3 = e4.theme;
        return { boxSizing: "border-box", width: t3.variables.size.dimension.checkbox.m, height: t3.variables.size.dimension.checkbox.m, borderRadius: t3.variables.size.borderRadius.checkbox.m, border: "2px solid", position: "absolute", top: 0, left: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: t3.values.color.background.checkbox.default, color: t3.values.color.icon.checkbox.default, borderColor: t3.values.color.border.checkbox.default, "& svg": { opacity: 0 }, "&: hover": { borderColor: t3.values.color.border.checkbox.defaultHover }, "input: focus-visible + &": { outlineWidth: "2px", outlineStyle: "solid", outlineColor: "Highlight" }, "@media (-webkit-min-device-pixel-ratio:0)": { "input: focus-visible + &": { outlineColor: "-webkit-focus-ring-color", outlineStyle: "auto" } }, "input:checked + & ": { border: 0, background: t3.values.color.background.checkbox.checked, "&:hover": { background: t3.values.color.background.checkbox.checkedHover }, svg: { opacity: 1 } }, "input:disabled + &": { pointerEvents: "none" } };
      }, "");
      function no(e4) {
        var t3 = e4.name, r3 = e4.value, n3 = r3 === void 0 ? "" : r3, o3 = e4.checked, a3 = o3 === void 0 ? void 0 : o3, l3 = e4.label, s3 = l3 === void 0 ? "" : l3, c3 = e4.labelHint, d3 = c3 === void 0 ? "" : c3, u3 = e4.disabled, f3 = u3 !== void 0 && u3, h3 = e4.onChange, p3 = e4.onClick, v3 = e4.onBlur, g3 = e4.onFocus, b3 = e4["data-e2e-test-id"], w3 = Qn(e4, Jn);
        return i2.a.createElement(Bn, Kn({ "data-e2e-test-id": b3 }, w3, { disabled: f3 }), i2.a.createElement(wt, { space: "m", vAlignItems: "top", noWrap: true }, i2.a.createElement(eo, null, i2.a.createElement(to, { type: "checkbox", name: t3, value: n3, checked: a3, disabled: f3, onChange: h3, onClick: p3, onBlur: v3, onFocus: g3 }), i2.a.createElement(ro, null, i2.a.createElement(er, { size: "s", name: "check" }))), s3 && i2.a.createElement("div", null, typeof s3 == "string" ? i2.a.createElement(Bt, null, s3) : s3, d3 && i2.a.createElement(Bt, { variant: "secondary", size: "s" }, d3))));
      }
      var oo = ["name", "value", "checked", "label", "disabled", "size", "isHighlighted", "alignItems", "onChange", "onClick", "onBlur", "onFocus", "data-e2e-test-id"];
      function ao() {
        return (ao = Object.assign || function(e4) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = arguments[t3];
            for (var n3 in r3)
              Object.prototype.hasOwnProperty.call(r3, n3) && (e4[n3] = r3[n3]);
          }
          return e4;
        }).apply(this, arguments);
      }
      function io(e4, t3) {
        if (e4 == null)
          return {};
        var r3, n3, o3 = function(e5, t4) {
          if (e5 == null)
            return {};
          var r4, n4, o4 = {}, a4 = Object.keys(e5);
          for (n4 = 0; n4 < a4.length; n4++)
            r4 = a4[n4], t4.indexOf(r4) >= 0 || (o4[r4] = e5[r4]);
          return o4;
        }(e4, t3);
        if (Object.getOwnPropertySymbols) {
          var a3 = Object.getOwnPropertySymbols(e4);
          for (n3 = 0; n3 < a3.length; n3++)
            r3 = a3[n3], t3.indexOf(r3) >= 0 || Object.prototype.propertyIsEnumerable.call(e4, r3) && (o3[r3] = e4[r3]);
        }
        return o3;
      }
      function lo(e4, t3) {
        var r3 = Object.keys(e4);
        if (Object.getOwnPropertySymbols) {
          var n3 = Object.getOwnPropertySymbols(e4);
          t3 && (n3 = n3.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e4, t4).enumerable;
          })), r3.push.apply(r3, n3);
        }
        return r3;
      }
      function so(e4) {
        for (var t3 = 1; t3 < arguments.length; t3++) {
          var r3 = arguments[t3] != null ? arguments[t3] : {};
          t3 % 2 ? lo(Object(r3), true).forEach(function(t4) {
            co(e4, t4, r3[t4]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r3)) : lo(Object(r3)).forEach(function(t4) {
            Object.defineProperty(e4, t4, Object.getOwnPropertyDescriptor(r3, t4));
          });
        }
        return e4;
      }
      function co(e4, t3, r3) {
        return t3 in e4 ? Object.defineProperty(e4, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t3] = r3, e4;
      }
      var uo = Ue("div", { target: "e13rhokn3" })(function(e4) {
        var t3 = e4.theme, r3 = e4.size, n3 = e4.disabled;
        return { display: "block", position: "relative", width: t3.variables.size.dimension.toggle.width[r3], height: t3.variables.size.dimension.togglePoint[r3], boxSizing: "border-box", cursor: n3 ? "default" : "pointer" };
      }, ""), fo = Ue("input", { target: "e13rhokn2" })(function() {
        return { opacity: 0, height: 0, width: 0, position: "absolute" };
      }, ""), ho = Ue("div", { target: "e13rhokn1" })(function(e4) {
        var t3 = e4.theme, r3 = e4.size;
        return { width: t3.variables.size.dimension.togglePoint[r3], height: t3.variables.size.dimension.togglePoint[r3], margin: parseInt(t3.variables.size.dimension.togglePoint[r3], 10) / (r3 === "m" ? 4 : 2), borderRadius: parseInt(t3.variables.size.dimension.togglePoint[r3], 10) / 2, transform: "translateX(0)", transition: "transform 0.2s linear", background: t3.values.color.background.togglePoint.default };
      }, ""), po = Ue("div", { target: "e13rhokn0" })(function(e4) {
        var t3, r3 = e4.theme, n3 = e4.size, o3 = e4.isHighlighted, a3 = parseInt(r3.variables.size.dimension.togglePoint[n3], 10) / (n3 === "m" ? 4 : 2), i3 = parseInt(r3.variables.size.dimension.toggle.width[n3], 10) - parseInt(r3.variables.size.dimension.togglePoint[n3], 10) - 2 * a3 - 2;
        return so(so({ boxSizing: "border-box", width: r3.variables.size.dimension.toggle.width[n3], height: r3.variables.size.dimension.toggle.height[n3], borderRadius: r3.variables.size.borderRadius.toggle[n3], display: "flex", alignItems: "center", transition: "background-color 0.2s linear, border-color 0.2s linear", border: "1px solid", borderColor: o3 ? r3.values.color.border.toggle.highlighted : r3.values.color.border.toggle.default, background: o3 ? r3.values.color.background.toggle.highlighted : r3.values.color.background.toggle.default }, n3 === "s" && { marginTop: 2 }), {}, { "input:checked + &": (t3 = { border: "1px solid", borderColor: r3.values.color.border.toggle.checked, background: r3.values.color.background.toggle.checked }, co(t3, "".concat(ho), { transform: "translateX(".concat(i3, "px)") }), co(t3, "&:hover", { borderColor: r3.values.color.border.toggle.hover }), t3), "input:disabled + &": { pointerEvents: "none" }, "input:focus-visible + &": { outlineWidth: 2, outlineStyle: "solid", outlineColor: "Highlight" }, "@media (-webkit-min-device-pixel-ratio: 0)": { "input:focus-visible + &": { outlineColor: "-webkit-focus-ring-color", outlineStyle: "auto" } }, "&:hover": { borderColor: r3.values.color.border.toggle.hover } });
      }, "");
      function vo(e4) {
        var t3 = e4.name, r3 = e4.value, n3 = r3 === void 0 ? "" : r3, o3 = e4.checked, a3 = o3 === void 0 ? void 0 : o3, l3 = e4.label, s3 = l3 === void 0 ? "" : l3, c3 = e4.disabled, d3 = c3 !== void 0 && c3, u3 = e4.size, f3 = u3 === void 0 ? "m" : u3, h3 = e4.isHighlighted, p3 = h3 !== void 0 && h3, v3 = e4.alignItems, g3 = v3 === void 0 ? "left" : v3, b3 = e4.onChange, w3 = e4.onClick, m3 = e4.onBlur, y3 = e4.onFocus, k3 = e4["data-e2e-test-id"], x3 = io(e4, oo), C3 = f3 === "s" ? "xs" : "m", j3 = f3 === "s" ? "tertiary" : "secondary", O3 = f3 === "s" ? "bold" : "normal";
        return i2.a.createElement(Bn, ao({ "data-e2e-test-id": k3 }, x3, { disabled: d3 }), i2.a.createElement(wt, { alignItems: g3, space: C3, vAlignItems: "top", noWrap: true }, s3 && i2.a.createElement(Bt, { size: f3, variant: j3, weight: O3 }, s3), i2.a.createElement(uo, { size: f3, disabled: d3 }, i2.a.createElement(fo, { type: "checkbox", name: t3, value: n3, checked: a3, disabled: d3, onChange: b3, onClick: w3, onBlur: m3, onFocus: y3 }), i2.a.createElement(po, { size: f3, isHighlighted: p3 }, i2.a.createElement(ho, { size: f3 })))));
      }
      var go = ["name", "value", "checked", "label", "disabled", "onChange", "onClick", "onBlur", "onFocus", "data-e2e-test-id"];
      function bo() {
        return (bo = Object.assign || function(e4) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = arguments[t3];
            for (var n3 in r3)
              Object.prototype.hasOwnProperty.call(r3, n3) && (e4[n3] = r3[n3]);
          }
          return e4;
        }).apply(this, arguments);
      }
      function wo(e4, t3) {
        if (e4 == null)
          return {};
        var r3, n3, o3 = function(e5, t4) {
          if (e5 == null)
            return {};
          var r4, n4, o4 = {}, a4 = Object.keys(e5);
          for (n4 = 0; n4 < a4.length; n4++)
            r4 = a4[n4], t4.indexOf(r4) >= 0 || (o4[r4] = e5[r4]);
          return o4;
        }(e4, t3);
        if (Object.getOwnPropertySymbols) {
          var a3 = Object.getOwnPropertySymbols(e4);
          for (n3 = 0; n3 < a3.length; n3++)
            r3 = a3[n3], t3.indexOf(r3) >= 0 || Object.prototype.propertyIsEnumerable.call(e4, r3) && (o3[r3] = e4[r3]);
        }
        return o3;
      }
      var mo = Ue("div", { target: "e1fgddiq2" })(function(e4) {
        var t3 = e4.theme;
        return { userSelect: "none", display: "block", position: "relative", width: t3.variables.size.dimension.radio.m, height: t3.variables.size.dimension.radio.m, boxSizing: "border-box" };
      }, ""), yo = Ue("input", { target: "e1fgddiq1" })(function() {
        return { opacity: 0, cursor: "pointer", position: "absolute", width: 0, height: 0 };
      }, ""), ko = Ue("span", { target: "e1fgddiq0" })(function(e4) {
        var t3 = e4.theme;
        return { boxSizing: "border-box", width: t3.variables.size.dimension.radio.m, height: t3.variables.size.dimension.radio.m, borderRadius: t3.variables.size.borderRadius.radio.m, border: "2px solid", top: 0, left: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", cursor: "pointer", background: t3.values.color.background.radio.default, borderColor: t3.values.color.border.radio.default, "& div": { opacity: 0, borderRadius: "50%", width: t3.variables.size.dimension.radioPoint.m, height: t3.variables.size.dimension.radioPoint.m, background: t3.values.color.icon.radio.default }, "&:hover, input:checked + &": { borderColor: t3.values.color.border.radio.defaultHover }, "input:checked + &": { background: t3.values.color.background.radio.checked, "&:hover": { background: t3.values.color.background.radio.checkedHover }, "& div": { opacity: 1 } }, "focus-visible + &": { outlineWidth: "2px", outlineStyle: "solid", outlineColor: "Highlight" }, "@media (-webkit-min-device-pixel-ratio:0)": { "focus-visible + &": { outlineColor: "-webkit-focus-ring-color", outlineStyle: "auto" } } };
      }, "");
      function xo(e4) {
        var t3 = e4.name, r3 = e4.value, n3 = r3 === void 0 ? "" : r3, o3 = e4.checked, a3 = o3 === void 0 ? void 0 : o3, l3 = e4.label, s3 = l3 === void 0 ? "" : l3, c3 = e4.disabled, d3 = c3 !== void 0 && c3, u3 = e4.onChange, f3 = e4.onClick, h3 = e4.onBlur, p3 = e4.onFocus, v3 = e4["data-e2e-test-id"], g3 = wo(e4, go);
        return i2.a.createElement(Bn, bo({ "data-e2e-test-id": v3 }, g3, { disabled: d3 }), i2.a.createElement(wt, { space: "m", vAlignItems: "top", noWrap: true }, i2.a.createElement(mo, null, i2.a.createElement(yo, { type: "radio", name: t3, value: n3, checked: a3, disabled: d3, onChange: u3, onClick: f3, onBlur: h3, onFocus: p3 }), i2.a.createElement(ko, null, i2.a.createElement("div", null))), typeof s3 == "string" ? i2.a.createElement(Bt, null, s3) : s3));
      }
      var Co = ["name", "value", "checked", "label", "icon", "disabled", "onChange", "onClick", "onBlur", "onFocus"];
      function jo() {
        return (jo = Object.assign || function(e4) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = arguments[t3];
            for (var n3 in r3)
              Object.prototype.hasOwnProperty.call(r3, n3) && (e4[n3] = r3[n3]);
          }
          return e4;
        }).apply(this, arguments);
      }
      function Oo(e4, t3) {
        if (e4 == null)
          return {};
        var r3, n3, o3 = function(e5, t4) {
          if (e5 == null)
            return {};
          var r4, n4, o4 = {}, a4 = Object.keys(e5);
          for (n4 = 0; n4 < a4.length; n4++)
            r4 = a4[n4], t4.indexOf(r4) >= 0 || (o4[r4] = e5[r4]);
          return o4;
        }(e4, t3);
        if (Object.getOwnPropertySymbols) {
          var a3 = Object.getOwnPropertySymbols(e4);
          for (n3 = 0; n3 < a3.length; n3++)
            r3 = a3[n3], t3.indexOf(r3) >= 0 || Object.prototype.propertyIsEnumerable.call(e4, r3) && (o3[r3] = e4[r3]);
        }
        return o3;
      }
      var Mo = Ue("div", { target: "ecpa6et2" })(function() {
        return { userSelect: "none", display: "block", position: "relative", width: "100%", boxSizing: "border-box" };
      }, ""), zo = Ue("input", { target: "ecpa6et1" })(function() {
        return { opacity: 0, cursor: "pointer", height: 0, width: 0, position: "absolute" };
      }, ""), So = Ue("div", { target: "ecpa6et0" })(function(e4) {
        var t3 = e4.theme;
        return { cursor: "pointer", textTransform: "none", textDecoration: "none", borderRadius: t3.variables.size.borderRadius.button.m, fontFamily: t3.variables.fontFamily.lato, fontSize: t3.variables.size.font.button.m, fontWeight: t3.variables.weight.bold, lineHeight: t3.variables.size.lineHeight.button.m, "input: focus-visible + &": { outlineWidth: "2px", outlineStyle: "solid", outlineColor: "Highlight" }, "@media (-webkit-min-device-pixel-ratio:0)": { "input: focus-visible + &": { outlineColor: "-webkit-focus-ring-color", outlineStyle: "auto" } }, "input:not(:checked) + &": { border: "1px solid", padding: "".concat(parseInt(t3.variables.size.spacing.s, 10) - 1, "px ").concat(parseInt(t3.variables.size.spacing.l, 10) - 1, "px"), backgroundColor: t3.values.color.background.button.secondary.base, borderColor: t3.values.color.border.button.secondary.base, color: t3.values.color.text.button.secondary.base, "&:hover": { backgroundColor: t3.values.color.background.button.secondary.hover, borderColor: t3.values.color.border.button.secondary.hover, color: t3.values.color.text.button.secondary.hover }, "&:active": { backgroundColor: t3.values.color.background.button.secondary.active, borderColor: t3.values.color.border.button.secondary.active, color: t3.values.color.text.button.secondary.active } }, "input:checked + & ": { border: 0, padding: "".concat(t3.variables.size.spacing.s, " ").concat(t3.variables.size.spacing.l), backgroundColor: t3.values.color.background.button.primary.base, color: t3.values.color.text.button.primary.base, "&:hover": { backgroundColor: t3.values.color.background.button.primary.base, color: t3.values.color.text.button.primary.base }, "&:active": { backgroundColor: t3.values.color.background.button.primary.base, color: t3.values.color.text.button.primary.base } } };
      }, "");
      function Eo(e4) {
        var t3 = e4.name, r3 = e4.value, n3 = r3 === void 0 ? "" : r3, o3 = e4.checked, a3 = o3 === void 0 ? void 0 : o3, l3 = e4.label, s3 = l3 === void 0 ? "" : l3, c3 = e4.icon, d3 = e4.disabled, u3 = d3 !== void 0 && d3, f3 = e4.onChange, h3 = e4.onClick, p3 = e4.onBlur, v3 = e4.onFocus, g3 = Oo(e4, Co);
        return i2.a.createElement(Bn, jo({}, g3, { disabled: u3 }), i2.a.createElement(Mo, null, i2.a.createElement(zo, { type: "radio", name: t3, value: n3, checked: a3, disabled: u3, onChange: f3, onClick: h3, onBlur: p3, onFocus: v3 }), i2.a.createElement(So, null, i2.a.createElement(wt, { vAlignItems: "center", alignItems: "spaceBetween", noWrap: true }, s3, c3 && i2.a.createElement(er, { name: c3 })))));
      }
      var Po = ["name", "value", "placeholder", "hasError", "onChange", "onClick", "onBlur", "onFocus", "tabIndex", "areaLabel", "autoComplete", "rows", "maxLength", "resize"];
      function Ho(e4, t3) {
        if (e4 == null)
          return {};
        var r3, n3, o3 = function(e5, t4) {
          if (e5 == null)
            return {};
          var r4, n4, o4 = {}, a4 = Object.keys(e5);
          for (n4 = 0; n4 < a4.length; n4++)
            r4 = a4[n4], t4.indexOf(r4) >= 0 || (o4[r4] = e5[r4]);
          return o4;
        }(e4, t3);
        if (Object.getOwnPropertySymbols) {
          var a3 = Object.getOwnPropertySymbols(e4);
          for (n3 = 0; n3 < a3.length; n3++)
            r3 = a3[n3], t3.indexOf(r3) >= 0 || Object.prototype.propertyIsEnumerable.call(e4, r3) && (o3[r3] = e4[r3]);
        }
        return o3;
      }
      var Bo = Ue("textarea", { target: "e1u5324b1" })(function(e4) {
        var t3 = e4.theme, r3 = e4.resize, n3 = e4.hasError;
        return { fontFamily: t3.variables.fontFamily.lato, fontSize: t3.variables.size.font.text.m, lineHeight: t3.variables.size.lineHeight.text.m, minHeight: t3.variables.size.dimension.textarea.minHeight.m, borderRadius: t3.variables.size.borderRadius.textarea.s, border: "1px solid", width: "100%", padding: t3.variables.size.spacing.xs, boxSizing: "border-box", color: t3.values.color.text.secondary, borderColor: n3 ? t3.values.color.border.textarea.error : t3.values.color.border.textarea.default, backgroundColor: t3.values.color.background.textarea.default, resize: r3 };
      }, ""), Ao = Ue("div", { target: "e1u5324b0" })(function() {
        return { width: "100%", display: "flex", alignItems: "center", flexDirection: "row", position: "relative", zIndex: 1 };
      }, "");
      function Lo(e4) {
        var t3 = e4.name, r3 = e4.value, n3 = e4.placeholder, o3 = e4.hasError, a3 = o3 !== void 0 && o3, l3 = e4.onChange, s3 = e4.onClick, c3 = e4.onBlur, d3 = e4.onFocus, u3 = e4.tabIndex, f3 = e4.areaLabel, h3 = e4.autoComplete, p3 = h3 === void 0 ? "on" : h3, v3 = e4.rows, g3 = v3 === void 0 ? 5 : v3, b3 = e4.maxLength, w3 = b3 === void 0 ? 256 : b3, m3 = e4.resize, y3 = m3 === void 0 ? "none" : m3, k3 = Ho(e4, Po);
        return i2.a.createElement(Bn, k3, i2.a.createElement(Ao, null, i2.a.createElement(Bo, { name: t3, disabled: k3.disabled, placeholder: n3, hasError: a3, onClick: s3, onChange: l3, onBlur: c3, onFocus: d3, "aria-label": f3, tabIndex: u3, autoComplete: p3, rows: g3, maxLength: w3, defaultValue: r3, resize: y3 })));
      }
      function Io(e4) {
        return function(e5) {
          if (Array.isArray(e5))
            return Zo(e5);
        }(e4) || function(e5) {
          if (typeof Symbol != "undefined" && e5[Symbol.iterator] != null || e5["@@iterator"] != null)
            return Array.from(e5);
        }(e4) || function(e5, t3) {
          if (!e5)
            return;
          if (typeof e5 == "string")
            return Zo(e5, t3);
          var r3 = Object.prototype.toString.call(e5).slice(8, -1);
          r3 === "Object" && e5.constructor && (r3 = e5.constructor.name);
          if (r3 === "Map" || r3 === "Set")
            return Array.from(e5);
          if (r3 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3))
            return Zo(e5, t3);
        }(e4) || function() {
          throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
      }
      function Zo(e4, t3) {
        (t3 == null || t3 > e4.length) && (t3 = e4.length);
        for (var r3 = 0, n3 = new Array(t3); r3 < t3; r3++)
          n3[r3] = e4[r3];
        return n3;
      }
      function Vo(e4, t3) {
        var r3 = Object.keys(e4);
        if (Object.getOwnPropertySymbols) {
          var n3 = Object.getOwnPropertySymbols(e4);
          t3 && (n3 = n3.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e4, t4).enumerable;
          })), r3.push.apply(r3, n3);
        }
        return r3;
      }
      function Ro(e4) {
        for (var t3 = 1; t3 < arguments.length; t3++) {
          var r3 = arguments[t3] != null ? arguments[t3] : {};
          t3 % 2 ? Vo(Object(r3), true).forEach(function(t4) {
            To(e4, t4, r3[t4]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r3)) : Vo(Object(r3)).forEach(function(t4) {
            Object.defineProperty(e4, t4, Object.getOwnPropertyDescriptor(r3, t4));
          });
        }
        return e4;
      }
      function To(e4, t3, r3) {
        return t3 in e4 ? Object.defineProperty(e4, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t3] = r3, e4;
      }
      var _o = function(e4, t3) {
        var r3, n3 = e4.topOffsets, o3 = e4.overscan, a3 = Math.max(0, function(e5, t4) {
          for (var r4 = 0, n4 = e5.length - 1, o4 = Math.floor((r4 + n4) / 2); r4 <= n4; ) {
            if (e5[o4 = Math.floor((r4 + n4) / 2)].amount === t4)
              return o4;
            t4 < e5[o4].amount ? n4 = o4 - 1 : r4 = o4 + 1;
          }
          return o4;
        }(n3, t3) - o3 / 2), i3 = ((r3 = n3[a3]) === null || r3 === void 0 ? void 0 : r3.amount) || 0;
        return Ro(Ro({}, e4), {}, { scrolledItemCount: a3, scrolledInPx: i3 });
      }, $o = function(e4, t3, r3) {
        var n3 = e4.topOffsets, o3 = n3 === void 0 ? [] : n3, a3 = e4.scrolledInPx, i3 = e4.scrolledItemCount, l3 = e4.avgItemHeight, s3 = e4.lastItemHeight, c3 = e4.maxHeight, d3 = e4.overscan, u3 = Io(o3), f3 = s3;
        Array.from(t3.children).forEach(function(e5, t4) {
          u3[t4 + i3] = { amount: a3 + e5.offsetTop, isInterpolated: false }, t4 + i3 !== r3 - 1 || s3 || (f3 = e5.getBoundingClientRect().height);
        });
        for (var h3 = 0; h3 < r3; h3 += 1)
          u3[h3] && !u3[h3].isInterpolated || (u3[h3] = { amount: u3[h3 - 1].amount + l3, isInterpolated: true });
        var p3 = Math.max(l3, t3.getBoundingClientRect().height / (t3.childElementCount || 1)), v3 = function(e5, t4) {
          var r4, n4 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, o4 = Math.min(t4.length, e5), a4 = ((r4 = t4[o4 - 1]) === null || r4 === void 0 ? void 0 : r4.amount) || 0, i4 = a4 + n4;
          return i4;
        }(r3, u3, f3);
        return Ro(Ro({}, e4), {}, { lastItemHeight: f3, avgItemHeight: l3, topOffsets: u3, amountOfItemsInView: Math.round(c3 / p3) + d3, maxContentHeight: v3 });
      }, Do = function(e4, t3) {
        switch (t3.type) {
          case "reset":
            return function(e5, t4, r3, n3) {
              return Ro(Ro({}, e5), {}, { lastItemHeight: null, topOffsets: [{ amount: 0, isInterpolated: false }], scrolledInPx: 0, scrolledItemCount: 0, maxHeight: r3, avgItemHeight: t4, overscan: n3 });
            }(e4, t3.itemHeight, t3.maxHeight, t3.overscan);
          case "scroll":
            return _o(e4, t3.scrollTop);
          case "updateViewport":
            return $o(e4, t3.viewportNode, t3.itemAmount);
          case "recommendScrollPosition":
            return function(e5, t4, r3) {
              var n3, o3, a3 = e5.topOffsets, i3 = e5.maxHeight;
              if (!a3)
                return e5;
              var l3 = (n3 = a3[r3 + 1]) === null || n3 === void 0 ? void 0 : n3.amount, s3 = (o3 = a3[r3]) === null || o3 === void 0 ? void 0 : o3.amount, c3 = null;
              return s3 < t4 && (c3 = s3), l3 >= t4 + i3 && (c3 = l3 - i3), r3 === a3.length - 1 && (c3 = a3[r3].amount), Ro(Ro({}, e5), {}, { recommendedScrollPosition: c3 });
            }(e4, t3.scrollTop, t3.itemToBeInView);
          default:
            throw new Error();
        }
      };
      function Fo(e4, t3) {
        return function(e5) {
          if (Array.isArray(e5))
            return e5;
        }(e4) || function(e5, t4) {
          var r3 = e5 == null ? null : typeof Symbol != "undefined" && e5[Symbol.iterator] || e5["@@iterator"];
          if (r3 == null)
            return;
          var n3, o3, a3 = [], i3 = true, l3 = false;
          try {
            for (r3 = r3.call(e5); !(i3 = (n3 = r3.next()).done) && (a3.push(n3.value), !t4 || a3.length !== t4); i3 = true)
              ;
          } catch (e6) {
            l3 = true, o3 = e6;
          } finally {
            try {
              i3 || r3.return == null || r3.return();
            } finally {
              if (l3)
                throw o3;
            }
          }
          return a3;
        }(e4, t3) || function(e5, t4) {
          if (!e5)
            return;
          if (typeof e5 == "string")
            return Wo(e5, t4);
          var r3 = Object.prototype.toString.call(e5).slice(8, -1);
          r3 === "Object" && e5.constructor && (r3 = e5.constructor.name);
          if (r3 === "Map" || r3 === "Set")
            return Array.from(e5);
          if (r3 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3))
            return Wo(e5, t4);
        }(e4, t3) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
      }
      function Wo(e4, t3) {
        (t3 == null || t3 > e4.length) && (t3 = e4.length);
        for (var r3 = 0, n3 = new Array(t3); r3 < t3; r3++)
          n3[r3] = e4[r3];
        return n3;
      }
      var qo = Ue("div", { target: "ebr5g6s1" })(function(e4) {
        return { overflow: "auto", width: "100%", height: "100%", maxHeight: e4.maxHeight };
      }, ""), No = Ue("div", { target: "ebr5g6s0" })(function(e4) {
        return { overflow: "hidden", boxSizing: "border-box", height: e4.maxContentHeight };
      }, "");
      function Uo(e4) {
        var t3 = e4.maxHeight, r3 = e4.itemHeight, n3 = e4.itemAmount, o3 = e4.emptyState, l3 = o3 === void 0 ? function() {
          return null;
        } : o3, s3 = e4.itemInView, c3 = e4.itemTemplate, d3 = e4["data-e2e-test-id"], u3 = Object(a2.useRef)(null), f3 = Object(a2.useRef)(null), h3 = Fo(Object(a2.useReducer)(Do, {}), 2), p3 = h3[0], v3 = p3.scrolledItemCount, g3 = p3.amountOfItemsInView, b3 = p3.scrolledInPx, w3 = p3.maxContentHeight, m3 = w3 === void 0 ? t3 : w3, y3 = p3.recommendedScrollPosition, k3 = h3[1];
        Object(a2.useLayoutEffect)(function() {
          k3({ type: "reset", itemHeight: r3, maxHeight: t3, overscan: 10 }), u3.current.scrollTop = 0;
        }, [r3, n3, t3]), Object(a2.useEffect)(function() {
          k3({ type: "recommendScrollPosition", scrollTop: u3.current.scrollTop, itemToBeInView: s3 });
        }, [s3]), Object(a2.useEffect)(function() {
          y3 !== null && (u3.current.scrollTop = y3);
        }, [y3]), Object(a2.useLayoutEffect)(function() {
          f3.current && k3({ type: "updateViewport", viewportNode: f3.current, itemAmount: n3 });
        }, [n3, v3]);
        var x3 = Math.min(Math.max(0, n3 - v3), g3);
        return i2.a.createElement(qo, { ref: u3, maxHeight: t3, style: { maxHeight: t3 }, "data-e2e-test-id": d3, onScroll: function(e5) {
          k3({ type: "scroll", scrollTop: e5.currentTarget.scrollTop });
        } }, n3 === 0 ? l3() : i2.a.createElement(No, { maxContentHeight: m3 }, i2.a.createElement("div", { ref: f3, style: { transform: "translateY(".concat(b3, "px") } }, !!x3 && new Array(x3).fill(0).map(function(e5, t4) {
          return c3(v3 + t4);
        }))));
      }
      var Go = ["options", "name", "value", "placeholder", "emptyStateMessage", "hasError", "filterMethod", "onChange", "onBlur", "onFocus", "maxHeight", "autoComplete"];
      function Xo(e4, t3) {
        return function(e5) {
          if (Array.isArray(e5))
            return e5;
        }(e4) || function(e5, t4) {
          var r3 = e5 == null ? null : typeof Symbol != "undefined" && e5[Symbol.iterator] || e5["@@iterator"];
          if (r3 == null)
            return;
          var n3, o3, a3 = [], i3 = true, l3 = false;
          try {
            for (r3 = r3.call(e5); !(i3 = (n3 = r3.next()).done) && (a3.push(n3.value), !t4 || a3.length !== t4); i3 = true)
              ;
          } catch (e6) {
            l3 = true, o3 = e6;
          } finally {
            try {
              i3 || r3.return == null || r3.return();
            } finally {
              if (l3)
                throw o3;
            }
          }
          return a3;
        }(e4, t3) || function(e5, t4) {
          if (!e5)
            return;
          if (typeof e5 == "string")
            return Yo(e5, t4);
          var r3 = Object.prototype.toString.call(e5).slice(8, -1);
          r3 === "Object" && e5.constructor && (r3 = e5.constructor.name);
          if (r3 === "Map" || r3 === "Set")
            return Array.from(e5);
          if (r3 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3))
            return Yo(e5, t4);
        }(e4, t3) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }();
      }
      function Yo(e4, t3) {
        (t3 == null || t3 > e4.length) && (t3 = e4.length);
        for (var r3 = 0, n3 = new Array(t3); r3 < t3; r3++)
          n3[r3] = e4[r3];
        return n3;
      }
      function Jo(e4, t3) {
        if (e4 == null)
          return {};
        var r3, n3, o3 = function(e5, t4) {
          if (e5 == null)
            return {};
          var r4, n4, o4 = {}, a4 = Object.keys(e5);
          for (n4 = 0; n4 < a4.length; n4++)
            r4 = a4[n4], t4.indexOf(r4) >= 0 || (o4[r4] = e5[r4]);
          return o4;
        }(e4, t3);
        if (Object.getOwnPropertySymbols) {
          var a3 = Object.getOwnPropertySymbols(e4);
          for (n3 = 0; n3 < a3.length; n3++)
            r3 = a3[n3], t3.indexOf(r3) >= 0 || Object.prototype.propertyIsEnumerable.call(e4, r3) && (o3[r3] = e4[r3]);
        }
        return o3;
      }
      function Ko(e4, t3) {
        var r3 = Object.keys(e4);
        if (Object.getOwnPropertySymbols) {
          var n3 = Object.getOwnPropertySymbols(e4);
          t3 && (n3 = n3.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e4, t4).enumerable;
          })), r3.push.apply(r3, n3);
        }
        return r3;
      }
      function Qo(e4) {
        for (var t3 = 1; t3 < arguments.length; t3++) {
          var r3 = arguments[t3] != null ? arguments[t3] : {};
          t3 % 2 ? Ko(Object(r3), true).forEach(function(t4) {
            ea(e4, t4, r3[t4]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r3)) : Ko(Object(r3)).forEach(function(t4) {
            Object.defineProperty(e4, t4, Object.getOwnPropertyDescriptor(r3, t4));
          });
        }
        return e4;
      }
      function ea(e4, t3, r3) {
        return t3 in e4 ? Object.defineProperty(e4, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t3] = r3, e4;
      }
      var ta = Ue("div", { target: "el6d4lv4" })(function() {
        return { position: "relative" };
      }, ""), ra = Ue("div", { target: "el6d4lv3" })(function() {
        return { zIndex: 0, position: "absolute", pointerEvents: "none", width: "100%", bottom: 0, left: 0 };
      }, ""), na = Ue("div", { target: "el6d4lv2" })(function(e4) {
        var t3 = e4.theme, r3 = e4.dropdownPosition;
        return Qo(Qo({ backgroundColor: t3.values.color.background.layer_2, position: "absolute", fontSize: t3.variables.size.font.text.s, zIndex: 2, width: "100%", margin: "".concat(t3.variables.size.spacing.xs, " 0"), cursor: "pointer", borderRadius: t3.variables.size.borderRadius.dropdown.m, overflow: "hidden", boxShadow: t3.variables.shadow.card.b, boxSizing: "border-box" }, r3 === "down" && { top: "100%" }), r3 === "up" && { bottom: "100%" });
      }, ""), oa = Ue("div", { target: "el6d4lv1" })(function(e4) {
        var t3 = e4.theme, r3 = e4.active;
        return Qo(Qo({ padding: t3.variables.size.spacing.xs, borderRadius: t3.variables.size.borderRadius.dropdown.s }, r3 && { backgroundColor: t3.values.color.background.dropdown.active }), {}, { "&:hover": { backgroundColor: t3.values.color.background.dropdown.active } });
      }, ""), aa = Ue("select", { target: "el6d4lv0" })(function() {
        return { display: "none" };
      }, ""), ia = function(e4, t3) {
        return e4.label.toLowerCase().indexOf(t3.toLowerCase()) > -1;
      };
      function la(e4) {
        var t3 = e4.options, r3 = t3 === void 0 ? [] : t3, n3 = e4.name, o3 = e4.value, l3 = e4.placeholder, s3 = e4.emptyStateMessage, c3 = e4.hasError, d3 = e4.filterMethod, u3 = d3 === void 0 ? ia : d3, f3 = e4.onChange, h3 = f3 === void 0 ? function() {
          return null;
        } : f3, p3 = e4.onBlur, v3 = p3 === void 0 ? function() {
          return null;
        } : p3, g3 = e4.onFocus, b3 = g3 === void 0 ? function() {
          return null;
        } : g3, w3 = e4.maxHeight, m3 = w3 === void 0 ? 230 : w3, y3 = e4.autoComplete, k3 = y3 === void 0 ? "on" : y3, x3 = Jo(e4, Go), C3 = x3.disabled, j3 = Xo(Object(a2.useState)(false), 2), O3 = j3[0], M3 = j3[1], z3 = Xo(Object(a2.useState)(""), 2), S3 = z3[0], E3 = z3[1], P3 = Xo(Object(a2.useState)(-1), 2), H3 = P3[0], B3 = P3[1], A3 = Object(a2.useMemo)(function() {
          return r3.find(function(e5) {
            return e5.value === o3;
          }) || { value: "", label: "" };
        }, [r3, o3]), L3 = Xo(Object(a2.useState)(A3), 2), I3 = L3[0], Z3 = L3[1], V3 = Object(a2.useRef)(null), R3 = Object(a2.useRef)(null), T3 = Object(a2.useRef)(null), _3 = Object(a2.useRef)(o3);
        _3.current = o3;
        var $3 = Object(a2.useCallback)(function(e5) {
          I3.value !== e5.value && Z3(e5);
        }, [I3]), D3 = Dt(V3, R3, O3), F3 = Object(a2.useCallback)(function() {
          var e5 = arguments.length > 0 && arguments[0] !== void 0 && arguments[0];
          if (M3(false), !e5) {
            var t4 = r3.find(function(e6) {
              return e6.label.toLowerCase().trim() === S3.toLowerCase().trim();
            });
            t4 && $3(t4);
          }
          E3(""), B3(-1), v3();
        }, [v3, $3, S3, r3]);
        Object(a2.useEffect)(function() {
          V3.current && _3.current !== I3.value && V3.current.dispatchEvent(new Event("change", { bubbles: true }));
        }, [I3, V3, _3]), Object(a2.useEffect)(function() {
          $3(A3);
        }, [A3]);
        var W3 = Object(a2.useMemo)(function() {
          return S3 ? r3.filter(function(e5) {
            return u3(e5, S3);
          }) : r3;
        }, [r3, u3, S3]), q3 = Object(a2.useMemo)(function() {
          return r3.some(function(e5) {
            return e5.value === o3;
          }) ? r3.find(function(e5) {
            return e5.value === o3;
          }).label : "";
        }, [o3, r3]);
        return Object(a2.useEffect)(function() {
          B3(-1);
        }, [W3]), Ft({ Escape: function() {
          return F3(true);
        }, Enter: function() {
          if (W3[H3])
            return $3(W3[H3]), void F3(true);
          F3();
        }, ArrowUp: function() {
          B3(Math.max(H3 - 1, 0));
        }, ArrowDown: function() {
          B3(Math.min(H3 + 1, W3.length - 1));
        } }, T3, O3 && !C3), Ft({ "ArrowUp ArrowDown": function() {
          M3(true);
        } }, T3, !O3 && !C3), i2.a.createElement(Bn, x3, i2.a.createElement(ta, { onBlur: function() {
          F3(true);
        } }, i2.a.createElement("div", { style: { zIndex: 1 } }, i2.a.createElement(Xn, { areaLabel: x3.label, name: "".concat(n3, "-innerInput"), value: S3, privateProps: { isTransparent: !(O3 && S3) }, icon: O3 ? "chevron-up" : "chevron-down", hasError: c3, disabled: C3, onFocus: function() {
          M3(true), b3();
        }, onClick: function() {
          M3(true);
        }, onChange: function(e5) {
          e5.currentTarget.value && M3(true), E3(e5.currentTarget.value);
        }, ref: T3, autoComplete: k3 })), i2.a.createElement(ra, null, i2.a.createElement(Yn, { name: n3, value: q3, onChange: function() {
          return null;
        }, icon: O3 ? "chevron-up" : "chevron-down", placeholder: l3, tabIndex: -1, autoComplete: "off" })), O3 && i2.a.createElement(na, { dropdownPosition: D3, ref: R3, onMouseDown: function(e5) {
          return e5.preventDefault();
        } }, i2.a.createElement(Uo, { maxHeight: m3, itemHeight: 36, itemAmount: W3.length, emptyState: function() {
          return i2.a.createElement(At, { space: "xs" }, i2.a.createElement(Bt, null, s3 || "\u{1F937}\u{1F3FB}\u200D\u2640\uFE0F"));
        }, itemInView: H3, itemTemplate: function(e5) {
          var t4 = W3[e5];
          return i2.a.createElement(oa, { key: t4.value, active: H3 === e5 || o3 === t4.value, onMouseDown: function() {
            $3(t4), F3(true);
          } }, i2.a.createElement(Bt, { weight: "bold", variant: "secondary", size: "s" }, t4.label));
        } })), i2.a.createElement(aa, { onChange: h3, value: I3.value, ref: V3, autoComplete: "off" }, i2.a.createElement("option", { value: I3.value }, I3.label))));
      }
      function sa(e4, t3) {
        var r3 = Object.keys(e4);
        if (Object.getOwnPropertySymbols) {
          var n3 = Object.getOwnPropertySymbols(e4);
          t3 && (n3 = n3.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e4, t4).enumerable;
          })), r3.push.apply(r3, n3);
        }
        return r3;
      }
      function ca(e4) {
        for (var t3 = 1; t3 < arguments.length; t3++) {
          var r3 = arguments[t3] != null ? arguments[t3] : {};
          t3 % 2 ? sa(Object(r3), true).forEach(function(t4) {
            da(e4, t4, r3[t4]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r3)) : sa(Object(r3)).forEach(function(t4) {
            Object.defineProperty(e4, t4, Object.getOwnPropertyDescriptor(r3, t4));
          });
        }
        return e4;
      }
      function da(e4, t3, r3) {
        return t3 in e4 ? Object.defineProperty(e4, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t3] = r3, e4;
      }
      function ua(e4) {
        return (ua = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e5) {
          return typeof e5;
        } : function(e5) {
          return e5 && typeof Symbol == "function" && e5.constructor === Symbol && e5 !== Symbol.prototype ? "symbol" : typeof e5;
        })(e4);
      }
      function fa(e4) {
        return e4 && ua(e4) === "object" && !Array.isArray(e4);
      }
      var ha = function(e4, t3) {
        return function e5(t4) {
          for (var r3 = arguments.length, n3 = new Array(r3 > 1 ? r3 - 1 : 0), o3 = 1; o3 < r3; o3++)
            n3[o3 - 1] = arguments[o3];
          if (!n3.length)
            return t4;
          var a3 = n3.shift();
          if (fa(t4) && fa(a3))
            for (var i3 in a3)
              fa(a3[i3]) ? (t4[i3] || Object.assign(t4, da({}, i3, {})), e5(t4[i3], a3[i3])) : Object.assign(t4, da({}, i3, a3[i3]));
          return e5.apply(void 0, [t4].concat(n3));
        }({}, e4, { values: ca({}, e4.values.subThemes[t3]) });
      };
      function pa(e4) {
        var t3 = e4.name, r3 = e4.children, n3 = e4["data-e2e-test-id"];
        return i2.a.createElement(Se, { theme: function(e5) {
          return ha(e5, t3);
        } }, i2.a.createElement("div", { "data-e2e-test-id": n3 }, r3));
      }
      var va = ["onClick", "onFocus", "onBlur", "type", "disabled", "as", "icon", "data-e2e-test-id"];
      function ga() {
        return (ga = Object.assign || function(e4) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = arguments[t3];
            for (var n3 in r3)
              Object.prototype.hasOwnProperty.call(r3, n3) && (e4[n3] = r3[n3]);
          }
          return e4;
        }).apply(this, arguments);
      }
      function ba(e4, t3) {
        if (e4 == null)
          return {};
        var r3, n3, o3 = function(e5, t4) {
          if (e5 == null)
            return {};
          var r4, n4, o4 = {}, a4 = Object.keys(e5);
          for (n4 = 0; n4 < a4.length; n4++)
            r4 = a4[n4], t4.indexOf(r4) >= 0 || (o4[r4] = e5[r4]);
          return o4;
        }(e4, t3);
        if (Object.getOwnPropertySymbols) {
          var a3 = Object.getOwnPropertySymbols(e4);
          for (n3 = 0; n3 < a3.length; n3++)
            r3 = a3[n3], t3.indexOf(r3) >= 0 || Object.prototype.propertyIsEnumerable.call(e4, r3) && (o3[r3] = e4[r3]);
        }
        return o3;
      }
      function wa(e4, t3) {
        var r3 = Object.keys(e4);
        if (Object.getOwnPropertySymbols) {
          var n3 = Object.getOwnPropertySymbols(e4);
          t3 && (n3 = n3.filter(function(t4) {
            return Object.getOwnPropertyDescriptor(e4, t4).enumerable;
          })), r3.push.apply(r3, n3);
        }
        return r3;
      }
      function ma(e4) {
        for (var t3 = 1; t3 < arguments.length; t3++) {
          var r3 = arguments[t3] != null ? arguments[t3] : {};
          t3 % 2 ? wa(Object(r3), true).forEach(function(t4) {
            ya(e4, t4, r3[t4]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r3)) : wa(Object(r3)).forEach(function(t4) {
            Object.defineProperty(e4, t4, Object.getOwnPropertyDescriptor(r3, t4));
          });
        }
        return e4;
      }
      function ya(e4, t3, r3) {
        return t3 in e4 ? Object.defineProperty(e4, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e4[t3] = r3, e4;
      }
      var ka = Ue("button", { target: "e1k3gr3t0" })(function(e4) {
        var t3 = e4.theme, r3 = e4.variant, n3 = e4.squareCorners;
        return ma(ma({ "&[type='button']": { appearance: "none", "-moz-appearance": "none", "-webkit-appearance": "none" }, border: 0, display: "inline-block", textTransform: "none", textDecoration: "none", borderRadius: t3.variables.size.borderRadius.button.m, fontFamily: t3.variables.fontFamily.lato, fontSize: t3.variables.size.font.button.m, lineHeight: t3.variables.size.lineHeight.button.m, fontWeight: t3.variables.weight.bold, padding: t3.variables.size.spacing.xxs, cursor: "pointer", "&[disabled], &:disabled": { opacity: t3.variables.opacity.button.disabled, pointerEvents: "none" }, backgroundColor: t3.values.color.background.button[r3].base, color: t3.values.color.text.button[r3].base, "&:hover": { backgroundColor: t3.values.color.background.button[r3].hover, color: t3.values.color.text.button[r3].hover }, "&:active": { backgroundColor: t3.values.color.background.button[r3].active, color: t3.values.color.text.button[r3].active } }, r3 === "secondary" && { border: "1px solid", borderColor: t3.values.color.border.button[r3].base, padding: parseInt(t3.variables.size.spacing.xxs, 10) - 1, "&:hover": { borderColor: t3.values.color.border.button[r3].hover }, "&:active": { borderColor: t3.values.color.border.button[r3].active } }), n3 && { borderRadius: "0" });
      }, ""), xa = { type: "button", variant: "tertiary", disabled: false, as: "button", squareCorners: false, "data-e2e-test-id": void 0 };
      function Ca(e4) {
        var t3 = e4.onClick, r3 = e4.onFocus, n3 = e4.onBlur, o3 = e4.type, a3 = e4.disabled, l3 = e4.as, s3 = e4.icon, c3 = e4["data-e2e-test-id"], d3 = ba(e4, va);
        return i2.a.createElement(ka, ga({ "data-e2e-test-id": c3, as: l3, disabled: a3, type: l3 === "a" ? void 0 : o3, onClick: function(e5) {
          a3 && e5.preventDefault(), t3 && t3(e5);
        }, onFocus: r3, onBlur: n3, "aria-label": s3 }, d3), i2.a.createElement(wt, { vAlignItems: "center", alignItems: "center", space: "xxs", noWrap: true }, s3 && i2.a.createElement(er, { size: "s", name: s3 })));
      }
      Ca.defaultProps = xa;
      var ja = Ue("div", { target: "e1l20w891" })(function(e4) {
        var t3 = e4.theme;
        return { display: "inline-flex", borderRadius: t3.variables.size.spacing.xxs, height: t3.variables.size.spacing.l, backgroundColor: t3.values.color.background.layer_1, color: t3.values.color.text.lightPrimary, overflow: "hidden", "> div": { width: "100%", "> div": { lineHeight: "normal" } } };
      }, ""), Oa = Ue("div", { target: "e1l20w890" })(function(e4) {
        var t3 = e4.theme;
        return { width: t3.variables.size.dimension.mediaViewerBar.separator.width, height: t3.variables.size.spacing.l, backgroundColor: t3.values.color.background.layer_2 };
      }, "");
      function Ma(e4) {
        var t3 = e4.children, r3 = e4.hasSeparator, n3 = e4["data-e2e-test-id"], o3 = Xe()(t3);
        return i2.a.createElement(pa, { name: "dimmed" }, i2.a.createElement(ja, { "data-e2e-test-id": n3 }, i2.a.createElement(wt, { space: "zero", vAlignItems: "center", alignItems: "center", noWrap: true }, i2.a.Children.map(o3, function(e5, t4) {
          return i2.a.createElement(i2.a.Fragment, null, r3 && t4 > 0 && i2.a.createElement(Oa, null), e5);
        }))));
      }
      var za = ["success", "warning", "alert"], Sa = function(e4, t3) {
        var r3 = function(e5) {
          return za.reduce(function(t4, r4) {
            return e5[r4] && e5[r4] > 0 ? t4 + e5[r4] : t4;
          }, 0);
        }(t3), n3 = e4 > r3 ? e4 : r3, o3 = {};
        return za.forEach(function(e5) {
          o3[e5] = t3[e5] && t3[e5] > 0 ? t3[e5] : 0;
        }), { sanitizedMaxValue: n3, sanitizedValues: o3 };
      }, Ea = { "data-e2e-test-id": void 0, weight: "fat", squareCorners: false, privateProps: { monochrome: false } }, Pa = function(e4, t3, r3) {
        switch (t3) {
          case "success":
            return r3 ? e4.values.color.segementedProgressBar.monochrome : e4.values.color.segementedProgressBar.success;
          case "warning":
            return r3 ? e4.values.color.segementedProgressBar.monochrome : e4.values.color.segementedProgressBar.warning;
          case "alert":
            return r3 ? e4.values.color.segementedProgressBar.monochrome : e4.values.color.segementedProgressBar.alert;
          case "inProgress":
          default:
            return e4.values.color.segementedProgressBar.inProgress;
        }
      }, Ha = Ue("div", { target: "e101pf3g1" })(function(e4) {
        var t3 = e4.theme, r3 = e4.squareCorners, n3 = e4.weight;
        return { width: "100%", display: "flex", flexDirection: "row", borderRadius: r3 ? 0 : t3.variables.size.borderRadius.progressBar, overflow: "hidden", height: n3 === "thin" ? t3.variables.size.spacing.xxs : t3.variables.size.spacing.xs };
      }, ""), Ba = Ue("div", { target: "e101pf3g0" })(function(e4) {
        var t3 = e4.theme, r3 = e4.styleVariant, n3 = e4.percentage, o3 = e4.monochrome;
        return { height: "100%", backgroundColor: Pa(t3, r3, o3), width: "".concat(n3, "%") };
      }, "");
      function Aa(e4) {
        var t3 = e4.maxValue, r3 = e4.values, n3 = e4.weight, o3 = e4.squareCorners, a3 = e4.privateProps.monochrome, l3 = e4["data-e2e-test-id"], s3 = Sa(t3, r3), c3 = function(e5, t4) {
          var r4 = za.map(function(r5) {
            var n5 = 100 * t4[r5] / e5;
            return n5 > 0 ? { percentage: n5, style: r5 } : null;
          }), n4 = r4.reduce(function(e6, t5) {
            return e6 + (t5 ? t5.percentage : 0);
          }, 0);
          return n4 < 100 && r4.push({ percentage: 100 - n4, style: "inProgress" }), r4.filter(Boolean);
        }(s3.sanitizedMaxValue, s3.sanitizedValues);
        return i2.a.createElement(Ha, { "data-e2e-test-id": l3, squareCorners: o3, weight: n3 }, c3.map(function(e5) {
          var t4 = e5.percentage, r4 = e5.style;
          return i2.a.createElement(Ba, { key: r4, "data-e2e-test-id": r4, styleVariant: r4, monochrome: a3, percentage: t4 });
        }));
      }
      Aa.defaultProps = Ea;
      var La = { "data-e2e-test-id": void 0, weight: "fat", squareCorners: false };
      function Ia(e4) {
        var t3 = e4.maxValue, r3 = e4.progress, n3 = e4.weight, o3 = e4.squareCorners, a3 = e4["data-e2e-test-id"];
        return i2.a.createElement(Aa, { maxValue: t3, values: { success: r3 }, weight: n3, squareCorners: o3, "data-e2e-test-id": a3, privateProps: { monochrome: true } });
      }
      Ia.defaultProps = La;
      var Za = function(e4, t3) {
        switch (t3 - 0) {
          case 1:
            return e4.variables.shadow.card.a;
          case 2:
            return e4.variables.shadow.card.b;
          case 3:
            return e4.variables.shadow.card.c;
          case 4:
            return e4.variables.shadow.card.d;
          case 0:
          default:
            return "";
        }
      }, Va = Ue("div", { target: "e1177hgu0" })(function(e4) {
        var t3 = e4.theme, r3 = e4.elevation;
        return { boxShadow: Za(t3, r3), borderRadius: t3.variables.size.borderRadius.card.m, backgroundColor: t3.values.color.background.layer_2 };
      }, "");
      function Ra(e4) {
        var t3 = e4.children, r3 = e4.elevation, n3 = r3 === void 0 ? 1 : r3, o3 = e4["data-e2e-test-id"];
        return i2.a.createElement(Va, { "data-e2e-test-id": o3, elevation: n3 }, t3);
      }
      var Ta = o2.dark, _a = o2.light;
    }]);
  });
})(build);
function loadFonts() {
  const lato700 = new FontFace("Lato", "/fonts/Lato.700.normal.woff2");
  document.fonts.add(lato700);
  const lato400 = new FontFace("Lato", "/fonts/Lato.400.normal.woff2");
  document.fonts.add(lato400);
}
var require$$0 = /* @__PURE__ */ getAugmentedNamespace(preact_module);
var jsxs$1;
var jsx$1;
var Fragment$1;
var r = require$$0, _ = 0;
function e(e2, o2, n2, t2, l2) {
  var u2, f2, i2 = {};
  for (f2 in o2)
    f2 == "ref" ? u2 = o2[f2] : i2[f2] = o2[f2];
  var p2 = { type: e2, props: i2, key: n2, ref: u2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: --_, __source: t2, __self: l2 };
  if (typeof e2 == "function" && (u2 = e2.defaultProps))
    for (f2 in u2)
      i2[f2] === void 0 && (i2[f2] = u2[f2]);
  return r.options.vnode && r.options.vnode(p2), p2;
}
Fragment$1 = r.Fragment, jsx$1 = e, jsxs$1 = e;
const jsx = jsx$1;
const jsxs = jsxs$1;
const Fragment = Fragment$1;
function TooltipLogo({
  theme = "light-theme"
}) {
  const logoColour = theme === "light-theme" ? "#24A3AA" : "#24A3AA";
  const textColour = theme === "light-theme" ? "#000105" : "#fff";
  return jsxs("svg", {
    width: "80",
    viewBox: "0 0 102 17",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [jsx("mask", {
      id: "mask0",
      maskUnits: "userSpaceOnUse",
      x: "0",
      y: "0",
      width: "16",
      height: "17",
      children: jsx("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M0 0.87207H15.0659V16.6997H0V0.87207Z",
        fill: "white"
      })
    }), jsx("g", {
      mask: "url(#mask0)",
      children: jsx("path", {
        fill: logoColour,
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12.0472 15.6584H3.01465L3.58547 14.6171H11.4764L12.0472 15.6584ZM8.72977 5.2334L13.3032 13.5758H12.0977L8.72315 7.42013L8.12696 8.50715L10.9056 13.5758H4.15637L8.72977 5.2334ZM15.0661 14.6171L8.72311 3.04666L8.13375 4.1461L2.9643 13.5758H1.7589L8.127 1.95923L7.53101 0.87207L-0.00402832 14.6171H2.39348L1.25183 16.6997H13.8103L12.6685 14.6171H15.0661Z"
      })
    }), jsx("path", {
      fill: textColour,
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M23.7406 10.9808H30.5153L27.4271 3.55892C27.3772 3.44132 27.3273 3.30815 27.2775 3.15928C27.2276 3.01054 27.1777 2.85306 27.1279 2.68698C27.078 2.85306 27.0281 3.01054 26.9783 3.15928C26.9284 3.30815 26.8785 3.44474 26.8287 3.5693L23.7406 10.9808ZM33.8599 16.3162H33.0157C32.9159 16.3162 32.834 16.2902 32.7699 16.2383C32.7058 16.1864 32.6559 16.1189 32.6203 16.0359L30.8358 11.7696H23.4092L21.6354 16.0359C21.6069 16.1122 21.557 16.1779 21.4858 16.2331C21.4145 16.2887 21.329 16.3162 21.2294 16.3162H20.3959L26.5829 1.62817H27.6728L33.8599 16.3162Z"
    }), jsx("path", {
      fill: textColour,
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M43.3173 12.6623C43.3594 12.5517 43.403 12.4427 43.4487 12.3354C43.4941 12.2281 43.5448 12.1261 43.601 12.0291L49.4426 1.8254C49.4986 1.73553 49.5546 1.68007 49.6107 1.65931C49.6667 1.63855 49.7437 1.62817 49.8418 1.62817H50.5878V16.3162H49.6422V3.79764C49.6422 3.61776 49.6527 3.4275 49.6737 3.22673L43.8216 13.4928C43.7234 13.6728 43.5834 13.7626 43.4014 13.7626H43.2332C43.0581 13.7626 42.9181 13.6728 42.8129 13.4928L36.8033 3.21635C36.8243 3.41712 36.8349 3.61079 36.8349 3.79764V16.3162H35.8998V1.62817H36.6352C36.7332 1.62817 36.812 1.63855 36.8716 1.65931C36.9311 1.68007 36.9889 1.73553 37.045 1.8254L43.0442 12.0395C43.1492 12.2333 43.2402 12.4409 43.3173 12.6623Z"
    }), jsx("path", {
      fill: textColour,
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M55.3269 9.27838V15.465H59.0408C60.3449 15.465 61.3283 15.1865 61.9909 14.6294C62.6535 14.0724 62.9847 13.2887 62.9847 12.2783C62.9847 11.8147 62.8958 11.3977 62.718 11.0274C62.5401 10.6574 62.2838 10.3424 61.9491 10.0828C61.6144 9.82334 61.2028 9.62455 60.7147 9.48599C60.2264 9.34763 59.6719 9.27838 59.0513 9.27838H55.3269ZM55.3269 8.4999H58.5386C59.222 8.4999 59.8061 8.41344 60.2909 8.24039C60.7756 8.06748 61.1732 7.83911 61.4836 7.5553C61.7938 7.27162 62.0224 6.94983 62.1687 6.58994C62.3153 6.23018 62.3885 5.85991 62.3885 5.47926C62.3885 4.48972 62.0727 3.74057 61.4416 3.23194C60.8103 2.72331 59.8358 2.46899 58.5177 2.46899H55.3269V8.4999ZM54.2599 16.3162V1.62817H58.5177C59.3615 1.62817 60.0921 1.71122 60.7094 1.8773C61.3265 2.04338 61.8373 2.28732 62.242 2.6091C62.6463 2.93089 62.9481 3.3237 63.147 3.78726C63.3456 4.25095 63.4451 4.77693 63.4451 5.36505C63.4451 5.75267 63.377 6.12636 63.241 6.48611C63.105 6.84601 62.9079 7.17817 62.65 7.48261C62.3919 7.78719 62.0762 8.05189 61.7032 8.2767C61.33 8.50165 60.903 8.67292 60.4217 8.79052C61.5864 8.96357 62.4826 9.34764 63.1102 9.94272C63.738 10.538 64.0519 11.3233 64.0519 12.299C64.0519 12.9218 63.9402 13.4824 63.717 13.9806C63.4938 14.4789 63.1695 14.9011 62.7442 15.247C62.3186 15.5931 61.7956 15.8578 61.1749 16.0411C60.5542 16.2245 59.8497 16.3162 59.0617 16.3162H54.2599Z"
    }), jsx("mask", {
      id: "mask1",
      maskUnits: "userSpaceOnUse",
      x: "66",
      y: "1",
      width: "36",
      height: "16",
      children: jsx("path", {
        fill: "white",
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M66.1226 1.63208H101.959V16.7201H66.1226V1.63208Z"
      })
    }), jsxs("g", {
      mask: "url(#mask1)",
      children: [jsx("path", {
        fill: textColour,
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M79.2436 9.17295C79.2436 8.14396 79.0992 7.21912 78.811 6.39858C78.5221 5.57818 78.1158 4.88281 77.5915 4.31259C77.0671 3.74251 76.4359 3.3061 75.6963 3.00363C74.958 2.70116 74.1379 2.54993 73.2372 2.54993C72.3503 2.54993 71.5392 2.70116 70.8037 3.00363C70.0683 3.3061 69.4351 3.74251 68.9039 4.31259C68.3725 4.88281 67.9609 5.57818 67.6688 6.39858C67.3768 7.21912 67.2308 8.14396 67.2308 9.17295C67.2308 10.2091 67.3768 11.1356 67.6688 11.9525C67.9609 12.7696 68.3725 13.4632 68.9039 14.0333C69.4351 14.6035 70.0683 15.0382 70.8037 15.3371C71.5392 15.6361 72.3503 15.7856 73.2372 15.7856C74.1379 15.7856 74.958 15.6361 75.6963 15.3371C76.4359 15.0382 77.0671 14.6035 77.5915 14.0333C78.1158 13.4632 78.5221 12.7696 78.811 11.9525C79.0992 11.1356 79.2436 10.2091 79.2436 9.17295ZM80.3626 9.17294C80.3626 10.3134 80.1903 11.3476 79.8452 12.2758C79.5007 13.2041 79.0146 13.9968 78.3889 14.6539C77.7618 15.311 77.0124 15.8186 76.1402 16.1767C75.2672 16.5349 74.2999 16.7138 73.2373 16.7138C72.1887 16.7138 71.2282 16.5349 70.3553 16.1767C69.4829 15.8186 68.7333 15.311 68.1071 14.6539C67.4807 13.9968 66.9935 13.2041 66.6451 12.2758C66.2967 11.3476 66.1226 10.3134 66.1226 9.17294C66.1226 8.03965 66.2967 7.00873 66.6451 6.08046C66.9935 5.15219 67.4807 4.35952 68.1071 3.70243C68.7333 3.04534 69.4829 2.53606 70.3553 2.17444C71.2282 1.81296 72.1887 1.63208 73.2373 1.63208C74.2999 1.63208 75.2672 1.81117 76.1402 2.16922C77.0124 2.52741 77.7618 3.03669 78.3889 3.69721C79.0146 4.35787 79.5007 5.15219 79.8452 6.08046C80.1903 7.00873 80.3626 8.03965 80.3626 9.17294Z"
      }), jsx("path", {
        fill: textColour,
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M90.0524 3.59291C89.9892 3.71121 89.8975 3.77022 89.7781 3.77022C89.6864 3.77022 89.5677 3.706 89.4232 3.57727C89.2788 3.44868 89.0822 3.30609 88.8357 3.14964C88.5885 2.99319 88.2794 2.84895 87.9086 2.7168C87.5384 2.58477 87.0815 2.51863 86.5377 2.51863C85.9939 2.51863 85.5154 2.5952 85.1029 2.74809C84.6897 2.9011 84.3439 3.1097 84.0647 3.37388C83.7855 3.6382 83.5737 3.9441 83.4293 4.29172C83.2848 4.63948 83.2126 5.00453 83.2126 5.38687C83.2126 5.88751 83.3195 6.30127 83.5348 6.62803C83.7494 6.95493 84.0335 7.23297 84.3855 7.46243C84.7376 7.69189 85.1377 7.88484 85.5856 8.04129C86.0328 8.19774 86.4926 8.35254 86.9648 8.50543C87.437 8.65844 87.8968 8.82718 88.344 9.01128C88.7919 9.19559 89.192 9.42683 89.5441 9.70487C89.8962 9.98305 90.1802 10.3255 90.3948 10.7322C90.6101 11.139 90.7177 11.6448 90.7177 12.2498C90.7177 12.8687 90.6101 13.451 90.3955 13.9968C90.1809 14.5428 89.8691 15.0174 89.4614 15.4205C89.0531 15.8238 88.5537 16.1419 87.9628 16.3748C87.3711 16.6077 86.696 16.7242 85.9356 16.7242C84.9501 16.7242 84.1022 16.5521 83.3918 16.208C82.6806 15.8638 82.0584 15.3928 81.5229 14.7946L81.8188 14.3358C81.9035 14.2314 82.0021 14.1793 82.1146 14.1793C82.1778 14.1793 82.2591 14.221 82.3577 14.3045C82.4563 14.3879 82.5758 14.4906 82.7167 14.6122C82.8577 14.7339 83.0272 14.8661 83.2244 15.0085C83.4216 15.1511 83.6508 15.2833 83.9112 15.4048C84.1723 15.5266 84.4717 15.6291 84.8099 15.7125C85.1481 15.796 85.5321 15.8377 85.962 15.8377C86.5544 15.8377 87.0829 15.749 87.5475 15.5717C88.0128 15.3944 88.4058 15.1529 88.7267 14.8468C89.0468 14.5409 89.292 14.1777 89.4614 13.7569C89.6302 13.3364 89.7149 12.886 89.7149 12.4062C89.7149 11.8847 89.6073 11.4555 89.3927 11.1181C89.1774 10.7809 88.8933 10.4993 88.5412 10.2733C88.1891 10.0474 87.7891 9.85789 87.3412 9.70487C86.894 9.55199 86.4342 9.40233 85.962 9.25638C85.4898 9.11036 85.03 8.94705 84.5828 8.76617C84.1348 8.58543 83.7348 8.35419 83.3827 8.07258C83.0306 7.79097 82.7466 7.43992 82.532 7.01916C82.3167 6.59853 82.2098 6.07181 82.2098 5.43902C82.2098 4.94538 82.3042 4.46903 82.4952 4.01011C82.6855 3.55119 82.9633 3.14621 83.33 2.79502C83.6966 2.44397 84.1494 2.16236 84.6883 1.95019C85.2272 1.73816 85.8418 1.63208 86.5328 1.63208C87.3079 1.63208 88.0037 1.75381 88.6204 1.99713C89.2371 2.24059 89.7989 2.6125 90.3059 3.11313L90.0524 3.59291Z"
      }), jsx("path", {
        fill: textColour,
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M101.294 3.59291C101.231 3.71121 101.14 3.77022 101.02 3.77022C100.928 3.77022 100.81 3.706 100.665 3.57727C100.52 3.44868 100.324 3.30609 100.077 3.14964C99.8305 2.99319 99.5215 2.84895 99.1506 2.7168C98.7805 2.58477 98.3228 2.51863 97.7791 2.51863C97.236 2.51863 96.7575 2.5952 96.3443 2.74809C95.9318 2.9011 95.5852 3.1097 95.3068 3.37388C95.0276 3.6382 94.8158 3.9441 94.6713 4.29172C94.5262 4.63948 94.454 5.00453 94.454 5.38687C94.454 5.88751 94.5616 6.30127 94.7762 6.62803C94.9915 6.95493 95.2748 7.23297 95.6276 7.46243C95.9797 7.69189 96.3797 7.88484 96.827 8.04129C97.2749 8.19774 97.7346 8.35254 98.2069 8.50543C98.6791 8.65844 99.1388 8.82718 99.5861 9.01128C100.033 9.19559 100.433 9.42683 100.786 9.70487C101.138 9.98305 101.422 10.3255 101.637 10.7322C101.852 11.139 101.959 11.6448 101.959 12.2498C101.959 12.8687 101.852 13.451 101.638 13.9968C101.423 14.5428 101.111 15.0174 100.703 15.4205C100.295 15.8238 99.7951 16.1419 99.2041 16.3748C98.6131 16.6077 97.9374 16.7242 97.1777 16.7242C96.1922 16.7242 95.3443 16.5521 94.6338 16.208C93.9227 15.8638 93.2998 15.3928 92.765 14.7946L93.0609 14.3358C93.1449 14.2314 93.2435 14.1793 93.3567 14.1793C93.4199 14.1793 93.5012 14.221 93.5998 14.3045C93.6984 14.3879 93.8178 14.4906 93.9588 14.6122C94.0998 14.7339 94.2692 14.8661 94.4665 15.0085C94.6637 15.1511 94.8922 15.2833 95.1533 15.4048C95.4137 15.5266 95.713 15.6291 96.0519 15.7125C96.3901 15.796 96.7742 15.8377 97.2041 15.8377C97.7957 15.8377 98.3242 15.749 98.7895 15.5717C99.2548 15.3944 99.6479 15.1529 99.968 14.8468C100.289 14.5409 100.534 14.1777 100.703 13.7569C100.872 13.3364 100.956 12.886 100.956 12.4062C100.956 11.8847 100.849 11.4555 100.634 11.1181C100.419 10.7809 100.135 10.4993 99.7833 10.2733C99.4305 10.0474 99.0305 9.85789 98.5833 9.70487C98.136 9.55199 97.6763 9.40233 97.2041 9.25638C96.7318 9.11036 96.2721 8.94705 95.8241 8.76617C95.3769 8.58543 94.9769 8.35419 94.6248 8.07258C94.272 7.79097 93.9887 7.43992 93.7734 7.01916C93.5588 6.59853 93.4511 6.07181 93.4511 5.43902C93.4511 4.94538 93.5463 4.46903 93.7366 4.01011C93.9269 3.55119 94.2053 3.14621 94.572 2.79502C94.938 2.44397 95.3908 2.16236 95.9304 1.95019C96.4693 1.73816 97.0839 1.63208 97.7749 1.63208C98.5499 1.63208 99.2458 1.75381 99.8625 1.99713C100.479 2.24059 101.041 2.6125 101.548 3.11313L101.294 3.59291Z"
      })]
    })]
  });
}
const FEEDBACK_URL_DE = "https://go.amboss.com/browser-plugin-feedback-de";
const FEEDBACK_URL_EN = "https://go.amboss.com/browser-plugin-feedback-en";
const link_clicked = "amboss_content-card_link_clicked";
var styles$1 = ':host-context(amboss-content-card) {\n  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12), 0 32px 112px rgba(0, 0, 0, 0.24);\n  border-radius: 12px;\n  color: initial;\n  visibility: hidden;\n  pointer-events: none;\n  height: 0;\n}\n\n:host-context(amboss-content-card[show-popper]) {\n  visibility: visible;\n  pointer-events: auto;\n  z-index: 9999;\n  max-width: 400px;\n  height: auto;\n}\n\n\n:host-context(amboss-content-card) #content * {\n  height: 0;\n}\n\n:host-context(amboss-content-card[show-popper]) #content * {\n  height: auto;\n}\n\n@keyframes c3 {\n  to {\n    stroke-dashoffset: 136;\n  }\n}\n:host-context(amboss-content-card[show-popper]) .amboss-animated-logo-inner {\n  stroke: rgb(13, 191, 143);\n  animation: 2s linear 0s infinite normal none running c3;\n  stroke-dasharray: 17;\n}\n\n:host-context(amboss-content-card[show-popper]) > #amboss-content-card-arrow::before {\n  content: "";\n  visibility: visible;\n  transform: rotate(45deg);\n  position: absolute;\n  width: 10px;\n  height: 10px;\n  background-color: #fff;\n}\n\n:host-context(amboss-content-card[show-popper]) > #amboss-content-card-arrow.dark-theme::before {\n  background-color: #24282d;\n}\n\n:host-context(amboss-content-card[data-popper-placement^="top"]) > #amboss-content-card-arrow {\n  bottom: 5px;\n}\n\n:host-context(amboss-content-card[data-popper-placement^="bottom"]) > #amboss-content-card-arrow {\n  top: -5px;\n}\n\n:host-context(amboss-content-card[show-popper]) > #amboss-content-card-arrow > #buffer::before {\n  content: "";\n  position: absolute;\n  background-color: transparent;\n}\n\n:host-context(amboss-content-card[data-popper-placement^="bottom"]) > #amboss-content-card-arrow > #buffer::before,\n:host-context(amboss-content-card[data-popper-placement^="top"]) > #amboss-content-card-arrow > #buffer::before {\n  width: 240px;\n  height: 1.5rem;\n  margin-left: -120px;\n  margin-top: -0.5rem;\n}\n\n:host-context(amboss-content-card[data-popper-placement^="top"]) > #amboss-content-card-arrow > #buffer::before {\n  margin-top: -0.5rem;\n}\n';
const LoadingCard = ({
  theme
}) => {
  return jsx("div", {
    id: "content",
    className: theme,
    children: jsx(build.exports.Card, {
      children: jsx(build.exports.CardBox, {
        children: jsx(build.exports.Stack, {
          space: "xs",
          children: jsx("svg", {
            id: "triangle",
            width: "100",
            height: "100",
            viewBox: "-3 -4 39 39",
            children: jsx("polygon", {
              fill: "transparent",
              "stroke-width": "1",
              points: "16,0 32,32 0,32",
              className: "amboss-animated-logo-inner"
            })
          })
        })
      })
    })
  });
};
const ContentCard = ({
  data,
  showDestinations,
  contentId,
  locale,
  theme,
  customBranding,
  track: track2
}) => {
  const {
    title,
    subtitle = "",
    body,
    destinations = [],
    media = []
  } = data || {};
  if (!contentId || !title)
    return jsx("div", {});
  return jsx("div", {
    id: "content",
    className: theme,
    children: jsxs(build.exports.Card, {
      children: [jsxs(build.exports.CardBox, {
        children: [jsx(build.exports.H5, {
          children: title
        }), jsx(build.exports.Text, {
          variant: "tertiary",
          size: "s",
          children: subtitle
        })]
      }), jsx(build.exports.Divider, {}), jsx(build.exports.CardBox, {
        children: jsxs(build.exports.Stack, {
          space: "xs",
          children: [body ? jsx(build.exports.Text, {
            size: "s",
            children: body
          }) : "", showDestinations && destinations.length > 0 ? jsx(build.exports.Stack, {
            space: "xs",
            children: destinations.map(({
              label,
              href
            }) => {
              function handleLinkClick(e2) {
                track2([link_clicked, {
                  content_id: contentId,
                  label
                }]);
              }
              return jsxs(build.exports.Inline, {
                space: "s",
                noWrap: true,
                vAlignItems: "center",
                children: [jsx(build.exports.Icon, {
                  name: "article",
                  variant: "primary"
                }), jsx(build.exports.Link, {
                  href,
                  variant: "primary",
                  size: "m",
                  onClick: handleLinkClick,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: label
                })]
              }, label);
            })
          }) : ""]
        })
      }), customBranding !== "yes" ? jsxs(Fragment, {
        children: [jsx(build.exports.Divider, {}), jsx(build.exports.CardBox, {
          children: jsxs(build.exports.Inline, {
            vAlignItems: "center",
            alignItems: "spaceBetween",
            children: [jsx(TooltipLogo, {
              theme: window.annotationOptions.theme
            }), jsx(build.exports.Link, {
              size: "s",
              variant: "tertiary",
              href: locale === "de" ? FEEDBACK_URL_DE : FEEDBACK_URL_EN,
              target: "_blank",
              rel: "noopener noreferrer",
              children: locale === "de" ? "Feedback senden" : "Send feedback"
            })]
          })
        })]
      }) : ""]
    }, title)
  });
};
const Wrapper = ({
  emotionCache,
  theme,
  themeName,
  children
}) => jsx(build.exports.ThemeProvider, {
  theme,
  children: jsxs(build.exports.CacheProvider, {
    value: emotionCache,
    children: [jsx("div", {
      id: "amboss-content-card-arrow",
      className: themeName,
      "data-popper-arrow": true,
      children: jsx("div", {
        id: "buffer"
      })
    }), children]
  })
});
class AmbossContentCard extends HTMLElement {
  static get observedAttributes() {
    return ["data-content-id"];
  }
  get contentId() {
    return this.getAttribute("data-content-id");
  }
  constructor() {
    super();
    this.attachShadow({
      mode: "open"
    });
    this.emotionCache = build.exports.createCache({
      container: this.shadowRoot
    });
    const styleEl = document.createElement("style");
    styleEl.innerText = styles$1.replaceAll(/\n/g, "");
    this.shadowRoot.appendChild(styleEl);
    loadFonts();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue)
      this.render();
  }
  render() {
    if (!window.annotationOptions || !window.annotationAdaptor)
      return void 0;
    if (typeof window.annotationAdaptor.getTooltipContent !== "function")
      return void 0;
    if (window.annotationOptions.locale !== "us" && window.annotationOptions.locale !== "de")
      return void 0;
    if (!this.contentId) {
      S$1(jsx(Wrapper, {
        emotionCache: this.emotionCache,
        theme: window.annotationOptions.theme === "dark-theme" ? build.exports.dark : build.exports.light,
        themeName: window.annotationOptions.theme,
        children: jsx("div", {})
      }), this.shadowRoot);
      return void 0;
    }
    S$1(jsx(Wrapper, {
      emotionCache: this.emotionCache,
      theme: window.annotationOptions.theme === "dark-theme" ? build.exports.dark : build.exports.light,
      themeName: window.annotationOptions.theme,
      children: jsx(LoadingCard, {
        theme: window.annotationOptions.theme
      })
    }), this.shadowRoot);
    window.annotationAdaptor.getTooltipContent(this.contentId).then((_data) => {
      const data = _data || {
        title: "Something went wrong while fetching this card."
      };
      S$1(jsx(Wrapper, {
        emotionCache: this.emotionCache,
        theme: window.annotationOptions.theme === "dark-theme" ? build.exports.dark : build.exports.light,
        themeName: window.annotationOptions.theme,
        children: jsx(ContentCard, {
          data,
          contentId: this.contentId,
          showDestinations: window.annotationOptions.withLinks !== "no",
          locale: window.annotationOptions.locale,
          theme: window.annotationOptions.theme,
          campaign: window.annotationOptions.campaign,
          customBranding: window.annotationOptions.customBranding,
          track: window.annotationAdaptor.track
        })
      }), this.shadowRoot);
    });
  }
}
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}
function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function(name2) {
      var value = attributes[name2];
      if (value === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles$1 = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect: effect$2,
  requires: ["computeStyles"]
};
function getBasePlacement(placement) {
  return placement.split("-")[0];
}
var max = Math.max;
var min = Math.min;
var round = Math.round;
function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (isHTMLElement(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth;
    if (offsetWidth > 0) {
      scaleX = round(rect.width) / offsetWidth || 1;
    }
    if (offsetHeight > 0) {
      scaleY = round(rect.height) / offsetHeight || 1;
    }
  }
  return {
    width: rect.width / scaleX,
    height: rect.height / scaleY,
    top: rect.top / scaleY,
    right: rect.right / scaleX,
    bottom: rect.bottom / scaleY,
    left: rect.left / scaleX,
    x: rect.left / scaleX,
    y: rect.top / scaleY
  };
}
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  };
}
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}
function getDocumentElement(element) {
  return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
}
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
}
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || getComputedStyle(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1;
  var isIE = navigator.userAgent.indexOf("Trident") !== -1;
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}
function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
function withinMaxClamp(min2, value, max2) {
  var v2 = within(min2, value, max2);
  return v2 > max2 ? max2 : v2;
}
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}
function expandToHashMap(value, keys) {
  return keys.reduce(function(hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}
var toPaddingObject = function toPaddingObject2(padding, state) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state, name = _ref.name, options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center, max2);
  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
function effect$1(_ref2) {
  var state = _ref2.state, options = _ref2.options;
  var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }
  state.elements.arrow = arrowElement;
}
var arrow$1 = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect$1,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function getVariation(placement) {
  return placement.split("-")[1];
}
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref) {
  var x2 = _ref.x, y2 = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x2 * dpr) / dpr || 0,
    y: round(y2 * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x, x2 = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y2 = _offsets$y === void 0 ? 0 : _offsets$y;
  var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
    x: x2,
    y: y2
  }) : {
    x: x2,
    y: y2
  };
  x2 = _ref3.x;
  y2 = _ref3.y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
      y2 -= offsetY - popperRect.height;
      y2 *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
      x2 -= offsetX - popperRect.width;
      x2 *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x2,
    y: y2
  }) : {
    x: x2,
    y: y2
  };
  x2 = _ref4.x;
  y2 = _ref4.y;
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x2 + "px, " + y2 + "px)" : "translate3d(" + x2 + "px, " + y2 + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y2 + "px" : "", _Object$assign2[sideX] = hasX ? x2 + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
  var state = _ref5.state, options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === "fixed"
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
var computeStyles$1 = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};
var passive = {
  passive: true
};
function effect(_ref) {
  var state = _ref.state, instance = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
var eventListeners = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn2() {
  },
  effect,
  data: {}
};
var hash$1 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash$1[matched];
  });
}
var hash = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash[matched];
  });
}
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
function getViewportRect(element) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x2 = 0;
  var y2 = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x2 = visualViewport.offsetLeft;
      y2 = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x2 + getWindowScrollBarX(element),
    y: y2
  };
}
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x2 = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y2 = -winScroll.scrollTop;
  if (getComputedStyle(body || html).direction === "rtl") {
    x2 += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x: x2,
    y: y2
  };
}
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
}
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}
function getInnerBoundingClientRect(element) {
  var rect = getBoundingClientRect(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
    }
  }
  return offsets;
}
function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a2, b2) {
    return overflows[a2] - overflows[b2];
  });
}
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  if (state.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i2 = 0; i2 < placements2.length; i2++) {
    var placement = placements2[i2];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break")
        break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}
var flip$1 = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state = _ref.state, name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
var hide$1 = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state = _ref2.state, options = _ref2.options, name = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement], x2 = _data$state$placement.x, y2 = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x2;
    state.modifiersData.popperOffsets.y += y2;
  }
  state.modifiersData[name] = data;
}
var offset$1 = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};
function popperOffsets(_ref) {
  var state = _ref.state, name = _ref.name;
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
var popperOffsets$1 = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function preventOverflow(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min$1 = offset2 + overflow[mainSide];
    var max$1 = offset2 - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset2 + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max(max$1, tetherMax) : max$1);
    popperOffsets2[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset2;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === "x" ? top : left;
    var _altSide = mainAxis === "x" ? bottom : right;
    var _offset = popperOffsets2[altAxis];
    var _len = altAxis === "y" ? "height" : "width";
    var _min = _offset + overflow[_mainSide];
    var _max = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    popperOffsets2[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }
  state.modifiersData[name] = data;
}
var preventOverflow$1 = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}
function debounce(fn3) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve(fn3());
        });
      });
    }
    return pending;
  };
}
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper2(reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state,
      setOptions: function setOptions(setOptionsAction) {
        var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options2);
        state.scrollParents = {
          reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m2) {
          return m2.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index], fn3 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn3 === "function") {
            state = fn3({
              state,
              options: _options,
              name,
              instance
            }) || state;
          }
        }
      },
      update: debounce(function() {
        return new Promise(function(resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      return instance;
    }
    instance.setOptions(options).then(function(state2) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref3) {
        var name = _ref3.name, _ref3$options = _ref3.options, options2 = _ref3$options === void 0 ? {} : _ref3$options, effect2 = _ref3.effect;
        if (typeof effect2 === "function") {
          var cleanupFn = effect2({
            state,
            name,
            instance,
            options: options2
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn3) {
        return fn3();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}
var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /* @__PURE__ */ popperGenerator({
  defaultModifiers
});
const tooltip_anchor_hovered = "amboss_tooltip_opened";
var styles = `:host-context(amboss-anchor) {
  /* dont do overrides here as we want top keep the styling from the page!!!*/
  /*color: initial;*/
}
:host-context([data-annotation-variant="underline"]) > span {
  border-bottom: solid 2px #0aa6b8;
}

:host-context([data-annotation-variant="logo"]) > span::after {
  /*content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAMJWlDQ1BJQ0MgUHJvZmlsZQAASImVlwdYU8kWgOeWJCQktEAoUkJvgvQqNbQIAlIFGyEJJJQYEoKKHVlUYC2oWLCiqyK2tQCy2LBgYRHs/WFBRVkXCzZU3iQBdPV7731v8s3cP2fOnDnn3LnzzQCgHssRi3NQDQByRfmSuPBg5viUVCbpIUAUPwA0OVypOCg2NgoyGHr+s7y7rtAEVxzktn7u/69Fk8eXcgFAYiGn86TcXMiHAMA9uGJJPgCEHig3n5YvhkyEXgJtCXQQsoWcM5XsJed0JUcpdBLiWJDTAFChcjiSTADU5H4xC7iZ0I5aOWQnEU8ogtwE2Z8r4PAgf4Y8Mjd3KmR1G8g26d/ZyfyHzfRhmxxO5jArY1EUlRChVJzDmfF/puN/l9wc2dAc5rBSBZKIOHnM8rxlT42UMxXyOVF6dAxkLchXhTyFvpyfCGQRiYP6H7hSFswZYACAUnmckEjIhpDNRDnRUYNy/wxhGBsyzD2aIMxnJyjHojzJ1LhB++h0vjQ0fog5EsVccp1SWXZi0KDNjQI+e8hmY6EgIVnpJ9peIEyKhqwG+a40Oz5yUOd5oYAVPaQjkcXJfYbvHAMZkrA4pQ5mkSsdigvzEQjZ0YMclS9IiFCOxSZzOQrf9CBn8aXjo4b85PFDQpVxYUV8UeKg/1iFOD84blB/mzgndlAfa+LnhMvlZpDbpAXxQ2N78+FiU8aLA3F+bILSN1w7izMmVukDbgeiAAuEACaQwZoOpoIsIGzrqe+B/5Q9YYADJCAT8IHDoGRoRLKiRwTbeFAI/oLEB9LhccGKXj4ogPIvw1Jl6wAyFL0FihHZ4AnkXBAJcuB/mWKUaHi2JPAYSoQ/zc6FvubAKu/7ScZUH5IRQ4khxAhiGNEWN8D9cV88CraBsLrgXrj3kF/f9AlPCB2Eh4RrhE7CrSnCIskPnjPBWNAJfQwbjC79++hwK2jVHQ/G/aB9aBtn4AbAAXeDMwXhAXBudyj93lfZcMTfcjloi+xERsm65ECyzY8eqNmpuQ9bkWfq+1wo/UofzhZruOfHOFjf5Y8Hn5E/amKLsINYC3YSO481YfWAiR3HGrBW7Kich9fGY8XaGJotTuFPNrQj/Gk+zuCc8qxJnWqdup0+D/aBfP70fPnHwpoqniERZgrymUFwt+Yz2SKu40imi5Mz3EXle79ya3nDUOzpCOPCN1neCQC8S6Ew85uMA/egI08AoL/7JjN/DZf9MgCOtnNlkgKlDJc3BEAB6vBL0QfGcO+ygRG5AA/gCwJBKBgDYkACSAGTYZ4FcJ1KwDQwC8wHJaAMLAOrwDqwCWwFO8EecADUgyZwEpwFF0E7uAbuwLXSBV6AXvAO9CMIQkJoCB3RR0wQS8QecUG8EH8kFIlC4pAUJA3JRESIDJmFLEDKkApkHbIFqUF+R44gJ5HzSAdyC3mAdCOvkU8ohlJRbdQItUJHoV5oEBqJJqCT0Ew0Dy1Ei9El6Bq0Gt2N1qEn0YvoNbQTfYH2YQBTxRiYKeaAeWEsLAZLxTIwCTYHK8UqsWpsL9YI3/QVrBPrwT7iRJyOM3EHuF4j8ESci+fhc/ByfB2+E6/DT+NX8Ad4L/6VQCMYEuwJPgQ2YTwhkzCNUEKoJGwnHCacgd9OF+EdkUhkEK2JnvDbSyFmEWcSy4kbiPuIJ4gdxEfEPhKJpE+yJ/mRYkgcUj6phLSWtJt0nHSZ1EX6oKKqYqLiohKmkqoiUilSqVTZpXJM5bLKU5V+sgbZkuxDjiHzyDPIS8nbyI3kS+Qucj9Fk2JN8aMkULIo8ylrKHspZyh3KW9UVVXNVL1Vx6kKVeeprlHdr3pO9YHqR6oW1Y7Kok6kyqhLqDuoJ6i3qG9oNJoVLZCWSsunLaHV0E7R7tM+qNHVHNXYajy1uWpVanVql9VeqpPVLdWD1CerF6pXqh9Uv6Teo0HWsNJgaXA05mhUaRzRuKHRp0nXdNaM0czVLNfcpXle85kWSctKK1SLp1WstVXrlNYjOkY3p7PoXPoC+jb6GXqXNlHbWputnaVdpr1Hu027V0dLx00nSWe6TpXOUZ1OBsawYrAZOYyljAOM64xPuka6Qbp83cW6e3Uv677XG6EXqMfXK9Xbp3dN75M+Uz9UP1t/uX69/j0D3MDOYJzBNIONBmcMekZoj/AdwR1ROuLAiNuGqKGdYZzhTMOthq2GfUbGRuFGYqO1RqeMeowZxoHGWcYrjY8Zd5vQTfxNhCYrTY6bPGfqMIOYOcw1zNPMXlND0whTmekW0zbTfjNrs0SzIrN9ZvfMKeZe5hnmK82bzXstTCzGWsyyqLW4bUm29LIUWK62bLF8b2VtlWy10Kre6pm1njXbutC61vquDc0mwCbPptrmqi3R1ss223aDbbsdauduJ7Crsrtkj9p72AvtN9h3jCSM9B4pGlk98oYD1SHIocCh1uGBI8MxyrHIsd7x5SiLUamjlo9qGfXVyd0px2mb0x1nLecxzkXOjc6vXexcuC5VLlddaa5hrnNdG1xfudm78d02ut10p7uPdV/o3uz+xcPTQ+Kx16Pb08IzzXO95w0vba9Yr3Kvc94E72Dvud5N3h99PHzyfQ74/O3r4Jvtu8v32Wjr0fzR20Y/8jPz4/ht8ev0Z/qn+W/27wwwDeAEVAc8DDQP5AVuD3waZBuUFbQ76GWwU7Ak+HDwe5YPazbrRAgWEh5SGtIWqhWaGLou9H6YWVhmWG1Yb7h7+MzwExGEiMiI5RE32EZsLruG3TvGc8zsMacjqZHxkesiH0bZRUmiGseiY8eMXTH2brRltCi6PgbEsGNWxNyLtY7Ni/1jHHFc7LiqcU/inONmxbXE0+OnxO+Kf5cQnLA04U6iTaIssTlJPWliUk3S++SQ5IrkzvGjxs8efzHFIEWY0pBKSk1K3Z7aNyF0wqoJXRPdJ5ZMvD7JetL0SecnG0zOmXx0ivoUzpSDaYS05LRdaZ85MZxqTl86O319ei+XxV3NfcEL5K3kdfP9+BX8pxl+GRUZzzL9MldkdgsCBJWCHiFLuE74Kisia1PW++yY7B3ZAznJOftyVXLTco+ItETZotNTjadOn9ohtheXiDvzfPJW5fVKIiXbpYh0krQhXxsesltlNrJfZA8K/AuqCj5MS5p2cLrmdNH01hl2MxbPeFoYVvjbTHwmd2bzLNNZ82c9mB00e8scZE76nOa55nOL53bNC5+3cz5lfvb8P4uciiqK3i5IXtBYbFQ8r/jRL+G/1JaolUhKbiz0XbhpEb5IuKhtsevitYu/lvJKL5Q5lVWWfS7nll/41fnXNb8OLMlY0rbUY+nGZcRlomXXlwcs31mhWVFY8WjF2BV1K5krS1e+XTVl1flKt8pNqymrZas710StaVhrsXbZ2s/rBOuuVQVX7VtvuH7x+vcbeBsubwzcuHeT0aayTZ82Czff3BK+pa7aqrpyK3FrwdYn25K2tfzm9VvNdoPtZdu/7BDt6NwZt/N0jWdNzS7DXUtr0VpZbffuibvb94TsadjrsHfLPsa+sv1gv2z/89/Tfr9+IPJA80Gvg3sPWR5af5h+uLQOqZtR11svqO9sSGnoODLmSHOjb+PhPxz/2NFk2lR1VOfo0mOUY8XHBo4XHu87IT7RczLz5KPmKc13To0/dfX0uNNtZyLPnDsbdvZUS1DL8XN+55rO+5w/csHrQv1Fj4t1re6th/90//Nwm0db3SXPSw3t3u2NHaM7jl0OuHzySsiVs1fZVy9ei77WcT3x+s0bE2903uTdfHYr59ar2wW3++/Mu0u4W3pP417lfcP71f+y/de+To/Oow9CHrQ+jH945xH30YvH0sefu4qf0J5UPjV5WvPM5VlTd1h3+/MJz7teiF/095T8pfnX+pc2Lw/9Hfh3a+/43q5XklcDr8vf6L/Z8dbtbXNfbN/9d7nv+t+XftD/sPOj18eWT8mfnvZP+0z6vOaL7ZfGr5Ff7w7kDgyIORKO4iiAwYpmZADwegcAtBR4dmgHgDJBeTdTFOXNU0ngP7Hy/qYoHgDsCAQgcR4AUfCMshFWS8hU+JQfwRMCAerqOlwHizTD1UVpiwpvLIQPAwNvjAAgNQLwRTIw0L9hYODLNujsLQBO5CnvhPIiv4NudpRTe9dDU/BD+TdFNHEJR1kSZAAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAgJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjU4PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjYyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CoIBL5oAAAUgSURBVGgF1VlLbE5BFB7iEZQ08UiQaC1U4lFvwoJaYCG1sSDx2Ei6aWPXLoTYiAQLCbUgsUGCjYiyqI2fUIlHaDwWtVALJJ5NJBq1YL6rZ/rd8997///eO39aJ2nuzJyZf+abM+c7Z6aj/lgx/7GMruTaL/b0mu6vfZWcwlQMwLsfP82xp69MW9fz/xPA6Zc95osF0f3xs7n78VPFQFTEAtj9Sy/euEUfffLalX0XKgLgiD06LAdWLuCq17J3ADguHdZ5RRrras2GmTOk6v3rHUBz4XFokQdXLHT1SviCVwCgTTiuSPOKBaZm8sSgCr/Y0XHX4OtTvAEQ2pTFTauaaPbWzZWqEb9oKjxybT4K3gBc7Hkb2v0267iy+zd63zu/8E2rXgBg99ufDlGl3v0DD8PBzCetegEgx0OOxJmNq6RoTr/4F9Bcgy3ACqdsuw/JDQC5ThxtwjJnXw4FtAnjxro1n7QW6xv47epZC7kB7Lr9IDQ30yYsI6yEY3W9scEIiH67+HYPVsgFQNPmrsXznONi99kyTfXzzJKp1Waf7SNy3qYb6JdHcgFAtimCHd6/qE6qZuvNO67MOlgIdQisoP3HDSqzkBkAHw/MxbSpLQMdCzs5rJQnQmcCkESb0LFllsycHgpoAILcCO0ieWg1EwBt9qPrlspagiMhjovGcw2rne6CDXYix2kMaBXBLoukBqCdE9nmttrZwdxROonG0LUVnrjjAofeTQ6NYJeFVlMD2JlAm+XoOFs9uHyho1VYLQutpgIA53xLl3SmTa3jTBROKuOwUInC1ePHFtFqWiukAsDOydTY9+t3yHGhO0T3AO20HIVbLPXmodWyASTRZvvgBV6cUNMm2vlaCf5vHXytgBWYVnGXTvMUUxYAOOB5ymmwY5LrQ5eUiQooWAEOL8L8ry2U5immLADY/X57TEQ0bUo7vryb3I7yibVLndOizvzPFkpzZygJIIoahTbhuJzvlLrAa6fltBpWYFpltgLYOCkJQF8BOdtkp8YErIubkHMh9GGH1rQqbBX3W2hPBIAdxi6JYIclMGmnZkqV/nFfPmac0GkLMbi430oEwDsMx5UdjnJczkTjJpN27bTMPJpWSwW3WAB6hznbhI6FddyeVEaOJJcb9BPmgRWYJMBw2LA4iQSAAVfs8RFh2uQXBuhZJ/3L+eIo8uWGEzqQBGer2g/59yMBRO2+DNIvDFFBS/qW+vJxQV9O6Mql1SIAUbQpQUu/MKyvneUCWqnFRulxXNpWDj09ckKnAx/HDP6tIgCtD5+xPuS4/MKATifWLgv1zVLZa5mNjwvfk0Ea4ic4YnyfkLlCAECb93o/iC4I/XG0yZTqBmQs8HEBrcqZ135yuKu76M4whudk2gTyPfNrAgboGxgIRVyMER2PlzL64y+NwAoSc/DFU+WcyZNMvb34iAAcaFXoHO2j5L+U2P1W9TQuA0fSFxtb2L7ZBdTgCMFxefdH0oL1WjhyQxcA0LSpB420OqfiwRGKe5c5Yy8X7NQIWpzHJAGrrapKUsfqur99N02dXU5/tXFD4r+onA+4EYMFHKuGa7dD94DO7ZuC50Hd13d9S0fBOTScu9O+qcZJiIW4E44VX2JAm3gKySvYmFLSbN9RmwazYOF/CaZ6bKQFMMmay7d032GrT7N5033LPNWWgbSEApkoJZBIfbi/nGLotRQB0JcYPWC46pxi8BoifaDF/ns0jUyxSVmUedP8Rjl9Ed1rzL+neen/FwTj359o6THhAAAAAElFTkSuQmCC');*/
  content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAABM0lEQVQ4jZ2TsVLCQBCGPxwLxyuktAOfQN6AdLHDNpX4BPIIKS3hCYyNZ4kd1/EI+ATGzhKL1HF2+DNCIGF0ZzLZ2/3v33/37jplWdJkzodLSxVJ/NWEOWncvbFX4LEN0EjgfIiAITB3Pgz+oyAD3gAjmv+JwPkwBnrAFHgwX7E92xui86ELrIClQpF8+w+KJF4fUzABupJ9p3Wm2KRVgarnkh4pbES3UmEE/W0VdQUpsBbJUOuV/Fy59KAC50Mf+ADuBVoWSTxWLpMiiz8BV0US53UFJvtTfq9WKVUMYaY7LejSjNSjJWdVBTZX2fyZcoYZaQ+nWxW+AZN8IdKdXmWWM4xhLR91zl8WZ8BCx3QNvGtYh6yOudkeog3Kzt2kthHYzXyuBly1YGYE9h2z33cB/ADX8GmB3KYABwAAAABJRU5ErkJggg==");
  transform: scale(0.9);
  pointer-events: auto;
}

:host-context([data-annotation-variant="logo"]) > span,
:host-context([data-annotation-variant="none"]) > span {
  pointer-events: none;
}

:host-context(.amboss-highlight) > span {
  background-color: rgba(10, 166, 184, 0.32);
}
`;
function getPopperOptions(arrow2) {
  return {
    placement: "auto",
    modifiers: [
      { name: "eventListeners", enabled: true },
      {
        name: "offset",
        enabled: true,
        options: {
          offset: [0, 8]
        }
      },
      {
        name: "arrow",
        options: {
          element: arrow2
        }
      },
      {
        name: "flip",
        enabled: true,
        options: {
          allowedAutoPlacements: ["top", "bottom"],
          rootBoundary: "viewport"
        }
      },
      {
        name: "preventOverflow",
        enabled: true,
        options: {
          boundariesElement: "viewport"
        }
      }
    ]
  };
}
class Anchor extends HTMLElement {
  static get observedAttributes() {
    return ["data-content-id"];
  }
  get contentId() {
    return this.getAttribute("data-content-id");
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.open = this.open.bind(this);
    this.t = this.t.bind(this);
    this.close = this.close.bind(this);
    this.popperInstance = null;
    this.content = document.querySelector("amboss-content-card");
    this.arrow = this.content.shadowRoot.querySelector("#amboss-content-card-arrow");
    this.target = document.createElement("span");
  }
  connectedCallback() {
    const styleElem = document.createElement("style");
    styleElem.innerText = styles;
    this.shadowRoot.appendChild(styleElem);
    this.render();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }
  render() {
    if (!this.childNodes[0])
      return void 0;
    this.target.innerText = this.childNodes[0].textContent;
    this.shadowRoot.appendChild(this.target);
    this.target.addEventListener("mouseover", (event) => {
      event.stopPropagation();
      this.open();
      this.content.addEventListener("mouseover", (event2) => {
        event2.stopPropagation();
        this.content.setAttribute("show-popper", "");
      }, { once: true });
      this.content.addEventListener("mouseleave", (event2) => {
        event2.stopPropagation();
        this.content.removeAttribute("show-popper");
        this.close();
      }, { once: true });
    });
    this.target.addEventListener("mouseleave", (event) => {
      event.stopPropagation();
      this.content.removeAttribute("show-popper");
      this.close();
    });
  }
  t() {
    window.annotationAdaptor.track([tooltip_anchor_hovered, {
      contentId: this.contentId
    }]);
  }
  open() {
    if (!this.content) {
      return void 0;
    }
    if (this.popperInstance !== null) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
    this.content.setAttribute("data-content-id", this.contentId);
    if (this.content.getAttribute("data-content-id") !== this.contentId) {
      this.open();
      return void 0;
    }
    this.arrow = this.content.shadowRoot.querySelector("#amboss-content-card-arrow");
    if (!this.arrow) {
      this.open();
      return void 0;
    }
    this.popperInstance = createPopper(this.target, this.content, getPopperOptions(this.arrow));
    this.popperInstance.forceUpdate();
    this.content.setAttribute("show-popper", "");
    this.t();
  }
  close() {
    setTimeout(() => {
      if (!this.content.hasAttribute("show-popper")) {
        this.content.removeAttribute("data-content-id");
        if (this.popperInstance !== null) {
          this.popperInstance.destroy();
          this.popperInstance = null;
        }
      }
    }, 50);
  }
}
const annotationOptionDefaults = {
  Content: AmbossContentCard,
  Anchor,
  shouldAnnotate: true,
  token: "",
  campaign: "",
  locale: "unset",
  annotationVariant: "underline",
  theme: "light-theme",
  customBranding: "no"
};
async function initAnnotation() {
  if (!window.annotationOptions)
    window.annotationOptions = {};
  if (!window.annotationOptions.Content)
    window.annotationOptions = annotationOptionDefaults;
  if (!window.annotationAdaptor)
    window.annotationAdaptor = {};
  if (!window.annotationAdaptor.getTooltipContent) {
    window.annotationAdaptor.getTooltipContent = getPhrasioWithIdFromWorkerPromiseWrapper;
    window.annotationAdaptor.track = track;
  }
  if (window.customElements.get("amboss-content-card") === void 0)
    window.customElements.define("amboss-content-card", AmbossContentCard);
  if (window.customElements.get("amboss-anchor") === void 0)
    window.customElements.define("amboss-anchor", Anchor);
  return true;
}
export { annotate, getPhrasiosFromText, initAnnotation };