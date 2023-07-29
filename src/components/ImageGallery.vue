<script setup>
const { posts } = defineProps(["posts"]);
const { VITE_SUPABASE_STORAGE_URL } = import.meta.env;
</script>
<template>
  <div class="imagegallery-container">
    <img
      v-for="post in posts"
      :key="post.id"
      :src="`${VITE_SUPABASE_STORAGE_URL}/${post.url}`"
    />
  </div>
</template>
<style scoped>
.imagegallery-container {
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
}

img {
  margin: 5px;
  width: 200px;
}
</style>
