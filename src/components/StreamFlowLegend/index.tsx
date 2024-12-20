import React from 'react';
import styles from './styles.scss';

const StreamFlowLegend = () => {
    const riskRange = [
        {
            score: 1,
            title: 'Normal Drainage',
            color: 'rgb(0, 0, 255)',
        },
        {
            score: 2,
            title: 'Two Year Return Period',
            color: 'rgb(42, 82, 189)',
        },
        {
            score: 3,
            title: 'Five Year Return Period',
            color: '#0088dd',
        },
        {
            score: 4,
            title: 'Ten Year Return Period',
            color: '#ffd301',
        },
        {
            score: 5,
            title: 'Twenty Year Return Period',
            color: '#ff8b01',
        },
        {
            score: 6,
            title: 'Fifty Year Return Period',
            color: '#c23b21',
        },
        {
            score: 7,
            title: 'Hundred Year Return Period',
            color: '#ff0000',
        },
    ];
    return (
        <div className={styles.streamFlowContainer}>
            <h4 className={styles.legendHeader}>STREAM FLOW</h4>
            <div className={styles.rangeWrapper}>
                {riskRange.map(rangeData => (
                    <div className={styles.legendElements}>
                        <div
                            className={styles.colorElement}
                            style={{ backgroundColor: rangeData.color }}
                        />
                        <p className={styles.scoreStream}>{rangeData.title}</p>
                    </div>
                ))}
            </div>
            <div className={styles.streamSource}>
                <p style={{ margin: 0 }} className={styles.scoreStream}>Source:</p>
                <a className={styles.streamLink} href="http://tethys.icimod.org/apps/streamflownepal/">ICIMOD</a>
            </div>
        </div>
    );
};

export default StreamFlowLegend;
