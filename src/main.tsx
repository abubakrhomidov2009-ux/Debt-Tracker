import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider as JotaiProvider } from "jotai";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <JotaiProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </JotaiProvider>
  </StrictMode>,
);
