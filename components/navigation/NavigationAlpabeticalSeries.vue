<template>
  <div :class="$props.class">
    <VTooltip v-for="symbol in symbols" :key="symbol" :disabled="groupCount === undefined">
      <template #activator="{ props: dataBind }">
        <VBtn
          v-bind="dataBind"
          icon
          variant="text"
          size="small"
          :color="symbol === selected ? 'yellow' : ''"
          @click="$emit('select', symbol)"
        >
          {{ symbol }}
        </VBtn>
      </template>
      {{ getSymbolCount(symbol) }}
    </VTooltip>
  </div>
</template>

<script setup lang="ts">
import type { KomgaComponents } from "#imports";

const props = withDefaults(
  defineProps<{
    class?: string;
    symbols: string[];
    selected?: string;
    groupCount?: KomgaComponents["schemas"]["GroupCountDto"][];
  }>(),
  {
    symbols: () => [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ],
    selected: undefined,
    groupCount: undefined,
    class: undefined,
  }
);

defineEmits<{
  (e: "select", symbol: string): void;
}>();

function getSymbolCount(symbol: string) {
  if (props.groupCount === undefined) return;

  const found = props.groupCount.find((g) => g.group.toLowerCase() === symbol.toLowerCase());

  return found?.count ?? 0;
}
</script>
