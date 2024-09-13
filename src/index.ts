const main = document.querySelector("main")!;

// fit page height
function updateRatio() {
    const vh = document.documentElement.clientHeight; // without scrollbar
    const mh = main.clientHeight; // height: 148mm
    main.style.setProperty("--scale", `${vh/mh}`);
}

window.addEventListener('resize', updateRatio);
updateRatio();

// change slide
let current = 0;
document.addEventListener("keyup", (ev) => {

    if( ! ["ArrowLeft", "ArrowRight"].includes(ev.code) )
        return;

    let sections = [...document.querySelectorAll(':is(section, .ws-frame)')];

    if( ev.code=== "ArrowLeft"  && current !== 0)
        --current;
    if( ev.code=== "ArrowRight" && current !== sections.length - 1 )
        ++current;

    main.scrollTo({
        top: (sections[current] as any).offsetTop,
        behavior: "instant",
    });
});

import LISS, { ShadowCfg } from "LISS/index.ts";

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

class FrameUCAPlain extends LISS({
    css
}) {
    constructor() {
        super();
        this.host.classList.add('ws-frame');
    }
}

LISS.define("frame-uca-plain", FrameUCAPlain);

const frametitle_css = `
    :host > .title > h1 {
        color: var(--uca_green);
        text-align: center;
    }
    :host > .title > h2 {
        color: var(--uca_green);
        text-align: center;
        font-style: italic;
        margin-top: 0;
    }
    :host > div {
        text-align: center;
        color: var(--uca_gray);

        & > .mail {
            font-style: italic;
        }
    }
`;
const content = 
`<div class="title">
    <h1></h1>
    <h2></h2>
</div>
<div>
    <span class="author"></span><br/>
    <span class="mail"></span>
</div>
<div>
    <span class="date"></span>
</div>
`;

class FrameUCATitle extends LISS({
    css: [css, frametitle_css],
    content,
    attributes: ["caption", "subcaption", "author", "mail"]
}) {
    constructor() {
        super();
        this.host.classList.add('ws-frame');

        this.content.querySelector('h1')!.textContent = this.attrs.caption;
        this.content.querySelector('h2')!.textContent = this.attrs.subcaption;
        this.content.querySelector('.author')!.textContent = this.attrs.author;
        this.content.querySelector('.mail')!.textContent = this.attrs.mail;
        this.content.querySelector('.date')!.textContent = new Date().toLocaleDateString('fr-FR', { year:"numeric", month:"short", day:"numeric"});
    }

}

LISS.define("frame-uca-title", FrameUCATitle);

const frame_content =
`<div class="header">
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
        font-weight: normal;
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

class FrameUCA extends LISS({
    css: [css, frame_css],
    content: frame_content,
    attributes: ["section", "subsection"]
}) {
    constructor() {
        super();
        this.host.classList.add('ws-frame');

        this.content.querySelector('.title')!.textContent = this.attrs.section;
        this.content.querySelector('.subtitle')!.textContent = this.attrs.subsection;
    }

    protected override onAttrChanged(name: string, _oldValue: string, value: string): void | false {
        if( name === "section")
            this.content.querySelector('.title')!.textContent = this.attrs.section;
        if( name === "subsection")
            this.content.querySelector('.subtitle')!.textContent = this.attrs.subsection;
    }

}

LISS.define("frame-uca", FrameUCA);

{
    const css = `
:host {
    display: none;
}`;

    class FrameSection extends LISS({
        css: [css],
        shadow: ShadowCfg.NONE
    }) {

        constructor() {
            super();
            const text = this.host.textContent!.trim();
            let next = this.host.nextElementSibling;

            while( next !== null && next.tagName !== "FRAME-SECTION") {
                next.setAttribute('section', text);
                next = next.nextElementSibling;
            }
        }

    }

    LISS.define("frame-section", FrameSection);
}

{
    const css = `
:host {
    display: none;
}`;

    class FrameSubSection extends LISS({
        css: [css],
        shadow: ShadowCfg.NONE
    }) {

        constructor() {
            super();
            const text = this.host.textContent!.trim();
            let next = this.host.nextElementSibling;

            while( next !== null && next.tagName !== "FRAME-SUBSECTION" && next.tagName !== "FRAME-SECTION") {
                next.setAttribute('subsection', text);
                next = next.nextElementSibling;
            }
        }

    }

    LISS.define("frame-subsection", FrameSubSection);
}