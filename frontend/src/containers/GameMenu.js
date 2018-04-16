import React, {
  Component
} from 'react';
import {
  Redirect
} from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

import WordsWindow from '../components/WordsWindow';
import GameWindow from '../components/GameWindow';
import GameWaitingScreen from './GameWaitingScreen';
import GameScreen from './GameScreen';

export default class HomeMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      redirectState: {},
      waiting: true,
      playerlist: []
    };
  }

  componentDidMount() {
    const tag = this.props.match.params.tag;

    axios
      .get(`/live/${tag}`)
      .then(({
        data
      }) => {
        if (data.error) {
          this.setState({
            redirect: true,
            redirectState: {
              type: 'warning',
              message: data.error.message
            }
          });
        } else {
          const innerData = data.data;
          const {
            userId,
            socketDomain
          } = innerData;

          const socket = io(`http://localhost:3001/${socketDomain}`);
          socket.on('connect', () => {
            socket.emit('join', {
              userId,
              tag,
              nickname: window.localStorage.getItem('nickname')
            });
          });

          socket.on('connect_error', timeout => {
            socket.close();
            this.setState({
              redirect: true
            });
          });

          socket.on('disconnect', issue => {
            this.setState({
              redirect: true,
              redirectState: {
                type: 'warning',
                message: issue || `You've been kicked!`
              }
            });
          });

          socket.on('update-playerlist', playerlist => {
            this.setState({
              playerlist
            });
          });

          this.socket = socket;
        }
      })
      .catch(error => {
        alert(error);
      });
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  handleStart = () => {
    this.setState({
      waiting: false
    });
  };

  render() {
    if (this.state.redirect) {
      console.log(this.state.redirectState);
      return ( <
        Redirect to = {
          {
            pathname: this.state.redirectTo || '/',
            state: this.state.redirectState
          }
        }
        />
      );
    }

    console.log(this.state.playerlist);

    return this.state.waiting ? ( <
      GameWaitingScreen playerlist = {
        this.state.playerlist
      }
      handleStart = {
        this.handleStart
      }
      />
    ) : ( <
      GameScreen / >
    );
  }
}