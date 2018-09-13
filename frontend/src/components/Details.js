import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';
import 'react-table/react-table.css'

import ActorActions from '../actions/actor';

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 600,
    padding: theme.spacing.unit * 2,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

class Details extends Component {
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { actorId },
      }
    } = this.props;
    dispatch(ActorActions.getActor({ actorId }));
  }
  getDetailsFromStore() {
    const { actor } = this.props.store
    return actor.profile;
  }
  render() {
    const { classes } = this.props;
    const profile = this.getDetailsFromStore();
    if (profile && profile.name) {
      return (<Paper className={classes.root}>
        <Grid container spacing={16}>
          <Grid item>
            <div>{profile.name}</div>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={16}>
              <Grid item xs>
                <Typography gutterBottom variant="subheading">
                  {`${profile.name} / ${profile.kanaName}`}
                </Typography>
                <Typography gutterBottom>
                  <a href={profile.detailUrl}>URL</a>
                </Typography>
                {profile.tags ? (
                  <Typography color="textSecondary">
                    <span>Tag: </span>
                    {profile.tags.forEach(tag => (<span>{tag}</span>))}
                  </Typography>) : ''}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>)
    } else {
      return 'No data';
    }
  }
}

const mapStoreToProps = store => ({ store })
const mapDispatchToProps = dispatch => ({ dispatch })

const connectedDetails = connect(mapStoreToProps, mapDispatchToProps)(Details);
export default withStyles(styles)(connectedDetails);
