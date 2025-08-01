import React, { useContext } from "react";
import { ResponsiveContainer, Treemap } from "recharts";
import ReactHtmlParser from "react-html-parser";
import { MainPageDataContext } from "#views/VizRisk/RatnaNagar/context";

import styles from "./styles.module.scss";

const LeftpaneSlide2 = () => {
	const barColors = ["#d3e878", "#00a811", "#e9e1d8", "#0b71bd", "#E2CF45", "grey", "green"];
	const { keyValueHtmlData, keyValueJsonData } = useContext(MainPageDataContext);

	const htmlData =
		keyValueHtmlData &&
		keyValueHtmlData.filter(
			(item: any) => item.key === "vizrisk_ratnanagar_page2_htmldata_301_3_35_35007"
		)[0];
	const landCoverData =
		keyValueJsonData &&
		keyValueJsonData.filter(
			(item: any) => item.key === "vizrisk_ratnanagar_page2_landcoverdata_301_3_35_35007"
		)[0];

	const CustomizedContent = (props: any) => {
		const { root, depth, x, y, width, height, index, colors, name, size } = props;

		return (
			<g>
				<rect
					x={x}
					y={y}
					width={width}
					height={height}
					style={{
						fill: depth < 2 ? colors[Math.floor((index / root.children.length) * 6)] : "none",
						stroke: "#0c2432",
						strokeWidth: 2.5 / (depth + 1e-10),
						strokeOpacity: 1 / (depth + 1e-10),
					}}
				/>
				{depth === 1 ? (
					<>
						<text
							x={x + width / 2}
							y={y + height / 2.2}
							textAnchor="middle"
							fill="white"
							stroke="white"
							fontSize={size < 10 ? 10 : 14}
							fontWeight={300}>
							{name}
						</text>
						<text
							x={x + width / 2}
							y={y + height / 2 + 15}
							textAnchor="middle"
							fill="white"
							stroke="white"
							fontSize={18}
							fontWeight={300}>
							{size}%
						</text>
					</>
				) : null}
			</g>
		);
	};

	return (
		<div className={styles.vrSideBar}>
			<div className="mainTitleDiv">
				{htmlData && htmlData.value && ReactHtmlParser(htmlData.value)}
			</div>
			{landCoverData && landCoverData.value && landCoverData.value.length > 0 && (
				<ResponsiveContainer height={400}>
					<Treemap
						width={400}
						height={200}
						data={landCoverData.value}
						dataKey="size"
						stroke="#0c2432"
						fill={barColors.map((item) => item)[1]}
						content={<CustomizedContent colors={barColors} />}
					/>
				</ResponsiveContainer>
			)}
		</div>
	);
};

export default LeftpaneSlide2;
