import * as constants from "./constants.js";

import axios from "axios";
import { getToken } from "./tokenStorage.js";
import router from "./router.js";

const api = axios.create();

api.interceptors.request.use(
  // If the request is not for the token endpoint, add the token to the headers.
  function (config) {
    if (config.url !== "/api/token") {
      const token = getToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // If the response is a 401 Unauthorized, redirect to the login page.
    if (
      error.response?.status === 401 &&
      router.currentRoute.value.name !== "login"
    ) {
      const redirectPath = router.currentRoute.value.fullPath;
      router.push({
        name: "login",
        query: { [constants.params.redirect]: redirectPath },
      });
    }
    return Promise.reject(error);
  },
);

export function getConfig() {
  return api.get("/api/config");
}