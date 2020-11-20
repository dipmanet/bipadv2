import React, { useState, useEffect } from 'react';
import { FaramInputElement } from '@togglecorp/faram';

import SelectInput from '#rsci/SelectInput';
import ErrorMessage from '../ErrorMessage';

import { Parameters, Errors } from '../../types';
import styles from './styles.scss';

interface Props {
    onChange: Function;
    errors: Errors[];
}
const parameters: Parameters[] = [
    { parameterCode: 'PM1_I', parameterName: 'PM1 Instantenous' },
    { parameterCode: 'PM10_I', parameterName: 'PM10 Inst' },
    { parameterCode: 'PM2.5_I', parameterName: 'PM2.5 Inst' },
    { parameterCode: 'T', parameterName: 'Air Temperature Inst' },
    { parameterCode: 'TSP_I', parameterName: 'Total Suspended Particulate Inst' },
    { parameterCode: 'RH_I', parameterName: 'Relative Humidity Inst' },
    { parameterCode: 'WS_I', parameterName: 'Wind Speed Inst' },
    { parameterCode: 'WD_I', parameterName: 'Wind direction Inst' },
];

const parameterKeySelector = (r: Parameters) => r.parameterCode;
const parameterLabelSelector = (r: Parameters) => r.parameterName;

const ParameterSelector = (props: Props) => {
    const [selectedParameter, setSelectedParameter] = useState('');
    const [error, setError] = useState('');
    const { onChange, errors } = props;
    const handleParamterChange = (parameterCode: string) => {
        setSelectedParameter(parameterCode);
        const parameter = parameters.filter(p => p.parameterCode === parameterCode)[0];
        onChange(parameter);
    };

    useEffect(() => {
        if (errors) {
            const err = errors.filter(e => e.type === 'Parameter')[0];
            if (err) {
                const { message } = err;
                setError(message || '');
            } else {
                setError('');
            }
        }
    }, [errors]);

    return (
        <div className={styles.parameterSelector}>
            <SelectInput
                className={styles.parameter}
                // label="Parameters"
                options={parameters}
                keySelector={parameterKeySelector}
                labelSelector={parameterLabelSelector}
                value={selectedParameter}
                onChange={handleParamterChange}
                placeholder="Select Parameter"
                // autoFocus
            />
            {error && <ErrorMessage message={error} /> }
        </div>
    );
};

export default FaramInputElement(ParameterSelector);
