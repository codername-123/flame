<script setup>
import { onMounted, ref } from "vue";
const observer = ref(null);
const root = ref(null);
const emit = defineEmits(["intersect"]);
onMounted(() => {
  observer.value = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) {
      emit("intersect");
    }
  });
  observer.value.observe(root.value);
});
</script>
<template>
  <div class="observer" ref="root"></div>
</template>
<style scoped>
.observer {
  width: 10px;
  height: 10px;
}
</style>
