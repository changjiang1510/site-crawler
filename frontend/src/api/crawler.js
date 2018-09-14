import axios from "axios";

const apiBaseURL = 'http://localhost:3333';

const actorApi = {
  crawlActorList(payload) {
    const url = `${apiBaseURL}/api/crawl/list`;
    return axios.get(
      url
    );
  },
}

export default actorApi;
