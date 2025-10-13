import * as StateService from "../../services/StateService"
import {useEffect} from "react"

export const OverlayWork = () => {

    const {state} = StateService.useStateManager();

    useEffect(() => {
        if (state !== StateService.States.WORK) 
            return;
        }
    , [state])

    if (state !== StateService.States.WORK) 
        return null;
    
    return (
        <div className="corner">
            <h2>work</h2>
        </div>
    )

}