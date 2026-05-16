<script setup>
defineProps({
  centered: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div :class="['app-logo', { 'is-centered': centered }]">
    <span class="app-logo-text">EDUPORTAL</span>
  </div>
</template>
