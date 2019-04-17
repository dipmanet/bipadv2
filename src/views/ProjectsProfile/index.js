import React from 'react';

import Page from '#components/Page';

import ProjectsProfileFilter from './Filter';
import Map from './Map';

import styles from './styles.scss';

class ProjectsProfile extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            leftPaneExpanded: true,
            rightPaneExpanded: true,
        };
    }

    handleRightPaneExpandChange = (rightPaneExpanded) => {
        this.setState({ rightPaneExpanded });
    }

    render() {
        const {
            leftPaneExpanded,
            rightPaneExpanded,
        } = this.state;

        return (
            <React.Fragment>
                <Map
                    leftPaneExpanded={leftPaneExpanded}
                    rightPaneExpanded={rightPaneExpanded}
                />
                <Page
                    mainContent={null}
                    leftContentClassName={styles.left}
                    leftContent={null}
                    rightContentClassName={styles.right}
                    rightContent={
                        <ProjectsProfileFilter
                            onExpandChange={this.handleRightPaneExpandChange}
                        />
                    }
                />
            </React.Fragment>
        );
    }
}

export default ProjectsProfile;
