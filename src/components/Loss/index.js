import PropTypes from 'prop-types';
import React from 'react';
import { _cs } from '@togglecorp/fujs';

import TextOutput from '#components/TextOutput';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    loss: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
};

const defaultProps = {
    className: '',
};

const emptyObject = {};

export default class Loss extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    render() {
        const {
            className,
            label,
            loss = emptyObject,
        } = this.props;

        const {
            peopleDeathCount = 0,
            livestockDestroyedCount = 0,
            infrastructureDestroyedCount = 0,
            estimatedLoss = 0,
            description = 'Not provided',
        } = loss;

        return (
            <div className={_cs(className, styles.loss)}>
                <div className={styles.label}>
                    <b>
                        { label }
                    </b>
                </div>
                <div>
                    <TextOutput
                        label="People Dead"
                        value={peopleDeathCount}
                        isNumericValue
                    />
                    <TextOutput
                        label="Livestock Destroyed"
                        value={livestockDestroyedCount}
                        isNumericValue
                    />
                    <TextOutput
                        label="Infrastructures Destroyed"
                        value={infrastructureDestroyedCount}
                        isNumericValue
                    />
                    <TextOutput
                        label="Estimated Loss (NRs.)"
                        value={estimatedLoss}
                        isNumericValue
                    />
                    <TextOutput
                        label="Description"
                        value={description}
                    />
                </div>
            </div>
        );
    }
}
