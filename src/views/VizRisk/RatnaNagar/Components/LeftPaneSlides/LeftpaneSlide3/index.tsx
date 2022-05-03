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
		let height;
		switch (true) {
			case itemCounts <= 25: {
				height = itemCounts + 75;
				return height;
			}
			case itemCounts > 25 && itemCounts <= 50: {
				height = itemCounts + 85;
				return height;
			}
			case itemCounts > 50 && itemCounts <= 75: {
				height = itemCounts + 90;
				return height;
			}
			case itemCounts > 75 && itemCounts <= 100: {
				height = itemCounts + 95;
				return height;
			}
			case itemCounts > 100 && itemCounts <= 150: {
				height = itemCounts + 90;
				return height;
			}
			default:
				return (itemCounts / totalCounts) * 1000 + 25;
		}
	};


	const calculateFontSize = (itemCounts: number, totalCounts: number) => {
		let fontsize;
		switch (true) {
			case (itemCounts <= 10): {
				fontsize = (itemCounts / totalCounts) * 20 + 8;
				return fontsize;
			}
			case (itemCounts > 25 && itemCounts <= 50): {
				fontsize = (itemCounts / totalCounts) * 20 + 5;
				return fontsize;
			}
			case (itemCounts > 50 && itemCounts <= 75): {
				fontsize = (itemCounts / totalCounts) * 20 + 5;
				return fontsize;
			}
			case (itemCounts > 75 && itemCounts <= 100): {
				fontsize = (itemCounts / totalCounts) * 20 + 5;
				return fontsize;
			}
			case (itemCounts > 100 && itemCounts <= 150): {
				fontsize = (itemCounts / totalCounts) * 20 + 5;
				return fontsize;
			}
			default:
				return (itemCounts / totalCounts) * 50 + 10;
		}
	};

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
														`${(item.count / totalCI) + 25}%`,
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
