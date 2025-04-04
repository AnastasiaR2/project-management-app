<script setup lang="ts">
import ProjectsTable from "@/components/ProjectsTable.vue";
</script>

<template>
  <main>
    <h1 class="project-title">Projects</h1>
    <ProjectsTable />
  </main>
</template>

<style lang="scss">
.project-title {
  margin-bottom: 10px;
}
</style>
