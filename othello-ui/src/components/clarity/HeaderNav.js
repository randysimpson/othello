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

const HeaderNav = (props) => {
  const {
    className,
    cssModule,
    children,
    tag: Tag,
    ...attributes
  } = props;

  const classes = mapToCssModules(classNames(
    className,
    'header-nav'
  ), cssModule);

  return (
    <Tag {...attributes} className={classes}>
      {children}
    </Tag>
  );
};

HeaderNav.propTypes = propTypes;
HeaderNav.defaultProps = defaultProps;

export default HeaderNav;
