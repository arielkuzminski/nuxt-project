import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts;
      },
      addPost(state, post) {
        state.loadedPosts.push(post);
      },
      editPost(state, editPost) {
        const postIndex = state.loadedPosts.findIndex(
          post => post.id === editPost.id
        );
        state.loadedPosts[postIndex] = editPost;
      },
      setToken(state, token) {
        state.token = token;
      },
      clearToken(state) {
        state.token = null;
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return context.app.$axios
          .$get("/posts.json")
          .then(res => {
            const postArray = [];
            for (const key in res) {
              postArray.push({ ...res[key], id: key });
            }
            vuexContext.commit("setPosts", postArray);
          })
          .catch(e => context.error(e));
      },
      addPost(vuexContext, postData) {
        const createdPost = {
          ...postData,
          updatedDate: new Date()
        };
        return this.$axios
          .$post(
            `/posts.json?auth=${vuexContext.state.token}`,
            createdPost
          )
          .then(res => {
            vuexContext.commit("addPost", {
              ...createdPost,
              id: res.name
            });
          })
          .catch(error => {
            console.log(error);
          });
      },
      editPost(vuexContext, editedPost) {
        return this.$axios
          .$put(
            `/posts/${
              editedPost.id
            }.json?auth=${vuexContext.state.token}`,
            editedPost
          )
          .then(res => {
            vuexContext.commit('editPost', editedPost);
          })
          .catch(err => {
            console.log(err);
          });
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit("setPosts", posts);
      },
      authenticateUser(vuexContext, authData) {
        let authUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' +
        process.env.fbAPIKey;
        if (!authData.isLogin) {
            return this.$axios.$post(authUrl, {
              email: authData.email,
              password: authData.password,
              returnSecureToken: true,
            }
          ).then(result => {
            vuexContext.commit('setToken', result.idToken);
            vuexContext.dispatch('setLogoutTime', result.expiresIn * 1000);
            this.$router.push('/admin');
          }).catch(e => {
            console.log(e);
          });
        } else {
          authUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' +
            process.env.fbAPIKey;
          return this.$axios.$post(authUrl, {
              email: authData.email,
              password: authData.password,
              returnSecureToken: true,
            }
          ).then(result => {
            vuexContext.commit('setToken', result.idToken);
            vuexContext.dispatch('setLogoutTime', result.expiresIn * 1000);
            this.$router.push('/admin');
          }).catch(e => {
            console.log(e);
          });
        }
      },
      setLogoutTimer(vuexContext, duration) {
        setTimeout(() => {
          vuexContext.commit('clearToken');
        }, duration)
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
      isAuthenticated(state) {
        return state.token != null;
      }
    }
  });
};

export default createStore;
