/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from "react";
import { Icon } from "react-icons-kit";
import { ic_edit as Edit } from "react-icons-kit/md/ic_edit";
import { ic_delete as Delete } from "react-icons-kit/md/ic_delete";
import { ic_directions as Directions } from "react-icons-kit/md/ic_directions";
import styles from "./styles.module.scss";

interface Point {}
interface Props {
	title: string;
	location: string;
	point: {};
	onEdit: () => void;
	routeToOpenspace: (point: Point) => void;
	handleDeleteModal: () => void;
	authenticated: boolean;
}

export default class SubHeader extends React.PureComponent<Props> {
	public render() {
		const {
			title,
			location,
			point,
			onEdit,
			routeToOpenspace,
			handleDeleteModal,
			authenticated,
			closeModal,
		} = this.props;
		return (
			<div className={styles.subHeader}>
				<div className={styles.topRow}>
					<div className={styles.header}>{title}</div>
					{authenticated && (
						<div
							className={styles.option}
							onClick={() => {
								onEdit();
								closeModal();
							}}
							onKeyDown={() => {
								onEdit();
								closeModal();
							}}>
							<Icon icon={Edit} size={15} />
							Edit
						</div>
					)}

					{authenticated && (
						<div
							className={styles.option}
							onClick={() => handleDeleteModal()}
							onKeyDown={() => handleDeleteModal()}>
							{" "}
							<Icon icon={Delete} size={15} />
							Delete
						</div>
					)}
					<div
						className={styles.direction}
						onClick={() => routeToOpenspace(point)}
						onKeyDown={() => routeToOpenspace(point)}>
						<Icon icon={Directions} size={20} />
					</div>
				</div>
				<div className={styles.bottomRow}>{location}</div>
			</div>
		);
	}
}
