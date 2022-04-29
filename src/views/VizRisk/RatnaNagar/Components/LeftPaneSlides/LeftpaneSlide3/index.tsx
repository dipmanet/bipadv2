/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
import React from 'react';
import styles from './styles.scss';
import Tick from '../../../../Common/Icons/Tick.svg';
import { findOcc } from '#views/VizRisk/RatnaNagar/utils';


interface Props {
	handleCIClick: (item: string) => void;
	clickedCiName: string[];
	cIData: any;
}
interface MainCIData {
	count: number;
	resourceType: string;
}

const LeftpaneSlide3 = (props: Props) => {
	const { handleCIClick, clickedCiName, cIData } = props;


	const mainCIData: MainCIData[] = findOcc(cIData, 'resourceType');

	const totalCI = mainCIData.map(item => item.count).reduce((a, b) => a + b);

	const calculateBubbleWidthHeight = (itemCounts: number, totalCounts: number) => {
		if (itemCounts <= 25) {
			const height = itemCounts + 50;
			return height;
		}
		if (itemCounts > 25 && itemCounts <= 50) {
			const height = itemCounts + 55;
			return height;
		}
		if (itemCounts > 50 && itemCounts <= 75) {
			const height = itemCounts + 60;
			return height;
		}
		if (itemCounts > 75 && itemCounts <= 100) {
			const height = itemCounts + 65;
			return height;
		}
		if (itemCounts > 100 && itemCounts <= 150) {
			const height = itemCounts + 70;
			return height;
		}
		return (itemCounts / totalCounts) * 1000 + 25;
	};


	const calculateFontSize = (itemCounts: number, totalCounts: number) => {
		if (itemCounts <= 10) {
			const fontsize = (itemCounts / totalCounts) * 20 + 5;
			return fontsize;
		}
		if (itemCounts > 25 && itemCounts <= 50) {
			const fontsize = (itemCounts / totalCounts) * 20 + 5;
			return fontsize;
		}
		if (itemCounts > 50 && itemCounts <= 75) {
			const fontsize = (itemCounts / totalCounts) * 20 + 5;
			return fontsize;
		}
		if (itemCounts > 75 && itemCounts <= 100) {
			const fontsize = (itemCounts / totalCounts) * 20 + 5;
			return fontsize;
		}
		if (itemCounts > 100 && itemCounts <= 150) {
			const fontsize = (itemCounts / totalCounts) * 20 + 5;
			return fontsize;
		}
		return (itemCounts / totalCounts) * 50 + 10;
	};

	console.log('ciData', findOcc(cIData, 'resourceType'));

	return (
		<div className={styles.vrSideBar}>
			{' '}
			<h1>Critical Infrastructure</h1>
			<p>
				Ratnanagar  Municipality is located in Sindhupalchok
				district of Bagmati province. The rural municipality
				has 7 wards covering a total area of 592 sq. km and
				is situated at an elevation of 800 m to 7000m AMSL.

			</p>
			<p>
				Ratnanagar  Municipality is located in Sindhupalchok
				district of Bagmati province. The rural municipality
				has 7 wards covering a total area of 592 sq. km and
				is situated at an elevation of 800 m to 7000m AMSL.

			</p>
			<p>
				Ratnanagar  Municipality is located in Sindhupalchok
				district of Bagmati province. The rural municipality
				has 7 wards covering a total area of 592 sq. km and
				is situated at an elevation of 800 m to 7000m AMSL.

			</p>

			<div className={styles.bubbleChart}>
				{
					mainCIData.length > 0 && mainCIData.sort((a, b) => b.count - a.count).map(
						item => (
							<button
								type="submit"
								key={item.resourceType}
								style={
									{
										height: `${calculateBubbleWidthHeight(item.count, totalCI)}px`,
										width: `${calculateBubbleWidthHeight(item.count, totalCI)}px`,
									}
								}
								onClick={() => handleCIClick(item.resourceType)}
								className={clickedCiName.includes(item.resourceType)
									? styles.tickBubbles : styles.bubbles}
							>
								<div className={styles.bubbleContents}>
									<h1
										style={{ fontSize: `${calculateFontSize(item.count, totalCI)}px` }}
										className={styles.ciCount}
									>
										{item.count}

									</h1>
									<p style={{
										fontSize: `${calculateFontSize(item.count, totalCI)}px`,
										textAlign: 'center',
									}}
									>
										{item.resourceType
											&& item.resourceType.charAt(0).toUpperCase() + item.resourceType.slice(1)}

									</p>
									{
										clickedCiName.includes(item.resourceType)
										&& (
											<img
												style={{
													height:
														`${calculateBubbleWidthHeight(item.count, totalCI) - item.count * 1.25}%`,
												}}
												className={styles.tickIcon}
												src={Tick}
												alt=""
											/>
										)
									}

								</div>
							</button>
						),
					)
				}
			</div>
		</div>

	);
};


export default LeftpaneSlide3;
