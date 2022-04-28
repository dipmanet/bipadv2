/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import Leftpane1 from './Leftpanes/Leftpane1/index';
import Leftpane2 from './Leftpanes/Leftpane2/index';
import Demographic from './Leftpanes/Demographic/index';
import Leftpane3 from './Leftpanes/Leftpane3/index';
import Leftpane4 from './Leftpanes/Leftpane4/index';
import Leftpane5 from './Leftpanes/Leftpane5/index';
import Leftpane6 from './Leftpanes/Leftpane6/index';
import Leftpane7 from './Leftpanes/Leftpane7/index';
import Leftpane8 from './Leftpanes/Leftpane8/index';
import Leftpane9 from './Leftpanes/Leftpane9/index';
import Leftpane10 from './Leftpanes/Leftpane10/index';
import Map from './Map/index';
import styles from './styles.scss';
import LeftTopBar from './Components/LeftTopBar';
import {
	ClientAttributes,
	createConnectedRequestCoordinator,
	createRequestClient,
	methods,
} from '#request';
import * as PageTypes from '#store/atom/page/types';

const mapStateToProps = (state: any) => { };
const mapDispatchToProps = (state: any) => { };

export interface ScrollTopInitialValues {
	page1ScrolltopValue: number;
	page2ScrolltopValue: number;
	page4ScrolltopValue: number;
	page5ScrolltopValue: number;
	page6ScrolltopValue: number;
	page7ScrolltopValue: number;
	page8ScrolltopValue: number;
	page9ScrolltopValue: number;
	page10ScrolltopValue: number;
	page11ScrolltopValue: number;
	demographicScrolltopValue: number;
}

export interface PostionInitialValues {
	page1PositionValue: number;
	page2PositionValue: number;
	page4PositionValue: number;
	page5PositionValue: number;
	page6PositionValue: number;
	page7PositionValue: number;
	page8PositionValue: number;
	page9PositionValue: number;
	page10PositionValue: number;
	page11PositionValue: number;
	demographicPositionValue: number;
}

interface Params {
	municipalityId: number;
	setcIData: any;
}
interface CIDataList {
	id: number;
	point: [];
	title: string;
	resourceType: string;

}

type CIData = CIDataList[]


interface OwnProps { }
interface Params { }
interface ReduxProps { }


const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {

	cIGetRequest: {
		url: '/resource/',
		method: methods.GET,
		query: ({ params }) => ({
			municipality: params && params.municipalityId,
			limit: -1,
		}),
		onSuccess: ({ params, response }) => {
			interface Response { results: PageTypes.Incident[] }
			const { results: cI = [] } = response as Response;
			if (params) {
				params.setcIData(cI);
			}
		},
		onMount: false,
	},

};

