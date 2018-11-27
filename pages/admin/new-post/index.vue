<template>
  <div class="admin-new-post-page">
    <section class="new-post-form">
      <AdminPostForm @submit="onSubmitted"/>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import AdminPostForm from "@/components/Admin/AdminPostForm";

export default {
  layout: "admin",
  components: {
    AdminPostForm
  },
  methods: {
    onSubmitted(postData) {
      console.log(postData);
      axios
        .post("https://nuxt-blog-c487f.firebaseio.com/posts.json", {
          ...postData,
          updatedDate: new Date()
        })
        .then(result => {
          console.log(result);
          this.$router.push('/admin');
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
.new-post-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .new-post-form {
    width: 500px;
  }
}
</style>

