import React from 'react';
import Button from '#rsca/Button';

import { iconNames } from '#constants';

import styles from './styles.scss';

const getSortIcon = (sortOrder) => {
    const mapping = {
        asc: 'sortAscending',
        dsc: 'sortDescending',
    };
    return iconNames[mapping[sortOrder] || 'sort'];
};

export default ({ columnKey, title, sortable, sortOrder, onSortClick }) => (
    <React.Fragment>
        { sortable &&
            <Button
                className={styles.sortButton}
                onClick={() => onSortClick(columnKey)}
                iconName={getSortIcon(sortOrder)}
                transparent
                smallVerticalPadding
            />
        }
        <b>{title}</b>
    </React.Fragment>
);

