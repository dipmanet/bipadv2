import React, { useState, useEffect } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormGroup from "@mui/material/FormGroup";
import { FormControl } from "@mui/material";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useDispatch, connect } from "react-redux";
// import { getInventoryItem } from '../../../../Redux/actions';

import { SetHealthInfrastructurePageAction } from "#actionCreators";
import { healthInfrastructurePageSelector, userSelector } from "#selectors";
import {
	ClientAttributes,
	createConnectedRequestCoordinator,
	createRequestClient,
	methods,
} from "#request";
import styles from "./styles.module.scss";

const mapStateToProps = (state: AppState): PropsFromAppState => ({
	healthInfrastructurePage: healthInfrastructurePageSelector(state),
	userDataMain: userSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setHealthInfrastructurePage: (params) => dispatch(SetHealthInfrastructurePageAction(params)),
});

const requests: { [key: string]: ClientAttributes<ReduxProps, Params> } = {
	getInventoryData: {
		url: "/inventory/",
		method: methods.GET,
		onMount: false,
		query: ({ params }) => ({
			format: "json",
			resource: `${params.resource}`,
		}),
		onSuccess: ({ response, props }) => {
			props.setHealthInfrastructurePage({
				inventoryData: response.results,
			});
		},
	},
};

const baseUrl = import.meta.env.VITE_APP_API_SERVER_URL;

interface Props {
	currentEditData: Record<string, unknown>;
	handleClose: () => void;
	unit: string;
	open: boolean;
	inventoryItem: { title: string; quantity: number; description: string; unit: string };
	inventoryData: array[];
	units: string[];
	resourceID: string;
}
const EditModal = (props: Props) => {
	const { currentEditData } = props;
	const {
		handleClose,
		units: unitFromprops,
		open,
		inventoryItem,
		inventoryData,
		resourceID,
	} = props;
	const [inventory, setinventory] = useState(inventoryData.description);
	const [quantity, setqty] = useState(inventoryData.quantity);
	const [unit, setUnit] = useState(inventoryData.unit);
	const dispatch = useDispatch();
	useEffect(() => {
		setinventory(inventoryData.description);
		setqty(inventoryData.quantity);
		setUnit(inventoryData.unit);
	}, [inventoryData]);
	const handleInventory = (e) => {
		setinventory(e.target.value);
	};
	const handleQuantity = (e) => {
		setqty(e.target.value);
	};
	const handleUnit = (e) => {
		setUnit(e.target.value);
	};

	const handleInvEdit = () => {
		const putData = {
			itemId: inventoryData.itemId,
			quantity,
			description: inventory,
			resource: resourceID,
			unit,
		};
		axios
			.patch(`${baseUrl}/inventory/${inventoryData.id}/`, putData, {
				headers: {
					Accept: "application/json",
				},
			})
			.then((res) => {
				props.requests.getInventoryData.do({ resource: resourceID });
				handleClose();
			})
			.catch((error) => {
				handleClose();
			});
	};

	return (
		<Modal
			open={open}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description">
			<Box sx={{ display: "flex" }}>
				<div className={styles.invContainer}>
					<div className={styles.col1}>
						<FormControl style={{ margin: "15px 0" }} variant="filled" fullWidth>
							<InputLabel id="inv-Input">Inventory</InputLabel>
							<Select
								labelId="inv-Label"
								id="invID"
								value={inventory}
								label="Internet Facility"
								onChange={handleInventory}
								style={{ border: "1px solid #d5d5d5", borderRadius: "3px" }}
								disableUnderline
								fullWidth>
								{inventoryItem &&
									inventoryItem.map((iD) => (
										<MenuItem value={iD.title} key={iD.id}>
											{iD.title}
										</MenuItem>
									))}
							</Select>
						</FormControl>
					</div>
					<div className={styles.col2}>
						<FormControl style={{ margin: "15px 0" }} variant="filled" fullWidth>
							<TextField
								id="outlined-basic"
								label="Quantity"
								variant="filled"
								value={quantity}
								onChange={handleQuantity}
								InputProps={{ disableUnderline: true }}
								style={{ border: "1px solid #d5d5d5", borderRadius: "3px" }}
							/>
						</FormControl>
					</div>
					<div className={styles.col3}>
						<FormControl style={{ margin: "15px 0" }} variant="filled" fullWidth>
							<InputLabel id="has_internet_facility-Input">Unit</InputLabel>
							<Select
								labelId="has_internet_facility-Label"
								id="has_internet_facilityID"
								value={unit}
								onChange={handleUnit}
								style={{ border: "1px solid #d5d5d5", borderRadius: "3px" }}
								disableUnderline>
								{unitFromprops &&
									unitFromprops.length > 0 &&
									unitFromprops.map((u) => (
										<MenuItem value={u} key={u}>
											{u}
										</MenuItem>
									))}
							</Select>
						</FormControl>
					</div>
					<button onClick={() => handleInvEdit()} type="button">
						Update and Close
					</button>
				</div>
			</Box>
		</Modal>
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(createConnectedRequestCoordinator<ReduxProps>()(createRequestClient(requests)(EditModal)));
