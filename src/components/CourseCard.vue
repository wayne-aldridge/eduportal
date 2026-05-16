<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  course: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="course-card">
    <img class="course-image" :src="course.image" :alt="course.alt" />
    <div class="course-card-body">
      <span class="badge">{{ course.category }}</span>
      <h3>{{ course.title }}</h3>
      <p>{{ course.description }}</p>
      <div class="course-card-footer">
        <div class="course-meta course-meta-inline">
          <span>{{ course.duration }}</span>
        </div>
        <RouterLink class="course-enroll-link" :to="`/enrollment?course=${encodeURIComponent(course.title)}`">
          Enroll Now
        </RouterLink>
      </div>
    </div>
  </article>
</template>
