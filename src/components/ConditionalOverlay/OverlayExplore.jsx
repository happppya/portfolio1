import * as StateService from "../../services/StateService"
import {useEffect} from "react"

export const OverlayExplore = () => {

    const {state} = StateService.useStateManager();

    useEffect(() => {
        if (state !== StateService.States.EXPLORE) 
            return;
        }
    , [state])

    if (state !== StateService.States.EXPLORE) 
        return null;
    
    return (
        <div className="corner">
            <h2>alexander</h2>
            <p>FULL STACK DEVELOPER</p>
            <p>& GAME DESIGNER</p>
        </div>
    )

}