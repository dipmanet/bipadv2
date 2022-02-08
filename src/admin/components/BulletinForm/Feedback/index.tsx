/* eslint-disable max-len */
import React, { useState } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

import styles from './styles.scss';

interface Props {

}

const Bulletin = (props: Props) => {
    const {
        handleFeedbackChange,
        deleteFeedbackChange,
        feedback,
    } = props;
    const [remarks, setRemarks] = useState(null);
    const handleFeedback = () => {
        if (remarks) {
            handleFeedbackChange(remarks);
        }
        setRemarks(null);
    };

    return (
        <>
            <div className={styles.formContainer}>
                <h2>२४ घण्टामा बिपद्का घटनाहरुमा भएको प्रतिकार्य</h2>
                {
                    feedback && feedback.length > 0
                    && (
                        <div className={styles.pratikriyas}>
                            <ul>
                                {
                                    feedback.map((p, i) => (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <li key={`${p}index${i}`}>
                                            {p}
                                            <IconButton
                                                type="button"
                                                onClick={() => deleteFeedbackChange(i)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    )}
                <div className={styles.formSubContainer}>
                    <div className={styles.formItem}>
                        <FormControl fullWidth>
                            <InputLabel>
                                {'प्रतिकार्य ...'}
                            </InputLabel>
                            <Input
                                type="text"
                                value={remarks || ''}
                                onChange={e => setRemarks(e.target.value)}
                                rows={5}
                                className={styles.select}
                                disableUnderline
                                inputProps={{
                                    disableUnderline: true,
                                }}
                                style={{ border: '1px solid #f3f3f3', borderRadius: '3px', padding: '0 10px' }}
                            />
                        </FormControl>
                    </div>
                    <div className={styles.btnContainer}>

                        <button
                            onClick={handleFeedback}
                            type="button"
                        >
                            + थप्नुहोस्
                        </button>
                    </div>
                </div>

            </div>
        </>


    );
};

export default Bulletin;
