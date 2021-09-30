import axios from "axios";

export function getUserData(userId) {
  return axios.get(`/api/users/getUser?username=${userId}`);
}
