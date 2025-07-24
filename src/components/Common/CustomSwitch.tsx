import React from "react";
import Switch from "@mui/material/Switch";
import { SxProps, Theme } from "@mui/material/styles";

interface CustomSwitchProps {
	value: boolean;
	onChange: (value: boolean) => void;
	className?: string;
	disabled?: boolean;
	size?: "small" | "medium";
	sx?: SxProps<Theme>;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
	value,
	onChange,
	className,
	disabled,
	size = "small",
	sx,
}) => {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.checked);
	};

	return (
		<Switch
			className={className}
			checked={value}
			onChange={handleChange}
			disabled={disabled}
			size={size}
			sx={{
				width: 24,
				height: 14,
				padding: 0,
				"& .MuiSwitch-switchBase": {
					transform: "translateX(-2px) translateY(-2px)",
					transitionDuration: "300ms",
					"&.Mui-checked": {
						transform: "translateX(7px) translateY(-2px)",
						color: "#fff",
						"& + .MuiSwitch-track": {
							backgroundColor: "#5e72e4",
							opacity: 1,
							border: 0,
						},
					},
				},
				"& .MuiSwitch-thumb": {
					boxSizing: "border-box",
					width: 10,
					height: 10,
				},
				"& .MuiSwitch-track": {
					borderRadius: 13,
					backgroundColor: "#cccccc",
					opacity: 1,
					transition: "background-color 500ms",
				},
				...sx,
			}}
		/>
	);
};

export default CustomSwitch;
