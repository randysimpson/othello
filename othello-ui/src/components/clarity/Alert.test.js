import React from 'react';
import Alert  from './Alert';

class AlertTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alertVisible: true
    }

    this.testVisible = this.testVisible.bind(this);
  }

  testVisible() {
    this.setState({
      alertVisible: false
    });
  }

  render() {
    return (
      <div>
        <Alert color="danger" isOpen={this.state.alertVisible} toggle={this.testVisible}>
          This is a test, <a href="#" className="alert-link">an example link</a> included.
        </Alert>
        <Alert color="danger" small={true} icon={false}>
          This is a small test.
        </Alert>
        <Alert color="danger">
          <h1>Error</h1>
          This is another test.
        </Alert>
        <Alert color="warning">
          This is a warning test.
        </Alert>
        <Alert color="info">
          This is a info test.
        </Alert>
        <Alert color="success">
          This is a success test.
        </Alert>
      </div>
    )
  }
}

export default AlertTest;
