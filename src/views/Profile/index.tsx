import React from 'react';
import { _cs } from '@togglecorp/fujs';

import MultiViewContainer from '#rscv/MultiViewContainer';
import ScrollTabs from '#rscv/ScrollTabs';
import AccentButton from '#rsca/Button/AccentButton';
import modalize from '#rscg/Modalize';

import Page from '#components/Page';
import DisasterProfile from './DisasterProfile';
import ProjectsProfile from './ProjectsProfile';
import Indicator from './Indicator';
import Contact from './Contact';

import styles from './styles.scss';

type TabKeys = 'summary' | 'projectsProfile' | 'contact';

interface Props {
}

const IndicatorButton = modalize(AccentButton);

const tabs: {
    [key in TabKeys]: string;
} = {
    summary: 'Summary',
    projectsProfile: 'Projects',
    contact: 'Contact',
};

const rendererParams = () => ({ className: styles.view });

export default class Profile extends React.PureComponent<Props> {
    private views = {
        summary: {
            component: DisasterProfile,
            rendererParams,
        },
        projectsProfile: {
            component: ProjectsProfile,
            rendererParams,
        },
        contact: {
            component: Contact,
            rendererParams,
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
                        >
                            <IndicatorButton
                                transparent
                                modal={<Indicator />}
                            >
                                Indicators
                            </IndicatorButton>
                        </ScrollTabs>
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
