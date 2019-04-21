import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

const ProjectItem = ({ projectId, title }) => {
    console.warn(projectId);

    return (
        <div className={styles.project}>
            <h3>{title}</h3>
        </div>
    );
};

ProjectItem.propTypes = {
    projectId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
};

export default ProjectItem;

