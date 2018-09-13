import axios from "axios";

const apiBaseURL = 'http://localhost:3333';

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
