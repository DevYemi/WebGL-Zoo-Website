import { Pane } from 'tweakpane';

export default class DebugUI {
    ui: Pane | null;
    isActive: boolean;
    constructor() {
        if (window.location.hash === "#debug") {
            this.isActive = true,
                this.ui = new Pane({ title: 'Tweak Values' })

            const ui = this.ui as any
            ui.containerElem_.style.zIndex = "10"

        } else {
            this.isActive = false,
                this.ui = null
        }
    }

    dispose() {
        if (this.ui) {
            this.ui.dispose()
        }
    }
}