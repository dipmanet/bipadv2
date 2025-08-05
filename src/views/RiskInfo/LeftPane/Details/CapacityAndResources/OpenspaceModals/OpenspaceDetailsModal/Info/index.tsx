import React, { Component } from "react";
import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import { createRequestClient, ClientAttributes, methods } from "#request";
import styles from "./styles.module.scss";
import IconComponent from "../IconComponent";

interface Props {
	openspaceId: any;
	allData: any;
	type?: string;
	// className: any;
}

interface Amenity {
	icon: string;
	amenitiesName: string;
	isAvailable: boolean;
	description: any;
}
interface Use {
	id: number;
	icon: string;
	suggestedUseName: any;
}

interface Params {
	openspaceId: any;
	openSpaceId: number;
}

interface SuggestedUses {
	length: number;
	map(arg0: (use: Use) => JSX.Element): React.ReactNode;
}

interface State {}
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 20,
	borderRadius: 1,
	"&.MuiLinearProgress-colorPrimary": {
		backgroundColor: "grey",
	},
	"& .MuiLinearProgress-bar": {
		borderRadius: 1,
		backgroundColor: "#1a90ff",
	},
}));

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
	suggestedUsesGetRequest: {
		url: ({ params }) => {
			if (!params || !params.openspaceId) {
				return "";
			}
			return `/open-suggested/?open_space=${params.openspaceId}`;
		},
		method: methods.GET,
		onMount: false,
	},
	amenitiesGetRequest: {
		url: ({ params }) => {
			if (!params || !params.openspaceId) {
				return "";
			}
			return `/open-amenities/?open_space=${params.openspaceId}`;
		},
		method: methods.GET,
		onMount: false,
	},
};

class Info extends Component {
	public constructor(props: Props) {
		super(props);
		const {
			requests: { suggestedUsesGetRequest, amenitiesGetRequest },
			openspaceId,
		} = this.props;
		suggestedUsesGetRequest.do({
			openspaceId,
		});
		amenitiesGetRequest.do({
			openspaceId,
		});
		this.state = {};
	}

	public render() {
		const { usableArea, totalArea, capacity, description } = this.props.allData;
		const usablePerc = (parseInt(usableArea, 10) / parseInt(totalArea, 10)) * 100;
		const { requests } = this.props;
		const {
			suggestedUsesGetRequest: { response, pending: suggestedUsesGetRequestPending },
		} = requests;
		const {
			amenitiesGetRequest: { response: responseOne, pending: amenitiesGetRequestPending },
		} = requests;

		let suggestedUses: SuggestedUses | undefined;
		let amenities: SuggestedUses | undefined;
		if (response) {
			suggestedUses = response.results as SuggestedUses;
		}
		if (responseOne) {
			amenities = responseOne.results;
		}
		return (
			<div className={styles.infoContainer}>
				<div className={styles.areaInfo}>
					<div className={styles.areaUnit}>
						<div className={styles.upper}>
							{totalArea || "N/A"}
							<span style={{ marginLeft: "3px" }}>sq.m </span>
						</div>
						<div className={styles.lower}> Total Area</div>
					</div>
					<div className={styles.areaUnit}>
						<div className={styles.upper}>
							{usableArea || "N/A"}
							<span style={{ marginLeft: "3px" }}>sq.m </span>
						</div>
						<div className={styles.lower}> Usable Area</div>
					</div>
					<div className={styles.areaUnit}>
						<div className={styles.upper}>
							{(usableArea / 5).toFixed(0)}
							<span style={{ marginLeft: "3px" }}>persons </span>
						</div>
						<div className={styles.lower}> Capacity</div>
					</div>
				</div>
				<div className={styles.utilizationInfo}>
					<div className={styles.division}>
						<div className={styles.usable}>
							<div className={styles.top}>
								<div className={styles.box1} />

								<div className={styles.text}>Usable Area</div>
							</div>
							<div className={styles.bottom}>
								{usablePerc ? `${usablePerc.toFixed(2)}%` : "N/A"}
							</div>
						</div>
						<div className={styles.nonUsable}>
							<div className={styles.top}>
								<div className={styles.box2} />

								<div className={styles.text}>Unusable Area</div>
							</div>
							<div className={styles.bottom}>
								{usablePerc ? `${(100 - usablePerc).toFixed(2)}%` : "N/A"}
							</div>
						</div>
					</div>
					<div className={styles.division1}>
						<BorderLinearProgress variant="determinate" value={usablePerc.toFixed(0)} />
					</div>
				</div>
				<div className={styles.amnities}>
					<div className={styles.suggestions}>
						<div className={styles.suggestionsTitle}>Suggested Use</div>
						{suggestedUses && suggestedUses.length !== 0 ? (
							suggestedUses.map((use: Use) => (
								<div className={styles.suggestionItem} key={use.id}>
									<IconComponent icon={use.icon} title={use.suggestedUseName} />
								</div>
							))
						) : (
							<span style={{ paddingBottom: "10px" }}>No suggested uses to display.</span>
						)}
					</div>

					<div className={styles.suggestions} style={{ borderLeft: "1px solid #d5d5d5" }}>
						<div className={styles.suggestionsTitle}>Amenities</div>
						{amenities && amenities.length !== 0 ? (
							amenities.map((amenity: Amenity) => (
								<div className={styles.suggestionItem}>
									<IconComponent
										icon={amenity.icon}
										title={amenity.amenitiesName}
										amnityPresence={amenity.isAvailable}
										checkbox
										description={amenity.description}
									/>
								</div>
							))
						) : (
							<span>No amenities to display.</span>
						)}
					</div>
				</div>
				<div className={styles.description}>{description}</div>
			</div>
		);
	}
}

export default createRequestClient(requestOptions)(Info);
