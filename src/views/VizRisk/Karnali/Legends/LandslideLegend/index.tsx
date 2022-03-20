import React from 'react';
import styles from './styles.scss';
import Icon from '#rscg/Icon';

const LandslideLegend = (props) => {
    const radius = [8, 16, 24, 32];
    const text = ['MINOR(0)', 'MAJOR(<10)', 'SEVERE(<100)', 'CATASTROPHIC(>100)'];
    return (
        <>

            <div className={styles.landslideLegend}>
                <div className={styles.circles}>
                    <h2>LANDSLIDES</h2>
                    {
                        radius.map((r, i) => (
                            <div className={styles.row} key={r}>
                                <Icon
                                    name="circle"
                                    style={{
                                        fontSize: `${r}px`,
                                        marginRight: `${40 - (10 * i)}px`,
                                        marginLeft: `${10 - (r / 3)}px`,
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
            </div>

        </>
    );
};

export default LandslideLegend;
