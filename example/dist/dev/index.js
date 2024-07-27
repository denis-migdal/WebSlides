/******/ var __webpack_modules__ = ({

/***/ "../libs/LISS/index.ts":
/*!*****************************!*\
  !*** ../libs/LISS/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CstmEvent: () => (/* binding */ CstmEvent),
/* harmony export */   LISS_Auto: () => (/* binding */ LISS_Auto),
/* harmony export */   ShadowCfg: () => (/* binding */ ShadowCfg),
/* harmony export */   "default": () => (/* binding */ LISS)
/* harmony export */ });
// ================================================
// =============== LISS exported types ============
// ================================================
var ShadowCfg;
(function(ShadowCfg) {
    ShadowCfg["NONE"] = "none";
    ShadowCfg["OPEN"] = "open";
    ShadowCfg["CLOSE"] = "closed";
})(ShadowCfg || (ShadowCfg = {}));
// ================================================
// =============== LISS Class =====================
// ================================================
let __cstr_host = null;
// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
const CAN_HAVE_SHADOW = [
    null,
    'article',
    'aside',
    'blockquote',
    'body',
    'div',
    'footer',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'header',
    'main',
    'nav',
    'p',
    'section',
    'span'
];
function _canHasShadow(tag) {
    return CAN_HAVE_SHADOW.includes(_element2tagname(tag));
}
function LISS({ extends: p_extends, host: p_host, dependancies: p_deps, attributes: p_attrs, params, content, css, shadow: p_shadow } = {}) {
    //TODO merge prop if extends LISS...
    const host = p_host ?? HTMLElement;
    const _extends = p_extends ?? Object;
    const attributes = p_attrs ?? [];
    const dependancies = p_deps ? [
        ...p_deps
    ] : [];
    const canHasShadow = _canHasShadow(host);
    const shadow = p_shadow ?? (canHasShadow ? "closed" : "none");
    if (!canHasShadow && shadow !== "none") throw new Error(`Host element ${_element2tagname(host)} does not support ShadowRoot`);
    // CONTENT processing
    if (content !== undefined) {
        dependancies.push((async ()=>{
            content = await content;
            if (content instanceof HTMLTemplateElement) content = content.innerHTML;
            if (typeof content === "string") {
                content = content.trim(); // Never return a text node of whitespace as the result
                if (content === '') content = undefined;
            }
            if (content instanceof Response) content = await content.text();
            return LISSBase.Parameters.content = content;
        })());
    }
    // CSS processing
    let stylesheets = [];
    if (css !== undefined) {
        if (!Array.isArray(css)) css = [
            css
        ];
        stylesheets = new Array(css.length);
        const fetch_css = async (css)=>{
            css = await css;
            if (css instanceof CSSStyleSheet) return css;
            if (css instanceof HTMLStyleElement) return css.sheet;
            let style = new CSSStyleSheet();
            if (typeof css === "string") {
                style.replace(css);
                return style;
            }
            //if( css instanceof Response )
            style.replace(await css.text());
            return style;
        };
        dependancies.push(...css.map(async (css, idx)=>stylesheets[idx] = await fetch_css(css)));
    }
    // @ts-ignore
    class LISSBase extends _extends {
        #host;
        constructor(){
            super();
            // h4ck, okay because JS is monothreaded.
            if (__cstr_host === null) throw new Error("Please do not directly call this constructor");
            this.#host = __cstr_host;
            __cstr_host = null;
        }
        get host() {
            return this.#host;
        }
        get attrs() {
            return this.#host.attrs;
        }
        setAttrDefault(attr, value) {
            return this.#host.setAttrDefault(attr, value);
        }
        get params() {
            return this.#host.params;
        }
        get content() {
            return this.#host.content;
        }
        static Parameters = {
            host,
            dependancies,
            attributes,
            params,
            content,
            stylesheets,
            shadow
        };
        onAttrChanged(_name, _oldValue, _newValue) {}
        get isInDOM() {
            return this.#host.isInDOM;
        }
        onDOMConnected() {}
        onDOMDisconnected() {}
    }
    return LISSBase;
}
//TODO: other options...
function extendsLISS(Liss, parameters) {
    // TODO: other options...
    const attrs = [
        ...Liss.Parameters.attributes,
        ...parameters.attributes
    ];
    const params = Object.assign({}, Liss.Parameters, {
        attributes: attrs
    });
    // @ts-ignore : because TS stupid
    class ExtendedLISS extends Liss {
        constructor(...t){
            // @ts-ignore : because TS stupid
            super(...t);
        }
        get attrs() {
            return super.attrs;
        }
        static Parameters = params;
    }
    return ExtendedLISS;
}
LISS.extendsLISS = extendsLISS;
// ================================================
// =============== LISSHost class =================
// ================================================
let id = 0;
function buildLISSHost(Liss, _params = {}) {
    const { host, attributes, content, stylesheets, shadow } = Liss.Parameters;
    const alreadyDeclaredCSS = new Set();
    const GET = Symbol('get');
    const SET = Symbol('set');
    const properties = Object.fromEntries(attributes.map((n)=>[
            n,
            {
                enumerable: true,
                get: function() {
                    return this[GET](n);
                },
                set: function(value) {
                    return this[SET](n, value);
                }
            }
        ]));
    class Attributes {
        #data;
        #defaults;
        #setter;
        [GET](name1) {
            return this.#data[name1] ?? this.#defaults[name1] ?? null;
        }
        [SET](name1, value) {
            return this.#setter(name1, value); // required to get a clean object when doing {...attrs}
        }
        constructor(data, defaults, setter){
            this.#data = data;
            this.#defaults = defaults;
            this.#setter = setter;
            Object.defineProperties(this, properties);
        }
    }
    // @ts-ignore : because TS is stupid.
    class LISSHostBase extends host {
        #params;
        #id = ++id;
        constructor(params = {}){
            super();
            this.#params = Object.assign({}, Liss.Parameters.params, _params, params);
            this.#waitInit = new Promise((resolve)=>{
                if (this.isInit) return resolve(this.#API);
                this.#resolve = resolve;
            });
        }
        /**** public API *************/ get isInit() {
            return this.#API !== null;
        }
        initialize(params = {}) {
            if (this.isInit) throw new Error('Element already initialized!');
            Object.assign(this.#params, params);
            const api = this.init();
            if (this.#isInDOM) api.onDOMConnected();
            return api;
        }
        get LISSSync() {
            if (!this.isInit) throw new Error('Accessing API before WebComponent initialization!');
            return this.#API;
        }
        get LISS() {
            return this.#waitInit;
        }
        /*** init ***/ #waitInit;
        #resolve = null;
        #API = null;
        #isInDOM = false;
        get isInDOM() {
            return this.#isInDOM;
        }
        disconnectedCallback() {
            this.#isInDOM = false;
            this.#API.onDOMDisconnected();
        }
        connectedCallback() {
            this.#isInDOM = true;
            if (!this.isInit) {
                this.init();
                return;
            }
            this.#API.onDOMConnected();
        }
        init() {
            customElements.upgrade(this);
            // shadow
            this.#content = this;
            if (shadow !== 'none') {
                this.#content = this.attachShadow({
                    mode: shadow
                });
                //@ts-ignore
                this.#content.addEventListener('click', onClickEvent);
                //@ts-ignore
                this.#content.addEventListener('dblclick', onClickEvent);
            }
            // attrs
            for (let obs of attributes)this.#attributes[obs] = this.getAttribute(obs);
            // css
            if (shadow !== 'none') this.#content.adoptedStyleSheets.push(sharedCSS);
            if (stylesheets.length) {
                if (shadow !== 'none') this.#content.adoptedStyleSheets.push(...stylesheets);
                else {
                    const cssselector = this.CSSSelector;
                    // if not yet inserted :
                    if (!alreadyDeclaredCSS.has(cssselector)) {
                        let style = document.createElement('style');
                        style.setAttribute('for', cssselector);
                        let html_stylesheets = "";
                        for (let style of stylesheets)for (let rule of style.cssRules)html_stylesheets += rule.cssText + '\n';
                        style.innerHTML = html_stylesheets.replace(':host', `:is(${cssselector})`);
                        document.head.append(style);
                        alreadyDeclaredCSS.add(cssselector);
                    }
                }
            }
            // content
            if (content !== undefined) {
                let template_elem = document.createElement('template');
                let str = content.replace(/\$\{(.+?)\}/g, (_, match)=>this.getAttribute(match) ?? '');
                template_elem.innerHTML = str;
                this.#content.append(...template_elem.content.childNodes);
            }
            // build
            // h4ck, okay because JS is monothreaded.
            __cstr_host = this;
            let obj = new Liss();
            /*if( obj instanceof Promise)
	    		obj = await obj;*/ this.#API = obj;
            // default slot
            if (this.hasShadow && this.#content.childNodes.length === 0) this.#content.append(document.createElement('slot'));
            if (this.#resolve !== null) this.#resolve(this.#API);
            return this.#API;
        }
        get params() {
            return this.#params;
        }
        /*** content ***/ #content = null;
        get content() {
            return this.#content;
        }
        getPart(name1) {
            return this.hasShadow ? this.#content?.querySelector(`::part(${name1})`) : this.#content?.querySelector(`[part="${name1}"]`);
        }
        getParts(name1) {
            return this.hasShadow ? this.#content?.querySelectorAll(`::part(${name1})`) : this.#content?.querySelectorAll(`[part="${name1}"]`);
        }
        get hasShadow() {
            return shadow !== 'none';
        }
        /*** CSS ***/ get CSSSelector() {
            return this.hasShadow ? this.tagName : `${this.tagName}[is="${this.getAttribute("is")}"]`;
        }
        /*** attrs ***/ #attrs_flag = false;
        #attributes = {};
        #attributesDefaults = {};
        #attrs = new Attributes(this.#attributes, this.#attributesDefaults, (name1, value)=>{
            this.#attributes[name1] = value;
            this.#attrs_flag = true; // do not trigger onAttrsChanged.
            if (value === null) this.removeAttribute(name1);
            else this.setAttribute(name1, value);
        });
        setAttrDefault(name1, value) {
            if (value === null) delete this.#attributesDefaults[name1];
            else this.#attributesDefaults[name1] = value;
        }
        get attrs() {
            return this.#attrs;
        }
        static observedAttributes = attributes;
        attributeChangedCallback(name1, oldValue, newValue) {
            if (this.#attrs_flag) {
                this.#attrs_flag = false;
                return;
            }
            this.#attributes[name1] = newValue;
            if (!this.isInit) return;
            if (this.#API.onAttrChanged(name1, oldValue, newValue) === false) {
                this.#attrs[name1] = oldValue; // revert the change.
            }
        }
    }
    return LISSHostBase;
}
// ================================================
// =============== LISS define ====================
// ================================================
const _DOMContentLoaded = new Promise((resolve)=>{
    if (document.readyState === "interactive" || document.readyState === "complete") return resolve();
    document.addEventListener('DOMContentLoaded', ()=>{
        resolve();
    }, true);
});
LISS.define = async function(tagname, ComponentClass, { dependancies, params } = {}) {
    dependancies ??= [];
    params ??= {};
    const Class = ComponentClass.Parameters.host;
    let LISSBase = ComponentClass;
    let htmltag = _element2tagname(Class) ?? undefined;
    await Promise.all([
        _DOMContentLoaded,
        ...dependancies,
        ...LISSBase.Parameters.dependancies
    ]);
    const LISSclass = buildLISSHost(ComponentClass, params);
    const opts = htmltag === undefined ? {} : {
        extends: htmltag
    };
    customElements.define(tagname, LISSclass, opts);
};
// ================================================
// =============== LISS ShadowRoot tools ==========
// ================================================
const sharedCSS = new CSSStyleSheet();
document.adoptedStyleSheets.push(sharedCSS);
LISS.insertGlobalCSSRules = function(css) {
    let css_style;
    if (css instanceof HTMLStyleElement) css_style = css.sheet;
    if (typeof css === "string") {
        css_style = new CSSStyleSheet();
        css_style.replaceSync(css);
    }
    for (let rule of css_style.cssRules)sharedCSS.insertRule(rule.cssText);
};
const DELEGATED_EVENTS = {
    "click": [],
    "dblclick": []
};
const ALREADY_PROCESSED = Symbol();
function onClickEvent(ev) {
    if (ev[ALREADY_PROCESSED] === true) return;
    ev[ALREADY_PROCESSED] = true;
    const handlers = DELEGATED_EVENTS[ev.type];
    for (let elem of ev.composedPath()){
        if (elem instanceof ShadowRoot || elem === document || elem === window) continue;
        var target = elem;
        for (let [selector, handler] of handlers){
            if (target.matches(selector)) handler(ev);
        }
    }
}
LISS.insertGlobalDelegatedListener = function(event_name, selector, handler) {
    DELEGATED_EVENTS[event_name].push([
        selector,
        handler
    ]);
};
document.addEventListener('click', onClickEvent);
document.addEventListener('dblclick', onClickEvent);
LISS.closest = function closest(selector, element) {
    while(true){
        var result = element.closest(selector);
        if (result !== null) return result;
        const root = element.getRootNode();
        if (!("host" in root)) return null;
        element = root.host;
    }
};
async function build(tagname, { params = {}, initialize = true, content = [], parent = undefined, id = undefined, classes = [], cssvars = {}, attrs = {}, data = {}, listeners = {} } = {}) {
    if (!initialize && parent === null) throw new Error("A parent must be given if initialize is false");
    let CustomClass = await customElements.whenDefined(tagname);
    let elem = new CustomClass(params);
    // Fix issue #2
    if (elem.tagName.toLowerCase() !== tagname) elem.setAttribute("is", tagname);
    if (id !== undefined) elem.id = id;
    if (classes.length > 0) elem.classList.add(...classes);
    for(let name1 in cssvars)elem.style.setProperty(`--${name1}`, cssvars[name1]);
    for(let name1 in attrs){
        let value = attrs[name1];
        if (typeof value === "boolean") elem.toggleAttribute(name1, value);
        else elem.setAttribute(name1, value);
    }
    for(let name1 in data){
        let value = data[name1];
        if (value === false) delete elem.dataset[name1];
        else if (value === true) elem.dataset[name1] = "";
        else elem.dataset[name1] = value;
    }
    if (!Array.isArray(content)) content = [
        content
    ];
    elem.replaceChildren(...content);
    for(let name1 in listeners)elem.addEventListener(name1, listeners[name1]);
    if (parent !== undefined) parent.append(elem);
    if (!elem.isInit && initialize) return await LISS.initialize(elem);
    return await LISS.getLISS(elem);
}
LISS.build = build;
LISS.whenDefined = async function(tagname, callback) {
    await customElements.whenDefined(tagname);
    if (callback !== undefined) callback();
    return;
};
LISS.whenAllDefined = async function(tagnames, callback) {
    await Promise.all(tagnames.map((t)=>customElements.whenDefined(t)));
    if (callback !== undefined) callback();
};
LISS.isDefined = function(name1) {
    return customElements.get(name1);
};
LISS.selector = function(name1) {
    if (name1 === undefined) return "";
    return `:is(${name1}, [is="${name1}"])`;
};
LISS.getLISS = async function(element) {
    await LISS.whenDefined(LISS.getName(element));
    return element.LISS; // ensure initialized.
};
LISS.getLISSSync = function(element) {
    if (!LISS.isDefined(LISS.getName(element))) throw new Error(`${name} hasn't been defined yet.`);
    let host = element;
    if (!host.isInit) throw new Error("Instance hasn't been initialized yet.");
    return host.LISSSync;
};
LISS.initialize = async function(element) {
    await LISS.whenDefined(LISS.getName(element));
    return await element.initialize(); // ensure initialization.
};
LISS.getName = function(element) {
    const name1 = element.getAttribute('is') ?? element.tagName.toLowerCase();
    if (!name1.includes('-')) throw new Error(`Element ${name1} is not a WebComponent`);
    return name1;
};
function _buildQS(selector, tagname_or_parent, parent = document) {
    if (tagname_or_parent !== undefined && typeof tagname_or_parent !== 'string') {
        parent = tagname_or_parent;
        tagname_or_parent = undefined;
    }
    return [
        `${selector}${LISS.selector(tagname_or_parent)}`,
        parent
    ];
}
async function qs(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    let result = await LISS.qso(selector, parent);
    if (result === null) throw new Error(`Element ${selector} not found`);
    return result;
}
LISS.qs = qs;
async function qso(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const element = parent.querySelector(selector);
    if (element === null) return null;
    return await LISS.getLISS(element);
}
LISS.qso = qso;
async function qsa(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const elements = parent.querySelectorAll(selector);
    let idx = 0;
    const promises = new Array(elements.length);
    for (let element of elements)promises[idx++] = LISS.getLISS(element);
    return await Promise.all(promises);
}
LISS.qsa = qsa;
async function qsc(selector, tagname_or_parent, element) {
    const res = _buildQS(selector, tagname_or_parent, element);
    const result = res[1].closest(res[0]);
    if (result === null) return null;
    return await LISS.getLISS(result);
}
LISS.qsc = qsc;
function qsSync(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const element = parent.querySelector(selector);
    if (element === null) throw new Error(`Element ${selector} not found`);
    return LISS.getLISSSync(element);
}
LISS.qsSync = qsSync;
function qsaSync(selector, tagname_or_parent, parent = document) {
    [selector, parent] = _buildQS(selector, tagname_or_parent, parent);
    const elements = parent.querySelectorAll(selector);
    let idx = 0;
    const result = new Array(elements.length);
    for (let element of elements)result[idx++] = LISS.getLISSSync(element);
    return result;
}
LISS.qsaSync = qsaSync;
function qscSync(selector, tagname_or_parent, element) {
    const res = _buildQS(selector, tagname_or_parent, element);
    const result = res[1].closest(res[0]);
    if (result === null) return null;
    return LISS.getLISSSync(result);
}
LISS.qscSync = qscSync;
// ================================================
// =============== LISS Auto ======================
// ================================================
class LISS_Auto extends LISS({
    attributes: [
        "src"
    ]
}) {
    #known_tag = new Set();
    #directory;
    #sw;
    constructor(){
        super();
        this.#sw = new Promise(async (resolve)=>{
            await navigator.serviceWorker.register(`./sw.js`);
            if (navigator.serviceWorker.controller) resolve();
            navigator.serviceWorker.addEventListener('controllerchange', ()=>{
                resolve();
            });
        });
        const src = this.attrs.src;
        if (src === null) throw new Error("src attribute is missing.");
        this.#directory = src[0] === '.' ? `${window.location.pathname}/${src}` : src;
        new MutationObserver((mutations)=>{
            for (let mutation of mutations)for (let addition of mutation.addedNodes)if (addition instanceof Element) this.#addTag(addition.tagName);
        }).observe(document, {
            childList: true,
            subtree: true
        });
        for (let elem of document.querySelectorAll("*"))this.#addTag(elem.tagName);
    }
    resources() {
        return [
            "index.js",
            "index.html",
            "index.css"
        ];
    }
    defineWebComponent(tagname, files, opts) {
        const js = files["index.js"];
        const content = files["index.html"];
        let klass = null;
        if (js !== undefined) klass = js(opts);
        else if (content !== undefined) klass = class WebComponent extends LISS(opts) {
        };
        if (klass === null) throw new Error(`Missing files for WebComponent ${tagname}.`);
        return LISS.define(tagname, klass);
    }
    async #addTag(tagname) {
        tagname = tagname.toLowerCase();
        if (tagname === 'liss-auto' || tagname === 'bliss-auto' || !tagname.includes('-') || this.#known_tag.has(tagname)) return;
        this.#known_tag.add(tagname);
        await this.#sw; // ensure SW is installed.
        const filenames = this.resources();
        const resources = await Promise.all(filenames.map((file)=>file.endsWith('.js') ? _import(`${this.#directory}/${tagname}/${file}`, true) : _fetchText(`${this.#directory}/${tagname}/${file}`, true)));
        const files = {};
        for(let i = 0; i < filenames.length; ++i)if (resources[i] !== undefined) files[filenames[i]] = resources[i];
        const content = files["index.html"];
        const css = files["index.css"];
        const opts = {
            ...content !== undefined && {
                content
            },
            ...css !== undefined && {
                css
            }
        };
        return this.defineWebComponent(tagname, files, opts);
    }
}
LISS.define("liss-auto", LISS_Auto);
class CstmEvent extends CustomEvent {
    get type() {
        return super.type;
    }
    constructor(type, args){
        super(type, {
            detail: args
        });
    }
}
// ================================================
// =============== LISS internal tools ============
// ================================================
async function fetchResource(resource) {
    resource = await resource;
    if (!(resource instanceof Response)) resource = await fetch(resource);
    return await resource.text();
}
async function _fetchText(uri, isLissAuto = false) {
    const options = isLissAuto ? {
        headers: {
            "liss-auto": "true"
        }
    } : {};
    const response = await fetch(uri, options);
    if (response.status !== 200) return undefined;
    if (isLissAuto && response.headers.get("status") === "404") return undefined;
    return await response.text();
}
async function _import(uri, isLissAuto = false) {
    // test for the module existance.
    if (isLissAuto && await _fetchText(uri, isLissAuto) === undefined) return undefined;
    try {
        return (await import(/* webpackIgnore: true */ uri)).default;
    } catch (e) {
        console.log(e);
        return undefined;
    }
}
// from https://stackoverflow.com/questions/51000461/html-element-tag-name-from-constructor
const HTMLCLASS_REGEX = /HTML(\w+)Element/;
const elementNameLookupTable = {
    'UList': 'ul',
    'TableCaption': 'caption',
    'TableCell': 'td',
    'TableCol': 'col',
    'TableRow': 'tr',
    'TableSection': 'tbody',
    'Quote': 'q',
    'Paragraph': 'p',
    'OList': 'ol',
    'Mod': 'ins',
    'Media': 'video',
    'Image': 'img',
    'Heading': 'h1',
    'Directory': 'dir',
    'DList': 'dl',
    'Anchor': 'a'
};
function _element2tagname(Class) {
    if (Class === HTMLElement) return null;
    let htmltag = HTMLCLASS_REGEX.exec(Class.name)[1];
    return elementNameLookupTable[htmltag] ?? htmltag.toLowerCase();
}


