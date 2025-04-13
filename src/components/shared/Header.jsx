import React, { useContext } from "react";
import { ThemeContext } from "../../Theme";
import "./header.css";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="header-container">
      <div className="header-toggle-buttons">
        <button onClick={() => toggleTheme()}>{theme}</button>
      </div>
    </div>
  );
};

export default Header;