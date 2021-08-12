/* eslint-disable css-modules/no-undef-class */
import React, { useState } from 'react';
import styles from './styles.scss';
import { physicalFactors, socialFactors, economicFactor } from './formData';

const getSelectTypes = data => [...new Set(data.filter(f => f.select).map(p => p.title))];
const getInputTypes = data => [...new Set(data.filter(f => !f.select).map(p => p.title))];
const pfSelectTypes = getSelectTypes(physicalFactors);
const pfInputTypes = getInputTypes(physicalFactors);
const scSelectTypes = getSelectTypes(socialFactors);
const scInputTypes = getInputTypes(socialFactors);
const ecInputTypes = getInputTypes(economicFactor);
const ecSelectTypes = getSelectTypes(economicFactor);
const initialValues = {
    'Foundation Type': '',
    'Roof Type': '',
    Storey: '',
    'Ground Surface': '',
    'Damage Grade': '',
    'Distance from Road (meters)': '',
    'Drinking Water Distance (minutes)': '',
};
const HouseholdForm = (props) => {
    const [foundationType, setFoundation] = useState(initialValues);
    const handleFoundation = (e, type) => {
        setFoundation({
            ...foundationType,
            [type]: e.target.value,
        });
    };
    const handleSave = () => {
        console.log('saving...');
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.section}>
                <h2>PHYSICAL FACTORS</h2>
                {
                    pfSelectTypes.map((type: string) => (
                        <div className={styles.inputContainer}>
                            <span className={styles.label}>
                                {type}
                            </span>
                            <select
                                value={foundationType[type]}
                                onChange={e => handleFoundation(e, type)}
                                className={styles.selectElement}
                            >
                                <option value="">{' '}</option>
                                {physicalFactors.filter(pf => pf.title === type)[0].options
                                    .map((item: string) => <option value={item}>{item}</option>)
                                }
                            </select>
                        </div>

                    ))
                }
                {
                    pfInputTypes.map((type: string) => (
                        <div className={styles.inputContainer}>
                            <span className={styles.label}>
                                {type}
                            </span>
                            <input
                                type="text"
                                value={foundationType[type]}
                                onChange={e => handleFoundation(e, type)}
                                className={styles.selectElement}
                            />

                        </div>

                    ))
                }
            </div>
            <div className={styles.section}>
                <h2>SOCIAL FACTORS</h2>
                {
                    scSelectTypes.map((type: string, idx: number) => (
                        <div className={styles.inputContainer}>
                            <span className={styles.label}>
                                {type}
                            </span>
                            <select
                                value={foundationType[type]}
                                onChange={e => handleFoundation(e, idx, type)}
                                className={styles.selectElement}
                            >
                                <option value="">{' '}</option>
                                {socialFactors.filter(pf => pf.title === type)[0].options
                                    .map((item: string) => <option value={item}>{item}</option>)

                                }
                            </select>
                        </div>

                    ))
                }
                {
                    scInputTypes.map((type: string) => (
                        <div className={styles.inputContainer}>
                            <span className={styles.label}>
                                {type}
                            </span>
                            <input
                                type="text"
                                value={foundationType[type]}
                                onChange={e => handleFoundation(e, type)}
                                className={styles.selectElement}
                            />

                        </div>

                    ))
                }

            </div>
            <div className={styles.section}>
                <h2>ECONOMIC FACTORS</h2>
                {
                    ecSelectTypes.map((type: string, idx: number) => (
                        <div className={styles.inputContainer}>
                            <span className={styles.label}>
                                {type}
                            </span>
                            <select
                                value={foundationType[type]}
                                onChange={e => handleFoundation(e, idx, type)}
                                className={styles.selectElement}
                            >
                                <option value="">{' '}</option>
                                {
                                    economicFactor.filter(pf => pf.title === type)[0].options
                                        .map((item: string) => <option value={item}>{item}</option>)
                                }
                            </select>
                        </div>

                    ))
                }
                {
                    ecInputTypes.map((type: string) => (
                        <div className={styles.inputContainer}>
                            <span className={styles.label}>
                                {type}
                            </span>
                            <input
                                type="text"
                                value={foundationType[type]}
                                onChange={e => handleFoundation(e, type)}
                                className={styles.selectElement}
                            />

                        </div>

                    ))
                }
            </div>
            <button
                type="button"
                onClick={handleSave}
            >
                Save/Update
            </button>
        </div>
    );
};

export default HouseholdForm;
