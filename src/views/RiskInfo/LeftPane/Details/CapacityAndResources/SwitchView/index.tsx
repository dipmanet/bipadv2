import React from 'react';
import Switch from 'react-input-switch';

import styles from './styles.scss';

type toggleValues = 'education' | 'health' | 'finance' | 'governance' |
'tourism' | 'cultural' | 'industry' | 'communication';

interface Props {
    activeLayersIndication: {
        education: boolean;
        health: boolean;
        finance: boolean;
        governance: boolean;
        tourism: boolean;
        cultural: boolean;
        industry: boolean;
        communication: boolean;
    };
    handleToggleClick: (key: toggleValues, value: boolean) => void;

}
const SwitchView = (props: Props) => {
    const { activeLayersIndication: { education,
        health,
        finance,
        governance,
        tourism,
        cultural,
        industry,
        communication },
    handleToggleClick } = props;
    return (
        <div className={styles.lists}>
            <div className={styles.listItem}>
                <Switch
                    className={styles.switch}
                    on
                    off={false}
                    value={education}
                    onChange={(value: boolean) => {
                        handleToggleClick('education', value);
                    }}
                />
                <div className={styles.listTitle}> Education </div>
            </div>
            <div className={styles.listItem}>
                <Switch
                    className={styles.switch}
                    on
                    off={false}
                    value={health}
                    onChange={(value: boolean) => {
                        handleToggleClick('health', value);
                    }}
                />
                <div className={styles.listTitle}> Health </div>
            </div>
            <div className={styles.listItem}>
                <Switch
                    className={styles.switch}
                    on
                    off={false}
                    value={finance}
                    onChange={(value: boolean) => {
                        handleToggleClick('finance', value);
                    }}
                />
                <div className={styles.listTitle}> Finance </div>
            </div>
            <div className={styles.listItem}>
                <Switch
                    className={styles.switch}
                    on
                    off={false}
                    value={governance}
                    onChange={(value: boolean) => {
                        handleToggleClick('governance', value);
                    }}
                />
                <div className={styles.listTitle}> Governance </div>
            </div>
            <div className={styles.listItem}>
                <Switch
                    className={styles.switch}
                    on
                    off={false}
                    value={tourism}
                    onChange={(value: boolean) => {
                        handleToggleClick('tourism', value);
                    }}
                />
                <div className={styles.listTitle}> Tourism </div>
            </div>
            <div className={styles.listItem}>
                <Switch
                    className={styles.switch}
                    on
                    off={false}
                    value={cultural}
                    onChange={(value: boolean) => {
                        handleToggleClick('cultural', value);
                    }}
                />
                <div className={styles.listTitle}> Cultural </div>
            </div>
            <div className={styles.listItem}>
                <Switch
                    className={styles.switch}
                    on
                    off={false}
                    value={industry}
                    onChange={(value: boolean) => {
                        handleToggleClick('industry', value);
                    }}
                />
                <div className={styles.listTitle}> Industry </div>
            </div>
            <div className={styles.listItem}>
                <Switch
                    className={styles.switch}
                    on
                    off={false}
                    value={communication}
                    onChange={(value: boolean) => {
                        handleToggleClick('communication', value);
                    }}
                />
                <div className={styles.listTitle}> Communication </div>
            </div>
        </div>
    );
};

export default SwitchView;
