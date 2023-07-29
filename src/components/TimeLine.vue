<script setup>
import Container from "./Container.vue";
import Cards from "./Cards.vue";
import { useUserStore } from "../stores/users";
import { storeToRefs } from "pinia";
import LoginMsg from "./LoginMsg.vue";
const userStore = useUserStore();

const { user, loadingUser } = storeToRefs(userStore);
</script>
<template>
  <Container>
    <div v-if="!loadingUser">
      <Cards v-if="user" />
      <LoginMsg v-else />
    </div>
    <div v-else class="timeline-spinner">
      <ASpin />
    </div>
  </Container>
</template>
<style>
.timeline-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
}
.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0px;
  align-items: center;
  justify-content: center;
}
</style>
