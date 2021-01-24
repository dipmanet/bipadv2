import React, { useRef } from 'react';
import styles from './styles.scss';

const FileUploader = ({ onFileSelectError, onFileSelectSuccess }) => {
    const fileInput = useRef(null);

    const handleFileInput = (e) => {
        // handle validations
        // console.log(e.target.files[0]);
        const file = e.target.files[0];
        // if (file.size > 1024) {
        //     onFileSelectError({ error: 'File size cannot exceed more than 1MB' });
        // } else {
        onFileSelectSuccess(file);
        // }
    };

    return (
        <div className={styles.fileUploader}>
            <input type="file" onChange={handleFileInput} />
            <button type="button" onClick={e => fileInput.current && fileInput.current.click()} className={styles.fileInputBtn} />
        </div>
    );
};

export default FileUploader;
