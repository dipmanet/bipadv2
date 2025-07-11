import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const PageNotFound = () => {
	const navigate = useNavigate();
	const [isAnimated, setIsAnimated] = useState(false);

	useEffect(() => {
		// Trigger animation after component mounts
		setIsAnimated(true);
	}, []);

	return (
		<div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary-background text-foreground p-4">
			<div
				className={`transform transition-all duration-700 ${
					isAnimated ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
				}`}>
				{/* Error Code */}
				<div className="relative mb-6">
					<h1 className="text-9xl font-bold text-destructive md:text-[12rem] lg:text-[15rem] opacity-10">
						404
					</h1>
					<div className="absolute inset-0 flex items-center justify-center">
						<svg
							className="w-32 h-32 text-destructive"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
				</div>

				{/* Error Message */}
				<div className="text-center space-y-6 max-w-md mx-auto">
					<h2 className="text-3xl font-semibold text-foreground md:text-4xl">Page Not Found</h2>
					<p className="text-secondary-foreground text-lg">
						The page you're looking for doesn't exist or has been moved.
					</p>

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

export default PageNotFound;
