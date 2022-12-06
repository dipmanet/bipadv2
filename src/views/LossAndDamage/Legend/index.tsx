import Spinner from '#rscv/Spinner';
import React from 'react';
import styles from './styles.scss';

interface LegendProp {
    currentSelection: string;
    legend: {
        name: string;
        color: string;
    }[];
    pending: boolean;
}

export const legendItems = [
    {
        name: '0-100',
        color: '#f1d9c1',
    },
    {
        name: '100-200',
        color: '#e7bca4',
    },
    {
        name: '200-300',
        color: '#db9d85',
    },
    {
        name: '300-400',
        color: '#d38871',
    },
    {
        name: '400-500',
        color: '#c96c54',
    },
    {
        name: '500-600',
        color: '#be4b2f',
    },
    {
        name: '600-700',
        color: '#cb6125',
    },
    {
        name: '700-more',
        color: '#e05c12',
    },

];

const Legend = (props: LegendProp) => {
    const { currentSelection, legend, pending } = props;

    return (
        <div className={styles.container}>
            <p className={styles.currentSelection}>{`No. of ${currentSelection}`}</p>
            <div className={styles.wrapper}>
                {
                    !pending
                        ? legend.map((item, index) => (
                            <div
                                className={styles.legendItem}
                                key={item.name}
                                style={index % 2 !== 0
                                    ? { justifySelf: 'flex-end' }
                                    : { marginRight: 'auto' }
                                }
                            >
                                <div
                                    className={styles.legendColor}
                                    style={{ background: item.color }}
                                />
                                <span className={styles.legendText}>
                                    {item.name}
                                </span>
                            </div>
                        ))
                        : (
                            <Spinner
                                className={styles.spinner}
                            />
                        )
                }
            </div>

        </div>
    );
};

export default Legend;
