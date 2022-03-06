import React, { useState } from 'react';
import styles from './styles.module.scss';


interface Props{
    newNotification?: boolean;
    title?: string;
    shortdescription?: string;
    longdescription?: string;
    type?: string;
    handleMoreBtn?: (e: string) => void;
    key?: number;
    itemobj?: Record<string, unknown>;
}


const Card = (props: Props) => {
    const [showMore, setShowMore] = useState(false);

    const {
        handleMoreBtn,
        newNotification,
        type,
        title,
        shortdescription,
        longdescription,
        itemobj,
    } = props;


    return (
        <div className={type === 'Info' ? styles.cardContainerInfo : styles.cardContainerError}>
            <p style={newNotification ? { color: 'black' } : { color: '#676767' }}>
                {title}

            </p>
            {
                showMore
                    ? (
                        <p style={newNotification ? { color: 'black' } : { color: '#676767' }}>
                            {longdescription}
                        </p>
                    )
                    : (
                        <p style={newNotification ? { color: 'black' } : { color: '#676767' }}>
                            {shortdescription}
                        </p>
                    )
            }
            <div className={styles.btnContainer}>
                <button
                    onClick={() => handleMoreBtn(itemobj)}
                    className={styles.handleMore}
                    type="button"
                >
                    {
                        showMore
                            ? 'Show Less'
                            : 'Show More'
                    }
                </button>
            </div>
        </div>
    );
};

export default Card;
