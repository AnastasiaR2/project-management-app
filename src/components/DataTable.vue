<script setup lang="ts">
interface Column {
  key: string;
  label: string;
}

defineProps<{
  data: Record<string, string | number>[];
  columns: Column[];
}>();
</script>

<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th v-for="(column, i) in columns" :key="`${column.key}${i}`">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td v-for="(column, i) in columns" :key="`${column.key}-${i}`">
            {{ item[column.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss">
.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  th,
  td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #007bff;
    font-weight: bold;
    color: white;
  }

  tr:hover {
    background-color: rgba(#f8f9fa, 0.7);
  }
}
</style>
