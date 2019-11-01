import React from 'react';

import Page from '#components/Page';

import template from './source.html';
import styles from './styles.scss';

const Indicator = () => (
    <Page
        leftContent={null}
        hideMap
        mainContentClassName={styles.main}
        mainContent={(
            <div
                className={styles.tableContainer}
                dangerouslySetInnerHTML={{ __html: template }}
            />
        )}
    />
);

export default Indicator;
