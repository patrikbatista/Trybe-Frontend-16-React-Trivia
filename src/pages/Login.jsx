// import PropTypes from 'prop-types';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getTokenThunk, login as loginAction } from '../actions';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { userToken } = this.props;
    console.log(userToken);
  }

  handleChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { email, name } = this.state;
    const { sendToken, login } = this.props;

    login(email, name);

    sendToken();
  }

  render() {
    const { email, name } = this.state;
    const { userToken } = this.props;
    return (
      <form onSubmit={ this.handleSubmit }>
        <label htmlFor="email">
          {'Email: '}
          <input
            data-testid="input-gravatar-email"
            value={ email }
            name="email"
            type="email"
            onChange={ this.handleChange }
          />
        </label>
        <label htmlFor="name">
          {'Nome: '}
          <input
            data-testid="input-player-name"
            value={ name }
            name="name"
            type="text"
            onChange={ this.handleChange }
          />
        </label>
        <button
          type="submit"
          data-testid="btn-play"
          disabled={ !(email && name) }
        >
          Jogar
        </button>
        { userToken && <Redirect to="/jogo" /> }
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  login: (email, name) => dispatch(loginAction(email, name)),
  sendToken: () => dispatch(getTokenThunk()),
});

const mapStateToProps = (state) => ({
  userToken: state.token.token,
});

Login.propTypes = {
  userToken: PropTypes.string.isRequired,
  sendToken: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
