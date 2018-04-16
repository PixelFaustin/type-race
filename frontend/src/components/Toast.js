import React, { Component } from 'react';

const toastMap = {
  warning: 'Uh oh!'
};

export default class Toast extends Component {
  constructor(props) {
    super(props);
  }

  handleGlobalClick = event => {
    if (event.target !== this.toast && !this.toast.contains(event.target)) {
      this.props.removeToast();
    }
  };

  componentWillMount() {
    setTimeout(() => {
      window.addEventListener('click', this.handleGlobalClick);
    }, 50);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleGlobalClick);
  }

  render() {
    return (
      <div
        className={`modal ${this.props.type}`}
        ref={toast => {
          this.toast = toast;
        }}
      >
        <span className="close-modal" onClick={this.props.removeToast}>
          &times;
        </span>
        <div className="modal-body">
          <h1 className="modal-header">{toastMap[this.props.type]}</h1>
          <div className="modal-content">{this.props.message}</div>
          <button className="btn-ok" onClick={this.props.removeToast}>
            OK
          </button>
        </div>
      </div>
    );
  }
}
