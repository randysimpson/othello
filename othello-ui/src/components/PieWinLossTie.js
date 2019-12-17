import React from 'react';

import PieChart from './chart/PieChart';

const PieWinLossTie = (props) => {
  const { title, p1Wins, p2Wins, ties } = props;

  const labels = ["Player 1", "Player 2", "Tie"];
  let datasets = [];

  let c1 = "rgba(184, 209, 11, 0.5)";
  let c2 = "rgba(21, 60, 254, 0.5)";
  let c3 = "rgba(235, 84, 97, 0.5)";
  datasets.push({
      label: "Player 1",
      //data: [p1Wins, p2Wins, games.length - p2Wins - p1Wins],
      data: [p1Wins, p2Wins, ties],
      backgroundColor: [c1, c2, c3],
      borderColor: [c1, c2, c3]
  });

  return (
    <PieChart
      labels={labels}
      datasets={datasets}
      title={title} />
  );
}

export default PieWinLossTie;
