// HeaderComponent.js
import React, { useState, useRef, useEffect } from "react";

const HeaderComponent = ({
  layoutMode,
  setLayoutMode,
  theme,
  setTheme,
  onAboutClick,
  hideExtras, // when true, hide About Us link and settings
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  // Close the settings dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header class='top'
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "40px",
        position: "relative",
      }}
    >
      {/* Left Column (Empty for centering purposes) */}
      <div style={{ flex: 1 }}></div>

      {/* Center Column: Axiom Title */}
      <div style={{ flex: 1, textAlign: "center" }}>
        <h1 style={{ margin: 0 }}>Axiom</h1>
      </div>

      {/* Right Column: About Us and Settings, or an empty div to preserve layout */}
      <div style={{ flex: 1, textAlign: "right", position: "relative" }}>
        {!hideExtras ? (
          <>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onAboutClick();
              }}
              style={{
                marginRight: "20px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              About Us
            </a>
            <div style={{ display: "inline-block", position: "relative" }}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "24px",
                  // color: 'white',
                  fontWeight: "bolder",
                  color: "inherit",
                }}
                aria-label="Settings"
              >
                {/* Replace emoji with an inline SVG if desired */}
                {/* ⚙️ */}⛭
              </button>
              {showSettings && (
                <div ref={settingsRef} className="settings-container">
                  <div className="settings-options">
                    <span
                      className={`settings-option ${
                        layoutMode === "inline" ? "active" : ""
                      }`}
                      onClick={() => {
                        setLayoutMode("inline");
                        setShowSettings(false);
                      }}
                    >
                      Inline
                    </span>
                    <span
                      className={`settings-option ${
                        layoutMode === "grid" ? "active" : ""
                      }`}
                      onClick={() => {
                        setLayoutMode("grid");
                        setShowSettings(false);
                      }}
                    >
                      Grid
                    </span>
                  </div>
                  <div>
                    <select
                      value={theme}
                      onChange={(e) => {
                        setTheme(e.target.value);
                        setShowSettings(false);
                      }}
                      className="settings-select"
                    >
                      <option value="scifi">Sci-Fi</option>
                      <option value="old_school">Old School</option>
                      <option value="xp">XP</option>
                      <option value="standard">Standard</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // Render an empty div to preserve layout when extras are hidden
          <div></div>
        )}
      </div>
    </header>
  );
};

export default HeaderComponent;
