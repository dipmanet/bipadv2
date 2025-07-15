/* eslint-disable*/
import React from "react";
import styles from "../styles.module.scss";
import PrimaryButton from "#rsca/Button/PrimaryButton";
import { createRequestClient, ClientAttributes, methods } from "#request";

interface Props {
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleTabClick: (tab: string) => void;
}

interface Amenity {
	id: number;
	openspaceName: string | number;
	amenities: number;
	iconName: string;
	name?: string;
	amenitiesName: string;
	description: string;
	isAvailable: boolean;
}

interface AmenitiesResponse {
	results: Amenity[];
}
interface State {
	allAmenitiesToPost: Amenity[];
	singleAmenitiesList: Amenity[];
}

interface Props {
	openspaceId: number | string | undefined;
}
interface ReduxProps {}
interface Params {
	setAllAmenitiesList?: (arg) => void;
	setSingleAmenitiesList: (arg) => void;
}

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	getAllAmenitiesRequest: {
		url: "/amenities/",
		method: methods.GET,
		onSuccess: ({ response, params }) => {
			if (params && params.setAllAmenitiesList) {
				params.setAllAmenitiesList(response.results);
			}
		},
	},
	getSingleAmenitiesRequest: {
		url: ({ props: { openspaceId } }) => `/open-amenities/?open_space=${openspaceId}`,
		// url: `/open-eia/?open_space=49`,
		method: methods.GET,
		onSuccess: ({ response, params }) => {
			if (params.setSingleAmenitiesList) {
				params.setSingleAmenitiesList(response.results);
			}
		},
	},
	addAmenitiesRequest: {
		url: "/open-amenities/",
		method: methods.POST,
		body: ({ params: { body } = { body: {} } }) => body,
		onSuccess: ({ response }) => {
			console.log("sucess", response);
		},
		onFailure: ({ error, params }) => {
			if (params && params.setFaramErrors) {
				// TODO: handle error
				console.warn("failure", error);
				params.setFaramErrors({
					$internal: ["Some problem occurred"],
				});
			}
		},
		onFatal: ({ params }) => {
			if (params && params.setFaramErrors) {
				params.setFaramErrors({
					$internal: ["Some problem occurred"],
				});
			}
		},
	},
	deleteAmenitiesRequest: {
		url: ({ params }) => `/open-amenities/${params.openspaceId}`,
		method: methods.DELETE,
		body: ({ params: { body } = { body: {} } }) => body,
		onSuccess: ({ response, props }) => {
			console.log("delete sucess", response);
		},
		onFailure: ({ error, params }) => {
			if (params && params.setFaramErrors) {
				// TODO: handle error
				console.warn("failure", error);
				params.setFaramErrors({
					$internal: ["Some problem occurred"],
				});
			}
		},
		onFatal: ({ params }) => {
			if (params && params.setFaramErrors) {
				params.setFaramErrors({
					$internal: ["Some problem occurred"],
				});
			}
		},
	},
};

