/* eslint-disable */
import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Icon } from 'react-icons-kit';
import { ic_check_circle } from 'react-icons-kit/md/ic_check_circle';
import { ic_cancel } from 'react-icons-kit/md/ic_cancel';
import { questionCircleO } from 'react-icons-kit/fa/questionCircleO';

export default function IconComponent(props) {
    const { icon, title, amnityPresence, checkbox, description } = props;
    return (
        <>
            <i
                className={icon}
                style={{
                    color: 'rgba(0,0,0,0.6)',
                    height: '25px',
                    width: '25px',
                    paddingRight: '5px',
                }}
            />
            {title}
            {amnityPresence && checkbox && (
                <span style={{ color: '#5ACE52', paddingLeft: '5px' }}>
                    <Icon size={15} icon={ic_check_circle} />
                </span>
            )}
            {!amnityPresence && checkbox && (
                <span style={{ color: '#F32F30', paddingLeft: '5px' }}>
                    {' '}
                    <Icon size={15} icon={ic_cancel} />
                </span>
            )}
            {description && (
                <span style={{ color: 'grey', paddingLeft: '5px' }}>
                    {' '}
                    <Icon
                        size={12}
                        icon={questionCircleO}
                        data-for="main"
                        data-tip={description}
                        data-iscapture="true"
                    />
                    <ReactTooltip
                        id="main"
                        place="top"
                        type="dark"
                        effect="float"
                        multiline={true}
                    />
                </span>
            )}
        </>
    );
}
