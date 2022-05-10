import { createPopper } from "@popperjs/core";
import {
  CARD_TAG_NAME,
  MATCH_WRAPPER_CONTENT_ID_ATTR,
  TOOLTIP_OPENED_EVENT,
  ARROW_ID_SELECTOR
} from './consts'
import {track} from './'

import styles from "./anchor-custom-element.css";

function getPopperOptions(arrow) {
  return {
    placement: "auto",
    modifiers: [
      { name: "eventListeners", enabled: true },
      {
        name: "offset",
        enabled: true,
        options: {
          offset: [0, 8],
        },
      },
      {
        name: "arrow",
        options: {
          element: arrow,
        },
      },
      {
        name: 'flip',
        enabled: true,
        options: {
          allowedAutoPlacements: ['top', 'bottom'],
          rootBoundary: 'viewport',
        },
      },
      {
        name: "preventOverflow",
        enabled: true,
        options: {
          boundariesElement: "viewport",
        },
      },
    ],
  };
}

class Anchor extends HTMLElement {
  static get observedAttributes() {
    return [ MATCH_WRAPPER_CONTENT_ID_ATTR ];
  }

  get contentId() {
    return this.getAttribute(MATCH_WRAPPER_CONTENT_ID_ATTR);
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.open = this.open.bind(this);
    this.t = this.t.bind(this);
    this.close = this.close.bind(this);
    this.popperInstance = null;
    this.content = document.querySelector(CARD_TAG_NAME);
    this.arrow = this.content.shadowRoot.querySelector(ARROW_ID_SELECTOR)
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
    if(!this.childNodes[0]) return undefined;
    this.target.innerText = this.childNodes[0].textContent
    this.shadowRoot.appendChild(this.target)

    this.target.addEventListener("mouseover", (event) => {
      event.stopPropagation();
      this.open();

      this.content.addEventListener(
        "mouseover",
        (event) => {
          event.stopPropagation();
          this.content.setAttribute("show-popper", "");
        },
        { once: true }
      );

      this.content.addEventListener(
        "mouseleave",
        (event) => {
          event.stopPropagation();
          this.content.removeAttribute("show-popper");
          this.close();
        },
        { once: true }
      );
    });

    this.target.addEventListener("mouseleave", (event) => {
      event.stopPropagation();
      this.content.removeAttribute("show-popper");
      this.close();
    });
  }

  t() {
    track([TOOLTIP_OPENED_EVENT, {
      contentId: this.contentId,
    }]);
  }

  open() {
    if (!this.content) {
      return undefined
    }

    if (this.popperInstance !== null) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }

    this.content.setAttribute(MATCH_WRAPPER_CONTENT_ID_ATTR, this.contentId);
    if (this.content.getAttribute(MATCH_WRAPPER_CONTENT_ID_ATTR) !== this.contentId) {
      this.open()
      return undefined
    }

    this.arrow = this.content.shadowRoot.querySelector(ARROW_ID_SELECTOR)
    if (!this.arrow) {
      this.open();
      return undefined
    }

    this.popperInstance = createPopper(
      this.target,
      this.content,
      getPopperOptions(this.arrow)
    );
    this.popperInstance.forceUpdate();
    this.content.setAttribute("show-popper", "");
    this.t();
  }

  close() {
    setTimeout(() => {
      if (!this.content.hasAttribute("show-popper")) {
        this.content.removeAttribute(MATCH_WRAPPER_CONTENT_ID_ATTR);
        if (this.popperInstance !== null) {
          this.popperInstance.destroy();
          this.popperInstance = null;
        }
      }
    }, 50);
  }
}

export default Anchor;
