const mutations = {

  updateUser: (state, newInfo) => {
    state.user = newInfo
  },
  updateAccessToken: (state, newInfo) => {
    state.accessToken = newInfo
  },
  updateRedirectTo: (state, newInfo) => {
    state.redirectTo = newInfo
  },
  setAccessToken: (state, newInfo) => {
    // ToDo: set token
    // axios.defaults.headers.common.Authorization = 'Bearer ' + newInfo
  }
}

export default mutations
