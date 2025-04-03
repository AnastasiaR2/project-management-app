<script setup lang="ts">
import { defineProps } from "vue";

interface Column {
  key: string;
  label: string;
}

defineProps<{
  data: Record<string, unknown>[];
  columns: Column[];
}>();
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="(column, i) in columns" :key="`${column.key}-${i}`">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id as string">
          <td v-for="(column, i) in columns" :key="`${column.key}${i}`">
            {{ item[column.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
