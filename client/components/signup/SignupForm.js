import React from 'react';
import TextFieldGroup from '../common/TextFieldGroup';

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      errors: {},
      isLoading: false,
      invalid: false
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDemoLogin = this.onDemoLogin.bind(this);
    this.checkUserExists = this.checkUserExists.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  isValid() {
    return true;
  }

  checkUserExists(e) {
  }

  onDemoLogin(e) {
    e.preventDefault();
    this.setState({ isLoading: true });
    this.props.demoLogin().then(
      () => {
        this.context.router.push('/dashboard');
      },
      () => {
        this.setState({ isLoading: false });
      }
    );
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true });
      this.props.userSignupRequest(this.state).then(
        () => {
          this.props.addFlashMessage({
            type: 'success',
            text: 'You signed up successfully. Login Below!'
          });
          this.context.router.push('/login');
        },
        (err) => this.setState({ errors: err.response.data, isLoading: false })
      );
    }
  }

  render() {
    const { errors } = this.state;
    
    return (
      <div className="home-shell home-auth-shell">
        <video autoPlay muted loop id="bgvid">
          <source src="/videos/video-bg.mp4" type="video/mp4" />
        </video>

        <div className="home-overlay"></div>

        <div className="home-auth-grid">
          <div className="home-form-panel">
            <p className="home-panel-label">Create Account</p>
            <h1>Join the community</h1>
            <p className="home-subtitle">
              Build your own MIDI space so favorites, playback, and downloads stay close at hand.
            </p>

            <form onSubmit={this.onSubmit}>
              <TextFieldGroup
                error={errors.username}
                label="Username"
                onChange={this.onChange}
                checkUserExists={this.checkUserExists}
                value={this.state.username}
                field="username"
              />

              <TextFieldGroup
                error={errors.email}
                label="Email"
                onChange={this.onChange}
                checkUserExists={this.checkUserExists}
                value={this.state.email}
                field="email"
              />

              <TextFieldGroup
                error={errors.password}
                label="Password"
                onChange={this.onChange}
                value={this.state.password}
                field="password"
                type="password"
              />

              <TextFieldGroup
                error={errors.passwordConfirmation}
                label="Password Confirmation"
                onChange={this.onChange}
                value={this.state.passwordConfirmation}
                field="passwordConfirmation"
                type="password"
              />

              <div className="home-form-actions">
                <button
                  disabled={this.state.isLoading || this.state.invalid}
                  className="btn btn-lg home-primary-btn home-auth-btn"
                >
                  Sign up
                </button>
                <button
                  type="button"
                  disabled={this.state.isLoading || this.state.invalid}
                  onClick={this.onDemoLogin}
                  className="btn btn-lg"
                >
                  Try Demo Account
                </button>
              </div>
            </form>
          </div>

          <div className="home-form-highlight">
            <p className="home-card-label">What you unlock</p>
            <h2>A personal favorites library</h2>
            <ul className="home-check-list">
              <li>Save tracks from archives the moment you find them</li>
              <li>Open a dashboard built around playback and downloads</li>
              <li>Come back to the songs you care about without digging</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

SignupForm.propTypes = {
  userSignupRequest: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired,
  isUserExists: React.PropTypes.func.isRequired,
  demoLogin: React.PropTypes.func.isRequired
}

SignupForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default SignupForm;
