import {
    BrowserRouter as Router,
    Routes,
    Route, Link,
  } from "react-router-dom";

const NavBar = () => {
    return (
        <>
            <Router>
                <header className="App-header">
                    <div>
                        <Link to="/">Home</Link>
                    </div>
                    <nav>
                        <Link to="/vectors">vectors</Link>
                        <Link to="/sign_in">Sign in</Link>
                        <Link to="/login">Log in</Link>
                    </nav>
                </header>
                <div className="globalContainer">
                    <Routes>
                        <Route exact path="/" />
                        <Route exact path="/login" />
                        <Route exact path="/sign_in" />
                    </Routes>
                </div>
            </Router>
        </>
    );
}

export default NavBar;