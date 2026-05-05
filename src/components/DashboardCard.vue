<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="dashboard-card">
    <div class="dashboard-card-icon" aria-hidden="true">{{ item.icon || '•' }}</div>
    <div class="dashboard-card-copy">
      <p class="dashboard-card-label">{{ item.label }}</p>
      <h3>{{ item.value }}</h3>
    </div>
  </article>
</template>
