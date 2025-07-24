/* eslint-disable @typescript-eslint/indent */
import CustomSwitch from "#components/Common/CustomSwitch";
import { _cs } from "@togglecorp/fujs";
import Icon from "#rscg/Icon";
import styles from "./styles.module.scss";

type toggleValues =
	| "education"
	| "health"
	| "finance"
	| "governance"
	| "hotelandrestaurant"
	| "cultural"
	| "industry"
	| "communication"
	| "communityspace"
	| "openspace"
	| "fireengine"
	| "helipad"
	| "evacuationcentre"
	| "warehouse";

interface Props {
	activeLayersIndication: {
		education: boolean;
		health: boolean;
		finance: boolean;
		governance: boolean;
		hotelandrestaurant: boolean;
		cultural: boolean;
		industry: boolean;
		communication: boolean;
		openspace: boolean;
		communityspace: boolean;
		fireengine: boolean;
		helipad: boolean;
		evacuationcentre: boolean;
		warehouse: boolean;
	};
	handleToggleClick: (key: toggleValues, value: boolean) => void;
	handleIconClick: (key: string) => void;
	disabled?: boolean;
}
const SwitchView = (props: Props) => {
	const {
		activeLayersIndication: {
			education,
			health,
			finance,
			governance,
			hotelandrestaurant,
			cultural,
			industry,
			communication,
			openspace,
			communityspace,
			fireengine,
			helipad,
			evacuationcentre,
			warehouse,
		},
		handleToggleClick,
		handleIconClick,
		disabled,
	} = props;
	return (
		<div className={styles.lists}>
			<div className={styles.listItem}>
				<CustomSwitch
					className={styles.switch}
					disabled={disabled}
					value={education ?? false}
					onChange={(value: boolean) => {
						handleToggleClick("education", value);
					}}
				/>
				<div className={styles.listTitle}> Education </div>
			</div>
			<div className={styles.listItem}>
				<CustomSwitch
					className={styles.switch}
					disabled={disabled}
					value={health ?? false}
					onChange={(value: boolean) => {
						handleToggleClick("health", value);
					}}
				/>
				<div className={styles.listTitle}> Health </div>
			</div>
			<div className={styles.listItem}>
				<CustomSwitch
					className={styles.switch}
					disabled={disabled}
					value={finance ?? false}
					onChange={(value: boolean) => {
						handleToggleClick("finance", value);
					}}
				/>
				<div className={styles.listTitle}> Finance </div>
			</div>
			<div className={styles.listItem}>
				<CustomSwitch
					className={styles.switch}
					disabled={disabled}
					value={governance ?? false}
					onChange={(value: boolean) => {
						handleToggleClick("governance", value);
					}}
				/>
				<div className={styles.listTitle}> Governance </div>
			</div>
			<div className={styles.listItem}>
				<CustomSwitch
					className={styles.switch}
					disabled={disabled}
					value={hotelandrestaurant ?? false}
					onChange={(value: boolean) => {
						handleToggleClick("hotelandrestaurant", value);
					}}
				/>
				<div className={styles.listTitle}> Hotel and Restaurant </div>
			</div>
			<div className={styles.listItem}>
				<CustomSwitch
					className={styles.switch}
					disabled={disabled}
					value={cultural ?? false}
					onChange={(value: boolean) => {
						handleToggleClick("cultural", value);
					}}
				/>
				<div className={styles.listTitle}> Cultural </div>
			</div>
			<div className={styles.listItem}>
				<CustomSwitch
					className={styles.switch}
					disabled={disabled}
					value={industry ?? false}
					onChange={(value: boolean) => {
						handleToggleClick("industry", value);
					}}
				/>
				<div className={styles.listTitle}> Industry </div>
			</div>
			<div className={styles.listItem}>
				<CustomSwitch
					className={styles.switch}
					disabled={disabled}
					value={communication ?? false}
					onChange={(value: boolean) => {
						handleToggleClick("communication", value);
					}}
				/>
				<div className={styles.listTitle}> Communication </div>
			</div>
			<div className={styles.listItemOpen}>
				<div className={styles.switchWrap}>
					<CustomSwitch
						className={styles.switch}
						disabled={disabled}
						value={openspace ?? false}
						onChange={(value: boolean) => {
							handleToggleClick("openspace", value);
						}}
					/>
					<div className={styles.listTitle}>Humanitarian Open Spaces </div>
				</div>

				<div className={styles.actionsIcon}>
					<Icon
						title={"Humanitarian Open Spaces in tabular format"}
						className={_cs(styles.infoIcon)}
						name="table"
						onClick={() => handleIconClick("showAllOpenspacesModal")}
					/>
					<Icon
						title={"Humanitarian Open Spaces Metadata"}
						className={_cs(styles.infoIcon)}
						name="aboutUs"
						onClick={() => handleIconClick("showOpenSpaceInfoModal")}
					/>
				</div>
			</div>
			<div className={styles.listItemOpen}>
				<div className={styles.switchWrap}>
					<CustomSwitch
						className={styles.switch}
						disabled={disabled}
						value={communityspace ?? false}
						onChange={(value: boolean) => {
							handleToggleClick("communityspace", value);
						}}
					/>
					<div className={styles.listTitle}> Community Spaces </div>
				</div>

				<div className={styles.actionsIcon}>
					<Icon
						title={"Community Spaces in tabular format"}
						className={_cs(styles.infoIcon)}
						name="table"
						onClick={() => handleIconClick("showAllCommunityModal")}
					/>
					<Icon
						title={"Community Spaces Metadata"}
						className={_cs(styles.infoIcon)}
						name="aboutUs"
						onClick={() => handleIconClick("communityMetaModal")}
					/>
				</div>
			</div>
			<div className={styles.listItem}>
				<CustomSwitch
					className={styles.switch}
					disabled={disabled}
					value={fireengine ?? false}
					onChange={(value: boolean) => {
						handleToggleClick("fireengine", value);
					}}
				/>
				<div className={styles.listTitle}> Fire Engine </div>
			</div>
			<div className={styles.listItem}>
				<CustomSwitch
					className={styles.switch}
					disabled={disabled}
					value={helipad ?? false}
					onChange={(value: boolean) => {
						handleToggleClick("helipad", value);
					}}
				/>
				<div className={styles.listTitle}> Helipad </div>
			</div>
			<div className={styles.listItem}>
				<CustomSwitch
					className={styles.switch}
					disabled={disabled}
					value={evacuationcentre ?? false}
					onChange={(value: boolean) => {
						handleToggleClick("evacuationcentre", value);
					}}
				/>
				<div className={styles.listTitle}> Evacuation Center </div>
			</div>
			{/* <div className={styles.listItem}>
                <Switch
                    className={styles.switch}
                    disabled={disabled}
                    on
                    off={false}
                    value={helipad}
                    onChange={(value: boolean) => {
                        handleToggleClick('helipad', value);
                    }}
                />
                <div className={styles.listTitle}> Helipad </div>
            </div> */}
		</div>
	);
};

export default SwitchView;
