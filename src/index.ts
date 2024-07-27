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
let sections = [...document.querySelectorAll(':is(section, uca-frame-plain)')];
let current = 0;
document.addEventListener("keyup", (ev) => {

    if( ! ["ArrowLeft", "ArrowRight"].includes(ev.code) )
        return;

    if( ev.code=== "ArrowLeft"  && current !== 0)
        --current;
    if( ev.code=== "ArrowRight" && current !== sections.length - 1 )
        ++current;

    main.scrollTo({
        top: (sections[current] as any).offsetTop,
        behavior: "instant",
    });
});

import LISS from "../libs/LISS/index.ts";

const css = `
    :host {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        height: 100%;
        background-image: url('./img/uca/background.png');
        background-size: cover;
    }
`;

class UCAPlainFrame extends LISS({
    css
}) {

}

LISS.define("uca-frame-plain", UCAPlainFrame);