class OnSiteAmenities extends React.PureComponent<Props, State> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			allAmenitiesToPost: null,
			singleAmenitiesList: null,
			checkedAmenities: [],
		};
	}

	public componentDidMount() {
		const {
			requests: { getSingleAmenitiesRequest, getAllAmenitiesRequest },
		} = this.props;
		getSingleAmenitiesRequest.do({
			setSingleAmenitiesList: this.setSingleAmenitiesList,
		});
		getAllAmenitiesRequest.do({
			setAllAmenitiesList: this.setAllAmenitiesList,
		});
	}

	private handleEditNoteChange = (e, id) => {
		const { value } = e.target;
		const { singleAmenitiesList } = this.state;
		singleAmenitiesList.forEach((element: Amenity, index) => {
			if (element.amenities === id) {
				element.description = value;
			}
		});

		this.setState({
			singleAmenitiesList,
		});
	};

	private handleNoteChange = (e, id) => {
		const { value } = e.target;

		const AmenitiesToPost = this.state.allAmenitiesToPost;
		AmenitiesToPost.forEach((element: Amenity, index) => {
			if (element.amenities == id) {
				element.description = value;
			}
		});
		this.setState({
			allAmenitiesToPost: AmenitiesToPost,
		});
	};

	private handleChange = (e, id: number) => {
		const { checked } = e.target;
		const { openspaceId } = this.props;

		const AmenitiesToPost: Amenity[] = this.state.allAmenitiesToPost;
		AmenitiesToPost.forEach((element, index) => {
			if (element.amenities === id) {
				const obj = {
					openSpace: openspaceId,
					amenities: id,
					description: AmenitiesToPost[index].description ? AmenitiesToPost[index].description : "",
					isAvailable: checked,
				};
				AmenitiesToPost[index] = obj;
			}
		});
		this.setState({
			allAmenitiesToPost: AmenitiesToPost,
		});
	};

	private setAllAmenitiesList = (allAmenities: Amenity[]) => {
		const { openspaceId } = this.props;
		const allAmenitiesToPost: Amenity[] = [];

		allAmenities.map((amenity: Amenity) => {
			const obj = {
				openSpace: openspaceId,
				amenities: amenity.id,
				description: "",
				isAvailable: false,
			};
			allAmenitiesToPost.push(obj);
		});
		this.setState({
			allAmenities,
			allAmenitiesToPost,
		});
	};

	private setSingleAmenitiesList = (allAmenities) => {
		this.setState({
			singleAmenitiesList: allAmenities,
		});
	};

	private postAmenities = () => {
		const { allAmenitiesToPost } = this.state;
		const { handleTabClick, LoadingSuccessHalt } = this.props;
		LoadingSuccessHalt(true);
		if (allAmenitiesToPost.length !== 0) {
			for (let i = 0; i < allAmenitiesToPost.length; i++) {
				const requestOptions = {
					method: "POST",
					body: JSON.stringify(allAmenitiesToPost[i]),
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				};
				fetch(`${import.meta.env.VITE_APP_API_SERVER_URL}/open-amenities/`, requestOptions)
					.then((response) => response.json())
					.then(() => {
						if (i === allAmenitiesToPost.length - 1) {
							handleTabClick("environmentChecklist");
							LoadingSuccessHalt(false);
						}
					});
			}
		} else {
			handleTabClick("environmentChecklist");
			LoadingSuccessHalt(false);
		}
	};

	private postEditedAmenities = () => {
		const { singleAmenitiesList } = this.state;
		const { handleTabClick, LoadingSuccessHalt } = this.props;
		LoadingSuccessHalt(true);
		if (singleAmenitiesList.length !== 0) {
			for (let i = 0; i < singleAmenitiesList.length; i++) {
				const requestOptions = {
					method: "PUT",
					body: JSON.stringify(singleAmenitiesList[i]),
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				};
				fetch(
					`${import.meta.env.VITE_APP_API_SERVER_URL}/open-amenities/${singleAmenitiesList[i].id}/`,
					requestOptions
				)
					.then((response) => response.json())
					.then(() => {
						if (i === singleAmenitiesList.length - 1) {
							handleTabClick("environmentChecklist");
							LoadingSuccessHalt(false);
						}
					});
			}
		} else {
			handleTabClick("environmentChecklist");
			LoadingSuccessHalt(false);
		}
	};

	private handleEditAmenitiesChange = (e, listItem: Amenity, latestValue) => {
		const { checked } = e.target;
		const { id, eia } = latestValue;

		const { singleAmenitiesList } = this.state;
		const amenitiesDescription = "";
		singleAmenitiesList.forEach((element: Amenity, index) => {
			if (element.id === id) {
				element.isAvailable = checked;
			}
		});
		this.setState(
			{
				singleAmenitiesList,
			},
			() => this.state.singleAmenitiesList
		);
	};

	public render() {
		const { resourceId } = this.props;
		const { allAmenities, singleAmenitiesList } = this.state;
		const { handleTabClick } = this.props;
		return (
			<React.Fragment>
				{resourceId === undefined
					? allAmenities &&
					  allAmenities.map((item) => (
							<div
								className={styles.amenitiesDiv}
								key={item.id}
								style={{
									margin: "4px 0 4px 0",
								}}>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}>
									<div>
										<i
											className={item.iconName}
											style={{
												paddingRight: "10px",
												color: "rgba(0,0,0,0.6)",
												height: "24px",
												width: "24px",
											}}
										/>
										{item.name}
									</div>
									<label className={styles.switch}>
										<input
											type="checkbox"
											value=""
											//  defaultChecked={latestValue.isAvailable}
											onClick={(e) => this.handleChange(e, item.id)}
										/>
										<span className={styles.slider} />
									</label>
								</div>
								<label className={styles.detailsLabel}>Note:</label>
								<input
									className={styles.detailsInput}
									onChange={(e) => this.handleNoteChange(e, item.id)}
								/>
							</div>
					  ))
					: allAmenities &&
					  singleAmenitiesList &&
					  allAmenities.map((item: Amenity) => {
							const eiaAvailability =
								singleAmenitiesList && singleAmenitiesList.filter((el) => el.amenities === item.id);
							// let latestValue =
							//  eiaAvailability.reduce(function (prev, current) {
							//     if (+current.id > +prev.id) {
							//         return current;
							//     } else {
							//         return prev;
							//     }
							// });
							return (
								<div
									className={styles.amenitiesDiv}
									key={item.id}
									style={{
										margin: "4px 0 4px 0",
									}}>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
										}}>
										<div>
											<i
												className={item.iconName}
												style={{
													paddingRight: "10px",
													color: "rgba(0,0,0,0.6)",
													height: "24px",
													width: "24px",
												}}
											/>
											{item.name}
										</div>
										<label className={styles.switch}>
											<input
												type="checkbox"
												value=""
												defaultChecked={
													eiaAvailability.length !== 0 ? eiaAvailability[0].isAvailable : false
												}
												onClick={(e) =>
													this.handleEditAmenitiesChange(
														e,
														item,
														eiaAvailability && eiaAvailability[0]
													)
												}
											/>
											<span className={styles.slider} />
										</label>
									</div>
									<label className={styles.detailsLabel}>Note:</label>
									<input
										className={styles.detailsInput}
										defaultValue={eiaAvailability[0] && eiaAvailability[0].description}
										name="note"
										onChange={(e) => this.handleEditNoteChange(e, item.id)}
									/>
								</div>
							);
					  })}

				<div className={styles.stepButtons}>
					{/* <PrimaryButton
                        disabled
                        onClick={() => handleTabClick('suggestedUses')}
                    >
                        Back
                    </PrimaryButton> */}
					<PrimaryButton
						// type="submit"
						// disabled={pristine}
						// pending={addResourcePending || editResourcePending}
						onClick={() => {
							resourceId === undefined ? this.postAmenities() : this.postEditedAmenities();
						}}>
						Save and Continue
					</PrimaryButton>
				</div>
			</React.Fragment>
		);
	}
}
export default createRequestClient(requests)(OnSiteAmenities);
