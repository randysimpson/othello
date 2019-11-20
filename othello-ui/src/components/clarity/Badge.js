import React from 'react';

const Badge = () => {
  const { level, message } = this.props;
  const classNameTxt = "badge badge-" + level;
  return (
    <span className={classNameTxt}>{message}</span>
  );
}

export default Badge;
