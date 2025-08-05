import React, { useState, useEffect } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/highcharts-more";

import { connect } from "react-redux";
import Modal from "#rscv/Modal";
import ModalHeader from "#rscv/Modal/Header";
import ModalBody from "#rscv/Modal/Body";
import DangerButton from "#rsca/Button/DangerButton";

import { ibfPageSelector } from "#selectors";
import { setIbfPageAction } from "#actionCreators";
import style from "./styles.module.scss";

import * as initialOptions from "./chartOptions";
import type { AppState } from "#types";
import type { PropsFromDispatch } from "..";

interface OwnProps {
	handleModalClose: () => void;
}

interface Props extends OwnProps, PropsFromDispatch {
	ibfPage: ReturnType<typeof ibfPageSelector>;
}

const mapStateToProps = (state: AppState) => ({
	ibfPage: ibfPageSelector(state),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch => ({
	setIbfPage: (params) => dispatch(setIbfPageAction(params)),
});

const BoxModal: React.FC<Props> = ({ ibfPage, handleModalClose }) => {
	const { selectedStation } = ibfPage;

	const [data, setData] = useState<number[][]>([]);
	const [category, setCategory] = useState<string[]>([]);
	const [thresholdFive, setThresholdFive] = useState<number | null>(null);
	const [thresholdTwenty, setThresholdTwenty] = useState<number | null>(null);
	const [chartOptions, setChartOptions] = useState<Highcharts.Options>(initialOptions.default);

	useEffect(() => {
		if (!selectedStation?.properties?.calculation) return;

		const rawCalculation = JSON.parse(selectedStation.properties.calculation);
		const baseDate = new Date(rawCalculation[0].recorded_date);
		const categories = Array.from({ length: 10 }, (_, i) => {
			const newDate = new Date(baseDate);
			newDate.setDate(baseDate.getDate() + i);
			return newDate.toLocaleDateString();
		});
		setCategory(categories);

		const boxData: number[][] = [];
		let t5: number | null = null;
		let t20: number | null = null;

		rawCalculation.slice(1).forEach((item) => {
			boxData.push([
				+item.min_dis.toFixed(2),
				+item.first_quartile.toFixed(2),
				+item.median.toFixed(2),
				+item.third_quartile.toFixed(2),
				+item.max_dis.toFixed(2),
			]);
			t5 = +item.threshold_five.toFixed(2);
			t20 = +item.threshold_twenty.toFixed(2);
		});

		setData(boxData);
		setThresholdFive(t5);
		setThresholdTwenty(t20);
	}, [selectedStation]);

	useEffect(() => {
		if (data.length && thresholdFive != null && thresholdTwenty != null && category.length) {
			const updatedOptions: Highcharts.Options = {
				...initialOptions.default,
				xAxis: {
					...(initialOptions.default.xAxis as Highcharts.XAxisOptions),
					categories: category,
				},
				yAxis: {
					...(initialOptions.default.yAxis as Highcharts.YAxisOptions),
					plotLines: [
						{ ...initialOptions.default.yAxis?.plotLines?.[0], value: thresholdFive },
						{ ...initialOptions.default.yAxis?.plotLines?.[1], value: thresholdTwenty },
					],
				},
				series: [
					{
						...(initialOptions.default.series?.[0] as Highcharts.SeriesBoxplotOptions),
						data,
					},
				],
			};

			setChartOptions(updatedOptions);
		}
	}, [data, thresholdFive, thresholdTwenty, category]);

	return (
		<Modal className={style.modal}>
			<ModalHeader
				title={`${selectedStation?.properties?.station_name ?? "Station"} Boxplot`}
				rightComponent={<DangerButton transparent iconName="close" onClick={handleModalClose} />}
			/>
			<ModalBody>
				{data.length > 0 && <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
			</ModalBody>
		</Modal>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(BoxModal);
