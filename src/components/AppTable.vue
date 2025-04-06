<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import TableActions from "./TableActions.vue";
import { APP_MAX_WIDTH } from "@/constants/ui";

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

const emit = defineEmits<{
  rowSelected: [id: string];
  edit: [item: Record<string, string | number>];
  delete: [id: string];
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
            :style="{
              width: (columnWidths[column.key] || APP_MAX_WIDTH / columns.length) + 'px',
            }"
          >
            {{ column.label }}
            <span
              v-if="resizable"
              class="resize-handle"
              @mousedown="startResizing($event, column.key)"
            ></span>
          </th>
        </tr>
      </thead>
      <slot v-if="$slots.tableBody" name="tableBody" />
      <tbody v-else>
        <tr v-for="item in data" :key="item.id" @click="emit('rowSelected', item.id as string)">
          <td v-for="(column, i) in columns" :key="`${column.key}-${i}`">
            <template v-if="column.key === 'actions'">
              <TableActions :item @edit="emit('edit', $event)" @delete="emit('delete', $event)" />
            </template>
            <template v-else>
              {{ item[column.key] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
