import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import LocalStorageEntry from '../components/LocalStorageEntry';
import Toast from '../components/Toast';

export default class HomeMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      redirectTo: '/',
      toast: null
    };

    if (this.props.location.state) {
      const { message, type } = this.props.location.state;

      this.state = Object.assign(this.state, { toast: { message, type } });
    }
  }

  createPrivateRace = () => {
    axios
      .post('/live')
      .then(({ data }) => {
        const dataBody = data.data;
        const { tag } = dataBody;

        this.setState({ redirect: true, redirectTo: `/live/!${tag}` });
      })
      .catch(error => {
        console.log(error);
      });
  };

  removeToast = () => {
    this.setState({ toast: null });
  };

  generateToast = (type, message) => {
    return () => {
      const toastObject = { message, type };
      this.setState({ toast: toastObject });
    };
  };

  render() {
    console.log(this.state);
    if (this.state.redirect) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className="game-container">
        <div className="main-screen">
          {this.state.toast && (
            <Toast
              message={this.state.toast.message}
              type={this.state.toast.type}
              removeToast={this.removeToast}
            />
          )}
          <span className="welcome-text">
            <h1>TypeRun</h1>
            <h3>
              Train your typing speed while competing with others in an online
              typing race!
            </h3>
          </span>
          <div className="row">
            <div className="menu-controls">
              <LocalStorageEntry
                placeholder="Enter your name"
                name="username"
                storageRef="nickname"
              />
              <button
                onClick={this.generateToast(
                  'warning',
                  'Online play has not yet been implemented'
                )}
              >
                Play Online
              </button>
              <button onClick={this.createPrivateRace}>
                Create Private Race
              </button>
              <button
                onClick={this.generateToast(
                  'warning',
                  'Customizing appearance has not been implemented!'
                )}
              >
                Customize Appearance
              </button>
            </div>
            <div className="ads">
              <h1>ADS</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
