<template>
  <VMenu location="bottom">
    <template #activator="{ props: dataBind }">
      <VBtn icon v-bind="dataBind" @click.prevent="">
        <VIcon>mdi-view-grid-plus</VIcon>
      </VBtn>
    </template>

    <VList>
      <VListGroup v-model="selection">
        <VListItem v-for="size in sizes" :key="size" @click="selection = size">
          <VListItemTitle>{{ size }}</VListItemTitle>
        </VListItem>
      </VListGroup>
    </VList>
  </VMenu>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const sizes = [20, 50, 100, 200, 500];

const selection = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
