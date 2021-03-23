import React, { useEffect, useState } from 'react';
import Icon from '#rscg/Icon';

import styles from './styles.scss';


const NavButtons = (props) => {
    const [page, setPage] = useState(1);
    const {
        getPage,
        maxPage,
        setDestination,
    } = props;

    const handleNext = () => {
        if (page < maxPage) {
            setPage(page + 1);
            getPage(page + 1);
        }
    };

    const handlePrev = () => {
        if (page > 1) {
            setPage(page - 1);
            getPage(page - 1);
        }
    };

    useEffect(() => {
        if (page === 0) {
            setDestination('nepal');
        } else if (page === 1) {
            setDestination('bahrabise');
        }
    }, [page, setDestination]);

    return (
        <div className={styles.navBtnCont}>
            <button
                type="button"
                onClick={handlePrev}
                className={styles.navbutton}
                disabled={page === 1}
            >
                <Icon
                    name="chevronLeft"
                    className={page === 1
                        ? styles.btnDisable
                        : styles.nextPrevBtn
                    }
                />
            </button>
            <div className={styles.navText}>
                {`page ${page} of ${maxPage}`}
            </div>
            <button
                type="button"
                onClick={handleNext}
                className={styles.navbutton}
                disabled={page === maxPage}
            >
                <Icon
                    name="chevronRight"
                    className={page === maxPage
                        ? styles.btnDisable
                        : styles.nextPrevBtn
                    }
                />
            </button>
        </div>
    );
};

export default NavButtons;
