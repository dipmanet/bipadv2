import React from 'react';
import { connect } from 'react-redux';
import FormattedDate from '#rscv/FormattedDate';

import styles from './styles.scss';
import { languageSelector } from '#selectors';

const mapStateToProps = state => ({
    language: languageSelector(state),
});

const TableDataCell = ({ value, language: { language } }) => (
    <FormattedDate
        className={styles.dateCell}
        value={value}
        mode="yyyy-MM-dd"
        language={language}
    />
);

export default connect(mapStateToProps)(TableDataCell);
