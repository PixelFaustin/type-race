import React, { Component } from 'react';

export default class LocalStorageEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entry: ''
    };
  }

  handleUsernameChange = ({ target }) => {
    window.localStorage.setItem(this.props.storageRef, target.value);
    this.setState({ entry: target.value });
  };

  componentDidMount() {
    this.setState({
      entry: window.localStorage.getItem(this.props.storageRef)
    });
  }

  render() {
    return (
      <input
        placeholder={this.props.placeholder}
        name={this.props.name}
        type="text"
        className="input-form"
        value={this.state.entry}
        onChange={this.handleUsernameChange}
      />
    );
  }
}
