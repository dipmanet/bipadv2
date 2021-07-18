import React from 'react';
import styles from './styles.scss';
import Icon from '#rscg/Icon';

const LandslideLegend = (props) => {
    const radius = [10, 20, 30, 40];
    const text = ['MINOR(0)', 'MAJOR(<10)', 'SEVERE(<100)', 'CATASTROPHIC(>100)'];
    return (
        <>

            <div className={styles.landslideLegend}>
                <div className={styles.circles}>
                    <h2>Landslides</h2>
                    {
                        radius.map((r, i) => (
                            <div className={styles.row}>
                                <Icon
                                    name="circle"
                                    style={{
                                        fontSize: `${r}px`,
                                        marginRight: `${40 - (10 * i)}px`,
                                        marginLeft: `${10 - (r / 10)}px`,
                                    }}
                                />
                                {

                                    <p>
                                        {text[i]}
                                    </p>

                                }

                            </div>
                        ))
                    }
                </div>
                {/* <div className={styles.text}>
                    {
                        text.map((r, i) => (
                            <p>
                                {text[i]}
                            </p>

                        ))
                    }
                </div> */}
            </div>

        </>
    );
};

export default LandslideLegend;
