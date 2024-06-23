import React from "react";
import RoutePlanner from "./components/RoutePlanner";
// import MapboxMap from "./components/MapboxMap";
import "./App.css";
import logo from "./image.png";

const App = () => {
  return (
    <div className="App">
      <nav className="App-nav">
        <img src={logo} alt="Logo" className="logo" />
      </nav>
      <div className="App-content">
        <header className="App-header">
          <h1 className="heading">
            Let's calculate the <span className="bold">distance</span> from maps
          </h1>
        </header>
        <RoutePlanner />
        {/* <MapboxMap /> */}
      </div>
    </div>
  );
};

export default App;
