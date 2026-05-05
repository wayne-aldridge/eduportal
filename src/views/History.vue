<script setup>
import { RouterLink } from 'vue-router'
import TimelineCard from '../components/TimelineCard.vue'
import { historyTimeline } from '../data/mockData'
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-heading section-animate narrow">
        <p class="eyebrow">Evolutionary Path</p>
        <h1>OUR LEGACY &amp; FUTURE</h1>
        <p>
          From manual enrollment procedures to a simplified digital student enrollment experience.
        </p>
      </div>

      <div class="timeline-list">
        <TimelineCard v-for="item in historyTimeline" :key="item.title" :item="item" />
      </div>

      <section class="history-cta">
        <div>
          <h2>A DECADE OF INNOVATION</h2>
          <p>
            We continue to push the boundaries of what is possible in educational technology,
            ensuring students always have the best tools for their journey.
          </p>
        </div>
        <RouterLink class="button button-dark" to="/courses">View Available Courses</RouterLink>
      </section>
    </div>
  </section>
</template>
