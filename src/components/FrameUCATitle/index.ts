import {LISS, define} from "@LISS/libs/LISS"

const plain_css = require("!!raw-loader!../FrameUCAPlain/index.css").default;
const css  = require("!!raw-loader!./index.css" ).default;
const html = require("!!raw-loader!./index.html").default;

// attributes: ["caption", "subcaption", "author", "mail"]

class FrameUCATitle extends LISS({
    css: [plain_css, css],
    html,
}) {
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

define("frame-uca-title", FrameUCATitle);