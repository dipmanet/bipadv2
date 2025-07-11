// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { StrictMode } from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import Store from "../src/utils/Store";
// import { Toaster } from "sonner";

// const queryClient = new QueryClient({
// 	defaultOptions: {
// 		queries: {
// 			refetchOnWindowFocus: false,
// 		},
// 	},
// });

createRoot(document.getElementById("root")!).render(
	// <StrictMode>
	// 	<QueryClientProvider client={queryClient}>
	// 		<Store>
	// 			<Toaster />
	// 			<App />
	// 		</Store>
	// 	</QueryClientProvider>
	// 	<App />
	// </StrictMode>
	<StrictMode>
		<App />
	</StrictMode>
);
