import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logout, demoLogin } from '../actions/authActions';

class NavigationBar extends React.Component {
  logout(e) {
    e.preventDefault();
    this.props.logout();
  }

  demoLogin(e) {
    e.preventDefault();
    this.props.demoLogin().then(() => {
      this.context.router.push('/dashboard');
    });
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    // const username = localStorage.getItem('username');

    // Navigation links if the user is authenticated and logged in
    const userLinks = (
      <ul className="nav navbar-nav navbar-right">
        {/* <li><Link to="/new-event">Add Event</Link></li> */}
        {/* <li><Link to="/scrape">Video Scrapes</Link></li> */}
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/midi-archives">Midi Archives</Link></li>
        <li><Link to="/">Hello, { this.props.user.username }</Link></li>
        <li><a href="#" onClick={this.logout.bind(this)}>Logout</a></li>
      </ul>
    );
    // Navigation links if the user is not logged in
    const guestLinks = (
      <ul className="nav navbar-nav navbar-right">
        {/* <li><Link to="/new-event">Add Event</Link></li> */}
        {/* <li><Link to="/scrape">Video Scrapes</Link></li> */}
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/midi-archives">Midi Archives</Link></li>
        <li><a href="#" onClick={this.demoLogin.bind(this)}>Try Demo</a></li>
        <li><Link to="/signup">Sign up</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    );

    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">Midi Archives</Link>
          </div>

          <div className="collapse navbar-collapse">
            { isAuthenticated ? userLinks : guestLinks }
          </div>
        </div>
      </nav>
    );
  }
}

NavigationBar.propTypes = {
  auth: React.PropTypes.object.isRequired,
  logout: React.PropTypes.func.isRequired,
  demoLogin: React.PropTypes.func.isRequired,
  user: React.PropTypes.object.isRequired
}

NavigationBar.contextTypes = {
  router: React.PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    user: state.auth.user
  };
}

export default connect(mapStateToProps, { logout, demoLogin })(NavigationBar);
