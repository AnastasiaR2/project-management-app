<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
interface Column {
  key: string;
  label: string;
}

const props = defineProps<{
  data: Record<string, string | number>[];
  columns: Column[];
  tableId: string;
  resizable?: boolean;
}>();

const emits = defineEmits<{
  rowSelected: [id: string];
}>();

const columnWidths = ref<{ [key: string]: number }>({});
const tableRef = ref<HTMLTableElement | null>(null);

const storageKey = computed(() => `tableColumnWidths:${props.tableId}`);

onMounted(() => {
  if (!props.resizable || !tableRef.value) return;

  const savedWidths = localStorage.getItem(storageKey.value);
  if (savedWidths) {
    columnWidths.value = JSON.parse(savedWidths);
  } else {
    const headerCells = tableRef.value.querySelectorAll("thead th");
    headerCells.forEach((th, index) => {
      const key = props.columns[index].key;
      columnWidths.value[key] = th.getBoundingClientRect().width;
    });
  }
});

const saveColumnWidths = () => {
  localStorage.setItem(storageKey.value, JSON.stringify(columnWidths.value));
};

const startResizing = (event: MouseEvent, columnKey: string) => {
  const startX = event.pageX;
  const startWidth = columnWidths.value[columnKey];

  const onMouseMove = (e: MouseEvent) => {
    const newWidth = Math.max(50, startWidth + (e.pageX - startX));
    columnWidths.value[columnKey] = newWidth;
  };

  const onMouseUp = () => {
    saveColumnWidths();
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

onBeforeUnmount(() => {
  saveColumnWidths();
});
</script>

<template>
  <div class="table-wrapper">
    <table class="table" ref="tableRef">
      <thead>
        <tr>
          <th
            v-for="(column, i) in columns"
            :key="`${column.key}${i}`"
            :style="{ width: (columnWidths[column.key] || 150) + 'px' }"
          >
            {{ column.label }}
            <span
              v-if="resizable && i !== columns.length - 1"
              class="resize-handle"
              @mousedown="startResizing($event, column.key)"
            ></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id" @click="emits('rowSelected', item.id as string)">
          <td v-for="(column, i) in columns" :key="`${column.key}-${i}`">
            {{ item[column.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.table {
  width: max-content;
  min-width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  background: $color-white;
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  th,
  td {
    padding: 12px;
    border: 1px solid $border-color;
    text-align: left;
  }

  th {
    background-color: $primary-color;
    font-weight: bold;
    color: $color-white;
    position: relative;
  }

  .resize-handle {
    width: 5px;
    height: 100%;
    cursor: col-resize;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
  }

  tr:hover {
    background-color: rgba($primary-color, 0.1);
  }
}
</style>
