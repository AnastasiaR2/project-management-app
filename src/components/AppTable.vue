<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import TableActions from "./TableActions.vue";
import { APP_MAX_WIDTH } from "@/constants/ui";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
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

const sort = ref<{ key: string; order: "asc" | "desc" } | null>(null);

function toggleSort(column: Column) {
  if (!column.sortable) return;

  if (sort.value?.key === column.key) {
    sort.value.order = sort.value.order === "asc" ? "desc" : "asc";
  } else {
    sort.value = { key: column.key, order: "asc" };
  }
}

const filteredAndSortedData = computed(() => {
  const result = [...props.data];

  // Filtering logic

  if (sort.value?.key) {
    result.sort((a, b) => {
      const valA = a[sort.value!.key];
      const valB = b[sort.value!.key];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === "number" && typeof valB === "number") {
        return sort.value!.order === "asc" ? valA - valB : valB - valA;
      }

      return sort.value!.order === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }

  return result;
});

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
            @click="toggleSort(column)"
            :class="{ 'sortable-header': column.sortable }"
          >
            <div class="header-content">
              {{ column.label }}
              <span v-if="column.sortable" class="sort-icon">
                <template v-if="sort?.key === column.key">
                  <span v-if="sort.order === 'asc'">▲</span>
                  <span v-else>▼</span>
                </template>
                <span v-else class="dimmed">↕</span>
              </span>
            </div>
            <span
              v-if="resizable"
              class="resize-handle"
              @mousedown="startResizing($event, column.key)"
            ></span>
          </th>
        </tr>
      </thead>
      <slot v-if="$slots.tableBody" name="tableBody" :data="filteredAndSortedData" />
      <tbody v-else>
        <tr v-if="filteredAndSortedData.length === 0">
          <td :colspan="columns.length" class="empty-row">No items to display.</td>
        </tr>
        <tr
          v-else
          v-for="item in filteredAndSortedData"
          :key="item.id"
          @click="emit('rowSelected', item.id as string)"
        >
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

<style scoped lang="scss">
.sortable-header {
  cursor: pointer;
  user-select: none;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sort-icon {
  font-size: 0.75rem;
  margin-left: 0.25rem;
}

.sort-icon .dimmed {
  opacity: 0.3;
}
</style>
