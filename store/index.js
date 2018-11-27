import Vuex from "vuex";
import axios from "axios";

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
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
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return axios
          .get("https://nuxt-blog-c487f.firebaseio.com/posts.json")
          .then(res => {
            const postArray = [];
            for (const key in res.data) {
              postArray.push({ ...res.data[key], id: key });
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
        return axios
          .post(
            "https://nuxt-blog-c487f.firebaseio.com/posts.json",
            createdPost
          )
          .then(res => {
            vuexContext.commit("addPost", {
              ...createdPost,
              id: res.data.name
            });
          })
          .catch(error => {
            console.log(error);
          });
      },
      editPost(vuexContext, editedPost) {
        return axios
          .put(
            `https://nuxt-blog-c487f.firebaseio.com/posts/${
              editedPost.id
            }.json`,
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
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      }
    }
  });
};

export default createStore;