/***/ }),

/***/ "../src/index.ts":
/*!***********************!*\
  !*** ../src/index.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _libs_LISS_index_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../libs/LISS/index.ts */ "../libs/LISS/index.ts");
const main = document.querySelector("main");
// fit page height
function updateRatio() {
    const vh = document.documentElement.clientHeight; // without scrollbar
    const mh = main.clientHeight; // height: 148mm
    main.style.setProperty("--scale", `${vh / mh}`);
}
window.addEventListener('resize', updateRatio);
updateRatio();
// change slide
let current = 0;
document.addEventListener("keyup", (ev)=>{
    if (![
        "ArrowLeft",
        "ArrowRight"
    ].includes(ev.code)) return;
    let sections = [
        ...document.querySelectorAll(':is(section, .ws-frame)')
    ];
    if (ev.code === "ArrowLeft" && current !== 0) --current;
    if (ev.code === "ArrowRight" && current !== sections.length - 1) ++current;
    main.scrollTo({
        top: sections[current].offsetTop,
        behavior: "instant"
    });
});

const css = `
    :host {
        --uca_green: #95c11f;
        --uca_gray : #5e5c5c;

        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        height: 100%;
        width : 100%;
        background-image: url('./img/uca/background.png');
        background-size: cover;
    }
`;
class FrameUCAPlain extends (0,_libs_LISS_index_ts__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css
}) {
    constructor(){
        super();
        this.host.classList.add('ws-frame');
    }
}
_libs_LISS_index_ts__WEBPACK_IMPORTED_MODULE_0__["default"].define("frame-uca-plain", FrameUCAPlain);
const frametitle_css = `
    :host > h1 {
        color: var(--uca_green);
        text-align: center;
    }
    :host > div {
        text-align: center;
        color: var(--uca_gray);

        & > .mail {
            font-style: italic;
        }
    }
`;
const content = `<h1></h1>
<div>
    <span class="author"></span><br/>
    <span class="mail"></span>
</div>
<div>
    <span class="date"></span>
</div>
`;
class FrameUCATitle extends (0,_libs_LISS_index_ts__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: [
        css,
        frametitle_css
    ],
    content,
    attributes: [
        "caption",
        "author",
        "mail"
    ]
}) {
    constructor(){
        super();
        this.host.classList.add('ws-frame');
        this.content.querySelector('h1').textContent = this.attrs.caption;
        this.content.querySelector('.author').textContent = this.attrs.author;
        this.content.querySelector('.mail').textContent = this.attrs.mail;
        this.content.querySelector('.date').textContent = new Date().toLocaleDateString('fr-FR', {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    }
}
_libs_LISS_index_ts__WEBPACK_IMPORTED_MODULE_0__["default"].define("frame-uca-title", FrameUCATitle);
const frame_content = `<div class="header">
    <h2 class="title"></h2>
    <h3 class="subtitle"></h3>
</div>
<div class="content"><slot></slot></div>`;
const frame_css = `
    :host {
        padding-left: 10px;
        padding-right: 10px;
    }
    :host > .header {
        position: absolute;
        top: 0;
        left: 10px;
    }

    :host > .header > h2 {
        margin-top: 8px;
        color: var(--uca_green);
        margin-bottom: 0px;
        font-size: 1em;
    }
    :host > .header > h3 {
        margin-top: 2px;
        font-weight: normal;
        font-style: italic;
        font-size: 0.75em;
        color: var(--uca_gray);
    }
`;
class FrameUCA extends (0,_libs_LISS_index_ts__WEBPACK_IMPORTED_MODULE_0__["default"])({
    css: [
        css,
        frame_css
    ],
    content: frame_content,
    attributes: [
        "section",
        "subsection"
    ]
}) {
    constructor(){
        super();
        this.host.classList.add('ws-frame');
        this.content.querySelector('.title').textContent = this.attrs.section;
        this.content.querySelector('.subtitle').textContent = this.attrs.subsection;
    }
}
_libs_LISS_index_ts__WEBPACK_IMPORTED_MODULE_0__["default"].define("frame-uca", FrameUCA);


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/publicPath */
/******/ (() => {
/******/ 	__webpack_require__.p = "";
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _libs_WebSlides_src_index_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../libs/WebSlides/src/index.ts */ "../src/index.ts");


})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!***********************!*\
  !*** ./src/index.css ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************!*\
  !*** ./src/index.md ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "index.html");
})();

