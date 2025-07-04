const main = document.querySelector("main")!;


const p = new URLSearchParams(location.search);

const IS_IN_OVERVIEW = p.has("overview");

if( IS_IN_OVERVIEW ) {
    main.style.setProperty('--nb_frame', p.get("overview"));
    document.body.classList.add('overview');
}


let height_offset = 0;

export function setHeightOffset(off: number) {
    height_offset = off;
    updateRatio();
}

// fit page height
function updateRatio() {
    const mh = 420; // height: 148mm - cste fix in CSS

    const isFullScreen = window.screen.height === window.innerHeight;

    const offset = isFullScreen ? 0 : height_offset;

    const vh = document.documentElement.clientHeight - offset; // without scrollbar
    const vw = document.documentElement.clientWidth; // without scrollbar

    const scale = IS_IN_OVERVIEW ? vw/(mh*16/9) : Math.min( vh/mh, vw/(mh*16/9) );

    main.style.setProperty("--scale", `${scale}`);
}

window.addEventListener('resize', updateRatio);
updateRatio();

// change slide
let current = 0;

function getCode(ev: KeyboardEvent) {

    let code = ev.code;

    if( code === "ArrowLeft"  || code === "ArrowUp")
        code = "PageUp";
    if( code === "ArrowRight" || code === "ArrowDown")
        code = "PageDown";

    return code;
}
function isDownUp(code: string) {
    return ["PageUp", "PageDown"].includes(code);
}

document.addEventListener("keydown", (ev) => {

    const code = getCode(ev);

    if( isDownUp( code ) ) {
        ev.preventDefault();
        handleEvent( code );
    }

});

document.addEventListener("keypress", (ev) => {

    if( isDownUp( getCode(ev) ) )
        ev.preventDefault();
});

document.addEventListener("keyup", (ev) => {

    if( isDownUp( getCode(ev) ) )
        ev.preventDefault();
});

function handleEvent(code: string) {

    let sections = [...document.querySelectorAll<HTMLElement>(':is(section, .ws-frame)')];

    const pos = document.querySelector("main")!.scrollTop;

    /*
    if( ev.code=== "ArrowLeft" && current !== 0)
        --current;
    if( ev.code=== "ArrowRight" && current !== sections.length - 1 )
        ++current;
    */
    if( code=== "PageUp" ) {

        let cur = sections.length - 1;
        while( cur != 0 && pos <= sections[cur].offsetTop)
            --cur;

        current = cur;
    }
    if( code=== "PageDown" ) {

        let cur = 0;
        while( cur != sections.length - 1 && pos >= sections[cur].offsetTop)
            ++cur;

        current = cur;
    }

    main.scrollTo({
        top     : sections[current].offsetTop,
        behavior: "instant",
    });
}

import LISS from "@LISS/src";

const css = `
    :host {
        --uca_green: #95c11f;
        --uca_gray : #5e5c5c;

        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        height: 100%;
        width : 100%;
        background-size: cover;
    }
`;

