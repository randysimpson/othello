import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  children: PropTypes.node,
  row: PropTypes.bool,
  tag: tagPropType,
  className: PropTypes.string,
  cssModule: PropTypes.object,
};

const defaultProps = {
  tag: 'div',
};

const FormControl = (props) => {
  const {
    className,
    cssModule,
    row,
    tag: Tag,
    ...attributes
  } = props;

  const classes = mapToCssModules(classNames(
    className,
    row ? 'clr-row' : false
  ), cssModule);

  return (
    <Tag {...attributes} className={classes} />
  );
};

FormControl.propTypes = propTypes;
FormControl.defaultProps = defaultProps;

export default FormControl;
