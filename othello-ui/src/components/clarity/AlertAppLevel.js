import React from 'react';

const AlertAppLevel = () => {
  const { level, message } = this.props;
  return (
    <div className="alert alert-app-level">
        {level} - {message}
    </div>
  );
}

export default AlertAppLevel;
