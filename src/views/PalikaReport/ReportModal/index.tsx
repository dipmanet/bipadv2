import React, { useState } from 'react';
import styles from './styles.scss';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import BulletIcon from '#resources/icons/Bullet.svg';
import PrimaryButton from '#rsca/Button/PrimaryButton';

interface Props {
    keyTab: number;
    showTabs: boolean;
    hideWelcomePage: () => void;
}

const ReportModal: React.FC<Props> = (props: Props) => {
    const { keyTab, showTabs, hideWelcomePage } = props;
    const handleWelcomePage = () => hideWelcomePage();
    return (
        <>
            {!showTabs
        && (
            <div className={styles.firstPageContainer}>
                <div className={styles.title}>
                    GET STARTED
                </div>
                <div className={styles.description}>
                    In publishing and graphic design, Lorem ipsum is a
                    placeholder text commonly used to demonstrate the
                    visual form of a document or a typeface without
                    relying on meaningful content. Lorem ipsum may be
                    used as a placeholder before final copy is available.
                </div>

                <div className={styles.title}>
                    What you can do with palika report.
                </div>
                <div className={styles.bulletPtRow}>
                    <div className={styles.bulletsContainer}>
                        <ScalableVectorGraphics
                            className={styles.bulletPoint}
                            src={BulletIcon}
                            alt="Bullet Point"
                        />
                        <div className={styles.bulletText}>
                             Know where your palika is in terms of DRR
                        </div>
                    </div>
                    <div className={styles.bulletsContainer}>
                        <ScalableVectorGraphics
                            className={styles.bulletPoint}
                            src={BulletIcon}
                            alt="Bullet Point"
                        />
                        <div className={styles.bulletText}>
                            Track the progress you palika is doing in terms of implementation of DRR
                        </div>
                    </div>
                </div>
                <div className={styles.bulletPtRow}>
                    <div className={styles.bulletsContainer}>
                        <ScalableVectorGraphics
                            className={styles.bulletPoint}
                            src={BulletIcon}
                            alt="Bullet Point"
                        />
                        <div className={styles.bulletText}>
                            Know the capacities and resources you have within the municipality.
                        </div>
                    </div>
                    <div className={styles.bulletsContainer}>
                        <ScalableVectorGraphics
                            className={styles.bulletPoint}
                            src={BulletIcon}
                            alt="Bullet Point"
                        />
                        <div className={styles.bulletText}>
                             Check how you palika is spending Budget in DRR
                        </div>
                    </div>
                </div>
                <div className={styles.btnContainer}>
                    <PrimaryButton
                        type="button"
                        className={styles.agreeBtn}
                        onClick={handleWelcomePage}
                    >
                        PROCEED
                    </PrimaryButton>
                </div>

            </div>
        )

            }
            {keyTab === 1 && showTabs
                ? (
                    <>
                        {/* Add a table with some data from budget */}
                    </>
                )
                : ''
            }
        </>
    );
};

export default ReportModal;
