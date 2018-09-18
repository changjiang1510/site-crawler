import axios from "axios";
const config = require('../config');

const apiBaseURL = config.API_BASE_URL;

const actorApi = {
  crawlActorList(payload) {
    const url = `${apiBaseURL}/api/crawl/list`;
    return axios.get(
      url
    );
  },
  crawlActorDetails(payload) {
    const { actorId } = payload;
    const url = `${apiBaseURL}/api/crawl/details`;
    return axios.get(
      url,
      {
        params: {
          actorId,
        },
      }
    );
  },
}

export default actorApi;
