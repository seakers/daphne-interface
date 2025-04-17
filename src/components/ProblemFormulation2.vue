<template>
  <div class="problem-formulation">
    <nav class="navbar is-light" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="index.html">
          <strong>DAPHNE EO</strong>
        </a>
      </div>
      
      <div class="navbar-menu">
        <div class="navbar-start">
          <span class="navbar-item">
            <strong>Problem Formulation: {{ problemName }}</strong>
          </span>
        </div>
        
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <button class="button is-primary" @click="saveConfiguration">
                <strong>Save Configuration</strong>
              </button>
              <a class="button is-light" href="index.html">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <div class="container mt-4">
      <div class="columns">
        <!-- Section 1: Design Space -->
        <div class="column is-4">
          <div class="card">
            <header class="card-header">
              <p class="card-header-title">Design Space</p>
            </header>
            <div class="card-content">
              <h4 class="title is-5">Instruments</h4>
              <div class="selectable-items">
                <div 
                  v-for="instrument in instruments" 
                  :key="instrument.id"
                  class="selectable-item"
                  :class="{ 'selected': selectedInstruments.includes(instrument.id) }"
                  @click="toggleSelection(instrument.id, 'instruments')"
                >
                  {{ instrument.name }}
                </div>
              </div>
              
              <h4 class="title is-5 mt-4">Orbits</h4>
              <div class="selectable-items">
                <div 
                  v-for="orbit in orbits" 
                  :key="orbit.id"
                  class="selectable-item"
                  :class="{ 'selected': selectedOrbits.includes(orbit.id) }"
                  @click="toggleSelection(orbit.id, 'orbits')"
                >
                  {{ orbit.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Section 2: Constraints and Tools -->
        <div class="column is-4">
          <div class="card">
            <header class="card-header">
              <p class="card-header-title">Constraints</p>
            </header>
            <div class="card-content">
              <div class="field has-addons">
                <div class="control is-expanded">
                  <div class="select is-fullwidth">
                    <select v-model="selectedConstraint">
                      <option value="" disabled selected>Select a constraint</option>
                      <option v-for="constraint in availableConstraints" :key="constraint.id" :value="constraint">
                        {{ constraint.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="control">
                  <button class="button is-info" @click="addConstraint" :disabled="!selectedConstraint || selectedConstraints.length >= 5">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              
              <div class="selected-constraints mt-4">
                <div v-for="(constraint, index) in selectedConstraints" :key="index" class="notification is-info is-light">
                  <button class="delete" @click="removeConstraint(index)"></button>
                  {{ constraint.name }}
                </div>
                <p v-if="selectedConstraints.length === 0" class="has-text-grey">
                  No constraints selected (up to 5 allowed)
                </p>
              </div>
            </div>
          </div>
          
          <div class="card mt-4">
            <header class="card-header">
              <p class="card-header-title">Tools</p>
            </header>
            <div class="card-content">
              <h4 class="title is-6">Optimization Tools</h4>
              <div class="field">
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="selectedOptimizationTool">
                      <option value="" disabled selected>Select optimization tool</option>
                      <option v-for="tool in optimizationTools" :key="tool.id" :value="tool">
                        {{ tool.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              
              <h4 class="title is-6 mt-4">Analysis Tools</h4>
              <div class="field">
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="selectedAnalysisTool">
                      <option value="" disabled selected>Select analysis tool</option>
                      <option v-for="tool in analysisTools" :key="tool.id" :value="tool">
                        {{ tool.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Section 3: Payload (XLS File Upload and Management) -->
        <div class="column is-4">
          <div class="card">
            <header class="card-header">
              <p class="card-header-title">Payload Configuration</p>
            </header>
            <div class="card-content">
              <!-- Option 1: Select from available spreadsheets -->
              <div class="field">
                <label class="label">Choose predefined spreadsheet</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="selectedSpreadsheet">
                      <option value="" disabled selected>Select a spreadsheet</option>
                      <option v-for="sheet in availableSpreadsheets" :key="sheet.id" :value="sheet">
                        {{ sheet.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              
              <!-- Option 2: Upload custom XLS file -->
              <div class="field mt-4">
                <label class="label">Or upload your own XLS file</label>
                <div class="file has-name is-fullwidth">
                  <label class="file-label">
                    <input class="file-input" type="file" accept=".xls,.xlsx" @change="handleFileUpload">
                    <span class="file-cta">
                      <span class="file-icon">
                        <i class="fas fa-upload"></i>
                      </span>
                      <span class="file-label">
                        Choose a file...
                      </span>
                    </span>
                    <span class="file-name" v-if="uploadedFile">
                      {{ uploadedFile.name }}
                    </span>
                    <span class="file-name" v-else>
                      No file selected
                    </span>
                  </label>
                </div>
              </div>
              
              <!-- Display selected file info -->
              <div v-if="currentSpreadsheetInfo" class="notification is-info is-light mt-4">
                <h5 class="title is-6">Selected Spreadsheet:</h5>
                <p><strong>Name:</strong> {{ currentSpreadsheetInfo.name }}</p>
                <p v-if="currentSpreadsheetInfo.sheets && currentSpreadsheetInfo.sheets.length">
                  <strong>Sheets:</strong> {{ currentSpreadsheetInfo.sheets.join(', ') }}
                </p>
                
                <div class="field mt-3">
                  <button class="button is-primary" @click="editSpreadsheet">
                    <i class="fas fa-edit"></i>
                    <span>Edit Spreadsheet</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Save Configuration Button (Centered at bottom) -->
      <div class="has-text-centered mt-5 mb-5">
        <button class="button is-success is-large" @click="saveConfiguration">
          <i class="fas fa-save"></i>
          <span>Save Configuration</span>
        </button>
      </div>
    </div>
    
    <!-- Spreadsheet Editor Modal -->
    <div class="modal" :class="{ 'is-active': showSpreadsheetEditor }">
      <div class="modal-background" @click="closeSpreadsheetEditor"></div>
      <div class="modal-card" style="width: 90vw; max-width: 1400px;">
        <header class="modal-card-head">
          <p class="modal-card-title">
            Edit Spreadsheet: {{ currentSpreadsheetInfo ? currentSpreadsheetInfo.name : '' }}
          </p>
          <div class="tabs" v-if="activeSheets && activeSheets.length > 1">
            <ul>
              <li v-for="(sheet, index) in activeSheets" :key="index" :class="{ 'is-active': activeSheetIndex === index }">
                <a @click="switchSheet(index)">{{ sheet }}</a>
              </li>
            </ul>
          </div>
          <button class="delete" aria-label="close" @click="closeSpreadsheetEditor"></button>
        </header>
        <section class="modal-card-body" style="max-height: 70vh; overflow: auto;">
          <spreadsheet-editor 
            v-if="spreadsheetData" 
            :data="spreadsheetData" 
            @update:data="updateSpreadsheetData"
          ></spreadsheet-editor>
          <div v-else class="has-text-centered">
            <p>Loading spreadsheet data...</p>
            <progress class="progress is-small is-primary" max="100"></progress>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="saveSpreadsheet">Save Changes</button>
          <button class="button" @click="closeSpreadsheetEditor">Cancel</button>
          <div class="file ml-auto">
            <label class="file-label">
              <button class="button is-link" @click="downloadSpreadsheet">
                <i class="fas fa-download mr-2"></i>
                Download XLS
              </button>
            </label>
          </div>
        </footer>
      </div>
    </div>
    <div class="modal" :class="{ 'is-active': showSaveDialog }">
  <div class="modal-background" @click="cancelSaveDialog"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Save Spreadsheet</p>
      <button class="delete" aria-label="close" @click="cancelSaveDialog"></button>
    </header>
    <section class="modal-card-body">
      <div class="field">
        <label class="label">Enter filename</label>
        <div class="control">
          <input class="input" type="text" v-model="newFileName" placeholder="filename.xlsx">
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success" @click="confirmSaveSpreadsheet">Save</button>
      <button class="button" @click="cancelSaveDialog">Cancel</button>
    </footer>
  </div>
</div>
  </div>
</template>

<script>
import SpreadsheetEditor from './SpreadsheetEditor.vue';
import * as XLSX from 'xlsx';

export default {
  name: 'ProblemFormulation',
  components: {
    SpreadsheetEditor
  },
  props: {
    problemName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // Design Space
      instruments: [],
      orbits: [],
      selectedInstruments: [],
      selectedOrbits: [],
      
      // Constraints
      availableConstraints: [],
      selectedConstraint: '',
      selectedConstraints: [],
      
      // Tools
      optimizationTools: [],
      analysisTools: [],
      selectedOptimizationTool: '',
      selectedAnalysisTool: '',
      
      // Payload
      availableSpreadsheets: [],
      selectedSpreadsheet: null,
      uploadedFile: null,
      currentSpreadsheetInfo: null,
      workbook: null,
      
      // Spreadsheet Editor
      showSpreadsheetEditor: false,
      spreadsheetData: null,
      originalSpreadsheetData: null,
      activeSheets: [],
      activeSheetIndex: 0,
      showSaveDialog: false,
      newFileName: '',
    };
  },
  created() {
    this.loadData();
  },
  watch: {
    selectedSpreadsheet(newVal) {
      if (newVal) {
        this.uploadedFile = null; // Clear any uploaded file
        this.loadSelectedSpreadsheet();
      } else {
        this.currentSpreadsheetInfo = null;
      }
    }
  },
  methods: {
    async loadData() {
      // In a real app, these would be API calls based on the problem name
      let reqData = new FormData();
      let dataResponse = await fetchPost(API_URL + 'eoss/tse/tse-data', reqData);

        if (dataResponse.ok) {
            let data = await dataResponse.json();
            this.instruments = data['instrument_names'];
            this.orbits = data["orbit_names"];
        } else {
            console.error('Failed to load problem data');
        }
      
      // Load instruments
      this.instruments = [
        { id: 1, name: 'Radar Altimeter' },
        { id: 2, name: 'Visible Imager' },
        { id: 3, name: 'Infrared Sounder' },
        { id: 4, name: 'Microwave Sounder' },
        { id: 5, name: 'Lidar' },
        { id: 6, name: 'Spectrometer' },
        { id: 7, name: 'Radio Occultation' },
        { id: 8, name: 'Scatterometer' }
      ];
      
      // Load orbits
      this.orbits = [
        { id: 1, name: 'LEO-600-SSO-AM' },
        { id: 2, name: 'LEO-600-SSO-DD' },
        { id: 3, name: 'LEO-800-SSO-AM' },
        { id: 4, name: 'LEO-800-SSO-PM' },
        { id: 5, name: 'GEO' },
        { id: 6, name: 'MEO' }
      ];
      
      // Load constraints
      this.availableConstraints = [
        { id: 1, name: 'Maximum Cost: $500M' },
        { id: 2, name: 'Minimum Science Return: 0.7' },
        { id: 3, name: 'Launch Before 2025' },
        { id: 4, name: 'Mass Limit: 500kg' },
        { id: 5, name: 'Power Limit: 800W' },
        { id: 6, name: 'Data Rate: 10Mbps' },
        { id: 7, name: 'Reliability > 0.95' },
        { id: 8, name: 'Design Life: 5 years' }
      ];
      
      // Load tools
      this.optimizationTools = [
        { id: 1, name: 'Genetic Algorithm' },
        { id: 2, name: 'Simulated Annealing' },
        { id: 3, name: 'Particle Swarm' }
      ];
      
      this.analysisTools = [
        { id: 1, name: 'Monte Carlo Simulation' },
        { id: 2, name: 'Value of Information Analysis' },
        { id: 3, name: 'Pareto Front Analysis' }
      ];
      
      // Load spreadsheets
      this.availableSpreadsheets = [
        { id: 1, name: 'Instrument Capabilities', filename: 'instrument_capabilities.xlsx', sheets: ['Requirements', 'Capabilities'] },
        { id: 2, name: 'Mission Requirements', filename: 'mission_requirements.xlsx', sheets: ['Objectives', 'Constraints'] },
        { id: 3, name: 'Cost Models', filename: 'cost_models.xlsx', sheets: ['Development', 'Operations'] }
      ];
    },
    
    toggleSelection(id, type) {
      if (type === 'instruments') {
        const index = this.selectedInstruments.indexOf(id);
        if (index === -1) {
          this.selectedInstruments.push(id);
        } else {
          this.selectedInstruments.splice(index, 1);
        }
      } else if (type === 'orbits') {
        const index = this.selectedOrbits.indexOf(id);
        if (index === -1) {
          this.selectedOrbits.push(id);
        } else {
          this.selectedOrbits.splice(index, 1);
        }
      }
    },
    
    addConstraint() {
      if (this.selectedConstraint && this.selectedConstraints.length < 5) {
        this.selectedConstraints.push(this.selectedConstraint);
        this.selectedConstraint = '';
      }
    },
    
    removeConstraint(index) {
      this.selectedConstraints.splice(index, 1);
    },
    
    // Handle file upload
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Check if it's an Excel file
      if (!file.name.match(/\.(xls|xlsx)$/i)) {
        alert('Please select an Excel file (.xls or .xlsx)');
        return;
      }
      
      this.uploadedFile = file;
      this.selectedSpreadsheet = null; // Clear any selected predefined spreadsheet
      
      // Read the uploaded file
      const reader = new FileReader();
      // Update the part of handleFileUpload where you read the file
reader.onload = (e) => {
  try {
    const data = new Uint8Array(e.target.result);
    this.workbook = XLSX.read(data, { type: 'array' });
    
    // Extract sheets
    this.activeSheets = this.workbook.SheetNames || [];
    this.activeSheetIndex = 0;
    
    // Initialize _structured to store our formatted data
    this.workbook._structured = {};
    
    this.currentSpreadsheetInfo = {
      name: file.name.replace(/\.\w+$/, ''),
      filename: file.name,
      isUploaded: true,
      sheets: this.activeSheets
    };
    
    // Load the first sheet automatically
    this.loadActiveSheetData();
    
  } catch (error) {
    console.error('Error reading Excel file:', error);
    alert('Could not read the Excel file. Please make sure it\'s a valid Excel file.');
  }
};
      
      reader.onerror = () => {
        alert('Error reading the file');
      };
      
      reader.readAsArrayBuffer(file);
    },
    
    // Load a predefined spreadsheet
    loadSelectedSpreadsheet() {
      if (!this.selectedSpreadsheet) return;
      
      this.currentSpreadsheetInfo = {
        name: this.selectedSpreadsheet.name,
        sheets: this.selectedSpreadsheet.sheets,
        filename: this.selectedSpreadsheet.filename,
        isPredefined: true
      };
      
      this.activeSheets = this.selectedSpreadsheet.sheets;
      this.activeSheetIndex = 0;
      
      // In a real app, this would load the actual spreadsheet from the server
      // For this example, we'll simulate it with mock data
      this.workbook = {
        SheetNames: this.selectedSpreadsheet.sheets,
        Sheets: {}
      };

      console.log("this is happening")
      
      // Create mock data for each sheet
      this.selectedSpreadsheet.sheets.forEach(sheet => {
        // Create mock data structure for the sheet
        const mockData = this.createMockSheetData(sheet);
        this.workbook.Sheets[sheet] = mockData;
      });
    },

    loadActiveSheetData() {
  if (!this.workbook || !this.activeSheets || this.activeSheets.length === 0) {
    console.error('No workbook or sheets available');
    return;
  }
  
  const sheetName = this.activeSheets[this.activeSheetIndex];
  console.log("Loading sheet data for:", sheetName);
  
  // First check if we have structured data for this sheet
  console.log("the workbook", this.workbook.Sheets)
    console.log("the workbook structured", this.workbook._structured)
  if (this.workbook._structured && this.workbook._structured[sheetName]) {
    console.log("Using cached structured data");
    this.spreadsheetData = JSON.parse(JSON.stringify(this.workbook._structured[sheetName]));
  } else {
    // Convert from XLSX format
    if (this.currentSpreadsheetInfo.isUploaded) {
      const sheet = this.workbook.Sheets[sheetName];
      
      // Check if valid sheet exists
      if (sheet) {
        console.log("Converting sheet to structured format");
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        if (jsonData && jsonData.length > 0) {
          // First row is headers, rest are data rows
          const headers = jsonData[0] || [];
          const rows = jsonData.slice(1) || [];
          
          // Make sure all rows have the same number of columns as headers
          const normalizedRows = rows.map(row => {
            const newRow = [...row];
            while (newRow.length < headers.length) newRow.push('');
            return newRow;
          });
          
          this.spreadsheetData = {
            headers: headers,
            rows: normalizedRows
          };
        } else {
          // Empty sheet
          this.spreadsheetData = {
            headers: ['Column 1'],
            rows: [['']],
          };
        }
      } else {
        console.error("Sheet not found:", sheetName);
        this.spreadsheetData = {
          headers: ['Column 1'],
          rows: [['']],
        };
      }
    } else {
      // For predefined sheets
      if (this.workbook.Sheets[sheetName] && this.workbook.Sheets[sheetName].data) {
        this.spreadsheetData = JSON.parse(JSON.stringify(this.workbook.Sheets[sheetName].data));
      } else {
        // Create mock data for this sheet
        this.workbook.Sheets[sheetName] = {
          data: this.createMockSheetData(sheetName)
        };
        this.spreadsheetData = JSON.parse(JSON.stringify(this.workbook.Sheets[sheetName].data));
      }
    }
    
    // Cache this structured format
    if (!this.workbook._structured) this.workbook._structured = {};
    this.workbook._structured[sheetName] = JSON.parse(JSON.stringify(this.spreadsheetData));
  }
  
  console.log("Loaded spreadsheet data:", this.spreadsheetData);
  
  // Save original data for comparison
  this.originalSpreadsheetData = JSON.parse(JSON.stringify(this.spreadsheetData));
},
    
    // Create mock sheet data based on the sheet name
    createMockSheetData(sheetName) {
      // This is a simplified mock - in a real app, you'd retrieve actual data
      const mockData = {};
      let headers, rows;
      
      if (sheetName.includes('Requirement') || sheetName.includes('Objectives')) {
        headers = ['ID', 'Description', 'Priority', 'Category', 'Notes'];
        rows = [
          ['R001', 'Global coverage', 'High', 'Mission', 'Critical requirement'],
          ['R002', 'Revisit time < 3 days', 'Medium', 'Operations', 'Weather dependent'],
          ['R003', 'Resolution < 30m', 'High', 'Science', 'For land use observation'],
          ['R004', 'Minimum 5 year lifetime', 'Medium', 'Mission', 'Budget dependent']
        ];
      } else if (sheetName.includes('Capabilities')) {
        headers = ['Instrument', 'Parameter', 'Value', 'Units', 'Notes'];
        rows = [
          ['Visible Imager', 'Resolution', '15', 'm', 'At nadir'],
          ['Visible Imager', 'Swath Width', '120', 'km', 'Full capability'],
          ['Infrared Sounder', 'Resolution', '250', 'm', 'Thermal bands'],
          ['Radar Altimeter', 'Precision', '5', 'cm', 'Over ocean']
        ];
      } else if (sheetName.includes('Cost')) {
        headers = ['Component', 'Development Cost ($M)', 'Operations Cost ($M)', 'Total ($M)', 'Notes'];
        rows = [
          ['Spacecraft Bus', '120', '5', '125', 'COTS platform'],
          ['Visible Imager', '75', '3', '78', 'Custom development'],
          ['Power System', '30', '1', '31', 'Solar arrays'],
          ['Ground System', '25', '10', '35', 'Includes 5 years operations']
        ];
      } else {
        headers = ['Column A', 'Column B', 'Column C', 'Column D'];
        rows = [
          ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
          ['Value 5', 'Value 6', 'Value 7', 'Value 8'],
          ['Value 9', 'Value 10', 'Value 11', 'Value 12']
        ];
      }
      
      // Format the data for our spreadsheet editor
      return {
        data: {
          headers,
          rows
        }
      };
    },
    
    editSpreadsheet() {
      if (!this.currentSpreadsheetInfo) return;
      
      this.showSpreadsheetEditor = true;
      this.loadActiveSheetData();
    },
    
//     loadActiveSheetData() {
//   if (!this.workbook || !this.activeSheets || this.activeSheets.length === 0) {
//     console.error('No workbook or sheets available');
//     return;
//   }
  
//   const sheetName = this.activeSheets[this.activeSheetIndex];
//   console.log("the sheet name", sheetName)
  
//   if (this.currentSpreadsheetInfo.isUploaded) {
//     // Check if we already have structured data for this sheet
//     console.log("uploaded sheet", this.workbook._structured)
//     if (this.workbook._structured && this.workbook._structured[sheetName]) {
//         console.log("structured sheet")
//       this.spreadsheetData = JSON.parse(JSON.stringify(this.workbook._structured[sheetName]));
//       console.log("the spreadsheet data", this.spreadsheetData)
//     } else {
//       // Convert from XLSX format to our structured format
      
//       const sheet = this.workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
//       if (jsonData && jsonData.length > 0) {
//         // First row is headers, rest are data rows
//         const headers = jsonData[0] || [];
//         const rows = jsonData.slice(1) || [];
        
//         // Make sure all rows have the same number of columns as headers
//         const normalizedRows = rows.map(row => {
//           const newRow = [...row];
//           while (newRow.length < headers.length) newRow.push('');
//           return newRow;
//         });
        
//         this.spreadsheetData = {
//           headers: headers,
//           rows: normalizedRows
//         };
        
//         // Save this structured format
//         if (!this.workbook._structured) this.workbook._structured = {};
//         this.workbook._structured[sheetName] = JSON.parse(JSON.stringify(this.spreadsheetData));
//       } else {
//         // Empty sheet
//         this.spreadsheetData = {
//           headers: ['Column 1'],
//           rows: [['']],
//         };
//       }
//     }
//   } else {
//     // For predefined sheets
//     console.log("in predefined sheet")
//     console.log("the workbook structures", this.workbook._structured)
//     console.log("the workbook", this.workbook.Sheets[sheetName])
//     if (this.workbook.Sheets[sheetName] && this.workbook.Sheets[sheetName].data) {
//       this.spreadsheetData = JSON.parse(JSON.stringify(this.workbook.Sheets[sheetName].data));
//     } else {
//       // Create mock data for this sheet if it doesn't exist
//       this.workbook.Sheets[sheetName] = {
//         data: this.createMockSheetData(sheetName)
//       };
//       this.spreadsheetData = JSON.parse(JSON.stringify(this.workbook.Sheets[sheetName].data));
//     }
//   }
  
//   // Save original data for comparison
//   this.originalSpreadsheetData = JSON.parse(JSON.stringify(this.spreadsheetData));
// },
    
    switchSheet(index) {
      if (index !== this.activeSheetIndex) {
        // Save current sheet changes if needed
        this.saveCurrentSheetChanges();
        
        // Switch to the new sheet
        this.activeSheetIndex = index;
        this.loadActiveSheetData();
      }
    },
    
    saveCurrentSheetChanges() {
  if (!this.workbook || !this.activeSheets || !this.spreadsheetData) {
    console.error('Missing workbook, sheets, or data');
    return;
  }
  
  const sheetName = this.activeSheets[this.activeSheetIndex];
  console.log('Saving changes for sheet:', sheetName);
  
  // Initialize structured data storage if needed
  if (!this.workbook._structured) {
    this.workbook._structured = {};
  }
  
  // Save the structured data
  this.workbook._structured[sheetName] = JSON.parse(JSON.stringify(this.spreadsheetData));
  
  // Update the XLSX sheet as well
  if (this.spreadsheetData && this.spreadsheetData.headers && this.spreadsheetData.rows) {
    const aoa = [this.spreadsheetData.headers, ...this.spreadsheetData.rows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    this.workbook.Sheets[sheetName] = ws;
  }
  
  // If it's an uploaded file, make sure we keep the structure
  if (this.currentSpreadsheetInfo.isUploaded) {
    // The structured data is already saved in _structured
    console.log('Saved structured data for uploaded sheet');
  } else {
    // For predefined sheets
    if (!this.workbook.Sheets[sheetName]) {
      this.workbook.Sheets[sheetName] = {};
    }
    this.workbook.Sheets[sheetName].data = JSON.parse(JSON.stringify(this.spreadsheetData));
    console.log('Saved data for predefined sheet');
  }
  
  console.log('Current spreadsheet data preserved');
},
    
    updateSpreadsheetData(newData) {
      this.spreadsheetData = newData;
    },
    
    closeSpreadsheetEditor() {
      // Save changes to current sheet before closing
      this.saveCurrentSheetChanges();
      
      this.showSpreadsheetEditor = false;
      this.spreadsheetData = null;
    },
    
    saveSpreadsheet() {
      // Save changes to current sheet
      this.showSaveDialog = true;
      this.newFileName = this.currentSpreadsheetInfo.filename || 
                     (this.currentSpreadsheetInfo.name + '.xlsx');

        this.saveCurrentSheetChanges();

      
      // In a real app, this would send the updated data to an API
      // For this example, we'll just update our local state
      
      // Create a new filename for the edited spreadsheet
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      let newFilename;
      
      if (this.currentSpreadsheetInfo.isUploaded) {
        // For uploaded files, append timestamp to the original filename
        const originalName = this.uploadedFile.name;
        const ext = originalName.split('.').pop();
        const baseName = originalName.substring(0, originalName.length - ext.length - 1);
        newFilename = `${baseName}-edited-${timestamp}.${ext}`;
      } else {
        // For predefined spreadsheets, use the original name with timestamp
        newFilename = this.currentSpreadsheetInfo.filename.replace(/\.(xlsx|xls)$/, `-edited-${timestamp}.$1`);
      }
      
      // Create a new spreadsheet entry
      const newSpreadsheet = {
        id: this.availableSpreadsheets.length + 1,
        name: `${this.currentSpreadsheetInfo.name} (Edited)`,
        filename: newFilename,
        sheets: this.activeSheets,
        isEdited: true
      };
      
      // Add to available spreadsheets
      this.availableSpreadsheets.push(newSpreadsheet);
      
      // Update our current selection to the new spreadsheet
      this.selectedSpreadsheet = newSpreadsheet;
      this.currentSpreadsheetInfo = {
        name: newSpreadsheet.name,
        sheets: newSpreadsheet.sheets,
        filename: newSpreadsheet.filename,
        isPredefined: false,
        isEdited: true
      };
      
      alert(`Spreadsheet saved as: ${newFilename}`);
      this.closeSpreadsheetEditor();
    },
    
    downloadSpreadsheet() {
      // Save current sheet changes before downloading
      this.saveCurrentSheetChanges();
      
      if (!this.workbook) return;
      
      try {
        // Generate the Excel file
        const wbout = XLSX.write(this.workbook, { bookType: 'xlsx', type: 'array' });
        
        // Create a Blob from the Excel data
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        
        // Create a download link
        const fileName = this.currentSpreadsheetInfo.filename || 
                         this.currentSpreadsheetInfo.name.replace(/\s+/g, '_') + '.xlsx';
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        
        // Trigger the download
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error generating Excel file:', error);
        alert('Failed to download the spreadsheet.');
      }
    },

    confirmSaveSpreadsheet() {
  if (!this.newFileName) {
    alert('Please enter a filename');
    return;
  }
  
  // Ensure filename has .xlsx extension
  let filename = this.newFileName;
  if (!filename.toLowerCase().endsWith('.xlsx')) {
    filename += '.xlsx';
  }
  
  try {
    // Update the current spreadsheet info with new name
    this.currentSpreadsheetInfo.filename = filename;
    this.currentSpreadsheetInfo.name = filename.replace(/\.\w+$/, '');
    
    // Close dialog
    this.showSaveDialog = false;
  } catch (error) {
    console.error('Error saving spreadsheet:', error);
    alert('Failed to save the spreadsheet');
  }
},

cancelSaveDialog() {
  this.showSaveDialog = false;
},
    
    saveConfiguration() {
      // In a real app, this would save the complete configuration
      
      const config = {
        problemName: this.problemName,
        designSpace: {
          selectedInstruments: this.selectedInstruments.map(id => {
            const instrument = this.instruments.find(i => i.id === id);
            return instrument ? instrument.name : id;
          }),
          selectedOrbits: this.selectedOrbits.map(id => {
            const orbit = this.orbits.find(o => o.id === id);
            return orbit ? orbit.name : id;
          })
        },
        constraints: this.selectedConstraints.map(c => c.name),
        tools: {
          optimization: this.selectedOptimizationTool ? this.selectedOptimizationTool.name : null,
          analysis: this.selectedAnalysisTool ? this.selectedAnalysisTool.name : null
        },
        payload: this.currentSpreadsheetInfo ? this.currentSpreadsheetInfo.name : null
      };
      
      // Display the configuration (in a real app, this would be saved to the backend)
      console.log('Configuration saved:', config);
      alert('Configuration saved successfully!');
    }
  }
}
</script>

<style scoped>
.problem-formulation {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  flex-grow: 1;
}

.selectable-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selectable-item {
  padding: 0.5rem 0.75rem;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.selectable-item:hover {
  background-color: #f5f5f5;
}

.selectable-item.selected {
  background-color: #3273dc;
  color: white;
  border-color: #2366d1;
}

.selected-constraints {
  max-height: 300px;
  overflow-y: auto;
}

/* Styles for the spreadsheet editor modal */
.modal-card {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-card-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.modal-card-title {
  margin-right: auto;
}

.tabs {
  margin-bottom: 0 !important;
  margin-right: 1rem;
  overflow-x: auto;
  max-width: 70%;
}

.tabs ul {
  flex-wrap: nowrap;
  min-width: max-content;
}

.modal-card-body {
  flex: 1;
  overflow: auto;
}

/* File upload styles */
.file.has-name.is-fullwidth {
  width: 100%;
}

.file.has-name.is-fullwidth .file-label {
  width: 100%;
}

.file.has-name.is-fullwidth .file-name {
  width: 100%;
  max-width: none;
}

/* Add margin to download button */
.ml-auto {
  margin-left: auto;
}

.mr-2 {
  margin-right: 0.5rem;
}
</style>