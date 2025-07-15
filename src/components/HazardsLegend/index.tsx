import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Legend from "#rscz/Legend";
import { hazardTypesSelector, languageSelector } from "#selectors";

const propTypes = {
	className: PropTypes.string,
	hazardTypes: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
	filteredHazardTypes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
	className: undefined,
	filteredHazardTypes: undefined,
};

const legendColorSelector = (d) => d.color;
const legendLabelSelector = (d, language) => {
	if (language === "en") {
		return d.title;
	}
	return d.titleNe;
};

const legendKeySelector = (d) => d.title;

class HazardsLegend extends React.PureComponent {
	static propTypes = propTypes;

	static defaultProps = defaultProps;

	render() {
		const {
			language: { language },
			className,
			hazardTypes,
			filteredHazardTypes,
			...otherProps
		} = this.props;

		const hazardItems = filteredHazardTypes || hazardTypes;
		return (
			<Legend
				className={className}
				data={hazardItems}
				keySelector={legendKeySelector}
				labelSelector={(d) => legendLabelSelector(d, language)}
				colorSelector={legendColorSelector}
				emptyComponent={null}
				{...otherProps}
			/>
		);
	}
}

const mapStateToProps = (state) => ({
	hazardTypes: hazardTypesSelector(state),
	language: languageSelector(state),
});

export default connect(mapStateToProps)(HazardsLegend);
