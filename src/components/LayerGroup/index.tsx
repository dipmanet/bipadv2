import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import PrimaryButton from '#rsca/Button/PrimaryButton';

import LayerSelection from '#components/LayerSelection';
import { LayerHierarchy } from '#types';

import styles from './styles.scss';

interface Props {
    className?: string;
    data: LayerHierarchy;
}

interface State {
    isContentShown: boolean;
}

class LayerGroup extends React.PureComponent<Props, State> {
    public state = {
        isContentShown: false,
    }

    private handleShowContentButtonClick = () => {
        this.setState(({ isContentShown }) => ({ isContentShown: !isContentShown }));
    }

    public render() {
        const {
            data,
            className,
        } = this.props;

        const {
            isContentShown,
        } = this.state;

        if (!data.children) {
            return null;
        }

        return (
            <div className={_cs(
                styles.layerGroup,
                className,
            )}
            >
                <header className={styles.header}>
                    <h3 className={styles.title}>
                        { data.title }
                    </h3>
                    <Button
                        transparent
                        className={styles.showContentButton}
                        iconName={isContentShown ? 'chevronUp' : 'chevronDown'}
                        onClick={this.handleShowContentButtonClick}
                    />
                </header>
                { data.shortDescription && (
                    <div className={styles.shortDescription}>
                        { data.shortDescription }
                    </div>
                )}
                { isContentShown && (
                    <div className={styles.content}>
                        { data.longDescription && (
                            <div className={styles.actions}>
                                <PrimaryButton
                                    iconName="info"
                                    disabled={!data.longDescription}
                                    transparent
                                    title={data.longDescription}
                                    className={styles.infoButton}
                                />
                                <Button
                                    transparent
                                    iconName="table"
                                    disabled
                                />
                                <Button
                                    iconName="contrast"
                                    transparent
                                    disabled
                                />
                                <Button
                                    iconName="download"
                                    transparent
                                    disabled
                                />
                                <Button
                                    iconName="share"
                                    transparent
                                    disabled
                                />
                            </div>
                        )}
                        {data.children.length !== 0 && (
                            <LayerSelection layerList={data.children as LayerHierarchy[]} />
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default LayerGroup;
