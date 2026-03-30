import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class Greetings extends React.Component {
  renderPrimaryAction() {
    if (this.props.auth.isAuthenticated) {
      return (
        <Link to="/midi-archives" className="btn btn-lg home-primary-btn">
          Open Midi Archives
        </Link>
      );
    }

    return (
      <Link to="/signup" className="btn btn-lg home-primary-btn">
        Create Free Account
      </Link>
    );
  }

  renderSecondaryAction() {
    if (this.props.auth.isAuthenticated) {
      return (
        <Link to="/dashboard" className="btn btn-lg home-secondary-btn">
          Go To Dashboard
        </Link>
      );
    }

    return (
      <Link to="/login" className="btn btn-lg home-secondary-btn">
        Sign In
      </Link>
    );
  }

  render() {
    var isAuthenticated = this.props.auth.isAuthenticated;

    return (
      <div className="home-shell">
        <video autoPlay muted loop id="bgvid">
          <source src="/videos/video-bg.mp4" type="video/mp4" />
        </video>

        <div className="home-overlay"></div>

        <div className="home-hero">
          <div className="home-hero-copy">
            <p className="home-kicker">Midi Library</p>
            <h1>Play, collect, and revisit your favorite MIDI tracks</h1>
            <p className="home-subtitle">
              Browse curated archives, save favorites into your own dashboard, and jump back into playback without digging through folders.
            </p>

            <div className="home-actions">
              {this.renderPrimaryAction()}
              {this.renderSecondaryAction()}
            </div>
          </div>

          <div className="home-highlight-card">
            <p className="home-card-label">What You Can Do</p>
            <h2>{isAuthenticated ? 'Your library is ready' : 'Start building a library'}</h2>
            <ul className="home-check-list">
              <li>Explore contemporary, games, movies, and anthems collections</li>
              <li>Favorite standout tracks and see them again in the dashboard</li>
              <li>Play files instantly or download them for offline practice</li>
            </ul>
          </div>
        </div>

        <div className="row home-content-row">
          <div className="col-md-7">
            <div className="home-panel home-panel-large">
              <p className="home-panel-label">Quick Start</p>
              <h2>Useful places to go next</h2>

              <div className="home-link-grid">
                <Link to="/midi-archives" className="home-link-card">
                  <span className="home-link-badge">Browse</span>
                  <h3>Midi Archives</h3>
                  <p>Search folders, preview tracks, and favorite anything worth keeping.</p>
                </Link>

                <Link to={isAuthenticated ? '/dashboard' : '/login'} className="home-link-card">
                  <span className="home-link-badge">Organize</span>
                  <h3>{isAuthenticated ? 'Dashboard' : 'Member Dashboard'}</h3>
                  <p>{isAuthenticated ? 'Open your saved favorites hub and jump back into downloads.' : 'Sign in to unlock favorites and your saved MIDI dashboard.'}</p>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="home-panel home-panel-side">
              <p className="home-panel-label">Flow</p>
              <h2>How this app works</h2>

              <div className="home-steps">
                <div className="home-step">
                  <span className="home-step-number">01</span>
                  <div>
                    <h3>Browse</h3>
                    <p>Move through the archives and search within a folder quickly.</p>
                  </div>
                </div>

                <div className="home-step">
                  <span className="home-step-number">02</span>
                  <div>
                    <h3>Favorite</h3>
                    <p>Star tracks that stand out so they stay attached to your account.</p>
                  </div>
                </div>

                <div className="home-step">
                  <span className="home-step-number">03</span>
                  <div>
                    <h3>Return Fast</h3>
                    <p>Use the dashboard as a personal shortcut for playing and downloading again.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Greetings.propTypes = {
  auth: React.PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps)(Greetings);
