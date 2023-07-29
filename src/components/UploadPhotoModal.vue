<script setup>
import { supabase } from "../supabase";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/users";
const visible = ref(false);
const caption = ref("");
const file = ref(null);
const errorMsg = ref("");
const loading = ref(false);
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const props = defineProps(["addNewPost"]);
const showModal = () => {
  visible.value = true;
};

const handleOk = async () => {
  loading.value = true;
  const fileName = Math.floor(Math.random() * 10000000000);
  let filePath;
  if (file.value) {
    const { data, error } = await supabase.storage
      .from("images")
      .upload("/public/" + fileName, file.value);

    if (error) {
      loading.value = false;
      return (errorMsg.value = "Unable to upload image");
    }

    filePath = data.path;

    await supabase.from("posts").insert({
      url: data.path,
      caption: caption.value,
      owner_id: user.value.id,
    });
  }
  props.addNewPost({
    url: filePath,
    caption: caption.value,
  });
  loading.value = false;
  visible.value = false;
  caption.value = "";
};

const handleUploadChange = (e) => {
  if (e.target.files[0]) {
    file.value = e.target.files[0];
  }
};
</script>
<template>
  <div>
    <AButton @click="showModal">Upload Photo</AButton>
    <AModal v-model:visible="visible" title="Upload Photo" @ok="handleOk">
      <div v-if="!loading">
        <input type="file" accept=".jpg,.png" @change="handleUploadChange" />
        <AInput
          v-model:value="caption"
          placeholder="Caption.."
          :maxlength="50"
        />
        <ATypographyText v-if="errorMsg" type="danger">
          {{ errorMsg }}
        </ATypographyText>
      </div>
      <div class="spinner" v-else>
        <ASpin />
      </div>
    </AModal>
  </div>
</template>
<style scoped>
input {
  margin-top: 10px;
}
.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
