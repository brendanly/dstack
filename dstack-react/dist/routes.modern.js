var routes = {
  notFound: function notFound() {
    return '/404';
  },
  auth: function auth() {
    return '/auth';
  },
  authLogin: function authLogin() {
    return '/auth/login';
  },
  verifyUser: function verifyUser() {
    return '/auth/verify';
  },
  stacks: function stacks(user) {
    if (user === void 0) {
      user = ':user';
    }

    return "/" + user;
  },
  stackDetails: function stackDetails(user, id) {
    if (user === void 0) {
      user = ':user';
    }

    if (id === void 0) {
      id = ':stack';
    }

    return "/" + user + "/" + id + (id === ':stack' ? '+' : '');
  },
  reports: function reports(user) {
    if (user === void 0) {
      user = ':user';
    }

    return "/" + user + "/d";
  },
  reportsDetails: function reportsDetails(user, id) {
    if (user === void 0) {
      user = ':user';
    }

    if (id === void 0) {
      id = ':id';
    }

    return "/" + user + "/d/" + id;
  },
  jobs: function jobs(user) {
    if (user === void 0) {
      user = ':user';
    }

    return "/" + user + "/j";
  },
  jobsDetails: function jobsDetails(user, id) {
    if (user === void 0) {
      user = ':user';
    }

    if (id === void 0) {
      id = ':id';
    }

    return "/" + user + "/j/" + id;
  },
  settings: function settings() {
    return '/settings';
  }
};

export default routes;
//# sourceMappingURL=routes.modern.js.map
