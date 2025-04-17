<template>
  <div class="spreadsheet-editor">
    <div class="spreadsheet-controls mb-3">
      <div class="buttons">
        <button class="button is-small is-info" @click="addRow">
          <span class="icon is-small">
            <i class="fas fa-plus"></i>
          </span>
          <span>Add Row</span>
        </button>
        <button class="button is-small is-info" @click="addColumn">
          <span class="icon is-small">
            <i class="fas fa-plus"></i>
          </span>
          <span>Add Column</span>
        </button>
      </div>
    </div>

    <div class="spreadsheet-container">
      <div class="table-wrapper">
        <table class="table is-bordered spreadsheet-table">
          <colgroup>
            <col class="row-header-col" />
            <col v-for="(_, index) in localData.headers" :key="index" :style="{ width: columnWidths[index] + 'px' }" />
          </colgroup>
          <thead>
            <tr>
              <th class="row-header">#</th>
              <th 
                v-for="(header, index) in localData.headers" 
                :key="index" 
                class="column-header"
                :class="{ 'resizing': resizingColumn === index }"
              >
                <div class="header-content">
                  <input 
                    type="text" 
                    class="input is-small" 
                    v-model="localData.headers[index]" 
                    @input="emitUpdate"
                  />
                  <button class="button is-small is-danger delete-btn" @click="deleteColumn(index)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <div 
                  class="resize-handle"
                  @mousedown="startResize($event, index)"
                ></div>
              </th>
            </tr>
          </thead>
          <th class="empty-spacer"></th>
          <tbody>
            <tr v-for="(row, rowIndex) in localData.rows" :key="rowIndex">
              <td class="row-header">
                <div class="row-actions">
                  {{ rowIndex + 1 }}
                  <button class="button is-small is-danger delete-row-btn" @click="deleteRow(rowIndex)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
              <td 
                v-for="(cell, cellIndex) in row" 
                :key="cellIndex"
                class="cell"
              >
                <input 
                  type="text" 
                  class="input is-small cell-input" 
                  v-model="localData.rows[rowIndex][cellIndex]" 
                  @input="emitUpdate"
                />
              </td>
              <th class="empty-spacer"></th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="spreadsheet-info mt-3">
      <p class="is-size-7 has-text-grey">
        <strong>Rows:</strong> {{ localData.rows.length }} | 
        <strong>Columns:</strong> {{ localData.headers.length }} |
        <strong>Tip:</strong> Drag column edges to resize. Scroll horizontally to view all columns.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpreadsheetEditor',
  props: {
    data: {
      type: Object,
      required: true,
      validator: function(value) {
        return value.headers && value.rows;
      }
    }
  },
  data() {
    return {
      localData: JSON.parse(JSON.stringify(this.data)),
      columnWidths: {},
      resizingColumn: null,
      startX: 0,
      startWidth: 0,
      minColumnWidth: 80,
      defaultColumnWidth: 150
    };
  },
  watch: {
    data: {
      handler(newVal) {
        this.localData = JSON.parse(JSON.stringify(newVal));
        // Initialize column widths for any new columns
        this.initColumnWidths();
      },
      deep: true
    }
  },
  mounted() {
    this.initColumnWidths();
    
    // Add document event listeners for resizing
    document.addEventListener('mousemove', this.handleResize);
    document.addEventListener('mouseup', this.stopResize);
    
    // Add window resize event listener
    window.addEventListener('resize', this.adjustTableLayout);
    
    // Initial adjustment
    this.$nextTick(() => {
      this.adjustTableLayout();
    });
  },
  beforeDestroy() {
    // Remove event listeners
    document.removeEventListener('mousemove', this.handleResize);
    document.removeEventListener('mouseup', this.stopResize);
    window.removeEventListener('resize', this.adjustTableLayout);
  },
  methods: {
    initColumnWidths() {
      // Ensure all columns have a width value
      this.localData.headers.forEach((_, i) => {
        if (this.columnWidths[i] === undefined) {
          this.columnWidths[i] = this.defaultColumnWidth;
        }
      });
    },
    
    adjustTableLayout() {
      // This method can be used to make any adjustments based on container size
      // For example, ensuring the table takes up the appropriate width
      const container = this.$el.querySelector('.spreadsheet-container');
      if (!container) return;
      
      // Here you could make responsive adjustments if needed
    },
    
    emitUpdate() {
      this.$emit('update:data', JSON.parse(JSON.stringify(this.localData)));
    },
    
    addRow() {
      // Add a new row with the same number of columns as headers
      const newRow = Array(this.localData.headers.length).fill('');
      this.localData.rows.push(newRow);
      this.emitUpdate();
    },
    
    deleteRow(index) {
      if (confirm('Are you sure you want to delete this row?')) {
        this.localData.rows.splice(index, 1);
        this.emitUpdate();
      }
    },
    
    addColumn() {
      // Add a new header
      const newIndex = this.localData.headers.length;
      this.localData.headers.push(`Column ${newIndex + 1}`);
      
      // Add a new cell to each row
      for (let i = 0; i < this.localData.rows.length; i++) {
        this.localData.rows[i].push('');
      }
      
      // Set default width for the new column
      this.columnWidths[newIndex] = this.defaultColumnWidth;
      
      this.emitUpdate();
    },
    
    deleteColumn(index) {
      if (confirm('Are you sure you want to delete this column?')) {
        // Remove header
        this.localData.headers.splice(index, 1);
        
        // Remove cell from each row
        for (let i = 0; i < this.localData.rows.length; i++) {
          this.localData.rows[i].splice(index, 1);
        }
        
        // Update column widths
        const newColumnWidths = {};
        Object.keys(this.columnWidths).forEach(colIndex => {
          const col = parseInt(colIndex);
          if (col < index) {
            newColumnWidths[col] = this.columnWidths[col];
          } else if (col > index) {
            newColumnWidths[col - 1] = this.columnWidths[col];
          }
        });
        
        this.columnWidths = newColumnWidths;
        this.emitUpdate();
      }
    },
    
    // Column resizing
    startResize(e, index) {
      e.preventDefault();
      this.resizingColumn = index;
      this.startX = e.clientX;
      this.startWidth = this.columnWidths[index] || this.defaultColumnWidth;
      document.body.style.cursor = 'col-resize';
    },
    
    handleResize(e) {
      if (this.resizingColumn === null) return;
      
      const diff = e.clientX - this.startX;
      const newWidth = Math.max(this.startWidth + diff, this.minColumnWidth);
      
      // Update the column width
      this.$set(this.columnWidths, this.resizingColumn, newWidth);
    },
    
    stopResize(e) {
      if (this.resizingColumn !== null) {
        this.resizingColumn = null;
        document.body.style.cursor = '';
      }
    }
  }
}
</script>

