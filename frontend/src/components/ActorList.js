import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { withStyles } from '@material-ui/core/styles';
import { Button, CircularProgress, Icon } from '@material-ui/core';
import DoneOutlined from '@material-ui/icons/DoneOutlined';
import 'react-table/react-table.css'

import ActorActions from '../actions/actor';
import CrawlerActions from '../actions/crawler';
import TableRow from './TableRow';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

class ActorList extends Component {
  componentDidMount() {
    this.props.dispatch(ActorActions.getActorList());
  }
  getActorListFromStore() {
    const { actor } = this.props.store
    return actor.actorList;
  }
  getCrawlStatusFromStore() {
    const { crawler } = this.props.store
    return crawler.crawlStatus;
  }
  triggerCrawler() {
    this.props.dispatch(CrawlerActions.crawlActorList());
  }
  navToDetails(event, actorInfo) {
    const { target } = event
    const shouldRespond = !target.querySelector('a');
    if (shouldRespond) {
      const { history } = this.props
      history.push(
        `/details/${actorInfo._id}`
      )
    }
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
    const actorList = this.getActorListFromStore();
    const crawlStatus = this.getCrawlStatusFromStore();
    const columns = [{
      Header: 'Name',
      accessor: 'name',
      style: { cursor: 'pointer' },
    },
    {
      Header: 'Kana Name',
      accessor: 'kanaName',
      style: { cursor: 'pointer' },
    },
    {
      Header: 'Url',
      accessor: 'detailUrl',
      Cell: row => (<a href={row.value}>URL</a>)
    }]

    return (
      <div>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center'}}>
          <Button
            variant='contained'
            color='primary'
            style={{marginRight: '20px'}}
            disabled={crawlStatus === 'processing'}
            onClick={this.triggerCrawler.bind(this)}
          >
            Crawl
          </Button>
          {this.displayProgress()}
        </div>
        <ReactTable
          data={actorList}
          columns={columns}
          TrComponent={TableRow}
          getTrProps={(state, rowInfo, column) => {
            return {
              onClick: (e) => {
                this.navToDetails(e, rowInfo.original);
              },
            };
          }}
        />
      </div>
    )
  }
}

const mapStoreToProps = store => ({ store })
const mapDispatchToProps = dispatch => ({ dispatch })

const connectedActorList = connect(mapStoreToProps, mapDispatchToProps)(ActorList);
export default withStyles(styles)(connectedActorList);
