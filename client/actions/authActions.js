import axios from 'axios';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import jwtDecode from 'jwt-decode';
import { SET_CURRENT_USER } from './types';
import { browserHistory } from 'react-router';

export const demoCredentials = {
  identifier: 'demo',
  password: 'demo-password'
};

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  };
}

export function logout() {
  return dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
  }
}

// Form data is passed into login function to make server call for user validation
export function login(data) {
  return dispatch => {
    return axios.post('/api/auth', data).then( (res) => {
      const token = res.data.token;
      // If user credentials is invalid redirect user back to login page
      if (token === undefined) {
        browserHistory.push('/#/signup');
      }
      else {
      localStorage.setItem('jwtToken', token);
      setAuthorizationToken(token);
      dispatch(setCurrentUser(jwtDecode(token)));
      }
    }).catch( (err) => {console.log("Error: " + err)});
  }
}

export function demoLogin() {
  return login(demoCredentials);
}
