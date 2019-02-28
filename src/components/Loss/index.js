import PropTypes from 'prop-types';
import React from 'react';

import TextOutput from '#components/TextOutput';

import _cs from '#cs';
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
            // FIXME: Remove random numbers: just for aesthetic purpose until api is ready
            peopleDeathCount = parseInt(Math.random() * 100, 10),
            livestockDestroyedCount = parseInt(Math.random() * 100, 10),
            infrastructureDestroyedCount = parseInt(Math.random() * 100, 10),
            estimatedLoss = parseInt(Math.random() * 100, 10),
            description = 'Not provided',
        } = loss;

        return (
            <div className={_cs(className, styles.loss)}>
                <div className={styles.label}>
                    <b> { label } </b>
                </div>
                <div>
                    <TextOutput
                        label="People Dead"
                        value={peopleDeathCount}
                    />
                    <TextOutput
                        label="Livestock Destroyed"
                        value={livestockDestroyedCount}
                    />
                    <TextOutput
                        label="Infrastructures Destroyed"
                        value={infrastructureDestroyedCount}
                    />
                    <TextOutput
                        label="Estimated Loss(NRs.)"
                        value={estimatedLoss}
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
