import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { connect } from 'react-redux';
import ListView from '#rsu/../v2/View/ListView';
import { getHashFromBrowser } from '#rscg/HashManager';

import { AttributeKey } from '#types';
import { AppState } from '#store/types';
import {
    languageSelector,
} from '#selectors';
import {
    attributeList,
    attributeListKeySelector,
    AttributeItem,
} from '../attributes';
import Attribute from './Attribute';
import styles from './styles.scss';


const mapStateToProps = (state: AppState) => ({
    language: languageSelector(state),

});

interface State {
    hash: string | undefined;
}

interface Props {
    className?: string;
    onAttributeClick: (key: AttributeKey) => void;
    titleShown: boolean;
    activeAttribute: AttributeKey;
}

class Overview extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            hash: getHashFromBrowser(),
        };
    }

    public componentDidMount() {
        window.addEventListener('hashchange', this.handleHashChange);
    }

    public componentWillUnmount() {
        window.removeEventListener('hashchange', this.handleHashChange);
    }

    private handleHashChange = () => {
        const hash = getHashFromBrowser();
        this.setState({ hash });
    }

    private getAttributeRendererParams = (_: string, attribute: AttributeItem) => ({
        attributeKey: attribute.key,
        title: this.props.language.language === 'en' ? attribute.title : attribute.titleNep,
        icon: this.props.language.language === 'en' ? attribute.icon : attribute.iconNep,
        description: this.props.language.language === 'en' ? attribute.description : attribute.descriptionNep,
        onClick: this.props.onAttributeClick,
        className: styles.attribute,
        titleShown: this.props.titleShown,
        isActive: this.state.hash === attribute.key,
        color: attribute.color,
    })

    public render() {
        const {
            className,
            titleShown,
        } = this.props;

        const { hash } = this.state;

        return (
            <ListView
                key={hash}
                className={_cs(styles.overview, className, !titleShown && styles.iconOnly)}
                data={attributeList}
                renderer={Attribute}
                rendererParams={this.getAttributeRendererParams}
                keySelector={attributeListKeySelector}
            />
        );
    }
}
export default connect(mapStateToProps)(Overview);
