import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography, Button, CircularProgress, Chip } from '@material-ui/core';
import DoneOutlined from '@material-ui/icons/DoneOutlined';

import ActorActions from '../actions/actor';
import CrawlerActions from '../actions/crawler';

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
  chip: {
    margin: theme.spacing.unit,
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
  getCrawlStatusFromStore() {
    const { crawler } = this.props.store
    return crawler.crawlStatus;
  }
  triggerCrawler() {
    const {
      dispatch,
      match: {
        params: { actorId },
      }
    } = this.props;
    this.props.dispatch(CrawlerActions.crawlActorDetails({ actorId }));
  }
  handleTagClick(event, tag) {
    const { target } = event;
    console.log(tag);
  }
  displayProgress() {
    const crawlStatus = this.getCrawlStatusFromStore();
    const { classes } = this.props;
    switch (crawlStatus) {
      case 'processing':
        return <CircularProgress className={classes.progress} />;
      case 'done':
        return <DoneOutlined />;
      default:
        return '';
    }
  }
  render() {
    const { classes } = this.props;
    const profile = this.getDetailsFromStore();
    const crawlStatus = this.getCrawlStatusFromStore();
    if (profile && profile.name) {
      return (<Paper className={classes.root}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginRight: '20px' }}
            disabled={crawlStatus === 'processing'}
            onClick={this.triggerCrawler.bind(this)}
          >
            Crawl
          </Button>
          {this.displayProgress()}
        </div>
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
                  <Typography color='textSecondary'>
                    <span>Tag: </span>
                    {profile.tags.map((tag, i)  => (
                      <Chip
                        key={i}
                        label={tag}
                        onClick={ (e) => this.handleTagClick(e, tag)}
                        className={classes.chip}
                        variant='outlined'
                        component='span'
                      />)
                    )}
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
