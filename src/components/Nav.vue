<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useUserStore } from "../stores/users";
import AuthModel from "./AuthModal.vue";
import Container from "./Container.vue";

// Reactive State
const userStore = useUserStore();
const { user, loadingUser } = storeToRefs(userStore);
const userName = ref("");
// const isAuthenticated = ref(false);

const router = useRouter();

const handleLogOut = async () => {
  await userStore.handleLogout();
};

const onSearch = () => {
  if (userName.value) {
    router.push(`/profile/${userName.value}`);
  }
  userName.value = "";
};

const goToUserProfile = () => {
  router.push(`/profile/${user.value.username}`);
};
</script>
<template>
  <ALayoutHeader>
    <Container>
      <div class="nav-container">
        <div class="left-content">
          <RouterLink to="/">Flame</RouterLink>
          <AInputSearch
            v-model:value="userName"
            placeholder="user name"
            style="width: 200px"
            @search="onSearch"
          />
        </div>
        <div v-if="!loadingUser">
          <div class="right-content" v-if="!user">
            <AuthModel :isLogin="false" />
            <AuthModel :isLogin="true" />
          </div>
          <div class="right-content" v-else>
            <AButton type="primary" @click="goToUserProfile">Profile</AButton>
            <AButton type="primary" @click="handleLogOut">LogOut</AButton>
          </div>
        </div>
      </div>
    </Container>
  </ALayoutHeader>
</template>
<style scoped>
.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  display: flex;
  align-items: center;
}

.left-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.right-content {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
