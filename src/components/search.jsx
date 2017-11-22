import React from 'react';
import {Glyphicon, Button, FormGroup, FormControl, InputGroup} from 'react-bootstrap';

let currentCorrectAnswer = "";
let currentQuizLength = 0;

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validationError: false,
      loading: false,
      searchError: false,
      inQuiz: false,
      hashtagSearchValue: "",
      currQuiz: '',
      selectedQuiz: "",
      currQuestionIndex: 0,
      selectedAnswer: "",
      incorrectAnswer: false,
      searchResult: {
        'name': '',
        'count': '',
      },
    }
  }

  search() {
    const QuizId = this.state.hashtagSearchValue;
    const BASE_URL = 'http://javierescalante.info/GE/api/quiz?_format=json&quiz=';
    const FETCH_URL = BASE_URL + this.state.hashtagSearchValue;
    const regex = /^[^# ]+$/;
    if (regex.test(QuizId)) {
      this.setState({searchResult: {'name': '', 'count': ''}, loading: true, validationError: false});
      fetch(FETCH_URL, {
        method: 'GET'
      })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        if (json.message.type["0"].target_id === 'quiz') {
          this.setState({searchResult: {'name': json.message.title["0"].value}, searchError: false, loading: false, currQuiz: json.message, selectedQuiz: json});
        } else {
          this.setState({searchError: true, loading: false});
        }
      }).catch(function(error) {
        console.log(error);
        this.setState({searchError: true, loading: false});
    }.bind(this));
    }else {
      this.setState({searchResult: {'name': '', 'count': ''}});
      this.setState({validationError: true})
    }
  }

  checkForloaded() {
    if (this.state.loading === true) {
      return (
        <div>
          <Glyphicon glyph="cog" className="loaderIcon"/>
          <p>Searching...</p>
        </div>
      );
    }
  }

  renderQuestion() {
    currentQuizLength = this.state.currQuiz.field_q.length
    if (currentQuizLength === this.state.currQuestionIndex) {
      return(
        <div>
          <h3 className="current_question_title">
             Congratulations!
          </h3>
          <input type="button" value="Back to Home" className="next_question_buton" onClick={() => { this.setState({inQuiz: false,selectedQuiz: "", currQuestionIndex: 0, selectedAnswer: "", searchResult: {'name': ''}}) } } />
        </div>
      )
    }
    let question = this.state.currQuiz.field_q[this.state.currQuestionIndex];
    return(
      <div>
        {
          <div>
            <h3 className="current_question_title">
             {(this.state.currQuestionIndex+1) + ")  " }
             {question.field_t["0"].value + ' ?'}
            </h3>
            <form action="">
              {question.field_question.map((answer, index2) => { 
                if (answer.correct === "1") {
                  currentCorrectAnswer = answer.answer
                  //console.log(currentCorrectAnswer)
                } 
                return(
                  <div key={index2} className="answer_wrapper">
                    <input className="posible_answer" type="radio" name="answer" value={answer.answer} onClick={ (e) => {this.handleAnswerChange(answer.answer)} }/>
                    <p className="posible_answer">{answer.answer}</p>
                    <div className="cf">
                    </div>
                  </div>
                )}
              )}
            </form>
            {this.state.incorrectAnswer && <p style={{color: 'red'}}>Sorry wrong answer, please try again</p>}
            <input type="button" value="Next" className="next_question_buton" onClick={() => { this.handleNext()}} />
          </div>
        }
      </div>
    )
  }

  handleNext() {
    if (this.state.selectedAnswer === currentCorrectAnswer) {
      this.setState({currQuestionIndex: this.state.currQuestionIndex+1})
    } else {
      this.setState({incorrectAnswer: true})
    }
  }

  handleAnswerChange(answer) {
    this.setState({incorrectAnswer: false})
    this.setState({selectedAnswer: answer})
  }

  render() {
    if (!this.state.inQuiz) {
      return (
        <div className="container" style={{width: '60%', paddingTop: '2em'}}>
          <p><strong>Look for the quiz you would like to take by its Id ( node Id )</strong></p>
          <p><strong>Protip!: There's only two quizzes number 11 and 10 feel free to add more.</strong></p>
          <FormGroup>
            <InputGroup>
              <FormControl type="text"
                           placeholder="Example: 11"
                           onChange={event => this.setState({hashtagSearchValue: event.target.value})}
                           />
              <InputGroup.Button>
                <Button className="btn-success"
                        onClick={() => {this.search()}}
                >
                  Search
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
          <div className="searchResult">
            {this.checkForloaded()}
            {/*this.checkForValidationError()*/}
            {this.state.searchResult.name !== '' && 
            <div>
              <h2>
                {this.state.searchResult.name}
              </h2>
              <Button className="btn-success"
                          onClick={() => {this.setState({inQuiz: true, activeQuiz: this.state.currQuiz})}}
                  >
                    Take Quiz
              </Button>
            </div>
            }
            {this.state.searchError && 
              <p style={{color: 'red'}}>No Quiz Found</p>
            }
          </div>
        </div>
      );
    } else {
      return(
        <div className="quiz-wrapper">
          <h2 className="quiz-page-title">
            {this.state.currQuiz.title["0"].value}
          </h2>
          {
            this.renderQuestion()
          }
        </div>
      );
    }
  }
}

export default Search;
