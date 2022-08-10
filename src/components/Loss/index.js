import PropTypes from 'prop-types';
import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import TextOutput from '#components/TextOutput';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    titleClassName: PropTypes.string,
    contentClassName: PropTypes.string,
    rowClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    valueClassName: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    loss: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
};

const defaultProps = {
    className: undefined,
    titleClassName: undefined,
    contentClassName: undefined,
    rowClassName: undefined,
    labelClassName: undefined,
    valueClassName: undefined,
};

const emptyObject = {};

export default class Loss extends React.PureComponent {
    static propTypes = propTypes;

    static defaultProps = defaultProps;

    render() {
        const {
            className,
            title,
            titleClassName,
            labelClassName,
            valueClassName,
            contentClassName,
            rowClassName,
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
            <Translation>
                {
                    t => (
                        <div className={_cs(className, styles.loss)}>
                            <h3 className={_cs(titleClassName, styles.title)}>
                                {title}
                            </h3>
                            <div className={contentClassName}>
                                <TextOutput
                                    className={rowClassName}
                                    labelClassName={labelClassName}
                                    valueClassName={valueClassName}
                                    label={t('People Dead')}
                                    value={peopleDeathCount}
                                    isNumericValue
                                />
                                <TextOutput
                                    className={rowClassName}
                                    labelClassName={labelClassName}
                                    valueClassName={valueClassName}
                                    label={t('Livestock Destroyed')}
                                    value={livestockDestroyedCount}
                                    isNumericValue
                                />
                                <TextOutput
                                    className={rowClassName}
                                    labelClassName={labelClassName}
                                    valueClassName={valueClassName}
                                    label={t('Infrastructures Destroyed')}
                                    value={infrastructureDestroyedCount}
                                    isNumericValue
                                />
                                <TextOutput
                                    className={rowClassName}
                                    labelClassName={labelClassName}
                                    valueClassName={valueClassName}
                                    label={t('Estimated Loss (NRs.)')}
                                    value={estimatedLoss}
                                    isNumericValue
                                />
                                <TextOutput
                                    className={rowClassName}
                                    labelClassName={labelClassName}
                                    valueClassName={valueClassName}
                                    label={t('Description')}
                                    value={t(description)}
                                />
                            </div>
                        </div>

                    )
                }
            </Translation>
        );
    }
}
