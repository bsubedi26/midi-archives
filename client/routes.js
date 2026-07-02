import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import Greetings from './components/Greetings';
import SignupPage from './components/signup/SignupPage';
import LoginPage from './components/login/LoginPage';
import NewEventPage from './components/events/NewEventPage';
import Dashboard from './components/dashboard/Dashboard';
import MidiArchives from './components/midi/MidiArchives';
import Scraper from './components/scraper/Scraper';

import requireAuth from './utils/requireAuth';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Greetings} />
    <Route path="signup" component={SignupPage} />
    <Route path="login" component={LoginPage} />
    <Route path="new-event" component={NewEventPage} />
    <Route path="dashboard" component={requireAuth(Dashboard)} />
    <Route path="midi-archives" component={requireAuth(MidiArchives)} />
    <Route path="scrape" component={requireAuth(Scraper)} />
  </Route>
)
