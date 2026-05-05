<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <div class="brand footer-brand">
          <span class="brand-mark">🎓</span>
          <span class="brand-name">EduPortal</span>
        </div>
        <p class="footer-copy">
          A simple student management platform for enrollment, course discovery, and academic
          updates.
        </p>
      </div>

      <div>
        <h2 class="footer-title">Quick Links</h2>
        <ul class="footer-list">
          <li><RouterLink to="/courses">All Courses</RouterLink></li>
          <li><RouterLink to="/enrollment">Start Enrollment</RouterLink></li>
          <li><RouterLink to="/about">Our Mission</RouterLink></li>
          <li><RouterLink to="/contact">Get Support</RouterLink></li>
        </ul>
      </div>

      <div>
        <h2 class="footer-title">Contact Us</h2>
        <ul class="footer-list">
          <li>admissions@eduportal.edu</li>
          <li>+1 (555) 123-4567</li>
          <li>123 Academic Way, Education City</li>
        </ul>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>© 2026 EduPortal Student Management System. All rights reserved.</p>
      <div class="footer-meta-links">
        <RouterLink to="/">Privacy Policy</RouterLink>
        <RouterLink to="/">Terms of Service</RouterLink>
        <RouterLink to="/contact">Feedback</RouterLink>
      </div>
    </div>
  </footer>
</template>
