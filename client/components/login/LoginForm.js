import React from 'react';
import TextFieldGroup from '../common/TextFieldGroup';
import { connect } from 'react-redux';
import { login } from '../../actions/authActions';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: '',
      password: '',
      errors: {},
      isLoading: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  isValid() {
    return true;
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.login(this.state).then(
      
      (res) => {
        var token = localStorage.getItem('jwtToken');
        if (token === null) {
          this.context.router.push('/signup')
        }
        else {
          this.context.router.push('/dashboard')
        }
      },
      (err) => {
        console.log('error');
      })
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, identifier, password, isLoading } = this.state;

    return (
      <div className="home-shell home-auth-shell">
        <video autoPlay muted loop id="bgvid">
          <source src="/videos/video-bg.mp4" type="video/mp4" />
        </video>

        <div className="home-overlay"></div>

        <div className="home-auth-grid">
          <div className="home-form-panel">
            <p className="home-panel-label">Welcome Back</p>
            <h1>Login</h1>
            <p className="home-subtitle">
              Step back into your library and pick up where your last favorite left off.
            </p>

            <form onSubmit={this.onSubmit}>
              { errors.form && <div className="alert alert-danger">{errors.form}</div> }

              <TextFieldGroup
                field="identifier"
                label="Username / Email"
                value={identifier}
                error={errors.identifier}
                onChange={this.onChange}
              />

              <TextFieldGroup
                field="password"
                label="Password"
                value={password}
                error={errors.password}
                onChange={this.onChange}
                type="password"
              />

              <div className="home-form-actions">
                <button className="btn btn-lg home-primary-btn home-auth-btn" disabled={isLoading}>
                  Login
                </button>
              </div>
            </form>
          </div>

          <div className="home-form-highlight">
            <p className="home-card-label">Inside your account</p>
            <h2>Your shortcuts are waiting</h2>
            <ul className="home-check-list">
              <li>Favorites sync from the archive page into the dashboard</li>
              <li>Replay or download saved MIDI without hunting through tabs</li>
              <li>Keep the app feeling personal instead of starting over</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  login: React.PropTypes.func.isRequired
}

LoginForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(null, { login })(LoginForm);
