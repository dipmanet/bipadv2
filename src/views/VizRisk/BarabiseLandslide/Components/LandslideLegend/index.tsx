import React from "react";
import Icon from "#rscg/Icon";
import styles from "./styles.module.scss";

const LandslideLegend = (props) => {
	const radius = [10, 20, 30, 40];
	const text = ["MINOR(0)", "MAJOR(<10)", "SEVERE(<100)", "CATASTROPHIC(>100)"];
	return (
		<>
			<div className={styles.landslideLegend}>
				<div className={styles.circles}>
					<h2>LANDSLIDES (PEOPLE DEATH)</h2>
					{radius.map((r, i) => (
						<div className={styles.row}>
							<Icon
								name="circle"
								style={{
									color: "#923f3f",
									fontSize: `${r}px`,
									marginRight: `${40 - 10 * i}px`,
									marginLeft: `${10 - r / 3}px`,
								}}
							/>
							{<p>{text[i]}</p>}
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default LandslideLegend;
