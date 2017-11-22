import React from 'react';
import './App.css';
import Search from './components/search.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quizSelected: false,
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src="./GElogo.png" className="App-logo" style={{'width': '80px'}}/>
          <h1 className="App-title">Garrison Elementary</h1>
          <h1 className="App-subtitle">Quiz App</h1>
        </header>
        <Search />
      </div>
    );
  }
}

export default App;
