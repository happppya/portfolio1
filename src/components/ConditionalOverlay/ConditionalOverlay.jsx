import * as StateService from "../../services/StateService"
import {OverlayAbout} from "./OverlayAbout"
import {OverlayExplore} from "./OverlayExplore"
import {OverlayWork} from "./OverlayWork"

export const ConditionalOverlay = () => {

    const {state} = StateService.useStateManager();

    let overlay;

    switch (state) {
        case StateService.States.EXPLORE:
            overlay = <OverlayExplore/>
            break;
        case StateService.States.WORK:
            overlay = <OverlayWork/>
            break;
        case StateService.States.ABOUT:
            overlay = <OverlayAbout/>
            break;
    }

    console.log(overlay);

    return overlay;

};