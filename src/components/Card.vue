<script setup>
const { user } = defineProps(["user"]);
const { VITE_SUPABASE_STORAGE_URL } = import.meta.env;
</script>
<template>
  <ACard hoverable style="width: 240px">
    <template #cover>
      <img
        :alt="user.username"
        :src="`${VITE_SUPABASE_STORAGE_URL}/${user.url}`"
      />
    </template>
    <ACardMeta :title="user.username">
      <template #description>{{ user.caption }}</template>
    </ACardMeta>
  </ACard>
</template>
<style scoped></style>
