import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  tag: tagPropType,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  children: PropTypes.node
};

const defaultProps = {
  tag: 'div'
};

const SubNav = (props) => {
  const {
    className,
    cssModule,
    children,
    tag: Tag,
    ...attributes
  } = props;

  const classes = mapToCssModules(classNames(
    className,
    'subnav'
  ), cssModule);

  return (
    <Tag {...attributes} className={classes}>
      {children}
    </Tag>
  );
};

SubNav.propTypes = propTypes;
SubNav.defaultProps = defaultProps;

export default SubNav;
