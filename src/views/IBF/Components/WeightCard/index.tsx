/* eslint-disable jsx-a11y/label-has-for */

/* eslint-disable @typescript-eslint/camelcase */

import React, { useState } from "react";
import Redux from "redux";
import { connect } from "react-redux";
import { patchRequest } from "#views/IBF/Requests/apiCalls";
import { setIbfPageAction } from "#actionCreators";
import { _cs } from "@togglecorp/fujs";
import styles from "./styles.module.scss";

interface PropsFromDispatch {}

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
	setIbfPage: (params) => dispatch(setIbfPageAction(params)),
});

const WeightCard = ({ weight, setWtActive, setIbfPage, isActiveHandler }) => {
	const [wts, setWts] = useState(weight);
	const [disable, setDisable] = useState(false);
	const [pending, setPending] = useState(false);

	// const { weightPatchRequest } = requests;

	const wtChangeHandler = (e, wtKey, whts) => {
		const { name } = e.target;
		const { value } = e.target;
		if (!value) {
			setDisable(true);
		} else {
			setDisable(false);
		}
		setWts((prevValues) => ({
			...prevValues,
			[wtKey]: {
				id: whts[wtKey].id,
				weight: Number(value),
				error: value ? "" : "This field is required",
			},
		}));
	};

	const formSubmitHandler = (event) => {
		event.preventDefault();
		const wtDataArr = [];
		setPending(true);
		const wtPatchRequest = async () => {
			for (const whtKey in wts) {
				if (wts[whtKey].weight !== weight[whtKey].weight) {
					const wtData = await patchRequest("ibf-vulnerability-subindicator", {
						wtToPatch: wts[whtKey],
					});
					wtDataArr.push(wtData);
				}
			}
			setPending(false);
			if (wtDataArr.length > 0) {
				setWtActive(false);
				isActiveHandler();
				setIbfPage({ wtChange: 1 });
			}
		};
		wtPatchRequest();
	};

	return (
		<div className={styles.weightContainer}>
			<form className={styles.formContainer} onSubmit={formSubmitHandler}>
				{Object.keys(wts).length > 0 &&
					Object.keys(wts).map((wtKey) => (
						<>
							<div className={styles.inputContainer}>
								<label className={styles.label} htmlFor={wtKey}>
									{wtKey}
								</label>
								<input
									className={styles.input}
									type="text"
									id={wtKey}
									name={wtKey}
									value={wts[wtKey].weight}
									onChange={(event) => wtChangeHandler(event, wtKey, wts)}
									required
								/>
							</div>
							{wts[wtKey].error && <p className={styles.error}>This field is required</p>}
						</>
					))}
				<div>
					<input
						className={_cs(styles.formSubmit, disable ? styles.disabled : styles.allowed)}
						type="submit"
						value={pending ? "Saving..." : "Save"}
						disabled={disable}
					/>
				</div>
			</form>
		</div>
	);
};

export default connect(undefined, mapDispatchToProps)(WeightCard);