var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFDQSx5Q0FBeUMsd0NBQXdDO1VBQ2pGO1VBQ0E7VUFDQTs7Ozs7VUNQQTs7Ozs7VUNBQTtVQUNBO1VBQ0E7VUFDQSx1REFBdUQsaUJBQWlCO1VBQ3hFO1VBQ0EsZ0RBQWdELGFBQWE7VUFDN0Q7Ozs7O1VDTkE7Ozs7Ozs7Ozs7Ozs7QUNBd0M7Ozs7Ozs7Ozs7O0FDQXhDOzs7Ozs7Ozs7Ozs7O0FDQUEsaUVBQWUscUJBQXVCLGVBQWUsRSIsInNvdXJjZXMiOlsid2VicGFjazovL1tQUk9KRUNUX05BTUVdLy4uL2xpYnMvTElTUy9pbmRleC50cyIsIndlYnBhY2s6Ly9bUFJPSkVDVF9OQU1FXS8uLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vW1BST0pFQ1RfTkFNRV0vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vW1BST0pFQ1RfTkFNRV0vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1tQUk9KRUNUX05BTUVdL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vW1BST0pFQ1RfTkFNRV0vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9bUFJPSkVDVF9OQU1FXS93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9bUFJPSkVDVF9OQU1FXS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9bUFJPSkVDVF9OQU1FXS8uL3NyYy9pbmRleC5jc3MiLCJ3ZWJwYWNrOi8vW1BST0pFQ1RfTkFNRV0vLi9zcmMvaW5kZXgubWQiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBleHBvcnRlZCB0eXBlcyA9PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgdHlwZSBDU1NfUmVzb3VyY2UgPSBzdHJpbmd8UmVzcG9uc2V8SFRNTFN0eWxlRWxlbWVudHxDU1NTdHlsZVNoZWV0O1xuZXhwb3J0IHR5cGUgQ1NTX1NvdXJjZSAgID0gQ1NTX1Jlc291cmNlIHwgUHJvbWlzZTxDU1NfUmVzb3VyY2U+O1xuXG5leHBvcnQgdHlwZSBIVE1MX1Jlc291cmNlID0gc3RyaW5nfFJlc3BvbnNlfEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XG5leHBvcnQgdHlwZSBIVE1MX1NvdXJjZSAgID0gSFRNTF9SZXNvdXJjZSB8IFByb21pc2U8SFRNTF9SZXNvdXJjZT47XG5cbmV4cG9ydCB0eXBlIExJU1NPcHRpb25zPEV4dGVuZHMgICAgZXh0ZW5kcyBDbGFzcyxcblx0XHRcdFx0XHRcdEhvc3QgICAgICAgZXh0ZW5kcyBIVE1MRWxlbWVudCxcblx0XHRcdFx0XHRcdEF0dHJzICAgICAgZXh0ZW5kcyBzdHJpbmcsXG5cdFx0XHRcdFx0XHRQYXJhbWV0ZXJzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55Pj4gPSB7XG5cblx0ZXh0ZW5kcz86IENvbnN0cnVjdG9yPEV4dGVuZHM+LFxuXHRob3N0ICAgPzogQ29uc3RydWN0b3I8SG9zdD4sXG5cblx0ZGVwZW5kYW5jaWVzPzogcmVhZG9ubHkgUHJvbWlzZTxhbnk+W10sXG5cdGF0dHJpYnV0ZXMgID86IHJlYWRvbmx5IEF0dHJzW10sXG5cdHBhcmFtcyAgICAgID86IFJlYWRvbmx5PFBhcmFtZXRlcnM+LFxuXG5cdGNvbnRlbnQ/OiBIVE1MX1NvdXJjZSxcblx0Y3NzICAgID86ICBDU1NfU291cmNlIHwgcmVhZG9ubHkgQ1NTX1NvdXJjZVtdLFxuXHRzaGFkb3cgPzogIFNoYWRvd0NmZyxcbn07XG5cbmV4cG9ydCBlbnVtIFNoYWRvd0NmZyB7XG5cdE5PTkUgPSAnbm9uZScsXG5cdE9QRU4gPSAnb3BlbicsIFxuXHRDTE9TRT0gJ2Nsb3NlZCdcbn07XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgQ2xhc3MgPT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxubGV0IF9fY3N0cl9ob3N0ICA6IGFueSA9IG51bGw7XG5cbnR5cGUgQ29uc3RydWN0b3I8VD4gPSBuZXcgKCkgPT4gVDtcbmludGVyZmFjZSBDbGFzcyB7fVxuXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3dcbmNvbnN0IENBTl9IQVZFX1NIQURPVyA9IFtcblx0bnVsbCwgJ2FydGljbGUnLCAnYXNpZGUnLCAnYmxvY2txdW90ZScsICdib2R5JywgJ2RpdicsXG5cdCdmb290ZXInLCAnaDEnLCAnaDInLCAnaDMnLCAnaDQnLCAnaDUnLCAnaDYnLCAnaGVhZGVyJywgJ21haW4nLFxuXHQnbmF2JywgJ3AnLCAnc2VjdGlvbicsICdzcGFuJ1xuXHRcbl07XG5mdW5jdGlvbiBfY2FuSGFzU2hhZG93KHRhZzogdHlwZW9mIEhUTUxFbGVtZW50KSB7XG5cdHJldHVybiBDQU5fSEFWRV9TSEFET1cuaW5jbHVkZXMoIF9lbGVtZW50MnRhZ25hbWUodGFnKSApO1xufVxuXG50eXBlIFJlc291cmNlID0gVVJMfFJlc3BvbnNlO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExJU1M8RXh0ZW5kcyAgICBleHRlbmRzIENsYXNzICAgICAgICAgICAgICA9IENsYXNzLFxuXHRcdFx0XHRcdFx0XHQgSG9zdCAgICAgICBleHRlbmRzIEhUTUxFbGVtZW50ICAgICAgICA9IEhUTUxFbGVtZW50LFxuXHRcdFx0XHRcdFx0XHQgQXR0cnMgICAgICBleHRlbmRzIHN0cmluZyAgICAgICAgICAgICA9IG5ldmVyLFxuXHRcdFx0XHRcdFx0XHQgUGFyYW1ldGVycyBleHRlbmRzIFJlY29yZDxzdHJpbmcsYW55PiA9IHt9Pih7XG5cdFx0XHRcdFx0XHRcdFx0ZXh0ZW5kcyAgICAgOiBwX2V4dGVuZHMsXG5cdFx0XHRcdFx0XHRcdFx0aG9zdCAgICAgICAgOiBwX2hvc3QsXG5cdFx0XHRcdFx0XHRcdFx0ZGVwZW5kYW5jaWVzOiBwX2RlcHMsXG5cdFx0XHRcdFx0XHRcdCAgICBhdHRyaWJ1dGVzICA6IHBfYXR0cnMsXG5cdFx0XHRcdFx0XHRcdCAgICBwYXJhbXMsXG5cdFx0XHRcdFx0XHRcdFx0Y29udGVudCxcblx0XHRcdFx0XHRcdFx0XHRjc3MsXG5cdFx0XHRcdFx0XHRcdFx0c2hhZG93ICAgICAgOiBwX3NoYWRvdyxcblx0XHRcdFx0XHRcdFx0fTogTElTU09wdGlvbnM8RXh0ZW5kcywgSG9zdCwgQXR0cnMsIFBhcmFtZXRlcnM+ID0ge30pIHtcblxuXHQvL1RPRE8gbWVyZ2UgcHJvcCBpZiBleHRlbmRzIExJU1MuLi5cblxuXHRjb25zdCBob3N0ICAgICAgICA9IHBfaG9zdCAgICA/PyBIVE1MRWxlbWVudCBhcyBDb25zdHJ1Y3RvcjxIb3N0Pjtcblx0Y29uc3QgX2V4dGVuZHMgICAgPSBwX2V4dGVuZHMgPz8gT2JqZWN0ICAgICAgYXMgdW5rbm93biBhcyBDb25zdHJ1Y3RvcjxFeHRlbmRzPjtcblx0Y29uc3QgYXR0cmlidXRlcyAgPSBwX2F0dHJzICAgPz8gW107XG5cdGNvbnN0IGRlcGVuZGFuY2llcz0gcF9kZXBzICAgID8gWy4uLnBfZGVwc10gOiBbXTtcblx0Y29uc3QgY2FuSGFzU2hhZG93PSBfY2FuSGFzU2hhZG93KGhvc3QpO1xuXHRjb25zdCBzaGFkb3cgICAgICA9IHBfc2hhZG93ICA/PyAoY2FuSGFzU2hhZG93ID8gU2hhZG93Q2ZnLkNMT1NFIDogU2hhZG93Q2ZnLk5PTkUpO1xuXG5cdGlmKCAhIGNhbkhhc1NoYWRvdyAmJiBzaGFkb3cgIT09IFNoYWRvd0NmZy5OT05FKVxuXHRcdHRocm93IG5ldyBFcnJvcihgSG9zdCBlbGVtZW50ICR7X2VsZW1lbnQydGFnbmFtZShob3N0KX0gZG9lcyBub3Qgc3VwcG9ydCBTaGFkb3dSb290YCk7XG5cblx0Ly8gQ09OVEVOVCBwcm9jZXNzaW5nXG5cdGlmKCBjb250ZW50ICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRkZXBlbmRhbmNpZXMucHVzaCggKCBhc3luYyAoKSA9PiB7XG5cblx0XHRcdGNvbnRlbnQgPSBhd2FpdCBjb250ZW50O1xuXG5cdFx0XHRpZihjb250ZW50IGluc3RhbmNlb2YgSFRNTFRlbXBsYXRlRWxlbWVudClcblx0XHRcdGNvbnRlbnQgPSBjb250ZW50LmlubmVySFRNTDtcblxuXHRcdFx0aWYoIHR5cGVvZiBjb250ZW50ID09PSBcInN0cmluZ1wiKSB7XG5cblx0XHRcdFx0Y29udGVudCA9IGNvbnRlbnQudHJpbSgpOyAvLyBOZXZlciByZXR1cm4gYSB0ZXh0IG5vZGUgb2Ygd2hpdGVzcGFjZSBhcyB0aGUgcmVzdWx0XG5cdFx0XHRcdGlmKGNvbnRlbnQgPT09ICcnKVxuXHRcdFx0XHRcdGNvbnRlbnQgPSB1bmRlZmluZWQ7XG5cblx0XHRcdH1cblx0XHRcdGlmKCBjb250ZW50IGluc3RhbmNlb2YgUmVzcG9uc2UgKVxuXHRcdFx0XHRjb250ZW50ID0gYXdhaXQgY29udGVudC50ZXh0KCk7XG5cblx0XHRcdHJldHVybiBMSVNTQmFzZS5QYXJhbWV0ZXJzLmNvbnRlbnQgPSBjb250ZW50O1xuXHRcdH0pKCkgKTtcblx0fVxuXG5cdC8vIENTUyBwcm9jZXNzaW5nXG5cdGxldCBzdHlsZXNoZWV0czogcmVhZG9ubHkgQ1NTU3R5bGVTaGVldFtdID0gW107XG5cdGlmKCBjc3MgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdGlmKCAhIEFycmF5LmlzQXJyYXkoY3NzKSApXG5cdFx0XHRjc3MgPSBbY3NzIGFzIENTU19Tb3VyY2VdO1xuXG5cdFx0c3R5bGVzaGVldHMgPSBuZXcgQXJyYXk8Q1NTU3R5bGVTaGVldD4oY3NzLmxlbmd0aCk7XG5cblx0XHRjb25zdCBmZXRjaF9jc3MgPSAoYXN5bmMgKGNzczogQ1NTX1NvdXJjZSkgPT4ge1xuXHRcdFx0Y3NzID0gYXdhaXQgY3NzO1xuXHRcdFx0aWYoY3NzIGluc3RhbmNlb2YgQ1NTU3R5bGVTaGVldClcblx0XHRcdFx0cmV0dXJuIGNzcztcblx0XHRcdGlmKCBjc3MgaW5zdGFuY2VvZiBIVE1MU3R5bGVFbGVtZW50KVxuXHRcdFx0XHRyZXR1cm4gY3NzLnNoZWV0ITtcblxuXHRcdFx0bGV0IHN0eWxlID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcblx0XHRcdGlmKCB0eXBlb2YgY3NzID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0XHRzdHlsZS5yZXBsYWNlKGNzcyk7XG5cdFx0XHRcdHJldHVybiBzdHlsZTtcblx0XHRcdH1cblxuXHRcdFx0Ly9pZiggY3NzIGluc3RhbmNlb2YgUmVzcG9uc2UgKVxuXHRcdFx0c3R5bGUucmVwbGFjZShhd2FpdCBjc3MudGV4dCgpKTtcblx0XHRcdHJldHVybiBzdHlsZTtcblx0XHR9KTtcblxuXHRcdGRlcGVuZGFuY2llcy5wdXNoKCAuLi5jc3MubWFwKCBhc3luYyAoY3NzLCBpZHgpID0+ICAoc3R5bGVzaGVldHMgYXMgYW55KVtpZHhdID0gYXdhaXQgZmV0Y2hfY3NzKGNzcykgKSApO1xuXHR9XG5cblx0dHlwZSBMSG9zdCA9IExJU1NIb3N0PExJU1NCYXNlPjtcblxuXHQvLyBAdHMtaWdub3JlXG5cdGNsYXNzIExJU1NCYXNlIGV4dGVuZHMgX2V4dGVuZHMge1xuXG5cdFx0cmVhZG9ubHkgI2hvc3Q6IGFueTsgLy8gcHJldmVudHMgaXNzdWUgIzEuLi5cblxuXHRcdGNvbnN0cnVjdG9yKCkge1xuXG5cdFx0XHRzdXBlcigpO1xuXG5cdFx0XHQvLyBoNGNrLCBva2F5IGJlY2F1c2UgSlMgaXMgbW9ub3RocmVhZGVkLlxuXHRcdFx0aWYoIF9fY3N0cl9ob3N0ID09PSBudWxsIClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiUGxlYXNlIGRvIG5vdCBkaXJlY3RseSBjYWxsIHRoaXMgY29uc3RydWN0b3JcIik7XG5cdFx0XHR0aGlzLiNob3N0ID0gX19jc3RyX2hvc3Q7XG5cdFx0XHRfX2NzdHJfaG9zdCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0cHVibGljIGdldCBob3N0KCk6IEhvc3Qge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2hvc3Q7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBnZXQgYXR0cnMoKSB7XG5cdFx0XHRyZXR1cm4gKHRoaXMuI2hvc3QgYXMgTEhvc3QpLmF0dHJzO1xuXHRcdH1cblx0XHRwcm90ZWN0ZWQgc2V0QXR0ckRlZmF1bHQoIGF0dHI6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpIHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuc2V0QXR0ckRlZmF1bHQoYXR0ciwgdmFsdWUpO1xuXG5cdFx0fVxuXHRcdHByb3RlY3RlZCBnZXQgcGFyYW1zKCkge1xuXHRcdFx0cmV0dXJuICh0aGlzLiNob3N0IGFzIExIb3N0KS5wYXJhbXM7XG5cdFx0fVxuXHRcdHByb3RlY3RlZCBnZXQgY29udGVudCgpIHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuY29udGVudCE7XG5cdFx0fVxuXG5cdFx0c3RhdGljIHJlYWRvbmx5IFBhcmFtZXRlcnMgPSB7XG5cdFx0XHRob3N0LFxuXHRcdFx0ZGVwZW5kYW5jaWVzLFxuXHRcdFx0YXR0cmlidXRlcyxcblx0XHRcdHBhcmFtcyxcblx0XHRcdGNvbnRlbnQsXG5cdFx0XHRzdHlsZXNoZWV0cyxcblx0XHRcdHNoYWRvdyxcblx0XHR9O1xuXG5cdFx0cHJvdGVjdGVkIG9uQXR0ckNoYW5nZWQoX25hbWU6IHN0cmluZyxcblx0XHRcdFx0XHRcdFx0XHRfb2xkVmFsdWU6IHN0cmluZyxcblx0XHRcdFx0XHRcdFx0XHRfbmV3VmFsdWU6IHN0cmluZyk6IHZvaWR8ZmFsc2Uge31cblxuXHRcdHByb3RlY3RlZCBnZXQgaXNJbkRPTSgpIHtcblx0XHRcdHJldHVybiAodGhpcy4jaG9zdCBhcyBMSG9zdCkuaXNJbkRPTTtcblx0XHR9XG5cdFx0cHJvdGVjdGVkIG9uRE9NQ29ubmVjdGVkKCkge31cblx0XHRwcm90ZWN0ZWQgb25ET01EaXNjb25uZWN0ZWQoKSB7fVxuXHR9XG5cblx0cmV0dXJuIExJU1NCYXNlO1xufVxuXG4vL1RPRE86IG90aGVyIG9wdGlvbnMuLi5cbmZ1bmN0aW9uIGV4dGVuZHNMSVNTPEV4dGVuZHMgZXh0ZW5kcyBDbGFzcyxcblx0SG9zdCAgICBleHRlbmRzIEhUTUxFbGVtZW50LFxuXHRBdHRyczEgICBleHRlbmRzIHN0cmluZyxcblx0QXR0cnMyICAgZXh0ZW5kcyBzdHJpbmcsXG5cdFBhcmFtcyAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLGFueT4sXG5cdFQgZXh0ZW5kcyBMSVNTUmV0dXJuVHlwZTxFeHRlbmRzLCBIb3N0LCBBdHRyczEsIFBhcmFtcz4+KExpc3M6IFQsIHBhcmFtZXRlcnM6IHthdHRyaWJ1dGVzOiByZWFkb25seSBBdHRyczJbXX0pIHtcblxuXHQvLyBUT0RPOiBvdGhlciBvcHRpb25zLi4uXG5cdGNvbnN0IGF0dHJzID0gWy4uLkxpc3MuUGFyYW1ldGVycy5hdHRyaWJ1dGVzLCAuLi5wYXJhbWV0ZXJzLmF0dHJpYnV0ZXMhXTtcblx0Y29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgTGlzcy5QYXJhbWV0ZXJzLCB7YXR0cmlidXRlczogYXR0cnN9KTtcblxuXHQvLyBAdHMtaWdub3JlIDogYmVjYXVzZSBUUyBzdHVwaWRcblx0Y2xhc3MgRXh0ZW5kZWRMSVNTIGV4dGVuZHMgTGlzcyB7XG5cdFx0Y29uc3RydWN0b3IoLi4udDogYW55W10pIHtcblx0XHRcdC8vIEB0cy1pZ25vcmUgOiBiZWNhdXNlIFRTIHN0dXBpZFxuXHRcdFx0c3VwZXIoLi4udCk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIG92ZXJyaWRlIGdldCBhdHRycygpIHtcblx0XHRcdHJldHVybiBzdXBlci5hdHRycyBhcyBSZWNvcmQ8QXR0cnMyfEF0dHJzMSwgc3RyaW5nfG51bGw+O1xuXHRcdH1cblxuXHRcdHN0YXRpYyBvdmVycmlkZSBQYXJhbWV0ZXJzID0gcGFyYW1zO1xuXHR9XG5cblx0cmV0dXJuIEV4dGVuZGVkTElTUztcbn1cbkxJU1MuZXh0ZW5kc0xJU1MgPSBleHRlbmRzTElTUztcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyB0eXBlIGhlbHBlcnMgPT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG50eXBlIGJ1aWxkTElTU0hvc3RSZXR1cm5UeXBlPFQ+ICA9IFQgZXh0ZW5kcyBMSVNTUmV0dXJuVHlwZTxpbmZlciBFeHRlbmRzIGV4dGVuZHMgQ2xhc3MsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpbmZlciBIb3N0ICAgIGV4dGVuZHMgSFRNTEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpbmZlciBBdHRycyAgIGV4dGVuZHMgc3RyaW5nLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aW5mZXIgUGFyYW1zICBleHRlbmRzIFJlY29yZDxzdHJpbmcsYW55Pj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdD8gUmV0dXJuVHlwZTx0eXBlb2YgYnVpbGRMSVNTSG9zdDxFeHRlbmRzLCBIb3N0LCBBdHRycywgUGFyYW1zLCBUPj4gOiBuZXZlcjtcblxuZXhwb3J0IHR5cGUgTElTU1JldHVyblR5cGU8XG5cdEV4dGVuZHMgZXh0ZW5kcyBDbGFzcyxcblx0SG9zdCAgICBleHRlbmRzIEhUTUxFbGVtZW50LFxuXHRBdHRycyAgIGV4dGVuZHMgc3RyaW5nLFxuXHRQYXJhbXMgIGV4dGVuZHMgUmVjb3JkPHN0cmluZyxhbnk+PiA9IFJldHVyblR5cGU8dHlwZW9mIExJU1M8RXh0ZW5kcywgSG9zdCwgQXR0cnMsIFBhcmFtcz4+O1xuZXhwb3J0IHR5cGUgTElTU0Jhc2U8RXh0ZW5kcyBleHRlbmRzIENsYXNzLFxuXHRcdFx0XHRcdCBIb3N0ICAgIGV4dGVuZHMgSFRNTEVsZW1lbnQsXG5cdFx0XHRcdFx0IEF0dHJzICAgZXh0ZW5kcyBzdHJpbmcsXG5cdFx0XHRcdFx0IFBhcmFtcyAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLGFueT4+ID0gSW5zdGFuY2VUeXBlPExJU1NSZXR1cm5UeXBlPEV4dGVuZHMsIEhvc3QsIEF0dHJzLCBQYXJhbXM+PjtcbmV4cG9ydCB0eXBlIExJU1NIb3N0PExJU1MgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+ID4gPSBJbnN0YW5jZVR5cGU8YnVpbGRMSVNTSG9zdFJldHVyblR5cGU8Q29uc3RydWN0b3I8TElTUz4gJiB7UGFyYW1ldGVyczogYW55fT4+O1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PSBMSVNTSG9zdCBjbGFzcyA9PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmxldCBpZCA9IDA7XG5cbmZ1bmN0aW9uIGJ1aWxkTElTU0hvc3Q8RXh0ZW5kcyBleHRlbmRzIENsYXNzLFxuXHRcdFx0XHRcdCAgIEhvc3QgICAgZXh0ZW5kcyBIVE1MRWxlbWVudCxcblx0XHRcdFx0XHQgICBBdHRycyAgIGV4dGVuZHMgc3RyaW5nLFxuXHRcdFx0XHRcdCAgIFBhcmFtcyAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLGFueT4sXG5cdFx0XHRcdFx0ICAgVCBleHRlbmRzIExJU1NSZXR1cm5UeXBlPEV4dGVuZHMsIEhvc3QsIEF0dHJzLCBQYXJhbXM+PihMaXNzOiBULCBfcGFyYW1zOiBQYXJ0aWFsPFBhcmFtcz4gPSB7fSkge1xuXHRjb25zdCB7XG5cdFx0aG9zdCxcblx0XHRhdHRyaWJ1dGVzLFxuXHRcdGNvbnRlbnQsXG5cdFx0c3R5bGVzaGVldHMsXG5cdFx0c2hhZG93LFxuXHR9ID0gTGlzcy5QYXJhbWV0ZXJzO1xuXG5cdGNvbnN0IGFscmVhZHlEZWNsYXJlZENTUyA9IG5ldyBTZXQoKTtcblxuXHRjb25zdCBHRVQgPSBTeW1ib2woJ2dldCcpO1xuXHRjb25zdCBTRVQgPSBTeW1ib2woJ3NldCcpO1xuXG5cdGNvbnN0IHByb3BlcnRpZXMgPSBPYmplY3QuZnJvbUVudHJpZXMoIGF0dHJpYnV0ZXMubWFwKG4gPT4gW24sIHtcblxuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbigpOiBzdHJpbmd8bnVsbCAgICAgIHsgcmV0dXJuICh0aGlzIGFzIHVua25vd24gYXMgQXR0cmlidXRlcylbR0VUXShuKTsgfSxcblx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlOiBzdHJpbmd8bnVsbCkgeyByZXR1cm4gKHRoaXMgYXMgdW5rbm93biBhcyBBdHRyaWJ1dGVzKVtTRVRdKG4sIHZhbHVlKTsgfVxuXHR9XSkgKTtcblxuXHRjbGFzcyBBdHRyaWJ1dGVzIHtcbiAgICAgICAgW3g6IHN0cmluZ106IHN0cmluZ3xudWxsO1xuXG4gICAgICAgICNkYXRhICAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+O1xuICAgICAgICAjZGVmYXVsdHMgOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcbiAgICAgICAgI3NldHRlciAgIDogKG5hbWU6IEF0dHJzLCB2YWx1ZTogc3RyaW5nfG51bGwpID0+IHZvaWQ7XG5cbiAgICAgICAgW0dFVF0obmFtZTogQXR0cnMpIHtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jZGF0YVtuYW1lXSA/PyB0aGlzLiNkZWZhdWx0c1tuYW1lXSA/PyBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBbU0VUXShuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKXtcbiAgICAgICAgXHRyZXR1cm4gdGhpcy4jc2V0dGVyKG5hbWUsIHZhbHVlKTsgLy8gcmVxdWlyZWQgdG8gZ2V0IGEgY2xlYW4gb2JqZWN0IHdoZW4gZG9pbmcgey4uLmF0dHJzfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IoZGF0YSAgICA6IFJlY29yZDxBdHRycywgc3RyaW5nfG51bGw+LFxuXHRcdFx0XHRcdGRlZmF1bHRzOiBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPixcbiAgICAgICAgXHRcdFx0c2V0dGVyICA6IChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSA9PiB2b2lkKSB7XG5cbiAgICAgICAgXHR0aGlzLiNkYXRhICAgICA9IGRhdGE7XG5cdFx0XHR0aGlzLiNkZWZhdWx0cyA9IGRlZmF1bHRzO1xuICAgICAgICBcdHRoaXMuI3NldHRlciA9IHNldHRlcjtcblxuICAgICAgICBcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHByb3BlcnRpZXMpO1xuICAgICAgICB9XG5cdH1cblxuXHQvLyBAdHMtaWdub3JlIDogYmVjYXVzZSBUUyBpcyBzdHVwaWQuXG5cdGNsYXNzIExJU1NIb3N0QmFzZSBleHRlbmRzIGhvc3Qge1xuXG5cdFx0cmVhZG9ubHkgI3BhcmFtczogUGFyYW1zO1xuXG5cdFx0cmVhZG9ubHkgI2lkID0gKytpZDsgLy8gZm9yIGRlYnVnXG5cblx0XHRjb25zdHJ1Y3RvcihwYXJhbXM6IFBhcnRpYWw8UGFyYW1zPiA9IHt9KSB7XG5cdFx0XHRzdXBlcigpO1xuXHRcdFx0dGhpcy4jcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgTGlzcy5QYXJhbWV0ZXJzLnBhcmFtcywgX3BhcmFtcywgcGFyYW1zKTtcblxuXHRcdFx0dGhpcy4jd2FpdEluaXQgPSBuZXcgUHJvbWlzZSggKHJlc29sdmUpID0+IHtcblx0XHRcdFx0aWYodGhpcy5pc0luaXQpXG5cdFx0XHRcdFx0cmV0dXJuIHJlc29sdmUodGhpcy4jQVBJISk7XG5cdFx0XHRcdHRoaXMuI3Jlc29sdmUgPSByZXNvbHZlO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0LyoqKiogcHVibGljIEFQSSAqKioqKioqKioqKioqL1xuXG5cdFx0Z2V0IGlzSW5pdCgpIHtcblx0XHRcdHJldHVybiB0aGlzLiNBUEkgIT09IG51bGw7XG5cdFx0fVxuXHRcdGluaXRpYWxpemUocGFyYW1zOiBQYXJ0aWFsPFBhcmFtcz4gPSB7fSkge1xuXG5cdFx0XHRpZiggdGhpcy5pc0luaXQgKVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgYWxyZWFkeSBpbml0aWFsaXplZCEnKTtcblxuXHRcdFx0T2JqZWN0LmFzc2lnbih0aGlzLiNwYXJhbXMsIHBhcmFtcyk7XG5cblx0XHRcdGNvbnN0IGFwaSA9IHRoaXMuaW5pdCgpO1xuXG5cdFx0XHRpZiggdGhpcy4jaXNJbkRPTSApXG5cdFx0XHRcdChhcGkgYXMgYW55KS5vbkRPTUNvbm5lY3RlZCgpO1xuXG5cdFx0XHRyZXR1cm4gYXBpO1xuXHRcdH1cblxuXHRcdGdldCBMSVNTU3luYygpIHtcblx0XHRcdGlmKCAhIHRoaXMuaXNJbml0IClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdBY2Nlc3NpbmcgQVBJIGJlZm9yZSBXZWJDb21wb25lbnQgaW5pdGlhbGl6YXRpb24hJyk7XG5cdFx0XHRyZXR1cm4gdGhpcy4jQVBJITtcblx0XHR9XG5cdFx0Z2V0IExJU1MoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy4jd2FpdEluaXQ7XG5cdFx0fVxuXG5cdFx0LyoqKiBpbml0ICoqKi9cblx0XHQjd2FpdEluaXQ6IFByb21pc2U8SW5zdGFuY2VUeXBlPFQ+Pjtcblx0XHQjcmVzb2x2ZTogKCh1OiBJbnN0YW5jZVR5cGU8VD4pID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG5cdFx0I0FQSTogSW5zdGFuY2VUeXBlPFQ+IHwgbnVsbCA9IG51bGw7XG5cblx0XHQjaXNJbkRPTSA9IGZhbHNlO1xuXHRcdGdldCBpc0luRE9NKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2lzSW5ET007XG5cdFx0fVxuXG5cdFx0ZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHR0aGlzLiNpc0luRE9NID0gZmFsc2U7XG5cdFx0XHQodGhpcy4jQVBJISBhcyBhbnkpLm9uRE9NRGlzY29ubmVjdGVkKCk7XG5cdFx0fVxuXG5cdFx0Y29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cblx0XHRcdHRoaXMuI2lzSW5ET00gPSB0cnVlO1xuXHRcblx0XHRcdGlmKCAhIHRoaXMuaXNJbml0ICkge1xuXHRcdFx0XHR0aGlzLmluaXQoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQodGhpcy4jQVBJISBhcyBhbnkpLm9uRE9NQ29ubmVjdGVkKCk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBpbml0KCkge1xuXHRcdFx0XG5cdFx0XHRjdXN0b21FbGVtZW50cy51cGdyYWRlKHRoaXMpO1xuXHRcdFx0XG5cdFx0XHQvLyBzaGFkb3dcblx0XHRcdHRoaXMuI2NvbnRlbnQgPSB0aGlzIGFzIHVua25vd24gYXMgSG9zdDtcblx0XHRcdGlmKCBzaGFkb3cgIT09ICdub25lJykge1xuXHRcdFx0XHR0aGlzLiNjb250ZW50ID0gdGhpcy5hdHRhY2hTaGFkb3coe21vZGU6IHNoYWRvd30pO1xuXG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxuXHRcdFx0XHR0aGlzLiNjb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGlja0V2ZW50KTtcblx0XHRcdFx0Ly9AdHMtaWdub3JlXG5cdFx0XHRcdHRoaXMuI2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBvbkNsaWNrRXZlbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBhdHRyc1xuXHRcdFx0Zm9yKGxldCBvYnMgb2YgYXR0cmlidXRlcyEpXG5cdFx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNbb2JzXSA9IHRoaXMuZ2V0QXR0cmlidXRlKG9icyk7XG5cblx0XHRcdC8vIGNzc1xuXHRcdFx0aWYoIHNoYWRvdyAhPT0gJ25vbmUnKVxuXHRcdFx0XHQodGhpcy4jY29udGVudCBhcyBTaGFkb3dSb290KS5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChzaGFyZWRDU1MpO1xuXHRcdFx0aWYoIHN0eWxlc2hlZXRzLmxlbmd0aCApIHtcblxuXHRcdFx0XHRpZiggc2hhZG93ICE9PSAnbm9uZScpXG5cdFx0XHRcdFx0KHRoaXMuI2NvbnRlbnQgYXMgU2hhZG93Um9vdCkuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goLi4uc3R5bGVzaGVldHMpO1xuXHRcdFx0XHRlbHNlIHtcblxuXHRcdFx0XHRcdGNvbnN0IGNzc3NlbGVjdG9yID0gdGhpcy5DU1NTZWxlY3RvcjtcblxuXHRcdFx0XHRcdC8vIGlmIG5vdCB5ZXQgaW5zZXJ0ZWQgOlxuXHRcdFx0XHRcdGlmKCAhIGFscmVhZHlEZWNsYXJlZENTUy5oYXMoY3Nzc2VsZWN0b3IpICkge1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRsZXQgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG5cdFx0XHRcdFx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoJ2ZvcicsIGNzc3NlbGVjdG9yKTtcblxuXHRcdFx0XHRcdFx0bGV0IGh0bWxfc3R5bGVzaGVldHMgPSBcIlwiO1xuXG5cdFx0XHRcdFx0XHRmb3IobGV0IHN0eWxlIG9mIHN0eWxlc2hlZXRzKVxuXHRcdFx0XHRcdFx0XHRmb3IobGV0IHJ1bGUgb2Ygc3R5bGUuY3NzUnVsZXMpXG5cdFx0XHRcdFx0XHRcdFx0aHRtbF9zdHlsZXNoZWV0cyArPSBydWxlLmNzc1RleHQgKyAnXFxuJztcblxuXHRcdFx0XHRcdFx0c3R5bGUuaW5uZXJIVE1MID0gaHRtbF9zdHlsZXNoZWV0cy5yZXBsYWNlKCc6aG9zdCcsIGA6aXMoJHtjc3NzZWxlY3Rvcn0pYCk7XG5cblx0XHRcdFx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kKHN0eWxlKTtcblxuXHRcdFx0XHRcdFx0YWxyZWFkeURlY2xhcmVkQ1NTLmFkZChjc3NzZWxlY3Rvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGNvbnRlbnRcblx0XHRcdGlmKCBjb250ZW50ICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdGxldCB0ZW1wbGF0ZV9lbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcblx0XHRcdFx0bGV0IHN0ciA9IChjb250ZW50IGFzIHN0cmluZykucmVwbGFjZSgvXFwkXFx7KC4rPylcXH0vZywgKF8sIG1hdGNoKSA9PiB0aGlzLmdldEF0dHJpYnV0ZShtYXRjaCk/PycnKVxuXHQgICAgXHRcdHRlbXBsYXRlX2VsZW0uaW5uZXJIVE1MID0gc3RyO1xuXHQgICAgXHRcdHRoaXMuI2NvbnRlbnQuYXBwZW5kKC4uLnRlbXBsYXRlX2VsZW0uY29udGVudC5jaGlsZE5vZGVzKTtcblx0ICAgIFx0fVxuXG5cdCAgICBcdC8vIGJ1aWxkXG5cblx0ICAgIFx0Ly8gaDRjaywgb2theSBiZWNhdXNlIEpTIGlzIG1vbm90aHJlYWRlZC5cblx0XHRcdF9fY3N0cl9ob3N0ICAgPSB0aGlzO1xuXG5cdCAgICBcdGxldCBvYmogPSBuZXcgTGlzcygpO1xuXG5cdCAgICBcdC8qaWYoIG9iaiBpbnN0YW5jZW9mIFByb21pc2UpXG5cdCAgICBcdFx0b2JqID0gYXdhaXQgb2JqOyovXG5cblx0XHRcdHRoaXMuI0FQSSA9IG9iaiBhcyBJbnN0YW5jZVR5cGU8VD47XG5cblx0XHRcdC8vIGRlZmF1bHQgc2xvdFxuXHRcdFx0aWYoIHRoaXMuaGFzU2hhZG93ICYmIHRoaXMuI2NvbnRlbnQuY2hpbGROb2Rlcy5sZW5ndGggPT09IDAgKVxuXHRcdFx0XHR0aGlzLiNjb250ZW50LmFwcGVuZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2xvdCcpICk7XG5cblx0XHRcdGlmKCB0aGlzLiNyZXNvbHZlICE9PSBudWxsKVxuXHRcdFx0XHR0aGlzLiNyZXNvbHZlKHRoaXMuI0FQSSk7XG5cblx0XHRcdHJldHVybiB0aGlzLiNBUEk7XG5cdFx0fVxuXG5cdFx0Z2V0IHBhcmFtcygpOiBQYXJhbXMge1xuXHRcdFx0cmV0dXJuIHRoaXMuI3BhcmFtcztcblx0XHR9XG5cblxuXHRcdC8qKiogY29udGVudCAqKiovXG5cdFx0I2NvbnRlbnQ6IEhvc3R8U2hhZG93Um9vdHxudWxsID0gbnVsbDtcblxuXHRcdGdldCBjb250ZW50KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0Z2V0UGFydChuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvcihgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3IoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblx0XHRnZXRQYXJ0cyhuYW1lOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy4jY29udGVudD8ucXVlcnlTZWxlY3RvckFsbChgOjpwYXJ0KCR7bmFtZX0pYClcblx0XHRcdFx0XHQ6IHRoaXMuI2NvbnRlbnQ/LnF1ZXJ5U2VsZWN0b3JBbGwoYFtwYXJ0PVwiJHtuYW1lfVwiXWApO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXQgaGFzU2hhZG93KCk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIHNoYWRvdyAhPT0gJ25vbmUnO1xuXHRcdH1cblxuXHRcdC8qKiogQ1NTICoqKi9cblxuXHRcdGdldCBDU1NTZWxlY3RvcigpIHtcblx0XHRcdHJldHVybiB0aGlzLmhhc1NoYWRvd1xuXHRcdFx0XHRcdD8gdGhpcy50YWdOYW1lXG5cdFx0XHRcdFx0OiBgJHt0aGlzLnRhZ05hbWV9W2lzPVwiJHt0aGlzLmdldEF0dHJpYnV0ZShcImlzXCIpfVwiXWA7XG5cdFx0fVxuXG5cdFx0LyoqKiBhdHRycyAqKiovXG5cdFx0I2F0dHJzX2ZsYWcgPSBmYWxzZTtcblxuXHRcdCNhdHRyaWJ1dGVzICAgICAgICAgPSB7fSBhcyBSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPjtcblx0XHQjYXR0cmlidXRlc0RlZmF1bHRzID0ge30gYXMgUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG5cdFx0I2F0dHJzID0gbmV3IEF0dHJpYnV0ZXMoXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzLFxuXHRcdFx0dGhpcy4jYXR0cmlidXRlc0RlZmF1bHRzLFxuXHRcdFx0KG5hbWU6IEF0dHJzLCB2YWx1ZTpzdHJpbmd8bnVsbCkgPT4ge1xuXG5cdFx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNbbmFtZV0gPSB2YWx1ZTtcblxuXHRcdFx0XHR0aGlzLiNhdHRyc19mbGFnID0gdHJ1ZTsgLy8gZG8gbm90IHRyaWdnZXIgb25BdHRyc0NoYW5nZWQuXG5cdFx0XHRcdGlmKCB2YWx1ZSA9PT0gbnVsbClcblx0XHRcdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcblx0XHRcdH1cblx0XHQpIGFzIHVua25vd24gYXMgUmVjb3JkPEF0dHJzLCBzdHJpbmd8bnVsbD47XG5cblx0XHRzZXRBdHRyRGVmYXVsdChuYW1lOiBBdHRycywgdmFsdWU6IHN0cmluZ3xudWxsKSB7XG5cdFx0XHRpZiggdmFsdWUgPT09IG51bGwpXG5cdFx0XHRcdGRlbGV0ZSB0aGlzLiNhdHRyaWJ1dGVzRGVmYXVsdHNbbmFtZV07XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRoaXMuI2F0dHJpYnV0ZXNEZWZhdWx0c1tuYW1lXSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdGdldCBhdHRycygpOiBSZWFkb25seTxSZWNvcmQ8QXR0cnMsIHN0cmluZ3xudWxsPj4ge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy4jYXR0cnM7XG5cdFx0fVxuXG5cdFx0c3RhdGljIG9ic2VydmVkQXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XG5cdFx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUgICAgOiBBdHRycyxcblx0XHRcdFx0XHRcdFx0XHQgb2xkVmFsdWU6IHN0cmluZyxcblx0XHRcdFx0XHRcdFx0XHQgbmV3VmFsdWU6IHN0cmluZykge1xuXG5cdFx0XHRpZih0aGlzLiNhdHRyc19mbGFnKSB7XG5cdFx0XHRcdHRoaXMuI2F0dHJzX2ZsYWcgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiNhdHRyaWJ1dGVzW25hbWVdID0gbmV3VmFsdWU7XG5cdFx0XHRpZiggISB0aGlzLmlzSW5pdCApXG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0aWYoICh0aGlzLiNBUEkhIGFzIGFueSkub25BdHRyQ2hhbmdlZChuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpID09PSBmYWxzZSkge1xuXHRcdFx0XHR0aGlzLiNhdHRyc1tuYW1lXSA9IG9sZFZhbHVlOyAvLyByZXZlcnQgdGhlIGNoYW5nZS5cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIExJU1NIb3N0QmFzZTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBkZWZpbmUgPT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBfRE9NQ29udGVudExvYWRlZCA9IG5ldyBQcm9taXNlPHZvaWQ+KCAocmVzb2x2ZSkgPT4ge1xuXG5cdGlmKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIiB8fCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIpXG5cdFx0cmV0dXJuIHJlc29sdmUoKTtcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuXHRcdHJlc29sdmUoKTtcblx0fSwgdHJ1ZSk7XG59KTtcblxuTElTUy5kZWZpbmUgPSBhc3luYyBmdW5jdGlvbjxFeHRlbmRzIGV4dGVuZHMgQ2xhc3MsXG5cdFx0XHRcdFx0XHRcdCBIb3N0ICAgIGV4dGVuZHMgSFRNTEVsZW1lbnQsXG5cdFx0XHRcdFx0XHQgICAgIEF0dHJzICAgZXh0ZW5kcyBzdHJpbmcsXG5cdFx0XHRcdFx0XHQgICAgIFBhcmFtcyAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLGFueT4sXG5cdFx0XHRcdFx0XHQgICBcdCBUIGV4dGVuZHMgTElTU1JldHVyblR5cGU8RXh0ZW5kcywgSG9zdCwgQXR0cnMsIFBhcmFtcz4+KFxuXHRcdFx0XHRcdFx0ICAgXHR0YWduYW1lOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRcdENvbXBvbmVudENsYXNzOiBULFxuXHRcdFx0XHRcdFx0XHR7ZGVwZW5kYW5jaWVzLCBwYXJhbXN9OiB7cGFyYW1zPzogUGFydGlhbDxQYXJhbXM+LCBkZXBlbmRhbmNpZXM/OiByZWFkb25seSBQcm9taXNlPHN0cmluZz5bXX0gPSB7fSkge1xuXG5cdGRlcGVuZGFuY2llcz8/PVtdO1xuXHRwYXJhbXMgICAgICA/Pz0ge307XG5cblx0Y29uc3QgQ2xhc3MgPSBDb21wb25lbnRDbGFzcy5QYXJhbWV0ZXJzLmhvc3Q7XG5cdGxldCBMSVNTQmFzZTogYW55ID0gQ29tcG9uZW50Q2xhc3M7XG5cdGxldCBodG1sdGFnID0gX2VsZW1lbnQydGFnbmFtZShDbGFzcyk/P3VuZGVmaW5lZDtcblxuXHRhd2FpdCBQcm9taXNlLmFsbChbX0RPTUNvbnRlbnRMb2FkZWQsIC4uLmRlcGVuZGFuY2llcywgLi4uTElTU0Jhc2UuUGFyYW1ldGVycy5kZXBlbmRhbmNpZXNdKTtcblxuXHRjb25zdCBMSVNTY2xhc3MgPSBidWlsZExJU1NIb3N0PEV4dGVuZHMsIEhvc3QsIEF0dHJzLCBQYXJhbXMsIFQ+KENvbXBvbmVudENsYXNzLCBwYXJhbXMpO1xuXHRcblx0Y29uc3Qgb3B0cyA9IGh0bWx0YWcgPT09IHVuZGVmaW5lZCA/IHt9XG5cdFx0XHRcdFx0XHRcdFx0XHQgICA6IHtleHRlbmRzOiBodG1sdGFnfTtcblx0XG5cdGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWduYW1lLCBMSVNTY2xhc3MsIG9wdHMpO1xufTtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBTaGFkb3dSb290IHRvb2xzID09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBzaGFyZWRDU1MgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuZG9jdW1lbnQuYWRvcHRlZFN0eWxlU2hlZXRzLnB1c2goc2hhcmVkQ1NTKTtcblxuTElTUy5pbnNlcnRHbG9iYWxDU1NSdWxlcyA9IGZ1bmN0aW9uKGNzczogc3RyaW5nfEhUTUxTdHlsZUVsZW1lbnQpIHtcblxuXHRsZXQgY3NzX3N0eWxlITogQ1NTU3R5bGVTaGVldDtcblxuXHRpZiggY3NzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudCApXG5cdFx0Y3NzX3N0eWxlID0gY3NzLnNoZWV0ITtcblx0aWYoIHR5cGVvZiBjc3MgPT09IFwic3RyaW5nXCIpIHtcblx0XHRjc3Nfc3R5bGUgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuXHRcdGNzc19zdHlsZS5yZXBsYWNlU3luYyhjc3MpO1xuXHR9XG5cblx0Zm9yKGxldCBydWxlIG9mIGNzc19zdHlsZS5jc3NSdWxlcylcblx0XHRzaGFyZWRDU1MuaW5zZXJ0UnVsZShydWxlLmNzc1RleHQpO1xufVxuXG50eXBlIERlbGVnYXRlZEhhbmRsZXIgPSBbc3RyaW5nLCAoZXY6IE1vdXNlRXZlbnQpID0+IHZvaWRdO1xuY29uc3QgREVMRUdBVEVEX0VWRU5UUyA9IHtcblx0XCJjbGlja1wiOiBbXSBhcyBEZWxlZ2F0ZWRIYW5kbGVyW10sXG5cdFwiZGJsY2xpY2tcIjogW10gYXMgRGVsZWdhdGVkSGFuZGxlcltdXG59O1xuXG5jb25zdCBBTFJFQURZX1BST0NFU1NFRCA9IFN5bWJvbCgpO1xuXG5mdW5jdGlvbiBvbkNsaWNrRXZlbnQoZXY6IE1vdXNlRXZlbnQpIHtcblxuXHRpZiggKGV2IGFzIGFueSlbQUxSRUFEWV9QUk9DRVNTRURdID09PSB0cnVlIClcblx0XHRyZXR1cm47XG5cdChldiBhcyBhbnkpW0FMUkVBRFlfUFJPQ0VTU0VEXSA9IHRydWU7XG5cblx0Y29uc3QgaGFuZGxlcnMgPSBERUxFR0FURURfRVZFTlRTW2V2LnR5cGUgYXMga2V5b2YgdHlwZW9mIERFTEVHQVRFRF9FVkVOVFNdO1xuXG5cdGZvcihsZXQgZWxlbSBvZiBldi5jb21wb3NlZFBhdGgoKSApIHtcblx0XG5cdFx0aWYoIGVsZW0gaW5zdGFuY2VvZiBTaGFkb3dSb290IHx8IGVsZW0gPT09IGRvY3VtZW50IHx8IGVsZW0gPT09IHdpbmRvdyApXG5cdFx0XHRjb250aW51ZTtcblxuXHRcdHZhciB0YXJnZXQgPSBlbGVtIGFzIEVsZW1lbnQ7XG5cblx0XHRmb3IobGV0IFtzZWxlY3RvciwgaGFuZGxlcl0gb2YgaGFuZGxlcnMpIHtcblx0XHRcdGlmKCB0YXJnZXQubWF0Y2hlcyhzZWxlY3RvcikgKVxuXHRcdFx0XHRoYW5kbGVyKGV2KTtcblx0XHR9XG5cdH1cbn1cblxuTElTUy5pbnNlcnRHbG9iYWxEZWxlZ2F0ZWRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50X25hbWU6IGtleW9mIHR5cGVvZiBERUxFR0FURURfRVZFTlRTLCBzZWxlY3Rvcjogc3RyaW5nLCBoYW5kbGVyOiAoZXY6IE1vdXNlRXZlbnQpID0+IHZvaWQgKSB7XG5cdERFTEVHQVRFRF9FVkVOVFNbZXZlbnRfbmFtZV0ucHVzaChbc2VsZWN0b3IsIGhhbmRsZXJdKVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIG9uQ2xpY2tFdmVudCk7XG5cbkxJU1MuY2xvc2VzdCA9IGZ1bmN0aW9uIGNsb3Nlc3Q8RSBleHRlbmRzIEVsZW1lbnQ+KHNlbGVjdG9yOiBzdHJpbmcsIGVsZW1lbnQ6IEVsZW1lbnQpIHtcblxuXHR3aGlsZSh0cnVlKSB7XG5cdFx0dmFyIHJlc3VsdCA9IGVsZW1lbnQuY2xvc2VzdDxFPihzZWxlY3Rvcik7XG5cblx0XHRpZiggcmVzdWx0ICE9PSBudWxsKVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblxuXHRcdGNvbnN0IHJvb3QgPSBlbGVtZW50LmdldFJvb3ROb2RlKCk7XG5cdFx0aWYoICEgKFwiaG9zdFwiIGluIHJvb3QpIClcblx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0ZWxlbWVudCA9IChyb290IGFzIFNoYWRvd1Jvb3QpLmhvc3Q7XG5cdH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBoZWxwZXJzID09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG50eXBlIGluZmVyUGFyYW1zPFQ+ID0gVCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LCBpbmZlciBQIGV4dGVuZHMgUmVjb3JkPHN0cmluZyxhbnk+PiA/IFAgOiBuZXZlcjtcblxudHlwZSBCVUlMRF9PUFRJT05TPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+PiA9IFBhcnRpYWw8e1xuXHRcdFx0XHRcdCAgXHRwYXJhbXMgICAgOiBQYXJ0aWFsPGluZmVyUGFyYW1zPFQ+Pixcblx0XHRcdFx0XHQgIFx0Y29udGVudFx0ICA6IHN0cmluZ3xOb2RlfHJlYWRvbmx5IE5vZGVbXSxcblx0XHRcdFx0XHRcdGlkIFx0XHQgIDogc3RyaW5nLFxuXHRcdFx0XHRcdCAgXHRjbGFzc2VzXHQgIDogcmVhZG9ubHkgc3RyaW5nW10sXG5cdFx0XHRcdFx0ICBcdGNzc3ZhcnMgICA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHN0cmluZz4+LFxuXHRcdFx0XHRcdCAgXHRhdHRycyBcdCAgOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBzdHJpbmd8Ym9vbGVhbj4+LFxuXHRcdFx0XHRcdCAgXHRkYXRhIFx0ICA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHN0cmluZ3xib29sZWFuPj4sXG5cdFx0XHRcdFx0ICBcdGxpc3RlbmVycyA6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIChldjogRXZlbnQpID0+IHZvaWQ+PlxuXHRcdFx0XHRcdH0+ICYgKHtcblx0XHRcdFx0XHRcdGluaXRpYWxpemU6IGZhbHNlLFxuXHRcdFx0XHRcdFx0cGFyZW50OiBFbGVtZW50XG5cdFx0XHRcdFx0fXx7XG5cdFx0XHRcdFx0XHRpbml0aWFsaXplPzogdHJ1ZSxcblx0XHRcdFx0XHRcdHBhcmVudD86IEVsZW1lbnRcblx0XHRcdFx0XHR9KTtcblxuYXN5bmMgZnVuY3Rpb24gYnVpbGQ8VCBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHRhZ25hbWU6IFQsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPENvbXBvbmVudHNbVF0+KTogUHJvbWlzZTxDb21wb25lbnRzW1RdPjtcbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+Pih0YWduYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBCVUlMRF9PUFRJT05TPFQ+KTogUHJvbWlzZTxUPjtcbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+Pih0YWduYW1lOiBzdHJpbmcsIHtcblx0XHRwYXJhbXMgICAgPSB7fSxcblx0XHRpbml0aWFsaXplPSB0cnVlLFxuXHRcdGNvbnRlbnQgICA9IFtdLFxuXHRcdHBhcmVudCAgICA9IHVuZGVmaW5lZCxcblx0XHRpZCBcdFx0ICA9IHVuZGVmaW5lZCxcblx0XHRjbGFzc2VzICAgPSBbXSxcblx0XHRjc3N2YXJzICAgPSB7fSxcblx0XHRhdHRycyAgICAgPSB7fSxcblx0XHRkYXRhIFx0ICA9IHt9LFxuXHRcdGxpc3RlbmVycyA9IHt9XG5cdH06IEJVSUxEX09QVElPTlM8VD4gPSB7fSk6IFByb21pc2U8VD4ge1xuXG5cdGlmKCAhIGluaXRpYWxpemUgJiYgcGFyZW50ID09PSBudWxsKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIkEgcGFyZW50IG11c3QgYmUgZ2l2ZW4gaWYgaW5pdGlhbGl6ZSBpcyBmYWxzZVwiKTtcblxuXHRsZXQgQ3VzdG9tQ2xhc3MgPSBhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0YWduYW1lKTtcblx0bGV0IGVsZW0gPSBuZXcgQ3VzdG9tQ2xhc3MocGFyYW1zKSBhcyBMSVNTSG9zdDxUPjtcblxuXHQvLyBGaXggaXNzdWUgIzJcblx0aWYoIGVsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSB0YWduYW1lIClcblx0XHRlbGVtLnNldEF0dHJpYnV0ZShcImlzXCIsIHRhZ25hbWUpO1xuXG5cdGlmKCBpZCAhPT0gdW5kZWZpbmVkIClcblx0XHRlbGVtLmlkID0gaWQ7XG5cblx0aWYoIGNsYXNzZXMubGVuZ3RoID4gMClcblx0XHRlbGVtLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG5cblx0Zm9yKGxldCBuYW1lIGluIGNzc3ZhcnMpXG5cdFx0ZWxlbS5zdHlsZS5zZXRQcm9wZXJ0eShgLS0ke25hbWV9YCwgY3NzdmFyc1tuYW1lXSk7XG5cblx0Zm9yKGxldCBuYW1lIGluIGF0dHJzKSB7XG5cblx0XHRsZXQgdmFsdWUgPSBhdHRyc1tuYW1lXTtcblx0XHRpZiggdHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIilcblx0XHRcdGVsZW0udG9nZ2xlQXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcblx0XHRlbHNlXG5cdFx0XHRlbGVtLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG5cdH1cblxuXHRmb3IobGV0IG5hbWUgaW4gZGF0YSkge1xuXG5cdFx0bGV0IHZhbHVlID0gZGF0YVtuYW1lXTtcblx0XHRpZiggdmFsdWUgPT09IGZhbHNlKVxuXHRcdFx0ZGVsZXRlIGVsZW0uZGF0YXNldFtuYW1lXTtcblx0XHRlbHNlIGlmKHZhbHVlID09PSB0cnVlKVxuXHRcdFx0ZWxlbS5kYXRhc2V0W25hbWVdID0gXCJcIjtcblx0XHRlbHNlXG5cdFx0XHRlbGVtLmRhdGFzZXRbbmFtZV0gPSB2YWx1ZTtcblx0fVxuXG5cdGlmKCAhIEFycmF5LmlzQXJyYXkoY29udGVudCkgKVxuXHRcdGNvbnRlbnQgPSBbY29udGVudCBhcyBhbnldO1xuXHRlbGVtLnJlcGxhY2VDaGlsZHJlbiguLi5jb250ZW50KTtcblxuXHRmb3IobGV0IG5hbWUgaW4gbGlzdGVuZXJzKVxuXHRcdGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBsaXN0ZW5lcnNbbmFtZV0pO1xuXG5cdGlmKCBwYXJlbnQgIT09IHVuZGVmaW5lZCApXG5cdFx0cGFyZW50LmFwcGVuZChlbGVtKTtcblxuXHRpZiggISBlbGVtLmlzSW5pdCAmJiBpbml0aWFsaXplIClcblx0XHRyZXR1cm4gYXdhaXQgTElTUy5pbml0aWFsaXplKGVsZW0pO1xuXG5cdHJldHVybiBhd2FpdCBMSVNTLmdldExJU1MoZWxlbSk7XG59XG5MSVNTLmJ1aWxkID0gYnVpbGQ7XG5cblxuTElTUy53aGVuRGVmaW5lZCAgICA9IGFzeW5jIGZ1bmN0aW9uKHRhZ25hbWU6IHN0cmluZywgY2FsbGJhY2s/OiAoKSA9PiB2b2lkICkgOiBQcm9taXNlPHZvaWQ+IHtcblxuXHRhd2FpdCBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0YWduYW1lKTtcblxuXHRpZiggY2FsbGJhY2sgIT09IHVuZGVmaW5lZClcblx0XHRjYWxsYmFjaygpO1xuXG5cdHJldHVybjtcbn1cbkxJU1Mud2hlbkFsbERlZmluZWQgPSBhc3luYyBmdW5jdGlvbih0YWduYW1lczogcmVhZG9ubHkgc3RyaW5nW10sIGNhbGxiYWNrPzogKCkgPT4gdm9pZCApIDogUHJvbWlzZTx2b2lkPiB7XG5cblx0YXdhaXQgUHJvbWlzZS5hbGwoIHRhZ25hbWVzLm1hcCggdCA9PiBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZCh0KSApIClcblxuXHRpZiggY2FsbGJhY2sgIT09IHVuZGVmaW5lZClcblx0XHRjYWxsYmFjaygpO1xuXG59XG5cbkxJU1MuaXNEZWZpbmVkID0gZnVuY3Rpb24obmFtZTogc3RyaW5nKSB7XG5cdHJldHVybiBjdXN0b21FbGVtZW50cy5nZXQobmFtZSk7XG59XG5cbkxJU1Muc2VsZWN0b3IgPSBmdW5jdGlvbihuYW1lPzogc3RyaW5nKSB7XG5cdGlmKG5hbWUgPT09IHVuZGVmaW5lZCkgLy8ganVzdCBhbiBoNGNrXG5cdFx0cmV0dXJuIFwiXCI7XG5cdHJldHVybiBgOmlzKCR7bmFtZX0sIFtpcz1cIiR7bmFtZX1cIl0pYDtcbn1cblxuTElTUy5nZXRMSVNTICAgID0gYXN5bmMgZnVuY3Rpb248VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KCBlbGVtZW50OiBFbGVtZW50ICkge1xuXG5cdGF3YWl0IExJU1Mud2hlbkRlZmluZWQoIExJU1MuZ2V0TmFtZShlbGVtZW50KSApO1xuXG5cdHJldHVybiAoZWxlbWVudCBhcyBMSVNTSG9zdDxUPikuTElTUzsgLy8gZW5zdXJlIGluaXRpYWxpemVkLlxufVxuTElTUy5nZXRMSVNTU3luYz0gZnVuY3Rpb248VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KCBlbGVtZW50OiBFbGVtZW50ICkge1xuXG5cdGlmKCAhIExJU1MuaXNEZWZpbmVkKCBMSVNTLmdldE5hbWUoZWxlbWVudCkgKSApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGAke25hbWV9IGhhc24ndCBiZWVuIGRlZmluZWQgeWV0LmApO1xuXG5cdGxldCBob3N0ID0gZWxlbWVudCBhcyBMSVNTSG9zdDxUPjtcblxuXHRpZiggISBob3N0LmlzSW5pdCApXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW5zdGFuY2UgaGFzbid0IGJlZW4gaW5pdGlhbGl6ZWQgeWV0LlwiKTtcblxuXHRyZXR1cm4gaG9zdC5MSVNTU3luYztcbn1cbkxJU1MuaW5pdGlhbGl6ZSA9IGFzeW5jIGZ1bmN0aW9uPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+PiggZWxlbWVudDogRWxlbWVudCkge1xuXG5cdGF3YWl0IExJU1Mud2hlbkRlZmluZWQoIExJU1MuZ2V0TmFtZShlbGVtZW50KSApO1xuXG5cdHJldHVybiBhd2FpdCAoZWxlbWVudCBhcyBMSVNTSG9zdDxUPikuaW5pdGlhbGl6ZSgpOyAvLyBlbnN1cmUgaW5pdGlhbGl6YXRpb24uXG59XG5cbkxJU1MuZ2V0TmFtZSA9IGZ1bmN0aW9uKCBlbGVtZW50OiBFbGVtZW50ICk6IHN0cmluZyB7XG5cblx0Y29uc3QgbmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpcycpID8/IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcblx0aWYoICEgbmFtZS5pbmNsdWRlcygnLScpIClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtuYW1lfSBpcyBub3QgYSBXZWJDb21wb25lbnRgKTtcblxuXHRyZXR1cm4gbmFtZTtcbn1cblxuZnVuY3Rpb24gX2J1aWxkUVMoc2VsZWN0b3I6IHN0cmluZywgdGFnbmFtZV9vcl9wYXJlbnQ/OiBzdHJpbmcgfCBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQsIHBhcmVudDogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50ID0gZG9jdW1lbnQpIHtcblx0XG5cdGlmKCB0YWduYW1lX29yX3BhcmVudCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0YWduYW1lX29yX3BhcmVudCAhPT0gJ3N0cmluZycpIHtcblx0XHRwYXJlbnQgPSB0YWduYW1lX29yX3BhcmVudDtcblx0XHR0YWduYW1lX29yX3BhcmVudCA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdHJldHVybiBbYCR7c2VsZWN0b3J9JHtMSVNTLnNlbGVjdG9yKHRhZ25hbWVfb3JfcGFyZW50IGFzIHN0cmluZ3x1bmRlZmluZWQpfWAsIHBhcmVudF0gYXMgY29uc3Q7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgUXVlcnlTZWxlY3RvcnMgPT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuYXN5bmMgZnVuY3Rpb24gcXM8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFByb21pc2U8VD47XG5hc3luYyBmdW5jdGlvbiBxczxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXM8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRsZXQgcmVzdWx0ID0gYXdhaXQgTElTUy5xc288VD4oc2VsZWN0b3IsIHBhcmVudCk7XG5cdGlmKHJlc3VsdCA9PT0gbnVsbClcblx0XHR0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJHtzZWxlY3Rvcn0gbm90IGZvdW5kYCk7XG5cblx0cmV0dXJuIHJlc3VsdCFcbn1cbkxJU1MucXMgID0gcXNcblxuYXN5bmMgZnVuY3Rpb24gcXNvPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+PihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNvPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dID47XG5hc3luYyBmdW5jdGlvbiBxc288VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblx0aWYoIGVsZW1lbnQgPT09IG51bGwgKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCBMSVNTLmdldExJU1MoIGVsZW1lbnQgKTtcbn1cbkxJU1MucXNvID0gcXNvXG5cbmFzeW5jIGZ1bmN0aW9uIHFzYTxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogUHJvbWlzZTxUW10+O1xuYXN5bmMgZnVuY3Rpb24gcXNhPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0cGFyZW50ICA/OiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQpOiBQcm9taXNlPCBDb21wb25lbnRzW05dW10gPjtcbmFzeW5jIGZ1bmN0aW9uIHFzYTxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGw8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRsZXQgaWR4ID0gMDtcblx0Y29uc3QgcHJvbWlzZXMgPSBuZXcgQXJyYXk8UHJvbWlzZTxUPj4oIGVsZW1lbnRzLmxlbmd0aCApO1xuXHRmb3IobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpXG5cdFx0cHJvbWlzZXNbaWR4KytdID0gTElTUy5nZXRMSVNTKCBlbGVtZW50ICk7XG5cblx0cmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbn1cbkxJU1MucXNhID0gcXNhO1xuXG5hc3luYyBmdW5jdGlvbiBxc2M8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBQcm9taXNlPFQ+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPE4gZXh0ZW5kcyBrZXlvZiBDb21wb25lbnRzPihzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZSAgOiBOLFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgOiBFbGVtZW50KTogUHJvbWlzZTwgQ29tcG9uZW50c1tOXSA+O1xuYXN5bmMgZnVuY3Rpb24gcXNjPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+PihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBhd2FpdCBMSVNTLmdldExJU1MocmVzdWx0KTtcbn1cbkxJU1MucXNjID0gcXNjO1xuXG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IFQ7XG5mdW5jdGlvbiBxc1N5bmM8TiBleHRlbmRzIGtleW9mIENvbXBvbmVudHM+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lICA6IE4sXG5cdFx0XHRcdFx0XHRwYXJlbnQgID86IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KFx0c2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWVfb3JfcGFyZW50Pzoga2V5b2YgQ29tcG9uZW50cyB8IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCxcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8RG9jdW1lbnQgPSBkb2N1bWVudCkge1xuXG5cdFtzZWxlY3RvciwgcGFyZW50XSA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgcGFyZW50KTtcblxuXHRjb25zdCBlbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3I8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRpZiggZWxlbWVudCA9PT0gbnVsbCApXG5cdFx0dGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICR7c2VsZWN0b3J9IG5vdCBmb3VuZGApO1xuXG5cdHJldHVybiBMSVNTLmdldExJU1NTeW5jKCBlbGVtZW50ICk7XG59XG5MSVNTLnFzU3luYyA9IHFzU3luYztcblxuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogVFtdO1xuZnVuY3Rpb24gcXNhU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdHBhcmVudCAgPzogRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50KTogQ29tcG9uZW50c1tOXVtdO1xuZnVuY3Rpb24gcXNhU3luYzxUIGV4dGVuZHMgTElTU0Jhc2U8YW55LGFueSxhbnksYW55Pj4oXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRcdFx0XHRcdFx0dGFnbmFtZV9vcl9wYXJlbnQ/OiBrZXlvZiBDb21wb25lbnRzIHwgRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fERvY3VtZW50LFxuXHRcdFx0XHRcdFx0cGFyZW50ICA6IEVsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxEb2N1bWVudCA9IGRvY3VtZW50KSB7XG5cblx0W3NlbGVjdG9yLCBwYXJlbnRdID0gX2J1aWxkUVMoc2VsZWN0b3IsIHRhZ25hbWVfb3JfcGFyZW50LCBwYXJlbnQpO1xuXG5cdGNvbnN0IGVsZW1lbnRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGw8TElTU0hvc3Q8VD4+KHNlbGVjdG9yKTtcblxuXHRsZXQgaWR4ID0gMDtcblx0Y29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PFQ+KCBlbGVtZW50cy5sZW5ndGggKTtcblx0Zm9yKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKVxuXHRcdHJlc3VsdFtpZHgrK10gPSBMSVNTLmdldExJU1NTeW5jKCBlbGVtZW50ICk7XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cbkxJU1MucXNhU3luYyA9IHFzYVN5bmM7XG5cbmZ1bmN0aW9uIHFzY1N5bmM8VCBleHRlbmRzIExJU1NCYXNlPGFueSxhbnksYW55LGFueT4+KHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHRlbGVtZW50ICA6IEVsZW1lbnQpOiBUO1xuZnVuY3Rpb24gcXNjU3luYzxOIGV4dGVuZHMga2V5b2YgQ29tcG9uZW50cz4oc2VsZWN0b3I6IHN0cmluZyxcblx0XHRcdFx0XHRcdHRhZ25hbWUgIDogTixcblx0XHRcdFx0XHRcdGVsZW1lbnQgIDogRWxlbWVudCk6IENvbXBvbmVudHNbTl07XG5mdW5jdGlvbiBxc2NTeW5jPFQgZXh0ZW5kcyBMSVNTQmFzZTxhbnksYW55LGFueSxhbnk+PihcdHNlbGVjdG9yOiBzdHJpbmcsXG5cdFx0XHRcdFx0XHR0YWduYW1lX29yX3BhcmVudD86IGtleW9mIENvbXBvbmVudHMgfCBFbGVtZW50LFxuXHRcdFx0XHRcdFx0ZWxlbWVudCAgPzogRWxlbWVudCkge1xuXG5cdGNvbnN0IHJlcyA9IF9idWlsZFFTKHNlbGVjdG9yLCB0YWduYW1lX29yX3BhcmVudCwgZWxlbWVudCk7XG5cdFxuXHRjb25zdCByZXN1bHQgPSAocmVzWzFdIGFzIHVua25vd24gYXMgRWxlbWVudCkuY2xvc2VzdDxMSVNTSG9zdDxUPj4ocmVzWzBdKTtcblx0aWYocmVzdWx0ID09PSBudWxsKVxuXHRcdHJldHVybiBudWxsO1xuXG5cdHJldHVybiBMSVNTLmdldExJU1NTeW5jKHJlc3VsdCk7XG59XG5MSVNTLnFzY1N5bmMgPSBxc2NTeW5jO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PSBMSVNTIEF1dG8gPT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBjbGFzcyBMSVNTX0F1dG8gZXh0ZW5kcyBMSVNTKHthdHRyaWJ1dGVzOiBbXCJzcmNcIl19KSB7XG5cblx0cmVhZG9ubHkgI2tub3duX3RhZyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXHRyZWFkb25seSAjZGlyZWN0b3J5OiBzdHJpbmc7XG5cdHJlYWRvbmx5ICNzdzogUHJvbWlzZTx2b2lkPjtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblxuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLiNzdyA9IG5ldyBQcm9taXNlKCBhc3luYyAocmVzb2x2ZSkgPT4ge1xuXHRcdFx0XG5cdFx0XHRhd2FpdCBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcihgLi9zdy5qc2ApO1xuXG5cdFx0XHRpZiggbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciApXG5cdFx0XHRcdHJlc29sdmUoKTtcblxuXHRcdFx0bmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblxuXHRcdGNvbnN0IHNyYyA9IHRoaXMuYXR0cnMuc3JjO1xuXHRcdGlmKHNyYyA9PT0gbnVsbClcblx0XHRcdHRocm93IG5ldyBFcnJvcihcInNyYyBhdHRyaWJ1dGUgaXMgbWlzc2luZy5cIik7XG5cdFx0dGhpcy4jZGlyZWN0b3J5ID0gc3JjWzBdID09PSAnLidcblx0XHRcdFx0XHRcdFx0XHQ/IGAke3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZX0vJHtzcmN9YFxuXHRcdFx0XHRcdFx0XHRcdDogc3JjO1xuXG5cdFx0bmV3IE11dGF0aW9uT2JzZXJ2ZXIoIChtdXRhdGlvbnMpID0+IHtcblxuXHRcdFx0Zm9yKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpXG5cdFx0XHRcdGZvcihsZXQgYWRkaXRpb24gb2YgbXV0YXRpb24uYWRkZWROb2Rlcylcblx0XHRcdFx0XHRpZihhZGRpdGlvbiBpbnN0YW5jZW9mIEVsZW1lbnQpXG5cdFx0XHRcdFx0XHR0aGlzLiNhZGRUYWcoYWRkaXRpb24udGFnTmFtZSlcblxuXHRcdH0pLm9ic2VydmUoIGRvY3VtZW50LCB7IGNoaWxkTGlzdDp0cnVlLCBzdWJ0cmVlOnRydWUgfSk7XG5cblxuXHRcdGZvciggbGV0IGVsZW0gb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIipcIikgKVxuXHRcdFx0dGhpcy4jYWRkVGFnKGVsZW0udGFnTmFtZSk7XG5cdH1cblxuXG4gICAgcHJvdGVjdGVkIHJlc291cmNlcygpIHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0XCJpbmRleC5qc1wiLFxuXHRcdFx0XCJpbmRleC5odG1sXCIsXG5cdFx0XHRcImluZGV4LmNzc1wiXG5cdFx0XTtcbiAgICB9XG5cblx0cHJvdGVjdGVkIGRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lOiBzdHJpbmcsIGZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBvcHRzOiBQYXJ0aWFsPHtjb250ZW50OiBzdHJpbmcsIGNzczogc3RyaW5nfT4pIHtcblxuXHRcdGNvbnN0IGpzID0gZmlsZXNbXCJpbmRleC5qc1wiXTtcblx0XHRjb25zdCBjb250ZW50ID0gZmlsZXNbXCJpbmRleC5odG1sXCJdO1xuXG5cdFx0bGV0IGtsYXNzOiBudWxsfCBSZXR1cm5UeXBlPHR5cGVvZiBMSVNTPiA9IG51bGw7XG5cdFx0aWYoIGpzICE9PSB1bmRlZmluZWQgKVxuXHRcdFx0a2xhc3MgPSBqcyhvcHRzKTtcblx0XHRlbHNlIGlmKCBjb250ZW50ICE9PSB1bmRlZmluZWQgKVxuXHRcdFx0a2xhc3MgPSBjbGFzcyBXZWJDb21wb25lbnQgZXh0ZW5kcyBMSVNTKG9wdHMpIHt9O1xuXG5cdFx0aWYoa2xhc3MgPT09IG51bGwpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZmlsZXMgZm9yIFdlYkNvbXBvbmVudCAke3RhZ25hbWV9LmApO1xuXG5cdFx0cmV0dXJuIExJU1MuZGVmaW5lKHRhZ25hbWUsIGtsYXNzKTtcblx0fVxuXG5cdGFzeW5jICNhZGRUYWcodGFnbmFtZTogc3RyaW5nKSB7XG5cblx0XHR0YWduYW1lID0gdGFnbmFtZS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0aWYoIHRhZ25hbWUgPT09ICdsaXNzLWF1dG8nIHx8IHRhZ25hbWUgPT09ICdibGlzcy1hdXRvJyB8fCAhIHRhZ25hbWUuaW5jbHVkZXMoJy0nKSB8fCB0aGlzLiNrbm93bl90YWcuaGFzKCB0YWduYW1lICkgKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy4ja25vd25fdGFnLmFkZCh0YWduYW1lKTtcblxuXHRcdGF3YWl0IHRoaXMuI3N3OyAvLyBlbnN1cmUgU1cgaXMgaW5zdGFsbGVkLlxuXG5cdFx0Y29uc3QgZmlsZW5hbWVzID0gdGhpcy5yZXNvdXJjZXMoKTtcblx0XHRjb25zdCByZXNvdXJjZXMgPSBhd2FpdCBQcm9taXNlLmFsbCggZmlsZW5hbWVzLm1hcCggZmlsZSA9PiBmaWxlLmVuZHNXaXRoKCcuanMnKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ/IF9pbXBvcnQgICAoYCR7dGhpcy4jZGlyZWN0b3J5fS8ke3RhZ25hbWV9LyR7ZmlsZX1gLCB0cnVlKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ6IF9mZXRjaFRleHQoYCR7dGhpcy4jZGlyZWN0b3J5fS8ke3RhZ25hbWV9LyR7ZmlsZX1gLCB0cnVlKSApICk7XG5cblx0XHRjb25zdCBmaWxlczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBmaWxlbmFtZXMubGVuZ3RoOyArK2kpXG5cdFx0XHRpZiggcmVzb3VyY2VzW2ldICE9PSB1bmRlZmluZWQpXG5cdFx0XHRcdGZpbGVzW2ZpbGVuYW1lc1tpXV0gPSByZXNvdXJjZXNbaV07XG5cblx0XHRjb25zdCBjb250ZW50ID0gZmlsZXNbXCJpbmRleC5odG1sXCJdO1xuXHRcdGNvbnN0IGNzcyAgICAgPSBmaWxlc1tcImluZGV4LmNzc1wiXTtcblxuXHRcdGNvbnN0IG9wdHM6IFBhcnRpYWw8e2NvbnRlbnQ6IHN0cmluZywgY3NzOiBzdHJpbmd9PiA9IHtcblx0XHRcdC4uLmNvbnRlbnQgIT09IHVuZGVmaW5lZCAmJiB7Y29udGVudH0sXG5cdFx0XHQuLi5jc3MgICAgICE9PSB1bmRlZmluZWQgJiYge2Nzc30sXG5cdFx0fTtcblxuXHRcdHJldHVybiB0aGlzLmRlZmluZVdlYkNvbXBvbmVudCh0YWduYW1lLCBmaWxlcywgb3B0cyk7XG5cdFx0XG5cdH1cbn1cbkxJU1MuZGVmaW5lKFwibGlzcy1hdXRvXCIsIExJU1NfQXV0byk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50cyB7XG5cdFwibGlzcy1hdXRvXCI6IExJU1NfQXV0b1xufTtcbi8qXG4gKiBkZWNsYXJlIG1vZHVsZSAnJExJU1MnIHtcbiAqIFx0XHRpbnRlcmZhY2UgQ29tcG9uZW50cyB7XG4gKiBcdFx0XHRcIm5hbWVcIjogY2xhc3NcbiAqIFx0XHR9XG4gKiB9XG4gKi9cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT0gTElTUyBFdmVudHNUYXJnZXQgPT09PT09PT09PT09PT1cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG50eXBlIENzdEV2ZW50PEV2ZW50IGV4dGVuZHMgc3RyaW5nLCBBcmdzPiA9IEN1c3RvbUV2ZW50PEFyZ3M+ICYge3R5cGU6IEV2ZW50fTtcblxuZXhwb3J0IGludGVyZmFjZSBFdmVudHNUYXJnZXQ8RXZlbnRzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55Pj57XG5cblx0YWRkRXZlbnRMaXN0ZW5lcjxFdmVudCBleHRlbmRzIEV4Y2x1ZGU8a2V5b2YgRXZlbnRzLCBzeW1ib2x8bnVtYmVyPj4odHlwZTogRXZlbnQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgbGlzdGVuZXI6IG51bGx8ICgoZXY6IENzdEV2ZW50PEV2ZW50LCBFdmVudHNbRXZlbnRdPikgPT4gdm9pZCksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgb3B0aW9ucz86IGJvb2xlYW58QWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiB2b2lkO1xuXG5cdGRpc3BhdGNoRXZlbnQ8RXZlbnQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KGV2ZW50OiBDc3RFdmVudDxFdmVudCwgRXZlbnRzW0V2ZW50XT4pOiBib29sZWFuO1xuXG5cdHJlbW92ZUV2ZW50TGlzdGVuZXI8RXZlbnQgZXh0ZW5kcyBFeGNsdWRlPGtleW9mIEV2ZW50cywgc3ltYm9sfG51bWJlcj4+KHR5cGU6IEV2ZW50LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsaXN0ZW5lcjogbnVsbHwgKChldjogQ3N0RXZlbnQ8RXZlbnQsIEV2ZW50c1tFdmVudF0+KSA9PiB2b2lkKSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucz86IGJvb2xlYW58QWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgQ3N0bUV2ZW50PEV2ZW50IGV4dGVuZHMgc3RyaW5nLCBBcmdzPiBleHRlbmRzIEN1c3RvbUV2ZW50PEFyZ3M+IHtcblxuXHRvdmVycmlkZSBnZXQgdHlwZSgpOiBFdmVudCB7IHJldHVybiBzdXBlci50eXBlIGFzIEV2ZW50OyB9XG5cblx0Y29uc3RydWN0b3IodHlwZTogRXZlbnQsIGFyZ3M6IEFyZ3MpIHtcblx0XHRzdXBlcih0eXBlLCB7ZGV0YWlsOiBhcmdzfSk7XG5cdH1cbn1cblxuZXhwb3J0IHR5cGUgRXZlbnRzVGFyZ2V0Q3N0cjxFdmVudHMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLGFueT4+ID0gQ29uc3RydWN0b3I8RXZlbnRzVGFyZ2V0PEV2ZW50cz4+O1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09IExJU1MgaW50ZXJuYWwgdG9vbHMgPT09PT09PT09PT09XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hSZXNvdXJjZShyZXNvdXJjZTogUmVzb3VyY2V8UHJvbWlzZTxSZXNvdXJjZT4pIHtcblxuXHRyZXNvdXJjZSA9IGF3YWl0IHJlc291cmNlO1xuXG5cdGlmKCAhIChyZXNvdXJjZSBpbnN0YW5jZW9mIFJlc3BvbnNlKSApXG5cdFx0cmVzb3VyY2UgPSBhd2FpdCBmZXRjaChyZXNvdXJjZSk7XG5cblx0cmV0dXJuIGF3YWl0IHJlc291cmNlLnRleHQoKTtcbn1cblxuXG5hc3luYyBmdW5jdGlvbiBfZmV0Y2hUZXh0KHVyaTogc3RyaW5nfFVSTCwgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Y29uc3Qgb3B0aW9ucyA9IGlzTGlzc0F1dG9cblx0XHRcdFx0XHRcdD8ge2hlYWRlcnM6e1wibGlzcy1hdXRvXCI6IFwidHJ1ZVwifX1cblx0XHRcdFx0XHRcdDoge307XG5cblxuXHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVyaSwgb3B0aW9ucyk7XG5cdGlmKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwIClcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXG5cdGlmKCBpc0xpc3NBdXRvICYmIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KFwic3RhdHVzXCIpISA9PT0gXCI0MDRcIiApXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRyZXR1cm4gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xufVxuYXN5bmMgZnVuY3Rpb24gX2ltcG9ydCh1cmk6IHN0cmluZywgaXNMaXNzQXV0bzogYm9vbGVhbiA9IGZhbHNlKSB7XG5cblx0Ly8gdGVzdCBmb3IgdGhlIG1vZHVsZSBleGlzdGFuY2UuXG5cdGlmKGlzTGlzc0F1dG8gJiYgYXdhaXQgX2ZldGNoVGV4dCh1cmksIGlzTGlzc0F1dG8pID09PSB1bmRlZmluZWQgKVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gKGF3YWl0IGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIHVyaSkpLmRlZmF1bHQ7XG5cdH0gY2F0Y2goZSkge1xuXHRcdGNvbnNvbGUubG9nKGUpO1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cbn1cblxuLy8gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTAwMDQ2MS9odG1sLWVsZW1lbnQtdGFnLW5hbWUtZnJvbS1jb25zdHJ1Y3RvclxuY29uc3QgSFRNTENMQVNTX1JFR0VYID0gIC9IVE1MKFxcdyspRWxlbWVudC87XG5jb25zdCBlbGVtZW50TmFtZUxvb2t1cFRhYmxlID0ge1xuICAgICdVTGlzdCc6ICd1bCcsXG4gICAgJ1RhYmxlQ2FwdGlvbic6ICdjYXB0aW9uJyxcbiAgICAnVGFibGVDZWxsJzogJ3RkJywgLy8gdGhcbiAgICAnVGFibGVDb2wnOiAnY29sJywgIC8vJ2NvbGdyb3VwJyxcbiAgICAnVGFibGVSb3cnOiAndHInLFxuICAgICdUYWJsZVNlY3Rpb24nOiAndGJvZHknLCAvL1sndGhlYWQnLCAndGJvZHknLCAndGZvb3QnXSxcbiAgICAnUXVvdGUnOiAncScsXG4gICAgJ1BhcmFncmFwaCc6ICdwJyxcbiAgICAnT0xpc3QnOiAnb2wnLFxuICAgICdNb2QnOiAnaW5zJywgLy8sICdkZWwnXSxcbiAgICAnTWVkaWEnOiAndmlkZW8nLC8vICdhdWRpbyddLFxuICAgICdJbWFnZSc6ICdpbWcnLFxuICAgICdIZWFkaW5nJzogJ2gxJywgLy8sICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddLFxuICAgICdEaXJlY3RvcnknOiAnZGlyJyxcbiAgICAnRExpc3QnOiAnZGwnLFxuICAgICdBbmNob3InOiAnYSdcbiAgfTtcbmZ1bmN0aW9uIF9lbGVtZW50MnRhZ25hbWUoQ2xhc3M6IHR5cGVvZiBIVE1MRWxlbWVudCk6IHN0cmluZ3xudWxsIHtcblxuXHRpZiggQ2xhc3MgPT09IEhUTUxFbGVtZW50IClcblx0XHRyZXR1cm4gbnVsbDtcblx0XG5cdGxldCBodG1sdGFnID0gSFRNTENMQVNTX1JFR0VYLmV4ZWMoQ2xhc3MubmFtZSkhWzFdO1xuXHRyZXR1cm4gZWxlbWVudE5hbWVMb29rdXBUYWJsZVtodG1sdGFnIGFzIGtleW9mIHR5cGVvZiBlbGVtZW50TmFtZUxvb2t1cFRhYmxlXSA/PyBodG1sdGFnLnRvTG93ZXJDYXNlKClcbn0iLCJjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIikhO1xuXG4vLyBmaXQgcGFnZSBoZWlnaHRcbmZ1bmN0aW9uIHVwZGF0ZVJhdGlvKCkge1xuICAgIGNvbnN0IHZoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDsgLy8gd2l0aG91dCBzY3JvbGxiYXJcbiAgICBjb25zdCBtaCA9IG1haW4uY2xpZW50SGVpZ2h0OyAvLyBoZWlnaHQ6IDE0OG1tXG4gICAgbWFpbi5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tc2NhbGVcIiwgYCR7dmgvbWh9YCk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGVSYXRpbyk7XG51cGRhdGVSYXRpbygpO1xuXG4vLyBjaGFuZ2Ugc2xpZGVcbmxldCBjdXJyZW50ID0gMDtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZXYpID0+IHtcblxuICAgIGlmKCAhIFtcIkFycm93TGVmdFwiLCBcIkFycm93UmlnaHRcIl0uaW5jbHVkZXMoZXYuY29kZSkgKVxuICAgICAgICByZXR1cm47XG5cbiAgICBsZXQgc2VjdGlvbnMgPSBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnOmlzKHNlY3Rpb24sIC53cy1mcmFtZSknKV07XG5cbiAgICBpZiggZXYuY29kZT09PSBcIkFycm93TGVmdFwiICAmJiBjdXJyZW50ICE9PSAwKVxuICAgICAgICAtLWN1cnJlbnQ7XG4gICAgaWYoIGV2LmNvZGU9PT0gXCJBcnJvd1JpZ2h0XCIgJiYgY3VycmVudCAhPT0gc2VjdGlvbnMubGVuZ3RoIC0gMSApXG4gICAgICAgICsrY3VycmVudDtcblxuICAgIG1haW4uc2Nyb2xsVG8oe1xuICAgICAgICB0b3A6IChzZWN0aW9uc1tjdXJyZW50XSBhcyBhbnkpLm9mZnNldFRvcCxcbiAgICAgICAgYmVoYXZpb3I6IFwiaW5zdGFudFwiLFxuICAgIH0pO1xufSk7XG5cbmltcG9ydCBMSVNTIGZyb20gXCIuLi9saWJzL0xJU1MvaW5kZXgudHNcIjtcblxuY29uc3QgY3NzID0gYFxuICAgIDpob3N0IHtcbiAgICAgICAgLS11Y2FfZ3JlZW46ICM5NWMxMWY7XG4gICAgICAgIC0tdWNhX2dyYXkgOiAjNWU1YzVjO1xuXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIHdpZHRoIDogMTAwJTtcbiAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuL2ltZy91Y2EvYmFja2dyb3VuZC5wbmcnKTtcbiAgICAgICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgICB9XG5gO1xuXG5jbGFzcyBGcmFtZVVDQVBsYWluIGV4dGVuZHMgTElTUyh7XG4gICAgY3NzXG59KSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaG9zdC5jbGFzc0xpc3QuYWRkKCd3cy1mcmFtZScpO1xuICAgIH1cbn1cblxuTElTUy5kZWZpbmUoXCJmcmFtZS11Y2EtcGxhaW5cIiwgRnJhbWVVQ0FQbGFpbik7XG5cbmNvbnN0IGZyYW1ldGl0bGVfY3NzID0gYFxuICAgIDpob3N0ID4gaDEge1xuICAgICAgICBjb2xvcjogdmFyKC0tdWNhX2dyZWVuKTtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cbiAgICA6aG9zdCA+IGRpdiB7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgY29sb3I6IHZhcigtLXVjYV9ncmF5KTtcblxuICAgICAgICAmID4gLm1haWwge1xuICAgICAgICAgICAgZm9udC1zdHlsZTogaXRhbGljO1xuICAgICAgICB9XG4gICAgfVxuYDtcbmNvbnN0IGNvbnRlbnQgPSBcbmA8aDE+PC9oMT5cbjxkaXY+XG4gICAgPHNwYW4gY2xhc3M9XCJhdXRob3JcIj48L3NwYW4+PGJyLz5cbiAgICA8c3BhbiBjbGFzcz1cIm1haWxcIj48L3NwYW4+XG48L2Rpdj5cbjxkaXY+XG4gICAgPHNwYW4gY2xhc3M9XCJkYXRlXCI+PC9zcGFuPlxuPC9kaXY+XG5gO1xuXG5jbGFzcyBGcmFtZVVDQVRpdGxlIGV4dGVuZHMgTElTUyh7XG4gICAgY3NzOiBbY3NzLCBmcmFtZXRpdGxlX2Nzc10sXG4gICAgY29udGVudCxcbiAgICBhdHRyaWJ1dGVzOiBbXCJjYXB0aW9uXCIsIFwiYXV0aG9yXCIsIFwibWFpbFwiXVxufSkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmhvc3QuY2xhc3NMaXN0LmFkZCgnd3MtZnJhbWUnKTtcblxuICAgICAgICB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcignaDEnKSEudGV4dENvbnRlbnQgPSB0aGlzLmF0dHJzLmNhcHRpb247XG4gICAgICAgIHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCcuYXV0aG9yJykhLnRleHRDb250ZW50ID0gdGhpcy5hdHRycy5hdXRob3I7XG4gICAgICAgIHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCcubWFpbCcpIS50ZXh0Q29udGVudCA9IHRoaXMuYXR0cnMubWFpbDtcbiAgICAgICAgdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5kYXRlJykhLnRleHRDb250ZW50ID0gbmV3IERhdGUoKS50b0xvY2FsZURhdGVTdHJpbmcoJ2ZyLUZSJywgeyB5ZWFyOlwibnVtZXJpY1wiLCBtb250aDpcInNob3J0XCIsIGRheTpcIm51bWVyaWNcIn0pO1xuICAgIH1cblxufVxuXG5MSVNTLmRlZmluZShcImZyYW1lLXVjYS10aXRsZVwiLCBGcmFtZVVDQVRpdGxlKTtcblxuY29uc3QgZnJhbWVfY29udGVudCA9XG5gPGRpdiBjbGFzcz1cImhlYWRlclwiPlxuICAgIDxoMiBjbGFzcz1cInRpdGxlXCI+PC9oMj5cbiAgICA8aDMgY2xhc3M9XCJzdWJ0aXRsZVwiPjwvaDM+XG48L2Rpdj5cbjxkaXYgY2xhc3M9XCJjb250ZW50XCI+PHNsb3Q+PC9zbG90PjwvZGl2PmA7XG5cbmNvbnN0IGZyYW1lX2NzcyA9IGBcbiAgICA6aG9zdCB7XG4gICAgICAgIHBhZGRpbmctbGVmdDogMTBweDtcbiAgICAgICAgcGFkZGluZy1yaWdodDogMTBweDtcbiAgICB9XG4gICAgOmhvc3QgPiAuaGVhZGVyIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6IDA7XG4gICAgICAgIGxlZnQ6IDEwcHg7XG4gICAgfVxuXG4gICAgOmhvc3QgPiAuaGVhZGVyID4gaDIge1xuICAgICAgICBtYXJnaW4tdG9wOiA4cHg7XG4gICAgICAgIGNvbG9yOiB2YXIoLS11Y2FfZ3JlZW4pO1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAwcHg7XG4gICAgICAgIGZvbnQtc2l6ZTogMWVtO1xuICAgIH1cbiAgICA6aG9zdCA+IC5oZWFkZXIgPiBoMyB7XG4gICAgICAgIG1hcmdpbi10b3A6IDJweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgICAgICAgZm9udC1zdHlsZTogaXRhbGljO1xuICAgICAgICBmb250LXNpemU6IDAuNzVlbTtcbiAgICAgICAgY29sb3I6IHZhcigtLXVjYV9ncmF5KTtcbiAgICB9XG5gO1xuXG5jbGFzcyBGcmFtZVVDQSBleHRlbmRzIExJU1Moe1xuICAgIGNzczogW2NzcywgZnJhbWVfY3NzXSxcbiAgICBjb250ZW50OiBmcmFtZV9jb250ZW50LFxuICAgIGF0dHJpYnV0ZXM6IFtcInNlY3Rpb25cIiwgXCJzdWJzZWN0aW9uXCJdXG59KSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaG9zdC5jbGFzc0xpc3QuYWRkKCd3cy1mcmFtZScpO1xuXG4gICAgICAgIHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSEudGV4dENvbnRlbnQgPSB0aGlzLmF0dHJzLnNlY3Rpb247XG4gICAgICAgIHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCcuc3VidGl0bGUnKSEudGV4dENvbnRlbnQgPSB0aGlzLmF0dHJzLnN1YnNlY3Rpb247XG4gICAgfVxuXG59XG5cbkxJU1MuZGVmaW5lKFwiZnJhbWUtdWNhXCIsIEZyYW1lVUNBKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7IiwiaW1wb3J0IFwiLi4vbGlicy9XZWJTbGlkZXMvc3JjL2luZGV4LnRzXCI7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGRlZmF1bHQgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImluZGV4Lmh0bWxcIjsiXSwibmFtZXMiOlsiU2hhZG93Q2ZnIiwiX19jc3RyX2hvc3QiLCJDQU5fSEFWRV9TSEFET1ciLCJfY2FuSGFzU2hhZG93IiwidGFnIiwiaW5jbHVkZXMiLCJfZWxlbWVudDJ0YWduYW1lIiwiTElTUyIsImV4dGVuZHMiLCJwX2V4dGVuZHMiLCJob3N0IiwicF9ob3N0IiwiZGVwZW5kYW5jaWVzIiwicF9kZXBzIiwiYXR0cmlidXRlcyIsInBfYXR0cnMiLCJwYXJhbXMiLCJjb250ZW50IiwiY3NzIiwic2hhZG93IiwicF9zaGFkb3ciLCJIVE1MRWxlbWVudCIsIl9leHRlbmRzIiwiT2JqZWN0IiwiY2FuSGFzU2hhZG93IiwiRXJyb3IiLCJ1bmRlZmluZWQiLCJwdXNoIiwiSFRNTFRlbXBsYXRlRWxlbWVudCIsImlubmVySFRNTCIsInRyaW0iLCJSZXNwb25zZSIsInRleHQiLCJMSVNTQmFzZSIsIlBhcmFtZXRlcnMiLCJzdHlsZXNoZWV0cyIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsImZldGNoX2NzcyIsIkNTU1N0eWxlU2hlZXQiLCJIVE1MU3R5bGVFbGVtZW50Iiwic2hlZXQiLCJzdHlsZSIsInJlcGxhY2UiLCJtYXAiLCJpZHgiLCJjb25zdHJ1Y3RvciIsImF0dHJzIiwic2V0QXR0ckRlZmF1bHQiLCJhdHRyIiwidmFsdWUiLCJvbkF0dHJDaGFuZ2VkIiwiX25hbWUiLCJfb2xkVmFsdWUiLCJfbmV3VmFsdWUiLCJpc0luRE9NIiwib25ET01Db25uZWN0ZWQiLCJvbkRPTURpc2Nvbm5lY3RlZCIsImV4dGVuZHNMSVNTIiwiTGlzcyIsInBhcmFtZXRlcnMiLCJhc3NpZ24iLCJFeHRlbmRlZExJU1MiLCJ0IiwiaWQiLCJidWlsZExJU1NIb3N0IiwiX3BhcmFtcyIsImFscmVhZHlEZWNsYXJlZENTUyIsIlNldCIsIkdFVCIsIlN5bWJvbCIsIlNFVCIsInByb3BlcnRpZXMiLCJmcm9tRW50cmllcyIsIm4iLCJlbnVtZXJhYmxlIiwiZ2V0Iiwic2V0IiwiQXR0cmlidXRlcyIsIm5hbWUiLCJkYXRhIiwiZGVmYXVsdHMiLCJzZXR0ZXIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiTElTU0hvc3RCYXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJpc0luaXQiLCJpbml0aWFsaXplIiwiYXBpIiwiaW5pdCIsIkxJU1NTeW5jIiwiZGlzY29ubmVjdGVkQ2FsbGJhY2siLCJjb25uZWN0ZWRDYWxsYmFjayIsImN1c3RvbUVsZW1lbnRzIiwidXBncmFkZSIsImF0dGFjaFNoYWRvdyIsIm1vZGUiLCJhZGRFdmVudExpc3RlbmVyIiwib25DbGlja0V2ZW50Iiwib2JzIiwiZ2V0QXR0cmlidXRlIiwiYWRvcHRlZFN0eWxlU2hlZXRzIiwic2hhcmVkQ1NTIiwiY3Nzc2VsZWN0b3IiLCJDU1NTZWxlY3RvciIsImhhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsImh0bWxfc3R5bGVzaGVldHMiLCJydWxlIiwiY3NzUnVsZXMiLCJjc3NUZXh0IiwiaGVhZCIsImFwcGVuZCIsImFkZCIsInRlbXBsYXRlX2VsZW0iLCJzdHIiLCJfIiwibWF0Y2giLCJjaGlsZE5vZGVzIiwib2JqIiwiaGFzU2hhZG93IiwiZ2V0UGFydCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRQYXJ0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJ0YWdOYW1lIiwicmVtb3ZlQXR0cmlidXRlIiwib2JzZXJ2ZWRBdHRyaWJ1dGVzIiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwib2xkVmFsdWUiLCJuZXdWYWx1ZSIsIl9ET01Db250ZW50TG9hZGVkIiwicmVhZHlTdGF0ZSIsImRlZmluZSIsInRhZ25hbWUiLCJDb21wb25lbnRDbGFzcyIsIkNsYXNzIiwiaHRtbHRhZyIsImFsbCIsIkxJU1NjbGFzcyIsIm9wdHMiLCJpbnNlcnRHbG9iYWxDU1NSdWxlcyIsImNzc19zdHlsZSIsInJlcGxhY2VTeW5jIiwiaW5zZXJ0UnVsZSIsIkRFTEVHQVRFRF9FVkVOVFMiLCJBTFJFQURZX1BST0NFU1NFRCIsImV2IiwiaGFuZGxlcnMiLCJ0eXBlIiwiZWxlbSIsImNvbXBvc2VkUGF0aCIsIlNoYWRvd1Jvb3QiLCJ3aW5kb3ciLCJ0YXJnZXQiLCJzZWxlY3RvciIsImhhbmRsZXIiLCJtYXRjaGVzIiwiaW5zZXJ0R2xvYmFsRGVsZWdhdGVkTGlzdGVuZXIiLCJldmVudF9uYW1lIiwiY2xvc2VzdCIsImVsZW1lbnQiLCJyZXN1bHQiLCJyb290IiwiZ2V0Um9vdE5vZGUiLCJidWlsZCIsInBhcmVudCIsImNsYXNzZXMiLCJjc3N2YXJzIiwibGlzdGVuZXJzIiwiQ3VzdG9tQ2xhc3MiLCJ3aGVuRGVmaW5lZCIsInRvTG93ZXJDYXNlIiwiY2xhc3NMaXN0Iiwic2V0UHJvcGVydHkiLCJ0b2dnbGVBdHRyaWJ1dGUiLCJkYXRhc2V0IiwicmVwbGFjZUNoaWxkcmVuIiwiZ2V0TElTUyIsImNhbGxiYWNrIiwid2hlbkFsbERlZmluZWQiLCJ0YWduYW1lcyIsImlzRGVmaW5lZCIsImdldE5hbWUiLCJnZXRMSVNTU3luYyIsIl9idWlsZFFTIiwidGFnbmFtZV9vcl9wYXJlbnQiLCJxcyIsInFzbyIsInFzYSIsImVsZW1lbnRzIiwicHJvbWlzZXMiLCJxc2MiLCJyZXMiLCJxc1N5bmMiLCJxc2FTeW5jIiwicXNjU3luYyIsIkxJU1NfQXV0byIsIm5hdmlnYXRvciIsInNlcnZpY2VXb3JrZXIiLCJyZWdpc3RlciIsImNvbnRyb2xsZXIiLCJzcmMiLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm11dGF0aW9uIiwiYWRkaXRpb24iLCJhZGRlZE5vZGVzIiwiRWxlbWVudCIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwicmVzb3VyY2VzIiwiZGVmaW5lV2ViQ29tcG9uZW50IiwiZmlsZXMiLCJqcyIsImtsYXNzIiwiV2ViQ29tcG9uZW50IiwiZmlsZW5hbWVzIiwiZmlsZSIsImVuZHNXaXRoIiwiX2ltcG9ydCIsIl9mZXRjaFRleHQiLCJpIiwiQ3N0bUV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJhcmdzIiwiZGV0YWlsIiwiZmV0Y2hSZXNvdXJjZSIsInJlc291cmNlIiwiZmV0Y2giLCJ1cmkiLCJpc0xpc3NBdXRvIiwib3B0aW9ucyIsImhlYWRlcnMiLCJyZXNwb25zZSIsInN0YXR1cyIsImRlZmF1bHQiLCJlIiwiY29uc29sZSIsImxvZyIsIkhUTUxDTEFTU19SRUdFWCIsImVsZW1lbnROYW1lTG9va3VwVGFibGUiLCJleGVjIiwibWFpbiIsInVwZGF0ZVJhdGlvIiwidmgiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRIZWlnaHQiLCJtaCIsImN1cnJlbnQiLCJjb2RlIiwic2VjdGlvbnMiLCJzY3JvbGxUbyIsInRvcCIsIm9mZnNldFRvcCIsImJlaGF2aW9yIiwiRnJhbWVVQ0FQbGFpbiIsImZyYW1ldGl0bGVfY3NzIiwiRnJhbWVVQ0FUaXRsZSIsInRleHRDb250ZW50IiwiY2FwdGlvbiIsImF1dGhvciIsIm1haWwiLCJEYXRlIiwidG9Mb2NhbGVEYXRlU3RyaW5nIiwieWVhciIsIm1vbnRoIiwiZGF5IiwiZnJhbWVfY29udGVudCIsImZyYW1lX2NzcyIsIkZyYW1lVUNBIiwic2VjdGlvbiIsInN1YnNlY3Rpb24iXSwic291cmNlUm9vdCI6IiJ9