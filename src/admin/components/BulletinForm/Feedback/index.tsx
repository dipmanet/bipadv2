/* eslint-disable max-len */
import React, { useState } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
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
                <div className={styles.pratikriyas}>
                    <ul>
                        {
                            feedback.map(p => (
                                <li key={p}>
                                    {p}
                                    <button
                                        type="button"
                                        onClick={() => deleteFeedbackChange(p)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className={styles.formSubContainer}>
                    <div className={styles.formItem}>
                        <FormControl fullWidth>
                            <InputLabel>
                                {'प्रतिकृया दिनुहोस्...'}
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
                            + Submit
                        </button>
                    </div>
                </div>

            </div>
        </>


    );
};

export default Bulletin;
