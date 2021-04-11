import React from 'react';

import Page from '#components/Page';

import styles from './styles.scss';

interface Props {

}

class Ibf extends React.PureComponent<Props> {
    public render() {
        return (
            <>
                <Page hideFilter hideMap />
                <div className={styles.ibfContainer}> test </div>
            </>
        );
    }
}

export default Ibf;
