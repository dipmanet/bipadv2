import React, { useState } from "react";
import styles from "./styles.module.scss";

interface Props {
	vzLabel: string;
	setVzLabel: React.Dispatch<React.SetStateAction<string>>;
}

const LayerToggle = (props: Props) => {
	const [clickedState, setclickedState] = useState(false);
	const { setVzLabel, vzLabel } = props;
	const handleLayerChange = () => {
		if (vzLabel === "municipality") {
			setVzLabel("province");
		} else {
			setVzLabel("municipality");
		}
	};
	return (
		<div className={styles.containerToggle}>
			<button
				style={{ border: "none", backgroundColor: "transparent" }}
				type="submit"
				onClick={() => {
					handleLayerChange();
					setclickedState(!clickedState);
				}}>
				<div className={styles.toggleDiv}>
					<div className={vzLabel === "province" ? styles.circle : styles.circleMove} />
				</div>
			</button>

			<div className={styles.textSection}>
				{["View Provincial VisRisk", "View Municipal VisRisk"].map((item) => (
					<p className={styles.textLabel}>{item}</p>
				))}
			</div>
		</div>
	);
};

export default LayerToggle;
