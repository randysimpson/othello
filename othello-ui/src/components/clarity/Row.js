import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  tag: tagPropType,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  form: PropTypes.bool,
  disabled: PropTypes.bool
};

const defaultProps = {
  tag: 'div'
};

const Row = (props) => {
  const {
    className,
    cssModule,
    tag: Tag,
    form,
    disabled,
    ...attributes
  } = props;

  const classes = mapToCssModules(classNames(
    className,
    'clr-row',
    form ? 'clr-form-control' : false,
    disabled ? 'clr-form-control-disabled' : false
  ), cssModule);

  return (
    <Tag {...attributes} className={classes} />
  );
};

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

export default Row;
