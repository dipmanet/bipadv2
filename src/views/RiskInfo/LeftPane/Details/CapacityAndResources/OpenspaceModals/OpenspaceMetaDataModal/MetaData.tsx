import React from 'react';
import styles from './styles.scss';
import MainTable from './MetadataComponents/MainTAble';
import Template from './MetadataComponents/DataTemplate';
import CheckList from './MetadataComponents/CheckList';

export default class MetaData extends React.PureComponent {
    public render() {
        return (
            <div>
                {/* <MainTable />
                <br />
                <hr /> */}
                <Template />
                <br />
                <hr />
                <CheckList />
            </div>
        );
    }
}
