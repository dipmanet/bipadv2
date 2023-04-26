import React from 'react';
import { _cs } from '@togglecorp/fujs';


import { iconNames } from '#constants';
import Button from '#rsca/Button';
import Icon from '#rscg/Icon';
import styles from './styles.scss';

const getSortIcon = (sortOrder) => {
    const mapping = {
        asc: 'sortAscending',
        dsc: 'sortDescending',
    };
    return iconNames[mapping[sortOrder] || 'sort'];
};

const iconClassName = _cs(
    styles.icon,
);

const iconName = 'sort';

export default ({ columnKey, title, sortable, sortOrder, onSortClick }) => (
    <div
        role="presentation"
        onClick={() => onSortClick(columnKey)}
        className={styles.tableHeader}
    >
        {sortable && (
            // <Button
            //     className={styles.sortButton}
            //     onClick={() => onSortClick(columnKey)}
            //     iconName={getSortIcon(sortOrder)}
            //     transparent
            //     smallVerticalPadding
            // />
            <Icon
                name={iconName}
                className={iconClassName}
            />
        )}
        <div
            title={title}
            className={styles.title}
        >
            {title}
        </div>

    </div>
);
