<template>
  <VDialog v-model="showModal" max-width="450">
    <VCard>
      <VCardTitle>{{ reusableData.confirmDialog?.title ?? "Confirm" }}</VCardTitle>

      <VCardText>
        <VContainer fluid>
          <VRow v-if="reusableData.confirmDialog?.body">
            <!-- eslint-disable-next-line vue/no-v-html, vue/no-v-text-v-html-on-component -->
            <VCol v-if="reusableData.confirmDialog?.asHtml" v-html="reusableData.confirmDialog.body" />
            <VCol v-else>{{ reusableData.confirmDialog.body }}</VCol>
          </VRow>

          <VRow v-if="reusableData.confirmDialog?.confirmText">
            <VCol>
              <VCheckbox v-model="confirm" :color="reusableData.confirmDialog?.buttonConfirmColor ?? 'primary'">
                <template #label>
                  {{ reusableData.confirmDialog?.confirmText }}
                </template>
              </VCheckbox>
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn variant="text" @click="cancelDialog">
          {{ reusableData.confirmDialog?.buttonCancel ?? $t("common.cancel") }}
        </VBtn>
        <VBtn
          variant="text"
          :color="reusableData.confirmDialog?.buttonConfirmColor ?? 'primary'"
          :disabled="disableConfirm"
          @click="confirmDialog"
        >
          {{ reusableData.confirmDialog?.buttonConfirm ?? "Confirm" }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
const reusableData = useReusableContents();

const confirm = ref(false);
const showModal = computed({
  get: () => reusableData.confirmDialog !== undefined,
  set: (value) => {
    if (!value) {
      reusableData.confirmDialog = undefined;
    }
  },
});
const disableConfirm = computed(() => {
  return Boolean(reusableData.confirmDialog?.confirmText && !confirm.value);
});

function confirmDialog() {
  reusableData.confirmDialog?.onConfirm();
  nextTick(() => {
    confirm.value = false;
    showModal.value = false;
  });
}

function cancelDialog() {
  confirm.value = false;
  showModal.value = false;
}

watch(
  () => reusableData.confirmDialog,
  (data) => {
    if (data) {
      confirm.value = false;
    }
  }
);
</script>
