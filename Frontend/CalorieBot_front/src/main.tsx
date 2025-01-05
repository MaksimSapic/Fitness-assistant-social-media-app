import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./Theme/Theme.tsx";
import { UserProvider } from "./Context/UserContext.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
       <App/>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>
);
