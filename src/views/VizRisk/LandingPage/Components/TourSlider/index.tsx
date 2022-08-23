import React from 'react';
import styles from './styles.scss';

interface Props {
    tourTilte: string;
    tourContent: string;
    setTourStatus: React.Dispatch<React.SetStateAction<boolean>>;
    handleScrollClick: () => void;
    tourSectionComplete: boolean;
    islastPage: boolean;
}
const VisRiskTourSlider = (props: Props) => {
    const { tourTilte, tourContent,
        setTourStatus, handleScrollClick, tourSectionComplete, islastPage } = props;

    return (
        <div className={styles.tourWrapper}>
            <h3 className={styles.tourtitle}>{tourTilte}</h3>
            <div className={styles.tourContainer}>
                <p className={styles.tourContents}>
                    {tourContent}
                </p>
            </div>
            <div className={styles.tourBottomSetion}>
                {
                    !islastPage
                    && (
                        <button
                            className={styles.btnDownArrow}
                            onClick={handleScrollClick}
                            type="submit"
                        >
                            <i
                                className={`fa fa-angle-down ${tourSectionComplete
                                    ? styles.downIconComplete : styles.downIcon}`}
                                aria-hidden="true"
                            />
                        </button>
                    )
                }

                <button
                    className={islastPage ? styles.btnExplore : styles.btnSkip}
                    type="submit"
                    onClick={() => {
                        setTourStatus(false);
                    }}
                >
                    {islastPage ? 'Explore' : 'Skip to Map'}
                </button>
            </div>
        </div>
    );
};

export default VisRiskTourSlider;
