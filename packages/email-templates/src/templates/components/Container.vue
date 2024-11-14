<template>
  <BaseContainer :style="containerStyle">
    <slot />
  </BaseContainer>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { Container as BaseContainer } from '@vue-email/components'

const containerStyle: CSSProperties = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
}
</script>
