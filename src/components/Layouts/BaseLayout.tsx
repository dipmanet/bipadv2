// import Sidebar from "@/components/Sidebar";
import React from "react";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="w-full h-full flex flex-col flex-grow relative rounded-tl-[40px] bg-background text-secondary-foreground">
			{children}
		</div>
	);
};

export default BaseLayout;
