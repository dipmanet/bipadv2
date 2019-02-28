import PropTypes from 'prop-types';
import React from 'react';
import ReactSVG from 'react-svg';
import { FaramInputElement } from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import Label from '#rsci/Label';
import ListView from '#rscv/List/ListView';

import styles from './styles.scss';

const propTypes = {
    options: PropTypes.array,
    className: PropTypes.string,
    showLabel: PropTypes.bool,
    labelSelector: PropTypes.func,
    keySelector: PropTypes.func,
    iconSelector: PropTypes.func,
    value: PropTypes.array,
};

const defaultProps = {
    labelSelector: d => d.label,
    keySelector: d => d.key,
    iconSelector: d => d.icon,
    showLabel: true,
    options: [],
    value: [],
    className: '',
};

@FaramInputElement
export default class MultiListSelection extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getRendererParams = (index, option, options) => {
        const {
            labelSelector,
            iconSelector,
            keySelector,
            value,
        } = this.props;

        const key = keySelector(option, index, options);

        return {
            label: labelSelector(option, index, options),
            icon: iconSelector(option, index, options),
            optionKey: key,
            className: styles.option,
            isActive: value.indexOf(key) !== -1,
        };
    }

    handleOptionClick = ({ params: { optionKey } }) => {
        const {
            keySelector,
            value,
            onChange,
        } = this.props;

        const newValue = [...value];
        const optionIndex = value.findIndex(d => d === optionKey);

        if (optionIndex === -1) {
            newValue.push(optionKey);
        } else {
            newValue.splice(optionIndex, 1);
        }

        onChange(newValue);
    }

    renderOption = ({
        label,
        icon,
        optionKey,
        className,
        isActive,
    }) => (
        <Button
            className={_cs(className, isActive && styles.active)}
            transparent
            onClickParams={{ optionKey }}
            onClick={this.handleOptionClick}
        >
            { icon && (
                <ReactSVG
                    className={styles.icon}
                    svgClassName={styles.svg}
                    path={icon}
                />
            )}
            <div className={styles.title}>
                { label }
            </div>
        </Button>
    )

    render() {
        const {
            className,
            options,
            label,
            showLabel,
            keySelector,
        } = this.props;

        return (
            <div className={_cs(styles.multiListSelection, className)}>
                <Label
                    className={styles.label}
                    text={label}
                    show={showLabel}
                />
                <ListView
                    className={styles.options}
                    data={options}
                    renderer={this.renderOption}
                    rendererParams={this.getRendererParams}
                    keySelector={keySelector}
                />
            </div>
        );
    }
}
