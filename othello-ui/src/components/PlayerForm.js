import React from 'react';
import Form  from './clarity/Form';
import Row  from './clarity/Row';
import ControlContainer from './clarity/ControlContainer';

class PlayerForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const id = target.id;

    this.setState({
      [id]: value
    });
  }

  handleSubmit(event) {
    alert("test ");
    console.log(this.state);
    event.preventDefault();
  }

  render() {
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        <Row form>
            <label htmlFor="name" className="clr-control-label">Name</label>
            <ControlContainer>
              <input type="text"
                id="username"
                placeholder="Name Input"
                className="clr-input"
                value={this.state.username}
                onChange={this.handleChange} />
            </ControlContainer>
        </Row>
        <Row form>
            <label htmlFor="password" className="clr-control-label">Password</label>
            <ControlContainer error helper="Helper Text">
              <input type="password"
                id="password"
                placeholder="Password Input"
                className="clr-input"
                value={this.state.password}
                onChange={this.handleChange} />
            </ControlContainer>
        </Row>
        <Row form>
          <input type="submit" className="btn btn-primary" value="Create" />
        </Row>
      </Form>
    )
  }
}

export default PlayerForm;
