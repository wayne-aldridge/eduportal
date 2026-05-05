<script setup>
defineProps({
  feature: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <article class="info-card">
    <p class="card-index">0{{ index + 1 }}</p>
    <h3>{{ feature.title }}</h3>
    <p>{{ feature.description }}</p>
  </article>
</template>
