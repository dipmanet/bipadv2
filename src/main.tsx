import { createRoot } from "react-dom/client";
import "./index.css";
// import { StrictMode } from "react";
import Root from "./Root";

// Remove the preload element (from index.html) on first mount
const preload = document.getElementById("root-preload");
if (preload) {
	preload.remove();
}

createRoot(document.getElementById("root")!).render(
	// <StrictMode>
	<Root />
	// </StrictMode>
);
