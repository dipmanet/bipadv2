import React from 'react';
import PropTypes from 'prop-types';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';

import styles from './styles.scss';

interface Props {
    title: string;
    // count: number | string;
    icon: string;
    alt: string;
    // pending: boolean;
    handleOptionClick: Function;
}

const Option = ({ title, icon, alt, handleOptionClick }: Props) => (
    <div role="presentation" onClick={() => handleOptionClick(title)} className={styles.option}>
        <div className={styles.left}>
            <div className={styles.title}>{title}</div>
            {/* <div className={styles.subtitle}>
                Total count:
                {' '}
                {' '}
                {count}
            </div> */}
        </div>
        <div className={styles.spacer} />
        <div className={styles.right}>
            <ScalableVectorGraphics
                className={styles.optionIcon}
                src={icon}
                alt={alt}
            />
        </div>
    </div>
);

Option.defaultProps = {
    title: 'Not Available',
    // count: 0,
    alt: 'No Image',
    icon: 'No Icon',
};

Option.propTypes = {
    title: PropTypes.string,
    // count: PropTypes.oneOfType([
    //     PropTypes.string,
    //     PropTypes.number,
    // ]),
    alt: PropTypes.string,
    icon: PropTypes.string,
};

export default Option;
