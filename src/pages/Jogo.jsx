import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import { getQuestionsThunk } from '../actions';

class Jogo extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      currQuestion: 0,
      clicked: false,
      timer: 30,
    };
    this.pegarPerguntas = this.pegarPerguntas.bind(this);
    this.changeQuestion = this.changeQuestion.bind(this);
    this.concatQuestions = this.concatQuestions.bind(this);
    this.iniciarCronometro = this.iniciarCronometro.bind(this);
    this.setClass = this.setClass.bind(this);
  }

  componentDidMount() {
    this.pegarPerguntas();
    this.iniciarCronometro();

    console.log('O intervalo está rodando');
  }

  componentDidUpdate(prevProps, prevState) {
    const MAX_SECONDS = 0;

    if (prevState.timer === MAX_SECONDS) {
      clearInterval(this.cronometerInterval);
      this.endTimer();
    }
  }

  setClass() {
    this.setState({ clicked: true });
  }

  iniciarCronometro() {
    const ONE_SECOND = 1000; // Milisegundos
    this.cronometerInterval = setInterval(() => {
      this.setState((prevState) => ({ timer: prevState.timer - 1 }));
    }, ONE_SECOND);
  }

  endTimer() {
    this.setState({ timer: 'acabou o tempo', clicked: true });
  }

  async pegarPerguntas() {
    const { getQuestions } = this.props;
    await getQuestions();
    this.setState({ isLoading: false });
  }

  changeQuestion() {
    this.setState((prevState) => ({
      currQuestion: prevState.currQuestion + 1,
      clicked: false,
    }
    ));
    this.setState({ timer: 30 }, () => {
      clearInterval(this.cronometerInterval);
      this.iniciarCronometro();
    });
  }

  concatQuestions(correct, incorrect) {
    const arr1 = [...incorrect, correct];
    return arr1.sort();
  }

  button() {
    return (
      <button
        type="button"
        onClick={ this.changeQuestion }
        data-testid="btn-next"
      >
        Proxima
      </button>
    );
  }

  perguntas() {
    const { questions } = this.props;
    const { currQuestion, clicked, timer } = this.state;
    const options = this.concatQuestions(questions[currQuestion].correct_answer,
      questions[currQuestion].incorrect_answers);
    return (
      <div>
        <p>{timer}</p>
        <h4 data-testid="question-category">{questions[currQuestion].category}</h4>
        <p data-testid="question-text">{questions[currQuestion].question}</p>
        {options.map((questao, index) => (
          questao === questions[currQuestion].correct_answer ? (
            <button
              className={ clicked ? 'green-border' : '' }
              onClick={ this.setClass }
              type="button"
              key={ index }
              data-testid="correct-answer"
              disabled={ clicked }
            >
              {questao}
            </button>
          ) : (
            <button
              className={ clicked ? 'red-border' : '' }
              onClick={ this.setClass }
              type="button"
              key={ index }
              data-testid={ `wrong-answers-${index}` }
              disabled={ clicked }
            >
              {questao}
            </button>
          )
        ))}
        {clicked && this.button()}
      </div>
    );
  }

  render() {
    const { isLoading } = this.state;
    return (
      <div>
        <Header />
        {isLoading ? null : this.perguntas()}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getQuestions: (token) => dispatch(getQuestionsThunk(token)),
});

const mapStateToProps = (state) => ({
  questions: state.questions.questions,
});

Jogo.propTypes = {
  getQuestions: PropTypes.func,
  questions: PropTypes.any,
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(Jogo);
