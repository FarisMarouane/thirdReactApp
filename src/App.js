import React, { Component } from 'react';
import './App.css';
import * as Default from './Default';
import { Search } from './Components/Search';
import { Table } from './Components/Table';
import { Button } from './Components/Button';
import PropTypes from 'prop-types';

// const DEFAULT_QUERY = 'redux';
// const PATH_BASE = 'https://hn.algolia.com/api/v1';
// const PATH_SEARCH = '/search';
// const PARAM_SEARCH = 'query=';
// const PARAM_PAGE = 'page=';
// const DEFAULT_PAGE = 0;

// const isSearched = (searchTerm) => (item) =>
//   !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: Default.DEFAULT_QUERY,
      page: Default.DEFAULT_PAGE
    };

    this.needToSearchTopStories = this.needToSearchTopStories.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);

    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopstories (result) {
    const {hits, page} = result;
    const {results, searchKey} = this.state;

    const oldHits = (results && results[searchKey]) ? results[searchKey].hits : [];
    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({results: {
      ...results,
      [searchKey]: {hits: updatedHits, page}
    }});
  }

  fetchSearchTopstories (searchTerm, page) {
    fetch(`${Default.PATH_BASE}${Default.PATH_SEARCH}?${Default.PARAM_SEARCH}${searchTerm}&${Default.PARAM_PAGE}${page}`)
    .then(response => response.json())
    .then(result => this.setSearchTopstories(result))
    .catch(e => e);
    this.setState({page});
  }

  componentDidMount () {
    const searchTerm = this.state.searchTerm;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopstories(searchTerm, Default.DEFAULT_PAGE);
  }

  onSearchChange (event) {
    this.setState({ searchTerm: event.target.value });
  }

  onDismiss (id) {
    const {searchKey, results} = this.state;
    const {hits, page} = results[searchKey];
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({results: {
      ...results,
      [searchKey]: {hits: updatedHits, page}
    }
    });
  }

  onSearchSubmit (event) {
    const {searchTerm} = this.state;

    if (!this.needToSearchTopStories(searchTerm)) {
      this.fetchSearchTopstories(this.state.searchTerm, Default.DEFAULT_PAGE);
    }

    this.setState({searchKey: searchTerm});
    event.preventDefault();
  }

  needToSearchTopStories (searchTerm) {
    return this.state.results.hasOwnProperty(searchTerm);
  }

  render () {
    const { searchTerm, searchKey, results } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className='page'>
        <div className='interactions'>
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
            >
            <strong>Search:</strong>
          </Search>
        </div>
        <Table
          list={list}
          onDismiss={this.onDismiss}
          />
        <div className='interactions'>
          {(page > 0)
  ? <Button onClick={() => this.fetchSearchTopstories(searchKey, page - 1)}>
    Go Back
  </Button>
    : null }

          <Button onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}>
Next
</Button>
        </div>

      </div>
    );
  }
}

Table.propTypes = {
  onDismiss: PropTypes.func,
  list: PropTypes.array
};

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.node
};

Button.propTypes = {
  onClick: PropTypes.func
};

export default App;
