import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { TextField, Icon, Button } from '@material-ui/core';
import FilterActions from '../actions/filter';

const styles = theme => ({
  container: {
    margin: '20px 0px',
    border: 'solid 1px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '400px'
  },
  searchButtonWrapper: {
    textAlign: 'right',
  },
  button: {
    margin: theme.spacing.unit,
  },
  searchButton: {
    margin: theme.spacing.unit,
    right: '30px',
    bottom: '10px',
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class SearchForm extends Component {
  constructor(props) {
    super(props);
    const { filter } = props.store;
    this.state = {
      name: filter.listFilter.name || '',
      size: filter.listFilter.size || '',
      tag: filter.listFilter.tag || '',
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps) {
      const { filter } = nextProps.store;
      this.setState({
        name: filter.listFilter.name || '',
        size: filter.listFilter.size || '',
        tag: filter.listFilter.tag || '',
      });
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  filterActor () {
    const newFilter = {
      name: this.state.name,
      size: this.state.size,
      tag: this.state.tag,
    }
    this.props.dispatch(FilterActions.setListFilter(newFilter));
    this.props.handleFilter(newFilter);
  }
  clearFilter() {
    this.setState({
      name: '',
      size: '',
      tag: '',
    });
    this.props.dispatch(FilterActions.resetListFilter());
  }

  render() {
    const { classes } = this.props;
    return (
      <form className={classes.container} autoComplete='on'>
        <div>
          <TextField
            label='Name'
            variant='outlined'
            className={classes.textField}
            value={this.state.name}
            onChange={this.handleChange('name')}
            margin='normal'
          />
        </div>
        <div>
          <TextField
            label='Size'
            className={classes.textField}
            value={this.state.size}
            onChange={this.handleChange('size')}
            margin='normal'
          />
        </div>
        <div>
          <TextField
            label='Tag'
            className={classes.textField}
            value={this.state.tag}
            onChange={this.handleChange('tag')}
            margin='normal'
          />
        </div>
        <div className={classes.searchButtonWrapper}>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            onClick={this.clearFilter.bind(this)}>
              Clear
          </Button>
          <Button
            variant='contained'
            color='primary'
            className={classes.button}
            onClick={this.filterActor.bind(this)}>
            Search
          <Icon className={classes.rightIcon}>send</Icon>
          </Button>
        </div>
      </form>
    )
  }
}

SearchForm.propTypes = {
  handleFilter: PropTypes.func.isRequired,
}

const mapStoreToProps = store => ({ store })
const mapDispatchToProps = dispatch => ({ dispatch })

const connectedSearchForm = connect(mapStoreToProps, mapDispatchToProps)(SearchForm);
export default withStyles(styles)(connectedSearchForm);