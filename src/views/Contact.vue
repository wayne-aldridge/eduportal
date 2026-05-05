<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  email: '',
  inquiry: '',
  message: '',
})

const submitted = ref(false)

const submitForm = () => {
  submitted.value = true
  form.name = ''
  form.email = ''
  form.inquiry = ''
  form.message = ''
}
</script>

<template>
  <section class="section">
    <div class="container page-gutter">
      <div class="section-heading section-animate narrow">
        <p class="eyebrow">Support Channels</p>
        <h1>CONNECT WITH US</h1>
        <p>
          Our academic support team is ready to assist with enrollment inquiries and course
          information.
        </p>
      </div>

      <div class="contact-shell form-shell">
        <article class="contact-access-panel">
          <p class="eyebrow contact-eyebrow">Direct Access</p>
          <div class="contact-access-block">
            <span>Registry Hub</span>
            <strong>123 Academic Way, Education City</strong>
          </div>
          <div class="contact-access-block">
            <span>Network Node</span>
            <strong>+1 (555) 123-4567</strong>
          </div>
          <div class="contact-access-block">
            <span>Data Relay</span>
            <strong>admissions@eduportal.edu</strong>
          </div>
          <div class="contact-access-block contact-hours">
            <span>Office Hours</span>
            <strong>Monday to Friday</strong>
            <strong>8:00 AM - 5:00 PM</strong>
          </div>
        </article>

        <form class="contact-form-panel" @submit.prevent="submitForm">
          <div class="contact-form-grid">
            <label class="field">
              <span>Full Name</span>
              <input v-model="form.name" type="text" placeholder="Full Name" required />
            </label>
            <label class="field">
              <span>Email Address</span>
              <input v-model="form.email" type="email" placeholder="Email Address" required />
            </label>
          </div>
          <label class="field">
            <span>Nature of Inquiry</span>
            <input v-model="form.inquiry" type="text" placeholder="Nature of inquiry" required />
          </label>
          <label class="field">
            <span>Message</span>
            <textarea
              v-model="form.message"
              rows="5"
              placeholder="Detailed description..."
              required
            ></textarea>
          </label>
          <button class="button button-gold full-width" type="submit">Send Message</button>
          <p v-if="submitted" class="success-message">
            Your inquiry was submitted successfully. Our team will reach out soon.
          </p>
        </form>
      </div>
    </div>
  </section>
</template>
