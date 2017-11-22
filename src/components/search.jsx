import React from 'react';
import {Glyphicon, Button, FormGroup, FormControl, InputGroup} from 'react-bootstrap';

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
        this.setState({selectedQuiz: json});
        this.setState({searchResult: {'name': json.message.title["0"].value}, searchError: false, loading: false, currQuiz: json.message});
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

  checkForValidationError() {
    if (this.state.validationError === true) {
      return (
        <div>
          <p style={{color: 'red'}}>Search can't include # or spaces!</p>
        </div>
      );
    }
  }

  render() {
    if (!this.state.inQuiz) {
      return (
        <div className="container" style={{width: '60%', paddingTop: '2em'}}>
          <p><strong>Look for the quiz you would like to take by its Id ( node Id )</strong></p>
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
            <p>
              <p style={{color: 'red'}}>No Quiz Found</p>
            </p>
            }
          </div>
        </div>
      );
    } else {
      return(
        <p>
          {this.state.currQuiz.title["0"].value}
        </p>
      );
    }
    
  }
}

export default Search;
