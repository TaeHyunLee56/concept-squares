// ApiKeyContext.js
import React, { createContext, useState } from "react";

export const ApiKeyContext = createContext();

export function ApiKeyProvider({ children }) {
  const [apiKey, setApiKey] = useState("");

  const updateApiKey = (key) => {
    setApiKey(key);
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, updateApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

// // ApiKeyContext.js 로컬스토리지 사용
// import React, { createContext, useState, useEffect } from "react";

// export const ApiKeyContext = createContext();

// export function ApiKeyProvider({ children }) {
//   const [apiKey, setApiKey] = useState("");

//   useEffect(() => {
//     const savedKey = localStorage.getItem("apiKey");
//     if (savedKey) setApiKey(savedKey);
//   }, []);

//   const updateApiKey = (key) => {
//     setApiKey(key);
//     localStorage.setItem("apiKey", key);
//   };

//   return (
//     <ApiKeyContext.Provider value={{ apiKey, updateApiKey }}>
//       {children}
//     </ApiKeyContext.Provider>
//   );
// }
