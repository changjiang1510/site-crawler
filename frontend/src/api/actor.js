import axios from "axios";
const config = require('../config');

const apiBaseURL = config.API_BASE_URL;

const actorApi = {
  fetchActorDetails(payload) {
    const { actorId } = payload;
    const url = `${apiBaseURL}/api/actor/details/${actorId}`;

    return axios.get(
      url
    );
  },
  fetchActorList(payload) {
    const url = `${apiBaseURL}/api/actor/list`;
    return axios.get(
      url
    );
  },
}

export default actorApi;
