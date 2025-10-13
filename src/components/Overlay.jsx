export const Overlay = () => (
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
                <button className="nav-btn">Explore</button>
                <button className="nav-btn">Work</button>
                <button className="nav-btn">About</button>
            </nav>

        </div>

    </div>
)