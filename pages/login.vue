<template>
  <VContainer :style="{ maxWidth: '550px' }">
    <VRow align="center" justify="center">
      <VImg src="~/assets/logo.svg" :max-width="maxLogoWidth" />
    </VRow>

    <form v-if="!loading" novalidate class="mt-3" @submit.prevent="performLogin">
      <VRow v-if="!claimed" justify="center">
        <VCol class="text-body-1 mt-2">
          <VAlert type="info" icon="mdi-account-plus" variant="tonal" density="compact">
            <!-- eslint-disable-next-line vue/no-v-html, vue/no-v-text-v-html-on-component -->
            <span v-html="$t('login.unclaimed_html')" />
          </VAlert>
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <VTextField
            v-model="formData.login"
            :label="$t('common.email')"
            :error-messages="getErrors('login')"
            :loading="formSubmit"
            :disabled="formSubmit"
            autocomplete="username"
            variant="underlined"
            color="primary"
            autofocus
            @blur="v$.login.$touch()"
          />
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <VTextField
            v-model="formData.password"
            :label="$t('common.password')"
            :error-messages="getErrors('password')"
            :loading="formSubmit"
            :disabled="formSubmit"
            type="password"
            autocomplete="current-password"
            variant="underlined"
            color="primary"
            @blur="v$.password.$touch()"
          />
        </VCol>
      </VRow>

      <VRow class="mt-0">
        <VCheckbox
          v-model="rememberMe"
          :label="$t('common.remember-me')"
          hide-details
          class="mt-0 px-0"
          color="primary"
        />
      </VRow>

      <VRow>
        <VCol v-if="claimed" cols="auto">
          <VBtn color="primary" type="submit" :disabled="formSubmit">{{ $t("login.login") }}</VBtn>
        </VCol>
        <VCol v-if="!claimed" cols="auto">
          <VBtn color="primary" :disabled="formSubmit" @click.prevent="claimServer">
            {{ $t("login.create_user_account") }}
          </VBtn>
        </VCol>
      </VRow>

      <VDivider class="my-4 mt-2" />

      <VRow justify="center">
        <VCol cols="6">
          <LocaleSwitcher />
        </VCol>

        <VCol cols="6">
          <ThemeSwitcher :prepend-icon="themeIcon" />
        </VCol>
      </VRow>
    </form>
  </VContainer>
</template>

<script setup lang="ts">
import { email as vEmail, required as vRequired } from "@vuelidate/validators";

const router = useRouter();
const komgaUsers = useKomgaUser();
const reusables = useReusableContents();

const loading = ref(true);
const formSubmit = ref(false);
const claimed = ref(true);

const colorMode = useColorMode();
const { t } = useI18n();

const themeIcon = computed(() => {
  switch (colorMode.preference) {
    case "light": {
      return "mdi-brightness-7";
    }
    case "dark": {
      return "mdi-brightness-3";
    }
    default: {
      return "mdi-brightness-auto";
    }
  }
});

const formData = ref({
  login: "",
  password: "",
});
const rememberMe = ref(false);

const rules = {
  login: { required: vRequired, email: vEmail },
  password: { required: vRequired },
};

const v$ = useVuelidate(rules, formData);

const maxLogoWidth = computed(() => {
  switch (useDisplay().name.value) {
    case "xs": {
      return 100;
    }
    case "sm": {
      return 100;
    }
    case "md": {
      return 200;
    }
    default: {
      return 300;
    }
  }
});

function getErrors(fieldName: string): string[] {
  const errors = [] as string[];

  const field = v$.value[fieldName];

  if (field && field.$invalid && field.$dirty) {
    if (field?.required?.$invalid) {
      errors.push(t("common.required"));
    }

    if (field?.email?.$invalid) {
      errors.push(t("dialog.add_user.field_email_error"));
    }
  }

  return errors;
}

async function performLogin() {
  if (v$.value.$invalid) {
    return;
  }

  try {
    console.log("Logging in...");
    await komgaUsers.login(formData.value.login, formData.value.password, rememberMe.value);

    const redirect = router.currentRoute.value.query.redirect?.toString();

    const komgaLibraries = useKomgaLibraries();

    await komgaLibraries.fetchLibraries();

    if (redirect) {
      router.push(redirect);
    } else {
      router.push("/");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
  }
}

async function claimServer() {
  if (v$.value.$invalid) {
    return;
  }

  try {
    console.log("Claiming server...");

    const { data, error } = await useKomgaFetch("/api/v1/claim", {
      method: "POST",
      headers: {
        "X-Komga-Email": formData.value.login,
        "X-Komga-Password": formData.value.password,
      },
      baseURL: useKomgaServerUrl().origin,
    });

    if (error.value) {
      reusables.queueSnackbar({
        text: error.value.message,
        timeout: 2500,
        color: "error",
      });
    } else if (data.value) {
      await performLogin();
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      reusables.queueSnackbar({
        text: t("common.error_console"),
        details: error.message,
        timeout: 2500,
        color: "error",
      });
    }
  }
}

onMounted(async () => {
  const { origin } = useKomgaServerUrl();

  try {
    const { data } = await useKomgaFetch("/api/v1/claim", {
      method: "GET",
      baseURL: origin,
    });

    if (data.value) {
      claimed.value = data.value.isClaimed;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      reusables.queueSnackbar({
        text: t("common.error_console"),
        details: error.message,
        timeout: 2500,
        color: "error",
      });
    }
  }

  loading.value = false;
});

definePageMeta({
  layout: "fullpage",
});
</script>
