<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import AdminPostForm from '@/components/Admin/AdminPostForm'

export default {
  layout: 'admin',
  components: {
    AdminPostForm
  },
  asyncData(context) {
    return axios.get(`https://nuxt-blog-c487f.firebaseio.com/posts/${context.params.postId}.json`)
      .then((res) => {
        return {
          loadedPost: res.data
        }
      })
      .catch((error) => {
        console.log(error);
        context.error(error);
      })
  },
  methods: {
    onSubmitted(editedPost) {
      axios.put(`https://nuxt-blog-c487f.firebaseio.com/posts/${this.$route.params.postId}.json`, editedPost)
        .then((res) => {
          console.log(res.status);
          this.$router.push('/admin');
        })
        .catch((err) => {
          console.log(err);
        })
      console.log('onSubmitted');
    }
  }
}
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>
