import React from "react";
import { _cs } from "@togglecorp/fujs";
import memoize from "memoize-one";

import Numeral from "#rscv/Numeral";

import styles from "./styles.module.scss";

interface Props {
	className?: string;
}

class DisasterProfile extends React.PureComponent<Props> {
	private getAttributeDetails = (data, attributeKey) => {
		let max = 0;
		let total = 0;

		if (data.length === 0) {
			return {
				max,
				total,
				average: 0,
			};
		}

		data.forEach((d) => {
			const value = d.values[attributeKey] || 0;
			max = max < value ? value : max;
			total += value;
		});

		return {
			max,
			total,
			average: total / data.length,
		};
	};

	private getSortedDataByYear = memoize((data) => data.sort((a, b) => +b.year - +a.year));

	public render() {
		const { className, data, attributeKey, attributeName } = this.props;

		if (!data) {
			return null;
		}

		const { max, total, average } = this.getAttributeDetails(data, attributeKey);

		return (
			<div className={_cs(styles.chart, className)}>
				<div className={styles.summary}>
					<div className={styles.value}>
						<Numeral value={total} normal lang="ne" precision={0} />
					</div>
					<h4 className={styles.heading}>{attributeName}</h4>
				</div>
				<div className={styles.content}>
					{this.getSortedDataByYear(data).map((d) => {
						const value = d.values[attributeKey] || 0;
						const percent = (100 * value) / total;

						return (
							<div
								title={`${value} ${attributeName} on ${d.year}`}
								className={styles.barContainer}
								key={d.year}>
								<div className={styles.year}>{d.year}</div>
								<div className={styles.valueBar}>
									<div className={styles.bar} style={{ width: `${percent}%` }} />
								</div>
								<div className={styles.percent}>{percent.toFixed(1)}</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

export default DisasterProfile;
