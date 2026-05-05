<script setup>
import { computed, ref } from 'vue'
import CourseCard from '../components/CourseCard.vue'
import { courses } from '../data/mockData'

const searchTerm = ref('')
const selectedCluster = ref('All Clusters')

const clusters = ['All Clusters', ...new Set(courses.map((course) => course.category))]

const filteredCourses = computed(() =>
  courses.filter((course) => {
    const matchesSearch = `${course.title} ${course.description}`
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase())
    const matchesCategory =
      selectedCluster.value === 'All Clusters' || course.category === selectedCluster.value
    return matchesSearch && matchesCategory
  }),
)
</script>

<template>
  <section class="section">
    <div class="container container-wide page-gutter">
      <div class="catalog-head section-animate">
        <div class="catalog-title">
          <p class="eyebrow">Academic Catalog</p>
          <h1>AVAILABLE COURSES</h1>
        </div>

        <div class="filter-bar compact-filters">
          <label class="field">
            <span class="sr-only">Search courses</span>
            <input v-model="searchTerm" type="search" placeholder="Search courses..." />
          </label>

          <label class="field cluster-field">
            <span class="sr-only">Filter by cluster</span>
            <select v-model="selectedCluster">
              <option v-for="cluster in clusters" :key="cluster" :value="cluster">
                {{ cluster }}
              </option>
            </select>
          </label>
        </div>
      </div>

      <div class="card-grid three-up catalog-grid content-grid">
        <CourseCard v-for="course in filteredCourses" :key="course.title" :course="course" />
      </div>
    </div>
  </section>
</template>
