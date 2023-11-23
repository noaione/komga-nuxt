<template>
  <VMenu v-if="user.isAdmin" v-model="menuState" location="bottom">
    <template #activator="{ props: dataBind }">
      <VBtn icon v-bind="dataBind" @click.prevent="">
        <VIcon>mdi-dots-vertical</VIcon>
      </VBtn>
    </template>

    <VList density="compact">
      <VListItem class="list-danger" @click="promptDelete">
        <VListItemTitle>{{ $t("menu.delete") }}</VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>

<script setup lang="ts">
const props = defineProps<{
  item: KomgaItemWrapped;
  oneshotMode?: boolean;
  modelValue?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const user = useKomgaUser();
const menuState = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

function promptDelete() {
  if (props.item.type === "readlist") {
    promptDeleteReadList();
  } else if (props.item.type === "collection") {
    promptDeleteCollection();
  }
}

function promptDeleteReadList() {
  if (props.item.type !== "readlist") {
    return;
  }

  // Dispatch dialog
  menuState.value = false;
}

function promptDeleteCollection() {
  if (props.item.type !== "collection") {
    return;
  }

  // Dispatch dialog
  menuState.value = false;
}
</script>
