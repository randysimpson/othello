import React from 'react';
import Row  from './clarity/Row';
import Col  from './clarity/Col';
import Container from './clarity/Container';

import DataGrid from './clarity/DataGrid';
import PieWinLossTie from './PieWinLossTie';
import './GameStats.css';

const GameStats = (props) => {
  const { games } = props;

  let p1Wins = 0;
  let p2Wins = 0;
  let scoreDiff = 0;
  if(games.length > 0) {
    p1Wins = games.reduce((total, item) => {
      if(item.status.score.player1 > item.status.score.player2) {
        return total + 1;
      } else {
        return total;
      }
    }, 0);
    p2Wins = games.reduce((total, item) => {
      if(item.status.score.player1 < item.status.score.player2) {
        return total + 1;
      } else {
        return total;
      }
    }, 0);
    scoreDiff = games.reduce((total, item) => {
      return total + Math.abs(item.status.score.player1 - item.status.score.player2);
    }, 0);
  }

  const columns = [{
    id: 1,
    width: '75px',
    title: ''
  }, {
    id: 2,
    width: '75px',
    title: 'Player 1'
  }, {
    id: 3,
    width: '75px',
    title: 'Player 2'
  }, {
    id: 4,
    width: '50px',
    title: 'Tie'
  }, {
    id: 5,
    width: '100px',
    title: 'Total'
  }];

  const data = [{
      id: 0,
      columns: [{
        id: 1,
        width: '75px',
        data: 'Count'
      }, {
        id: 2,
        width: '75px',
        data: p1Wins
      }, {
        id: 3,
        width: '75px',
        data: p2Wins
      }, {
        id: 4,
        width: '50px',
        data: games.length - p2Wins - p1Wins
      }, {
        id: 5,
        width: '100px',
        data: games.length
      }]
    }, {
        id: 1,
        columns: [{
          id: 1,
          width: '75px',
          data: 'Percentage'
        }, {
          id: 2,
          width: '75px',
          data: ((p1Wins / games.length) * 100).toFixed(2)
        }, {
          id: 3,
          width: '75px',
          data: ((p2Wins / games.length) * 100).toFixed(2)
        }, {
          id: 4,
          width: '50px',
          data: (((games.length - p2Wins - p1Wins) / games.length) * 100).toFixed(2)
        }, {
          id: 5,
          width: '100px',
          data: 100
        }]
      }];

  const title = "test"

  return (
    <Container>
      <Row>
        <Col>
          <DataGrid
            columns={columns}
            data={data}
            total={data.length} />
          <Row>
            <Col>
              <span>Score Difference Avg: {(scoreDiff / games.length).toFixed(2)}</span>
            </Col>
          </Row>
        </Col>
        <Col md={3}>
          {games.length > 0 &&
            <PieWinLossTie
              title={title}
              p1Wins={p1Wins}
              p2Wins={p2Wins}
              ties={games.length - p2Wins - p1Wins} />
          }
        </Col>
      </Row>
    </Container>
  );
}

export default GameStats;
