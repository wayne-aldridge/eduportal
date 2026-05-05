<script setup>
import { accountProfile, enrolledCourses } from '../data/mockData'
</script>

<template>
  <section class="dashboard-stack">
    <article class="panel">
      <div class="panel-heading">
        <h2>Profile Information</h2>
      </div>

      <div class="profile-grid">
        <div class="profile-field">
          <span>Name</span>
          <strong>{{ accountProfile.name }}</strong>
        </div>
        <div class="profile-field">
          <span>Email</span>
          <strong>{{ accountProfile.email }}</strong>
        </div>
        <div class="profile-field">
          <span>Student ID</span>
          <strong>{{ accountProfile.studentId }}</strong>
        </div>
        <div class="profile-field">
          <span>Role</span>
          <strong>{{ accountProfile.role }}</strong>
        </div>
        <div class="profile-field">
          <span>Program</span>
          <strong>{{ accountProfile.program }}</strong>
        </div>
        <div class="profile-field">
          <span>Year Level</span>
          <strong>{{ accountProfile.yearLevel }}</strong>
        </div>
      </div>
    </article>

    <article class="panel">
      <div class="panel-heading">
        <h2>Enrolled Course History</h2>
      </div>

      <div class="activity-grid">
        <article v-for="course in enrolledCourses" :key="course.code" class="activity-card">
          <h3>{{ course.code }} · {{ course.title }}</h3>
          <p>{{ course.schedule }}</p>
          <p>{{ course.instructor }}</p>
        </article>
      </div>
    </article>
  </section>
</template>
