import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType } from './utils';

const propTypes = {
  children: PropTypes.node,
  inline: PropTypes.bool,
  layout: PropTypes.string,
  tag: tagPropType,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
  className: PropTypes.string,
  cssModule: PropTypes.object,
};

const defaultProps = {
  tag: 'form',
};
class Form extends Component {
  constructor(props) {
    super(props);
    this.getRef = this.getRef.bind(this);
    this.submit = this.submit.bind(this);
  }

  getRef(ref) {
    if (this.props.innerRef) {
      this.props.innerRef(ref);
    }
    this.ref = ref;
  }

  submit() {
    if (this.ref) {
      this.ref.submit();
    }
  }

  render() {
    const {
      className,
      cssModule,
      layout,
      tag: Tag,
      innerRef,
      ...attributes
    } = this.props;

    const classes = mapToCssModules(classNames(
      className,
      'clr-form',
      layout === 'horizontal' ? 'clr-form-horizontal' : (layout === 'compact' ? 'clr-form-compact' : false)
    ), cssModule);

    return (
      <Tag {...attributes} ref={innerRef} className={classes} />
    );
  }
}

Form.propTypes = propTypes;
Form.defaultProps = defaultProps;

export default Form;
