/* eslint-disable max-len */
/* eslint-disable arrow-parens */
import React from 'react';
import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import Spinner from '#rscv/Spinner';
import { languageSelector } from '#selectors';
import styles from './styles.scss';

interface LegendProp {
    currentSelection: string;
    legend: {
        name: string;
        color: string;
        range: [number, number];
    }[];
    mapState: { id: number; value: number }[];
    pending: boolean;
}

export const legendItems = [
    {
        name: '0-100',
        color: '#f1d9c1',
        value: 0,
    },
    {
        name: '100-200',
        color: '#e7bca4',
        value: 100,
    },
    {
        name: '200-300',
        color: '#db9d85',
        value: 200,
    },
    {
        name: '300-400',
        color: '#d38871',
        value: 300,
    },
    {
        name: '400-500',
        color: '#c96c54',
        value: 400,
    },
    {
        name: '500-600',
        color: '#be4b2f',
        value: 500,
    },
    {
        name: '600-700',
        color: '#cb6125',
        value: 600,
    },
    {
        name: '700-more',
        color: '#e05c12',
        value: 700,
    },
];

const mapStateToProps = (state) => ({
    language: languageSelector(state),
});

const Legend = (props: LegendProp) => {
    const {
        currentSelection,
        legend,
        pending,
        mapState,
        language: { language },
    } = props;

    const rangeExist = (min: number, max: number) => {
        // eslint-disable-next-line max-len
        const value = mapState.length > 0 && mapState.filter((i) => i.value >= min && i.value <= max);
        return value.length > 0;
    };

    return (
        <div className={styles.container}>
            <Translation>
                {(t) => (
                    <p className={styles.currentSelection}>
                        {language === 'en' ? `No. of ${currentSelection}` : `${t(currentSelection)}को विवरण`}
                    </p>
                )}
            </Translation>

            <div className={styles.wrapper}>
                {!pending ? (
                    legend.map((item, index) => {
                        if (rangeExist(item.range[0], item.range[1])) {
                            return (
                                <div
                                    className={styles.legendItem}
                                    key={item.name}
                                    style={
                                        index % 2 !== 0
                                            ? { justifySelf: 'flex-end', marginRight: 'auto' }
                                            : { marginRight: 'auto' }
                                    }
                                >
                                    <div className={styles.legendColor} style={{ background: item.color }} />
                                    <span className={styles.legendText}>{item.name}</span>
                                </div>
                            );
                        }
                        return '';
                    })
                ) : (
                    <Spinner className={styles.spinner} />
                )}
            </div>
        </div>
    );
};

export default connect(mapStateToProps)(Legend);
