<script setup>
import { storeToRefs } from "pinia";
import { reactive, ref } from "vue";
import { useUserStore } from "../stores/users";

const userStore = useUserStore();
const { errorMsg, loading, user } = storeToRefs(userStore);
// Reactive State
const visible = ref(false);
const userCredentials = reactive({
  email: "",
  password: "",
  username: "",
});
// Props
const { isLogin } = defineProps(["isLogin"]);

// Variables
const title = isLogin ? "Login" : "SignUp";

// Event Handlers
const showModal = () => {
  visible.value = true;
};

const clearUserCredentials = () => {
  userCredentials.email = "";
  userCredentials.password = "";
  userCredentials.username = "";
  userStore.clearErrorMsg();
};

const handleOk = async (e) => {
  if (isLogin) {
    await userStore.handleLogin({
      password: userCredentials.password,
      email: userCredentials.email,
    });
  } else {
    await userStore.handleSignup(userCredentials);
  }

  if (user.value) {
    visible.value = false;
    clearUserCredentials();
  }
};

const handleCancel = () => {
  clearUserCredentials();
  visible.value = false;
};
</script>

<template>
  <div>
    <AButton type="primary" @click="showModal">{{ title }}</AButton>
    <AModal v-model:visible="visible" :title="title" @ok="handleOk">
      <template #footer>
        <AButton key="back" @click="handleCancel">Cancel</AButton>
        <AButton
          key="submit"
          type="primary"
          :disabled="loading"
          :loading="loading"
          @click="handleOk"
        >
          Submit
        </AButton>
      </template>
      <div class="input-conainer" v-if="!loading">
        <AInput
          class="input"
          v-if="!isLogin"
          v-model:value="userCredentials.username"
          placeholder="UserName"
        />
        <AInput
          class="input"
          v-model:value="userCredentials.email"
          placeholder="Email"
        />
        <AInput
          class="input"
          v-model:value="userCredentials.password"
          placeholder="Password"
          type="password"
        />
      </div>
      <div v-else class="spinner">
        <ASpin />
      </div>

      <ATypographyText v-if="errorMsg" type="danger">
        {{ errorMsg }}
      </ATypographyText>
    </AModal>
  </div>
</template>
<style scoped>
.input {
  margin-top: 5px;
}

.input-container {
  height: 120px;
}

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}
</style>
