import { createPopper } from "@popperjs/core";
import { track } from "./utils";
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
  get phrasioId() {
    return this.getAttribute("data-phrasio-id");
  }

  get locale() {
    return this.getAttribute("data-locale");
  }

  get annotationVariant() {
    return this.getAttribute("data-annotation-variant");
  }

  get theme() {
    return this.getAttribute("data-theme");
  }

  get campaign() {
    return this.getAttribute("data-campaign");
  }

  get customBranding() {
    return this.getAttribute("data-custom-branding");
  }

  get withLinks() {
    return this.getAttribute("data-with-links");
  }

  get variant() {
    return this.getAttribute("data-variant");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.create = this.create.bind(this);
    this.open = this.open.bind(this);
    this.t = this.t.bind(this);
    this.keepOpen = this.keepOpen.bind(this);
    this.close = this.close.bind(this);
    this.destroy = this.destroy.bind(this);
    this.popperInstance = null;
    this.content = document.querySelector("amboss-annotation-content");
    this.arrow = this.content.shadowRoot.querySelector('#amboss-annotation-arrow')
    // if (!this.content.querySelector('#amboss-annotation-arrow')) {
    //   this.arrow = document.createElement('div')
    //   const buffer = document.createElement('div')
    //   this.arrow.id = 'amboss-annotation-arrow'
    //   this.arrow.setAttribute('data-popper-arrow', '')
    //   buffer.id = 'buffer'
    //   this.arrow.appendChild(buffer)
    //   this.content.prepend(this.arrow)
    // }
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

    if (!this.hasChildNodes()) {
      console.warn("!! this.hasChildNodes is falsey");
      return;
    }
    if (!this.content) {
      console.warn("!! this.content is falsey => ", this.content);
      return;
    }
    this.target.innerText = this.childNodes[0].textContent
    this.shadowRoot.appendChild(this.target)

    if (this.content === null) {
      console.error(
        "this.content is null. You may need to create the <amboss-annotation-content /> element in the dom"
      );
    }

    this.target.addEventListener("mouseover", (event) => {
      event.stopPropagation();
      this.open();

      this.content.addEventListener(
        "mouseover",
        (event) => {
          event.stopPropagation();
          this.keepOpen();
        },
        { once: true }
      );

      this.content.addEventListener(
        "mouseleave",
        (event) => {
          event.stopPropagation();
          this.close();
        },
        { once: true }
      );
    });

    this.target.addEventListener("mouseleave", (event) => {
      event.stopPropagation();
      this.close();
    });
  }

  create() {
    this.popperInstance = createPopper(
      this.target,
      this.content,
      getPopperOptions(this.arrow)
    );
  }

  keepOpen() {
    this.content.setAttribute("show-popper", "");
  }

  t() {
    track(tooltip_anchor_hovered, {
      phrasioId: this.phrasioId,
    });
  }

  open() {
    if (this.content === null) this.content = document.querySelector("amboss-annotation-content");
    if (this.arrow === null) this.arrow = this.content.shadowRoot.querySelector('#amboss-annotation-arrow')
    this.content.setAttribute("data-phrasio-id", this.phrasioId);
    this.content.setAttribute("data-locale", this.locale);
    this.content.setAttribute(
      "data-annotation-variant",
      this.annotationVariant
    );
    this.content.setAttribute("data-variant", this.variant);
    this.content.setAttribute("data-theme", this.theme);
    this.content.setAttribute("data-campaign", this.campaign);
    this.content.setAttribute("data-custom-branding", this.customBranding);
    this.content.setAttribute("data-with-links", this.withLinks);
    this.content.setAttribute("show-popper", "");

    if (this.popperInstance !== null) this.destroy();
    this.create();
    this.popperInstance.forceUpdate();

    this.t();
  }

  close() {
    this.content.removeAttribute("show-popper");
    setTimeout(() => {
      if (!this.content.hasAttribute("show-popper")) {
        this.destroy();
      }
    }, 50);
  }

  destroy() {
    if (this.popperInstance !== null) {
      this.content.setAttribute("data-phrasio-id", '');
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }
}

export default Anchor;
