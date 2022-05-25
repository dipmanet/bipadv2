import React from 'react';

import styles from './styles.scss';
import Loading from '#components/Loading';

import Page from '#components/Page';
import LandingPage from './LandingPage';
import RegularPage from './RegularPage';

type Options = 'Rain' | 'River' | 'Earthquake' | 'Pollution' | 'Fire' | undefined;

interface State {
    showInitial: boolean;
    chosenOption?: Options;
}

interface Props {}

class DataArchive extends React.PureComponent <Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            showInitial: true,
            chosenOption: undefined,
        };
    }

    private handleOptionClick = (option: Options) => {
        this.setState({ showInitial: false, chosenOption: option });
    }

    public render() {
        const { showInitial, chosenOption } = this.state;
        // const { requests } = this.props;
        // const pending = isAnyRequestPending(requests);
        const pending = false;

        return (
            <>
                <Loading pending={pending} />
                {showInitial && (
                    <Page
                        hideFilter
                        hideMap
                        mainContentContainerClassName={styles.initialContainer}
                        mainContent={
                            (<LandingPage handleOptionClick={this.handleOptionClick} />)
                        }
                    />
                )}
                {!showInitial && (
                    <RegularPage
                        handleOptionClick={this.handleOptionClick}
                        chosenOption={chosenOption}
                    />
                )}
            </>
        );
    }
}

export default DataArchive;