class FrameUCAPlain extends LISS({
    css
})<void> {
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

    :host .date {
        font-size: small;
        font-style: italic;
    }

    :host > div {
        text-align: center;
        color: var(--uca_gray);

        & > .mail {
            font-style: italic;
        }
    }
`;
const html = 
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
    html,
    attributes: ["caption", "subcaption", "author", "mail"]
})<void> {
    constructor() {
        super();
        this.host.classList.add('ws-frame');

        this.content.querySelector('h1')!.textContent = this.host.getAttribute("caption");
        this.content.querySelector('h2')!.textContent = this.host.getAttribute("subcaption");
        this.content.querySelector('.author')!.textContent = this.host.getAttribute("author");
        this.content.querySelector('.mail')!.textContent = this.host.getAttribute("mail");
        this.content.querySelector('.date')!.textContent = "(dernière modification le " + new Date(document.lastModified).toLocaleDateString('fr-FR', { year:"numeric", month:"long", day:"numeric", hour:"2-digit", minute: "2-digit"}) + ")";
    }

}

LISS.define("frame-uca-title", FrameUCATitle);

const frame_content =
`<div class="header">
    <h2 class="title"></h2>
    <h3><span class="subtitle"></span> <span class="subsubtitle"></span></h3>
</div><slot></slot><div></div>`;

const frame_css = `
    :host {
        justify-content: space-between;

        padding-left: 10px;
        padding-right: 10px;
    }
    :host > .header {
        /*position: absolute;
        top: 0;
        left: 10px;*/
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
        margin-bottom: 0px; /* because flex spacing */
        font-weight: normal;
        font-style: italic;
        font-size: 0.75em;
        color: var(--uca_gray);

        & .subsubtitle:not(:empty) {
            &::before {
                content: "("
            }
            &::after {
                content: ")"
            }
        }
    }
`;

class FrameUCA extends LISS({
    css : [css, frame_css],
    html: frame_content,
    attributes: ["repeat", "slide"] /* TODO... */
})<void> {
    constructor() {
        super();

        this.host.classList.add('ws-frame');

        for(let i = 0; i <= 2; ++i) {
            const prefix = "sub".repeat(i);

            const section = this.host.closest(`frame-${prefix}section`);
            if( section !== null)
                this.content.querySelector(`.${prefix}title`)!.textContent    = section.getAttribute("name");
        }

        const onslides = this.host.querySelectorAll<HTMLElement>("[onslide]");

        const slide = this.host.getAttribute("slide");
        if( slide === null)
            this.host.setAttribute("slide", "0");

        // dirty h4ck
        for(let script of (this.host as any).scripts ?? [])
            script(this.host);

        if( slide === "0") {

            let max = 0;
            for(let onslide of onslides) {
                const m = +onslide.getAttribute('onslide')!;
                if( m > max)
                    max = m;
            }

            if( max === 0)
                return;

            const dupl = Array.from({length: max}, (_, idx) => {
                const elem = this.host.cloneNode(true) as HTMLElement;
                elem.toggleAttribute("repeat", false);
                elem.setAttribute('slide', `${idx+1}`);

                // dirty h4ck
                (elem as any).scripts = (this.host as any).scripts;

                return elem;
            });
            this.host.after( ...dupl );
        }

        const slide_id = +( slide ?? "0" );
        for(let onslide of onslides) {
            const cond = onslide.getAttribute('onslide')!;

            const show = cond.split(",").map( p => p.split("-")).some( (part) => {

                if( part.length === 1)
                    return slide_id === +part[0];

                if( slide_id < +part[0] )
                    return false;
                
                if( part[1] === "")
                    return true;
                
                if( slide_id > +part[1] )
                    return false;

                return true;
            });

            if( ! show ) {
                onslide.style.setProperty("visibility", "hidden");
                //  onslide.style.setProperty("display", "none");
            }

            // ad hoc
            if( show && onslide.parentElement?.tagName === "SQL-INTERACTIVE") {
                const parent = onslide.parentElement!;
                const idx    = [...parent.children].indexOf(onslide);
                parent.setAttribute("option", `${idx}`);
            }

            // ad hoc
            if( show && onslide.matches("sql-option") ) {
                const system = onslide.closest("sql-system")!;
                const id = [...system.querySelectorAll("sql-option")].indexOf(onslide);
                system.setAttribute("active", `${id}` );
            }
        }

    }
}

LISS.define("frame-uca", FrameUCA);

{
    class FrameSection       extends LISS({ shadow: null })<void> {}
    class FrameSubSection    extends LISS({ shadow: null })<void> {}
    class FrameSubSubSection extends LISS({ shadow: null })<void> {}

    LISS.define("frame-section"      , FrameSection);
    LISS.define("frame-subsection"   , FrameSubSection);
    LISS.define("frame-subsubsection", FrameSubSubSection);
}