import React, { useRef } from "react";
import styles from "./styles.module.scss";

const FileUploader = ({ onFileSelectError, onFileSelectSuccess }) => {
	const fileInput = useRef(null);

	const handleFileInput = (e) => {
		const file = e.target.files[0];
		onFileSelectSuccess(file);
	};

	return (
		<div className={styles.fileUploader}>
			<input type="file" onChange={handleFileInput} />
			<button
				type="button"
				onClick={(e) => fileInput.current && fileInput.current.click()}
				className={styles.fileInputBtn}
			/>
		</div>
	);
};

export default FileUploader;
