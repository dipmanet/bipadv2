import React, { useRef } from 'react';
import styles from './styles.module.scss';

interface Props {
    onFileSelectSuccess: (e: File) => void;
    disable: boolean;
}


const FileUploader = (props: Props) => {
    const fileInput = useRef(null);
    const { onFileSelectSuccess, disable } = props;
    const handleFileInput = (e) => {
        const file = e.target.files[0];
        onFileSelectSuccess(file);
    };

    return (
        <div className={styles.fileUploader}>
            <input disabled={disable} type="file" id="file" onChange={handleFileInput} />
            <button type="button" onClick={e => fileInput.current && fileInput.current.click()} className={styles.fileInputBtn} />
        </div>
    );
};

export default FileUploader;
