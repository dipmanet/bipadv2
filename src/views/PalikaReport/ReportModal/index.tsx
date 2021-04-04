import React, { useState } from 'react';
import styles from './styles.scss';

interface Props {
    keyTab: number;
}

const ReportModal: React.FC<Props> = (props: Props) => {
    const { keyTab } = props;
    return (
        <>
            {keyTab === 1
                && (
                    <>
                        <div className={styles.title}>
                        ADD ANNUAL BUDGET
                        </div>
                        <div className={styles.subTitle}>
                        Insert annual policy program
                        </div>
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                className={styles.inputElement}
                                placeholder="Official Email"
                                onChange={console.log('flskjfls')}
                                // value={emailprop || ''}
                            />
                        </div>
                    </>
                )
            }
        </>
    );
};

export default ReportModal;
