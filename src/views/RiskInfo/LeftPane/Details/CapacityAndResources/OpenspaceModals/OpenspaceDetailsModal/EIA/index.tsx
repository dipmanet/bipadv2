import React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_check_circle as Check } from 'react-icons-kit/md/ic_check_circle';
import { ic_cancel as Cancel } from 'react-icons-kit/md/ic_cancel';
import styles from './styles.scss';
import { createRequestClient, ClientAttributes, methods } from '#request';

interface Props {
    openspaceId: number;
    requests: any;
}
interface Params {
    openspaceId: number;
}

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    mediaGetRequest: {
        url: ({ params }) => {
            if (!params || !params.openspaceId) {
                return '';
            }
            return `/open-eia/?open_space=${params.openspaceId}`;
        },
        method: methods.GET,
        onMount: false,
    },
};
class EiaComponent extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);

        const {
            requests: { mediaGetRequest },
            openspaceId,
        } = this.props;
        mediaGetRequest.do({
            openspaceId,
        });
    }

    public render() {
        const { requests } = this.props;
        const {
            mediaGetRequest: { response, pending },
        } = requests;

        const data = response && response.results && response.results;

        console.log('data data', data);

        return (
            <div className={styles.wrapper}>
                {response && data
                && data.map((eia: any) => (
                    <div className={styles.assesment}>
                        <div>
                            {eia.eiaName}
                        </div>
                        <div className={styles.icons}>
                            {eia.isAvailable && (
                                <span
                                    style={{
                                        color: '#5ACE52',
                                        paddingLeft: '5px',
                                    }}
                                >
                                    <Icon
                                        size={15}
                                        icon={Check}
                                    />
                                </span>
                            )}
                            {!eia.isAvailable && (
                                <span
                                    style={{
                                        color: '#F32F30',
                                        paddingLeft: '5px',
                                    }}
                                >
                                    {' '}
                                    <Icon size={15} icon={Cancel} />
                                </span>
                            )}
                        </div>
                    </div>
                ))}
                {!data
                || (data.length === 0 && (
                    <div className={styles.noData}>No data present</div>
                ))}
            </div>
        );
    }
}

export default createRequestClient(requestOptions)(EiaComponent);