<style scoped>
.spreadsheet-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.spreadsheet-controls {
  padding: 5px 0;
}

/* This is the key container that needs to enable horizontal scrolling */
.spreadsheet-container {
  position: relative;
  flex-grow: 1;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  background: white;
  overflow: auto; /* Changed from hidden to auto to enable both horizontal and vertical scrolling */
  max-height: 65vh; /* Ensure there's a maximum height */
}

/* Remove the table-wrapper div if it's causing issues */
/* If your HTML structure has this wrapper, adjust its styles: */
.table-wrapper {
  width: auto; /* Changed from 100% to auto to allow expansion */
  min-width: 100%; /* Ensure it takes at least 100% of container width */
}

.spreadsheet-table {
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 0;
  /* Make sure table can expand beyond container width */
  width: auto;
  /* Ensure it's at least as wide as its container */
  min-width: 100%;
}

.column-header {
  position: sticky;
  top: 0;
  background-color: #f5f5f5;
  z-index: 10;
  height: 40px;
  min-width: 150px; /* Ensure columns have a reasonable minimum width */
}

.column-header.resizing {
  background-color: #eaf2ff;
}

.row-header {
  position: sticky;
  left: 0;
  background-color: #f5f5f5;
  z-index: 5;
  width: 60px;
  min-width: 60px;
  max-width: 60px;
  text-align: center;
}

/* Ensure the corner cell has highest z-index */
tr:first-child .row-header {
  z-index: 15;
  background-color: #f5f5f5; /* Ensure background color is applied */
}

.header-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 2px 4px;
}

.header-content .input {
  flex-grow: 1;
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.2s;
  margin-left: 2px;
  width: 20px;
  height: 20px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.column-header:hover .delete-btn {
  opacity: 1;
}

.resize-handle {
  position: absolute;
  right: -5px; /* Position slightly outside the cell */
  top: 0;
  width: 10px; /* Wider to make it easier to grab */
  height: 100%;
  cursor: col-resize;
  z-index: 15;
}

.row-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px;
  height: 100%;
}

.delete-row-btn {
  opacity: 0;
  transition: opacity 0.2s;
  width: 20px;
  height: 20px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

tr:hover .delete-row-btn {
  opacity: 1;
}

.cell {
  padding: 0;
  min-width: 150px; /* Match column header min-width */
}

.cell-input {
  width: 100%;
  border: none;
  border-radius: 0;
  background: transparent;
  padding: 4px 6px;
  height: 32px;
  box-shadow: none;
}

.cell-input:focus {
  background-color: #fcfcff;
  box-shadow: inset 0 0 0 2px #4299e1;
}

/* Adjust Button in SpreadsheetEditor */
.button.is-small {
  height: 2em;
}

/* Make sure modal body takes full available height */
.modal-card-body .spreadsheet-editor {
  height: 65vh;
}

/* Ensure inputs in cells don't have Bulma's default styles that might break layout */
.cell-input.input {
  box-shadow: none;
}

.cell-input.input:focus {
  box-shadow: inset 0 0 0 2px #4299e1;
}

/* Make sure table header stays fixed when scrolling */
.spreadsheet-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
}

/* And row headers stay fixed when scrolling horizontally */
.spreadsheet-table .row-header {
  position: sticky;
  left: 0;
  z-index: 1;
}

/* Make header corner cell fixed in both directions */
.spreadsheet-table thead .row-header {
  z-index: 3;
}

/* Force white-space to prevent wrapping and enable horizontal scrolling */
.spreadsheet-table th,
.spreadsheet-table td {
  white-space: nowrap;
  overflow: hidden;
}

/* Add an extra spacer column to ensure we can always scroll a bit beyond the last column */
/* Add this class to any empty th/td you add at the end of each row */
.empty-spacer {
  min-width: 100px; 
  width: 100px;
  border-right: none;
}
</style>