<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="timeline-card">
    <div class="timeline-dot" aria-hidden="true"></div>
    <div class="timeline-content">
      <div class="timeline-head">
        <p class="timeline-year">{{ item.year }}</p>
        <span class="timeline-badge">{{ item.badge }}</span>
      </div>
      <h3>{{ item.title }}</h3>
      <p>{{ item.description }}</p>
    </div>
  </article>
</template>
