import {LISS, define} from "@LISS/libs/LISS"

const css = require("!!raw-loader!./index.css").default;

class FrameUCAPlain extends LISS({
    css
}) {
    constructor() {
        super();
        this.host.classList.add('ws-frame');
    }
}

define("frame-uca-plain", FrameUCAPlain);