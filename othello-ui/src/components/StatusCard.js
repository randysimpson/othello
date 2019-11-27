import React from 'react';

const StatusCard = (props) => {
  const { status } = props;

  return (
    <div className="card">
        <div className="card-block">
            <h3 className="card-title">Status</h3>
            <div className="card-text">
              <div className="clr-row">
                <div className="clr-col-6">
                  Last Action:
                </div>
                <div className="clr-col-6">
                  {status.date.toLocaleString()}
                </div>
                <div className="clr-col-6">
                  Message:
                </div>
                <div className="clr-col-6">
                  {status.message}
                </div>
              </div>
            </div>
        </div>
    </div>
  );
}

export default StatusCard;
