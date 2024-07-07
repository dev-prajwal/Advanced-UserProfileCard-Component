import { createStore } from 'vuex'
import axios from 'axios'

const store = createStore({
  modules: {
    users: {
      namespaced: true,
      state: {
        userDetails: {},
        userPosts: []
      },
      mutations: {
        SET_USER_DETAILS(state, userDetails) {
          state.userDetails = userDetails
        },
        SET_USER_POSTS(state, userPosts) {
          state.userPosts = userPosts
        }
      },
      actions: {
        async fetchUserDetails({ commit }, userId) {
          try {
            const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`)
            commit('SET_USER_DETAILS', response.data)
          } catch (error) {
            console.error('Error fetching User Details:', error)
          }
        },
        async fetchUserPosts({ commit }, userId) {
          try {
            const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
            commit('SET_USER_POSTS', response.data)
          } catch (error) {
            console.error('Error fetching User Posts:', error)
          }
        }
      },
      getters: {
        getUserDetails: state => state.userDetails,
        getUserPosts: state => state.userPosts
      }
    }
  }
});

export default store;
