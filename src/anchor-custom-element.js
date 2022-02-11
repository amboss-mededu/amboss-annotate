import { createPopper } from "@popperjs/core";
import { tooltip_anchor_hovered } from "./event-names";
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
    return [ "data-content-id" ];
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
    this.arrow = this.content.shadowRoot.querySelector('#amboss-content-card-arrow')
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
    window.ambossAnnotationAdaptor.track([tooltip_anchor_hovered, {
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

    this.content.setAttribute("data-content-id", this.contentId);
    if (this.content.getAttribute("data-content-id") !== this.contentId) {
      this.open()
      return undefined
    }

    this.arrow = this.content.shadowRoot.querySelector('#amboss-content-card-arrow')
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
        this.content.removeAttribute("data-content-id");
        if (this.popperInstance !== null) {
          this.popperInstance.destroy();
          this.popperInstance = null;
        }
      }
    }, 50);
  }
}

export default Anchor;
