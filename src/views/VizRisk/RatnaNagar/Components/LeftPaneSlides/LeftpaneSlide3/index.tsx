import React, { useContext } from "react";
import ReactHtmlParser from "react-html-parser";
import { findOcc } from "#views/VizRisk/RatnaNagar/utils";
import { MainPageDataContext, RatnaNagarMapContext } from "#views/VizRisk/RatnaNagar/context";
import styles from "./styles.module.scss";
import Tick from "../../../../Common/Icons/Tick.svg";
import CriticalInfraLegends from "../../Legends/CriticalInfraLegends";

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

	const { keyValueHtmlData, keyValueJsonData } = useContext(MainPageDataContext);

	const { map } = useContext(RatnaNagarMapContext);

	const htmlData =
		keyValueHtmlData &&
		keyValueHtmlData.filter(
			(item: any) => item.key === "vizrisk_ratnanagar_page4_htmldata_301_3_35_35007"
		)[0];
	const mainCIData: MainCIData[] = findOcc(cIData, "resourceType");

	const totalCI = mainCIData.map((item) => item.count).reduce((a, b) => a + b);

	const handleResetMap = () => {
		if (map) {
			map.fitBounds([82.9045981623205, 27.5472027536931, 83.1180839586179, 27.8206868107314]);

			map.easeTo({
				// pitch: 30,
				zoom: 12.0,
				duration: 1000,
			});
		}
	};

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
			case itemCounts <= 10: {
				fontsize = (itemCounts / totalCounts) * 20 + 8;
				return fontsize;
			}
			case itemCounts > 10 && itemCounts <= 50: {
				fontsize = (itemCounts / totalCounts) * 20 + 10;
				return fontsize;
			}
			case itemCounts > 50 && itemCounts <= 75: {
				fontsize = (itemCounts / totalCounts) * 20 + 14;
				return fontsize;
			}
			case itemCounts > 75 && itemCounts <= 100: {
				fontsize = (itemCounts / totalCounts) * 20 + 18;
				return fontsize;
			}
			case itemCounts > 100 && itemCounts <= 150: {
				fontsize = (itemCounts / totalCounts) * 20 + 22;
				return fontsize;
			}
			default:
				return (itemCounts / totalCounts) * 50 + 22;
		}
	};

	return (
		<div className={styles.vrSideBar}>
			{" "}
			<div className="mainTitleDiv">
				{htmlData && htmlData.value && ReactHtmlParser(htmlData.value)}
			</div>
			<p style={{ fontWeight: "light", color: "#24c3f3" }}>
				{" "}
				<em>Click to view Critical Infrastructures</em>
			</p>
			<div className={styles.bubbleChart}>
				{mainCIData.length > 0 &&
					mainCIData.map((item) => (
						<button
							type="submit"
							key={item.resourceType}
							style={{
								height: `${calculateBubbleWidthHeight(item.count, totalCI)}px`,
								width: `${calculateBubbleWidthHeight(item.count, totalCI)}px`,
							}}
							onClick={() => handleCIClick(item.resourceType)}
							className={
								clickedCiName.includes(item.resourceType) ? styles.tickBubbles : styles.bubbles
							}>
							<div className={styles.bubbleContents}>
								<h1
									style={{ fontSize: `${calculateFontSize(item.count, totalCI)}px` }}
									className={styles.ciCount}>
									{item.count}
								</h1>
								<p
									style={{
										fontSize: `${calculateFontSize(item.count, totalCI)}px`,
										textAlign: "center",
									}}>
									{item.resourceType &&
										item.resourceType.charAt(0).toUpperCase() + item.resourceType.slice(1)}
								</p>
								{clickedCiName.includes(item.resourceType) && (
									<img
										style={{
											height: `${item.count / totalCI + 25}%`,
										}}
										className={styles.tickIcon}
										src={Tick}
										alt=""
									/>
								)}
							</div>
						</button>
					))}
			</div>
			<CriticalInfraLegends
				cITypeName={mainCIData.map((item) => item.resourceType)}
				handleResetMap={handleResetMap}
			/>
		</div>
	);
};

export default LeftpaneSlide3;
