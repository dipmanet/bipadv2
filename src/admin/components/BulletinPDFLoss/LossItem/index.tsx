import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';
import { languageSelector } from '#selectors';

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    language: languageSelector(state),
});

interface Props {

}


const LossItem = (props: Props) => {
    const { lossIcon, lossTitle, loss, language: { language }, colors } = props;
    const getUnit = (n) => {
        if (language === 'np') {
            if (Number(n) > 10000000) {
                return ('करोड');
            } if (Number(n) > 100000) {
                return ('लाख');
            } if (Number(n) > 1000) {
                return ('हजार');
            }
        } else if (language === 'en') {
            if (Number(n) > 1000000000) {
                return ('B');
            } if (Number(n) > 1000000) {
                return ('M');
            } if (Number(n) > 1000) {
                return ('K');
            }
        }
        return '';
    };

    const getFormttedNumbers = (n) => {
        if (language === 'np') {
            if (Number(n) > 10000000) {
                return ((Number(n) / 10000000).toLocaleString());
            } if (Number(n) > 100000) {
                return ((Number(n) / 100000).toLocaleString());
            } if (Number(n) > 1000) {
                return ((Number(n) / 1000).toLocaleString());
            }
        } else if (language === 'en') {
            if (Number(n) > 1000000000) {
                return ((Number(n) / 1000000000).toLocaleString());
            } if (Number(n) > 1000000) {
                return ((Number(n) / 1000000).toLocaleString());
            } if (Number(n) > 1000) {
                return ((Number(n) / 1000).toLocaleString());
            }
        }
        return n;
    };

    return (
        <div className={styles.itemContainer}>
            <img src={lossIcon} alt="loss" />
            <hr className={styles.horLine} />
            <ul>
                <li>{lossTitle}</li>
                <li className={styles.large}>
                    {
                        getFormttedNumbers(loss)
                    }
                    <span style={{ fontSize: '12px' }}>{getUnit(loss)}</span>

                </li>
            </ul>
        </div>
    );
};

export default connect(mapStateToProps)(LossItem);
