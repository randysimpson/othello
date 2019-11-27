import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  children: PropTypes.node,
  error: PropTypes.bool,
  helper: PropTypes.string,
  tag: tagPropType,
  className: PropTypes.string,
  cssModule: PropTypes.object,
};

const defaultProps = {
  tag: 'div',
};

const ControlContainer = (props) => {
  const {
    className,
    cssModule,
    children,
    error,
    helper,
    tag: Tag,
    ...attributes
  } = props;

  const classes = mapToCssModules(classNames(
    className,
    'clr-control-container',
    error ? 'clr-error' : false
  ), cssModule);

  return (
    <Tag {...attributes} className={classes}>
      <div className="clr-input-wrapper">
        {children}
        <clr-icon class="clr-validate-icon" shape="exclamation-circle"></clr-icon>
      </div>
      <span className="clr-subtext">{helper}</span>
    </Tag>
  );
};

ControlContainer.propTypes = propTypes;
ControlContainer.defaultProps = defaultProps;

export default ControlContainer;
