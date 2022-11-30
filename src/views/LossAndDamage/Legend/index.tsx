import Spinner from '#rscv/Spinner';
import React from 'react';
import styles from './styles.scss';

interface LegendProp {
    currentSelection: string;
    mapState: {
        id: number;
        value: number;
    }[];
}

export const legendItems = [
    {
        name: '0-100',
        color: '#f7d8bf',
        value: 0,
    },
    {
        name: '100-200',
        color: '#f3c7a6',
        value: 100,
    },
    {
        name: '200-300',
        color: '#eeb191',
        value: 200,
    },
    {
        name: '300-400',
        color: '#e79b7a',
        value: 300,
    },
    {
        name: '400-500',
        color: '#e08466',
        value: 400,
    },
    {
        name: '500-600',
        color: '#e08466',
        value: 500,
    },
    {
        name: '600-700',
        color: '#db6e51',
        value: 600,
    },
    {
        name: '700-more',
        color: '#d4543d',
        value: 700,
    },

];

const Legend = (props: LegendProp) => {
    const { currentSelection, mapState } = props;
    const Maxvalue = mapState.reduce((a, b) => (a.value > b.value ? a : b)).value;
    const RoundedMaxValue = Math.ceil(Maxvalue / 100) * 100;
    const filteredLegendItems = legendItems.filter(item => item.value < RoundedMaxValue);
    console.log(filteredLegendItems, 'state');
    return (
        <div className={styles.container}>
            <p className={styles.currentSelection}>{`No. of ${currentSelection}`}</p>
            <div className={styles.wrapper}>
                {
                    filteredLegendItems.length > 0
                        ? filteredLegendItems.map((item, index) => (
                            <div
                                className={styles.legendItem}
                                key={item.value}
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
