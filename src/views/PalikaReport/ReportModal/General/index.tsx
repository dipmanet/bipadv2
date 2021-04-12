import React from 'react';
import styles from './styles.scss';

interface Props{

}
const General = (props: Props) => {
    console.log(props);
    return (
        <div className={styles.tabsPageContainer}>
          Forms

        </div>
    );
};

export default General;
