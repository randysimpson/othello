import React from 'react';

const PlayerCard = (props) => {
  const { player, score } = props;

  return (
    <div className="card">
        <div className="card-block">
            <h3 className="card-title">{player.name}</h3>
            <div className="card-text">
              <div className="clr-row">
                <div className="clr-col-6">
                  IP:
                </div>
                <div className="clr-col-6">
                  {player.ip}
                </div>
                <div className="clr-col-6">
                  Port:
                </div>
                <div className="clr-col-6">
                  {player.port}
                </div>
                <div className="clr-col-6">
                  Color:
                </div>
                <div className="clr-col-6">
                  {player.color}
                </div>
              </div>
            </div>
        </div>
        <div className="card-footer clr-justify-content-center">
            {score}
        </div>
    </div>
  );
}

export default PlayerCard;
