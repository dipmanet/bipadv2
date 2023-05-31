/* eslint-disable no-nested-ternary */
import { setIbfPageAction } from '#actionCreators';
import { _cs } from '@togglecorp/fujs';
import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import IbfLeftArrow from '#resources/icons/IbfLeftArrow.svg';
import { PropsFromDispatch } from '#views/IBF';
import styles from './styles.scss';

export interface ImpactedValueType {
    impactVal: string[];
    ind: string;
    countValue: number;
}
interface OwnProps {
    impactedValue: ImpactedValueType;
    setImpactedValue: React.Dispatch<React.SetStateAction<{}>>;
}

type Props = OwnProps & PropsFromDispatch;

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setIbfPage: params => dispatch(setIbfPageAction(params)),
});

const PotentiallyImpacted = (
    {
        impactedValue,
        setImpactedValue,
        setIbfPage,
    }: Props,
) => {
    const setSelectedLegend = (legend) => {
        setIbfPage({ selectedLegend: legend });
    };

    const actionSentence = ` Following actions are required for the household potentially impacted at ${impactedValue.ind} level
`;
    const fallbackSentence = ` No houses fall into the ${impactedValue.ind} impact level`;

    const defaultSentence = 'Select Impact level to view the type of early action support required.';

    return (
        <div className={styles.impactContainer}>
            <div className={styles.title}>
                {Object.keys(impactedValue).length > 0 && (
                    <button
                        className={styles.backBtn}
                        type="button"
                        onClick={() => {
                            setImpactedValue({});
                            setSelectedLegend('');
                        }}
                    >
                        <img src={IbfLeftArrow} alt="leftArrow" />
                    </button>
                )}
                <h1
                    className={_cs(Object.keys(impactedValue).length > 0
                        ? styles.activeTitle : styles.baseTitle)}
                >
Potentially Impacted
                </h1>
            </div>
            <div className={styles.content}>
                {
                    Object.keys(impactedValue).length > 0 ? (
                        <div className={styles.yesContent}>
                            <span>
      Early Action Support Required
                            </span>
                            <div className={styles.line} />
                            {impactedValue.countValue !== 0 && impactedValue.ind !== 'No Impact' && (
                                <p>
                                    {actionSentence}
                                </p>
                            )
                            }
                            {
                                impactedValue.countValue === 0 ? (
                                    <p>
                                        {fallbackSentence}
                                    </p>
                                )
                                    : impactedValue.ind !== 'No Impact' ? (
                                        <ul className={styles.impactList}>
                                            {
                                                impactedValue.impactVal.map((value, index, arr) => (
                                                    <li className={styles.listItem} key={value}>
                                                        {arr.length > 1 && (
                                                            <span>
                                                                {index + 1}
.
                                                            </span>
                                                        )}
                                                        {` ${value}`}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    ) : (
                                        <div>
                                            {
                                                impactedValue.impactVal[0]
                                            }
                                        </div>
                                    )
                            }
                        </div>
                    ) : (
                        <p
                            className={styles.noContent}
                        >
                            <span>
                                {defaultSentence}
                            </span>
                        </p>
                    )
                }
            </div>
        </div>
    );
};
export default connect(undefined, mapDispatchToProps)(PotentiallyImpacted);
