import { useNavigate, useRouteError } from "react-router-dom";
import { useState, useEffect } from "react";

const ErrorBoundary = () => {
	const routerError: any = useRouteError();
	const navigate = useNavigate();
	const [isAnimated, setIsAnimated] = useState(false);
	const [showFullError, setShowFullError] = useState(false);

	useEffect(() => {
		// Trigger animation after component mounts
		setIsAnimated(true);

		// Log error to console for debugging
		console.log("Router Error:", routerError, "abc", typeof routerError);
	}, [routerError]);

	// Determine error type and extract relevant information
	const getErrorDetails = () => {
		// Check if it's an HTTP error with status code
		let status = routerError?.status || routerError?.statusCode;
		let statusText = routerError?.statusText;
		let message = routerError?.data?.message || routerError?.error?.message || routerError?.message;

		// JS Error object detection
		if (routerError instanceof Error) {
			status = status || "Error";
			message = message || routerError.message;
			statusText = statusText || routerError.name || "Application Error";
		}

		// If we still don't have status info, make an educated guess
		if (!status && !statusText) {
			if (routerError?.code === "ERR_NETWORK") {
				status = "Network Error";
				statusText = "Connection Failed";
				message = message || "Cannot connect to the server. Please check your connection.";
			} else if (routerError?.name === "TimeoutError") {
				status = "Timeout";
				statusText = "Request Timeout";
				message = message || "The server took too long to respond.";
			} else {
				status = "Unknown";
				statusText = "Unknown Error";
				message = message || "An unexpected error occurred.";
			}
		}

		// Format common HTTP status codes in a user-friendly way
		if (status === 404) {
			statusText = statusText || "Not Found";
			message = message || "The requested resource was not found.";
		} else if (status === 403) {
			statusText = statusText || "Forbidden";
			message = message || "You don't have permission to access this resource.";
		} else if (status === 401) {
			statusText = statusText || "Unauthorized";
			message = message || "You need to be logged in to access this resource.";
		} else if (status >= 500 && status < 600) {
			statusText = statusText || "Server Error";
			message = message || "There was a problem with the server.";
		} else if (
			status >= 400 &&
			status < 500 &&
			status !== 404 &&
			status !== 403 &&
			status !== 401
		) {
			statusText = statusText || "Bad Request";
			message = message || "The request couldn't be processed.";
		}

		return { status, statusText, message };
	};

	const { status, statusText, message } = getErrorDetails();

	// Format the full error object as a string (with indentation for readability)
	const fullErrorText = JSON.stringify(routerError, null, 2);

	// Choose appropriate icon based on error type
	const getErrorIcon = () => {
		if (status === 404) {
			// Search/not found icon
			return (
				<svg
					className="w-32 h-32 text-destructive"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			);
		} else if (status === 403 || status === 401) {
			// Lock/forbidden icon
			return (
				<svg
					className="w-32 h-32 text-destructive"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			);
		} else if (status >= 500 && status < 600) {
			// Server error icon
			return (
				<svg
					className="w-32 h-32 text-destructive"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M5 12H3L12 3L21 12H19M5 12V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V12M9 15V15.01M12 15V15.01M15 15V15.01"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			);
		} else {
			// Default warning triangle
			return (
				<svg
					className="w-32 h-32 text-destructive"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			);
		}
	};

	return (
		<div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary-background text-foreground p-4">
			<div
				className={`transform transition-all duration-700 ${
					isAnimated ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
				} max-w-4xl w-full`}>
				{/* Error Code */}
				<div className="relative mb-6">
					<h1 className="text-9xl font-bold text-destructive md:text-[12rem] lg:text-[15rem] opacity-10">
						{typeof status === "number" ? status : "!"}
					</h1>
					<div className="absolute inset-0 flex items-center justify-center">{getErrorIcon()}</div>
				</div>

				{/* Error Message */}
				<div className="text-center space-y-6 mx-auto">
					<h2 className="text-3xl font-semibold text-foreground md:text-4xl">
						{statusText || "Error"}
					</h2>

					{/* Error Details */}
					<div className="bg-secondary/20 rounded-lg p-6 my-4 text-left">
						<h3 className="text-xl font-medium mb-3">Error Details:</h3>
						<p className="text-secondary-foreground text-lg break-words mb-6">{message}</p>

						{/* Error Details Toggle */}
						<div className="mt-6">
							<button
								onClick={() => setShowFullError(!showFullError)}
								className="text-primary hover:underline focus:outline-none text-sm flex items-center gap-2">
								{showFullError ? "Hide" : "Show"} Technical Details
								<svg
									className={`w-4 h-4 transform transition-transform ${
										showFullError ? "rotate-180" : ""
									}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>

							{/* Full Error Text */}
							{showFullError && (
								<div className="mt-4 bg-black/10 p-4 rounded-md overflow-auto max-h-96">
									<pre className="text-xs whitespace-pre-wrap break-words text-secondary-foreground font-mono">
										{fullErrorText}
									</pre>
								</div>
							)}
						</div>
					</div>

					<div className="text-sm text-secondary-foreground mt-6">
						<p className="mb-4">
							Please contact the maintainers of the website
							<a
								className="text-primary hover:underline ml-1"
								href="https://workwise/contact"
								target="_blank"
								rel="noopener noreferrer">
								here
							</a>
						</p>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col gap-4 sm:flex-row sm:justify-center pt-4">
						<button
							onClick={() => navigate("/")}
							className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 shadow-md">
							Back to Home
						</button>
						<button
							onClick={() => navigate(-1)}
							className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors duration-300 shadow-md">
							Go Back
						</button>
					</div>
				</div>
			</div>

			{/* Decorative Elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl"></div>
				<div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-destructive/5 rounded-full filter blur-3xl"></div>
			</div>
		</div>
	);
};

export default ErrorBoundary;
