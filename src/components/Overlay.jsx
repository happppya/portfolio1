import {useState} from "react";
import * as StateService from "../services/StateService"

export const Overlay = () => {

    const [active,
        setActive] = useState("Explore");

    const handleClick = (name) => {
        StateService.setState(name);
        setActive(name);
    };

    return (
        <div className="overlay">

            <div className="corner">
                <h2>alexander</h2>
                <p>FULL STACK DEVELOPER</p>
                <p>& GAME DESIGNER</p>
            </div>
            <div
                style={{
                position: "absolute",
                left: "50%",
                top: "55px"
            }}>
                <nav
                    className="nav"
                    style={{
                    position: "relative",
                    left: "-50%"
                }}>
                    <button
                        className={`nav-btn ${active === StateService.States.EXPLORE
                        ? "selected"
                        : ""}`}
                        onClick={() => handleClick(StateService.States.EXPLORE)}>
                        Explore
                    </button>
                    <button
                        className={`nav-btn ${active === StateService.States.WORK
                        ? "selected"
                        : ""}`}
                        onClick={() => handleClick(StateService.States.WORK)}>
                        Work
                    </button>
                    <button
                        className={`nav-btn ${active === StateService.States.ABOUT
                        ? "selected"
                        : ""}`}
                        onClick={() => handleClick(StateService.States.ABOUT)}>
                        About
                    </button>
                </nav>

            </div>

        </div>
    )
}