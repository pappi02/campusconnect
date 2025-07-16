// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import 'uno.css' // 👈 This is crucial!
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
</React.StrictMode>
);
