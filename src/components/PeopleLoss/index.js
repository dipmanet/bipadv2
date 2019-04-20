import PropTypes from 'prop-types';
import React from 'react';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';

import TextOutput from '#components/TextOutput';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

const emptyList = [];

export default class PeopleLoss extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getLossData = memoize((peopleList) => {
        const lossData = {
            dead: 0,
            injured: 0,
            missing: 0,
        };

        peopleList.forEach((d) => {
            lossData[d.status] += 1;
        });

        return lossData;
    })

    render() {
        const {
            className,
            label,
            peopleList = emptyList,
        } = this.props;

        if (peopleList.length === 0) {
            return null;
        }

        const lossData = this.getLossData(peopleList);

        return (
            <div className={_cs(className, styles.peopleLoss)}>
                <div className={styles.label}>
                    { label }
                </div>
                <div className={styles.lossList}>
                    <TextOutput
                        label="Dead"
                        value={lossData.dead}
                        isNumericValue
                    />
                    <TextOutput
                        label="Injured"
                        value={lossData.injured}
                        isNumericValue
                    />
                    <TextOutput
                        label="Missing"
                        value={lossData.missing}
                        isNumericValue
                    />
                </div>
            </div>
        );
    }
}
