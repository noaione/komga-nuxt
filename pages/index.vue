<script setup lang="ts">
const auth = useKomgaUser();
const router = useRouter();

onMounted(() => {
  if (auth.authenticated) {
    router.push("/startup?redirect=/dashboard");
  } else {
    router.push("/startup?redirect=/");
  }
});

definePageMeta({
  layout: "fullpage",
});
</script>
