//todo: add ability for multiple alert-items.

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules } from './utils';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  closeClassName: PropTypes.string,
  closeAriaLabel: PropTypes.string,
  cssModule: PropTypes.object,
  color: PropTypes.string,
  isOpen: PropTypes.bool,
  small: PropTypes.bool,
  icon: PropTypes.bool,
  toggle: PropTypes.func,
  innerRef: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.func,
  ]),
};

const defaultProps = {
  color: 'success',
  isOpen: true,
  icon: true,
  closeAriaLabel: 'Close'
};

function Alert(props) {
  const {
    className,
    closeClassName,
    closeAriaLabel,
    cssModule,
    color,
    isOpen,
    toggle,
    small,
    icon,
    children,
    innerRef,
    ...attributes
  } = props;

  const classes = mapToCssModules(classNames(
    className,
    'alert',
    `alert-${color}`,
    { 'alert-dismissible': toggle },
    { 'alert-sm': small }
  ), cssModule);

  const closeClasses = mapToCssModules(classNames('close', closeClassName), cssModule);

  let iconHTML;
  if(icon) {
    if(color === 'danger') {
      iconHTML = (
        <div className="alert-icon-wrapper">
          <clr-icon class="alert-icon" shape="exclamation-circle"></clr-icon>
        </div>
      )
    } else if(color === 'warning') {
      iconHTML = (
        <div className="alert-icon-wrapper">
          <clr-icon class="alert-icon" shape="exclamation-triangle"></clr-icon>
        </div>
      )
    } else if(color === 'info') {
      iconHTML = (
        <div className="alert-icon-wrapper">
          <clr-icon class="alert-icon" shape="info-circle"></clr-icon>
        </div>
      )
    } else if(color === 'success') {
      iconHTML = (
        <div className="alert-icon-wrapper">
          <clr-icon class="alert-icon" shape="check-circle"></clr-icon>
        </div>
      )
    }
  }

  const hiddenAttr = !isOpen ? { hidden: true } : {};

  return (
    <div {...attributes} className={classes} role="alert" innerRef={innerRef} {...hiddenAttr}>
      <div className="alert-items">
        <div className="alert-item static" role="alert">
          {iconHTML}
          <span className="alert-text">
            {children}
          </span>
        </div>
      </div>
      {toggle ?
        <button type="button" className={closeClasses} aria-label={closeAriaLabel} onClick={toggle}>
          <clr-icon aria-hidden="true" shape="close"></clr-icon>
        </button>
        : null}
    </div>
  );
}

Alert.propTypes = propTypes;
Alert.defaultProps = defaultProps;

export default Alert;
