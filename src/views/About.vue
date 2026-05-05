<script setup>
import { aboutHighlights, aboutStats } from '../data/mockData'
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-heading section-animate narrow">
        <p class="eyebrow">Educational Context</p>
        <h1>REDEFINING STUDENT MANAGEMENT</h1>
        <p>
          EduPortal is a digital education platform designed to simplify student enrollment,
          course browsing, and academic information access.
        </p>
      </div>

      <div class="about-card-grid">
        <article v-for="item in aboutHighlights" :key="item.title" class="about-info-card">
          <div class="about-icon" aria-hidden="true">{{ item.icon }}</div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>

      <section class="mission-band">
        <div class="mission-copy">
          <h2>OUR MISSION</h2>
          <p>
            To empower educational institutions with tools that foster transparency,
            efficiency, and student success in a rapidly evolving digital world.
          </p>
        </div>

        <div class="mission-stats">
          <article v-for="item in aboutStats" :key="item.label" class="mission-stat-card">
            <h3>{{ item.value }}</h3>
            <p>{{ item.label }}</p>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>
