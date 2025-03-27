import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const className = 'dark';
    const bodyClass = document.body.classList;
  
    if (darkMode) {
      bodyClass.add(className);
      localStorage.setItem("theme", "dark");
    } else {
      bodyClass.remove(className);
      localStorage.setItem("theme", "light");
    }
    console.log("Dark mode changed:", darkMode);
  }, [darkMode]);
  

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
