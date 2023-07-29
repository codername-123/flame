<script setup>
import UploadPhotoModal from "./UploadPhotoModal.vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../stores/users";
import { supabase } from "../supabase";
import { storeToRefs } from "pinia";
const props = defineProps([
  "user",
  "userInfo",
  "addNewPost",
  "isFollowing",
  "updateIsFollowing",
]);
const route = useRoute();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { username: profileUserName } = route.params;
const followUser = async () => {
  props.updateIsFollowing(true);
  await supabase.from("followers_following").insert({
    follower_id: user.value.id,
    following_id: props.user.id,
  });
};
const unfollowUser = async () => {
  props.updateIsFollowing(false);
  await supabase
    .from("followers_following")
    .delete()
    .eq("follower_id", user.value.id)
    .eq("following_id", props.user.id);
};
</script>
<template>
  <div class="userbar-container" v-if="props.user">
    <div class="top-content">
      <ATypographyTitle :level="2">{{ props.user.username }}</ATypographyTitle>
      <div v-if="user">
        <UploadPhotoModal
          v-if="profileUserName === user.username"
          :addNewPost="addNewPost"
        />
        <div v-else>
          <AButton v-if="!props.isFollowing" @click="followUser">
            Follow
          </AButton>
          <AButton v-else @click="unfollowUser">Following</AButton>
        </div>
      </div>
    </div>
    <div class="bottom-content">
      <ATypographyTitle :level="5">
        {{ userInfo.posts }} Posts
      </ATypographyTitle>
      <ATypographyTitle :level="5">
        {{ userInfo.followers }} followers
      </ATypographyTitle>
      <ATypographyTitle :level="5">
        {{ userInfo.following }} following
      </ATypographyTitle>
    </div>
  </div>
  <div class="userbar-container" v-else>
    <div class="top-content">
      <ATypographyTitle :level="2"> User Not Found</ATypographyTitle>
    </div>
  </div>
</template>
<style scoped>
.userbar-container {
  padding-bottom: 75px;
}

.top-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bottom-content {
  display: flex;
  align-items: center;
  gap: 30px;
}

.bottom-content h5 {
  margin: 0 !important;
  padding: 0;
}
</style>