const Ratnanagar = (props: any) => {
	const scrollTopPageInitialValues = {
		page1ScrolltopValue: 0,
		page2ScrolltopValue: 0,
		page4ScrolltopValue: 0,
		page5ScrolltopValue: 0,
		page6ScrolltopValue: 0,
		page7ScrolltopValue: 0,
		page8ScrolltopValue: 0,
		page9ScrolltopValue: 0,
		page10ScrolltopValue: 0,
		page11ScrolltopValue: 0,
		demographicScrolltopValue: 0,
	};

	const positionInitialValues = {
		page1PositionValue: 1,
		page2PositionValue: 1,
		page4PositionValue: 1,
		page5PositionValue: 1,
		page6PositionValue: 1,
		page7PositionValue: 1,
		page8PositionValue: 1,
		page9PositionValue: 1,
		page10PositionValue: 1,
		page11PositionValue: 1,
		demographicPositionValue: 1,
	};

	const [pending, setpending] = useState<boolean>(true);
	const [leftElement, setLeftElement] = useState<number>(0);
	const [scrollTopValuesPerPage, setScrollTopValuesPerPage] = useState<ScrollTopInitialValues>(scrollTopPageInitialValues);
	const [postionsPerPage, setPostionsPerPage] = useState<PostionInitialValues>(positionInitialValues);
	const [clickedCiName, setclickedCiName] = useState<string[]>([]);
	const [ciNameList, setciNameList] = useState<string[]>([]);
	const [unClickedCIName, setunClickedCIName] = useState<string[]>([]);

	// state for requested data
	const [cIData, setcIData] = useState<CIData>([]);


	const { requests: {
		cIGetRequest,
	} } = props;

	const municipalityId = 35007;


	useEffect(() => {
		cIGetRequest.setDefaultParams({
			setcIData,
			municipalityId,
		});
		cIGetRequest.do();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (cIData.length > 0) {
			setpending(false);
		}
	}, [cIData]);

	const onButtonClick = (item: number) => {
		setLeftElement(item);
	};

	const handleCIClick = (ciName: string) => {
		setclickedCiName(prevState => [...prevState, ciName]);
		setunClickedCIName(prevState => prevState.filter(ciItem => ciItem !== ciName));

		if (clickedCiName.includes(ciName)) {
			setclickedCiName(prevState => prevState.filter(ciItem => ciItem !== ciName));
			setunClickedCIName(prevState => [...new Set([...prevState, ciName])]);
		}
	};

	const geoJsonCI = {
		type: 'FeatureCollection',
		features: cIData.map(item => ({
			type: 'Feature',
			id: item.id,
			geometry: item.point,
			properties: {
				Name: item.title,
				layer: item.resourceType,
				Type: item.resourceType,
			},
		})),
	};


	return (
		<>

			{
				pending ? (
					<div className={styles.loaderInfo}>
						<Loader loaded={!pending} color="#fff" className={styles.loader} />
						<p className={styles.loaderText}>
							Loading Data...
						</p>
					</div>
				)
					: (
						<>
							{
								leftElement < 11 && (
									<>
										<Map
											leftElement={leftElement}
											CIData={geoJsonCI}
											clickedCiName={clickedCiName}
											ciNameList={ciNameList}
											setciNameList={setciNameList}
											unClickedCIName={unClickedCIName}
										/>
										<LeftTopBar />
									</>

								)
							}
							{leftElement === 0 && (
								<Leftpane1
									leftElement={leftElement}
									setLeftElement={setLeftElement}
									scrollTopValuesPerPage={scrollTopValuesPerPage}
									setScrollTopValuesPerPage={setScrollTopValuesPerPage}
									postionsPerPage={postionsPerPage}
									setPostionsPerPage={setPostionsPerPage}
									onButtonClick={onButtonClick}
								/>
							)}
							{leftElement === 1 && (
								<Leftpane2
									leftElement={leftElement}
									setLeftElement={setLeftElement}
									scrollTopValuesPerPage={scrollTopValuesPerPage}
									setScrollTopValuesPerPage={setScrollTopValuesPerPage}
									postionsPerPage={postionsPerPage}
									setPostionsPerPage={setPostionsPerPage}
									onButtonClick={onButtonClick}
								/>
							)}
							{leftElement === 2 && (
								<Demographic
									leftElement={leftElement}
									setLeftElement={setLeftElement}
									scrollTopValuesPerPage={scrollTopValuesPerPage}
									setScrollTopValuesPerPage={setScrollTopValuesPerPage}
									postionsPerPage={postionsPerPage}
									setPostionsPerPage={setPostionsPerPage}
									onButtonClick={onButtonClick}
								/>
							)}
							{leftElement === 3 && (
								<Leftpane3
									leftElement={leftElement}
									setLeftElement={setLeftElement}
									scrollTopValuesPerPage={scrollTopValuesPerPage}
									setScrollTopValuesPerPage={setScrollTopValuesPerPage}
									postionsPerPage={postionsPerPage}
									setPostionsPerPage={setPostionsPerPage}
									onButtonClick={onButtonClick}
									clickedCiName={clickedCiName}
									handleCIClick={handleCIClick}
									cIData={cIData}
								/>
							)}
							{leftElement === 4 && (
								<Leftpane4
									leftElement={leftElement}
									setLeftElement={setLeftElement}
									scrollTopValuesPerPage={scrollTopValuesPerPage}
									setScrollTopValuesPerPage={setScrollTopValuesPerPage}
									postionsPerPage={postionsPerPage}
									setPostionsPerPage={setPostionsPerPage}
									onButtonClick={onButtonClick}
								/>
							)}
							{leftElement === 5 && (
								<Leftpane5
									leftElement={leftElement}
									setLeftElement={setLeftElement}
									scrollTopValuesPerPage={scrollTopValuesPerPage}
									setScrollTopValuesPerPage={setScrollTopValuesPerPage}
									postionsPerPage={postionsPerPage}
									setPostionsPerPage={setPostionsPerPage}
									onButtonClick={onButtonClick}
								/>
							)}
							{leftElement === 6 && (
								<Leftpane6
									leftElement={leftElement}
									setLeftElement={setLeftElement}
									scrollTopValuesPerPage={scrollTopValuesPerPage}
									setScrollTopValuesPerPage={setScrollTopValuesPerPage}
									postionsPerPage={postionsPerPage}
									setPostionsPerPage={setPostionsPerPage}
									onButtonClick={onButtonClick}
								/>
							)}
							{leftElement === 7 && (
								<Leftpane7
									leftElement={leftElement}
									setLeftElement={setLeftElement}
									scrollTopValuesPerPage={scrollTopValuesPerPage}
									setScrollTopValuesPerPage={setScrollTopValuesPerPage}
									postionsPerPage={postionsPerPage}
									setPostionsPerPage={setPostionsPerPage}
									onButtonClick={onButtonClick}
								/>
							)}
							{leftElement === 8 && (
								<Leftpane8
									leftElement={leftElement}
									setLeftElement={setLeftElement}
									scrollTopValuesPerPage={scrollTopValuesPerPage}
									setScrollTopValuesPerPage={setScrollTopValuesPerPage}
									postionsPerPage={postionsPerPage}
									setPostionsPerPage={setPostionsPerPage}
									onButtonClick={onButtonClick}
								/>
							)}
							{leftElement === 9 && (
								<Leftpane9
									leftElement={leftElement}
									setLeftElement={setLeftElement}
									scrollTopValuesPerPage={scrollTopValuesPerPage}
									setScrollTopValuesPerPage={setScrollTopValuesPerPage}
									postionsPerPage={postionsPerPage}
									setPostionsPerPage={setPostionsPerPage}
									onButtonClick={onButtonClick}
								/>
							)}
							{leftElement === 10 && (
								<Leftpane10
									leftElement={leftElement}
									setLeftElement={setLeftElement}
									scrollTopValuesPerPage={scrollTopValuesPerPage}
									setScrollTopValuesPerPage={setScrollTopValuesPerPage}
									postionsPerPage={postionsPerPage}
									setPostionsPerPage={setPostionsPerPage}
									onButtonClick={onButtonClick}
								/>
							)}
						</>
					)
			}

		</>
	);
};


export default compose(
	// connect(mapStateToProps, mapDispatchToProps),
	createConnectedRequestCoordinator<ReduxProps>(),
	createRequestClient(requests),
)(Ratnanagar);
