import React from 'react';
import Icon from '#rscg/Icon';

import styles from './styles.scss';

interface Props {
    note?: string;
}

const DEFAULT_NOTE = 'Note: The calculated values are based on the average of our readings taken every 24 minutes.';

const Note = (props: Props) => {
    const { note } = props;
    return (
        <div className={styles.note}>
            <Icon
                className={styles.infoIcon}
                name="info"
            />
            { note || DEFAULT_NOTE }
        </div>
    );
};

export default Note;
