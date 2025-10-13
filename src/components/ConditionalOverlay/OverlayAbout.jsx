import * as StateService from "../../services/StateService"
import {useEffect} from "react"

export const OverlayAbout = () => {

    const {state} = StateService.useStateManager();

    useEffect(() => {
        if (state !== StateService.States.ABOUT) 
            return;
        }
    , [state])

    if (state !== StateService.States.ABOUT) 
        return null;
    
    return (
        <div className="corner">
            <h2>about</h2>
        </div>
    )

}