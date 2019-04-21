import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const ProjectItem = (props) => {
    const {
        projectId,
        title,
        start,
        end,
        budget,
    } = props;
    return (
        <div className={styles.project}>
            <h3>{title}</h3>
            <div>Budget: {budget}</div>
            <div>Start: {start}</div>
            <div>End: {end}</div>
        </div>
    );
};

ProjectItem.propTypes = {
    projectId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
};

export default ProjectItem;

