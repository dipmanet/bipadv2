import React from 'react';
import { _cs } from '@togglecorp/fujs';

import MultiViewContainer from '#rscv/MultiViewContainer';
import ScrollTabs from '#rscv/ScrollTabs';

import Page from '#components/Page';
import DisasterProfile from './DisasterProfile';
import ProjectsProfile from './ProjectsProfile';
import Indicator from './Indicator';
import Contact from './Contact';

import styles from './styles.scss';

type TabKeys = 'summary' | 'projectsProfile' | 'contact' | 'indicator';

interface Props {
}

const tabs: {
    [key in TabKeys]: string;
} = {
    summary: 'Summary',
    projectsProfile: 'Projects',
    contact: 'Contact',
    indicator: 'Indicator',
};

export default class Profile extends React.PureComponent<Props> {
    private views = {
        summary: {
            component: DisasterProfile,
        },
        projectsProfile: {
            component: ProjectsProfile,
        },
        contact: {
            component: Contact,
        },
        indicator: {
            component: Indicator,
        },
    };

    public render() {
        return (
            <Page
                leftContentContainerClassName={styles.leftContentContainer}
                leftContent={(
                    <>
                        <ScrollTabs
                            className={_cs(styles.tabs)}
                            tabs={tabs}
                            useHash
                        />
                        <MultiViewContainer
                            views={this.views}
                            useHash
                        />
                    </>
                )}
            />
        );
    }
}
