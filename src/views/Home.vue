<script setup>
import { RouterLink } from 'vue-router'
import FeatureCard from '../components/FeatureCard.vue'
import { featureCards } from '../data/mockData'
import heroImage from '../assets/hero.jpeg'
</script>

<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-stage">
        <div class="hero-copy section-animate">
          <p class="eyebrow">EduPortal Gateway</p>
          <h1 class="hero-title">
            STUDENT ENROLLMENT &amp;
            <span>MANAGEMENT SYSTEM</span>
          </h1>
          <p class="hero-subtitle">
            A simple and organized digital platform that helps students view available courses,
            submit enrollment forms, and access their academic information in one place.
          </p>

          <div class="hero-actions">
            <RouterLink class="button button-dark" to="/courses">View Courses</RouterLink>
            <RouterLink class="button button-gold" to="/enrollment">Enroll Now</RouterLink>
          </div>
        </div>

        <div class="hero-visual section-animate">
          <div class="hero-accent-shape" aria-hidden="true"></div>
          <div class="hero-image-card">
            <img
              :src="heroImage"
              alt="Student using laptop for online enrollment"
              class="hero-image"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="section surface">
      <div class="container">
        <div class="section-heading section-animate">
          <p class="eyebrow">Platform Features</p>
          <h2>Built for a smoother student journey</h2>
        </div>

        <div class="card-grid four-up">
          <FeatureCard
            v-for="(feature, index) in featureCards"
            :key="feature.title"
            :feature="feature"
            :index="index"
          />
        </div>
      </div>
    </section>
  </div>
</template>
