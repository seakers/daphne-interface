<!-- filepath: /Users/mahima/Documents/daphne-eo/daphne-interface/src/components/ProblemFormulation.vue -->
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
                <button class="button is-primary" @click="saveConfiguration" :disabled="loading">
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
        <!-- Loading indicator -->
        <div v-if="loading" class="has-text-centered p-5">
          <p class="is-size-5">Loading data...</p>
          <progress class="progress is-primary mt-3" max="100"></progress>
        </div>
        
        <div v-else>
          <!-- Problem Type Selection -->
          
          
          <div class="columns">
            <!-- Section 1: Evaluation Space -->
            <div class="column is-4">
              <div class="card">
                <header class="card-header">
                  <p class="card-header-title">Evaluation Space</p>
                </header>
                <div class="card-content">
                  <h4 class="title is-5">Metrics</h4>
                  <div class="field" v-for="(metric, index) in metrics" :key="'metric-'+index">
                    <div class="control">
                      <label class="checkbox">
                        <input 
                          type="checkbox" 
                          :value="metric" 
                          v-model="selectedMetrics"
                          @change="onMetricChange(metric)"
                        >
                        {{ metric }}
                      </label>
                    </div>
                    <div class="control" v-if="selectedMetrics.includes(metric)">
                      <label class="radio">
                        <input 
                          type="radio" 
                          :name="'metric-opt-'+index" 
                          :value="'min'" 
                          v-model="metricOptions[metric]"
                        >
                        Minimize
                      </label>
                      <label class="radio">
                        <input 
                          type="radio" 
                          :name="'metric-opt-'+index" 
                          :value="'max'" 
                          v-model="metricOptions[metric]"
                        >
                        Maximize
                      </label>
                    </div>
                  </div>
                  
                  <h4 class="title is-5 mt-4">Functions</h4>
                  <div class="field" v-for="functionName in functionNames" :key="'func-'+functionName">
                    <div class="control">
                        <label class="checkbox">
                            <input 
                            type="checkbox" 
                            :value="functionName" 
                            v-model="selectedFunctions"
                            @change="onFunctionChange(functionName)"
                            >
                            {{ functionName }}
                        </label>
                        </div>
                        
                        <div v-if="selectedFunctions.includes(functionName)" class="ml-4 mt-2">
                        <p class="is-size-6 mb-2"><strong>Tools for {{ functionName }}</strong></p>
                        <div class="field" v-for="(tool, tIndex) in getFunctionTools(functionName)" :key="'tool-'+tIndex">
                            <div class="control">
                            <label class="checkbox">
                                <input 
                                type="checkbox" 
                                :value="tool" 
                                v-model="selectedTools[functionName]"
                                >
                                {{ tool }}
                            </label>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Section 2: Design Space -->
            <div class="column is-4">
              <div class="card">
                <header class="card-header">
                  <p class="card-header-title">Design Space</p>
                </header>
                <div class="card-content">
                  <h4 class="title is-5">Instruments</h4>
                  <div class="selectable-items">
                    <div 
                      v-for="(instrument, index) in instrument_names" 
                      :key="'instrument-'+index"
                      class="selectable-item"
                      :class="{ 'is-selected': selectedInstruments.includes(instrument) }"
                      @click="toggleInstrument(instrument)"
                    >
                      {{ instrument }}
                    </div>
                  </div>
                  
                  <h4 class="title is-5 mt-4">Orbits</h4>
                  <div class="selectable-items">
                    <div 
                      v-for="(orbit, index) in orbit_names" 
                      :key="'orbit-'+index"
                      class="selectable-item"
                      :class="{ 'is-selected': selectedOrbits.includes(orbit) }"
                      @click="toggleOrbit(orbit)"
                    >
                      {{ orbit }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Section 3: Settings -->
            <div class="column is-4">
              <div class="card">
                <header class="card-header">
                  <p class="card-header-title">Settings</p>
                </header>
                <div class="card-content">
                  <div class="field" v-for="(value, key) in settings" :key="key">
                    <label class="label" v-if="typeof value !== 'object'">{{ formatLabel(key) }}</label>
                    <div class="control" v-if="typeof value === 'boolean'">
                      <label class="checkbox">
                        <input type="checkbox" v-model="settings[key]">
                        {{ value ? 'Enabled' : 'Disabled' }}
                      </label>
                    </div>
                    <div class="control" v-else-if="typeof value !== 'object'">
                      <input class="input" type="text" v-model="settings[key]">
                    </div>
                    
                    <!-- Nested settings -->
                    <div v-else>
                      <h5 class="title is-6 mt-3">{{ formatLabel(key) }}</h5>
                      <div class="field ml-4" v-for="(nestedVal, nestedKey) in value" :key="nestedKey">
                        <label class="label" v-if="!Array.isArray(nestedVal)">{{ formatLabel(nestedKey) }}</label>
                        <div class="control" v-if="typeof nestedVal === 'boolean'">
                          <label class="checkbox">
                            <input type="checkbox" v-model="settings[key][nestedKey]">
                            {{ nestedVal ? 'Enabled' : 'Disabled' }}
                          </label>
                        </div>
                        <div class="control" v-else-if="typeof nestedVal === 'number'">
                          <input class="input" type="number" v-model.number="settings[key][nestedKey]">
                        </div>
                        <div class="control" v-else-if="!Array.isArray(nestedVal)">
                          <input class="input" type="text" v-model="settings[key][nestedKey]">
                        </div>
                        <div v-else>
                          <label class="label">{{ formatLabel(nestedKey) }}</label>
                          <div class="tags">
                            <span class="tag is-medium" v-for="(item, i) in nestedVal" :key="i">
                              {{ item }}
                              <button class="delete is-small" @click="removeArrayItem(key, nestedKey, i)"></button>
                            </span>
                          </div>
                          <div class="field has-addons">
                            <div class="control is-expanded">
                              <input class="input" type="text" v-model="newItems[nestedKey]" placeholder="Add new item">
                            </div>
                            <div class="control">
                              <button class="button is-primary" @click="addArrayItem(key, nestedKey)">Add</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  

        </div>
      </div>
    </div>
  </template>
  
  <script>
  import {fetchPost} from "../scripts/fetch-helpers";

  export default {
    name: 'ProblemFormulation',
    data() {
      return {
        problemName: 'New Problem',
        problemType: '',
        loading: true,
        
        // Data from API
        instrument_names: [],
        orbit_names: [],
        metrics: [],
        functions: [],
        tools: {},
        functions_tools: {},
        
        // Evaluation Space
        selectedMetrics: [],
        metricOptions: {},
        selectedFunctions: [],
        selectedTools: {},
        
        // Design Space
        selectedInstruments: [],
        selectedOrbits: [],
        
        // Settings
        settings: {
          searchStrategy: "MOEA",
          proxyInstrument: true,
          proxyCostRisk: false,
          proxyLaunch: false,
          proxyOrbits: false,
          proxyValue: true,
          proxyMaintenance: true,
          useCache: true,
          useThreading: true,
          "@type": "AnalysisSettings",
          searchParameters: {
            "@type": "SearchParameters",
            maxNFE: 500,
            populationSize: 4,
            epsilons: 0.05,
            sizeTournament: 2,
            pCrossover: 0.9,
            pMutation: 0.2,
            alpha: 0.8,
            beta: 0.7,
            pmin: 0.03,
            dOperators: [],
            iOperators: [
              "TwoPointCrossover",
              "IntegerUM"
            ],
            NFEtriggerDM: 20,
            nOperRepl: 2
          }
        },
        newItems: {}
      }
    },
    computed: {
    // Get function names from the functions_tools dictionary keys
    functionNames() {
      return Object.keys(this.functions_tools);
    }
  },
    async created() {
      try {
        // Fetch data from API
        const reqData = {}; // Add any required request parameters
        const dataResponse = await fetchPost(API_URL + 'eoss/tse/tse-assigning-data');
        let data = {};
        if (dataResponse.ok) {
            data = await dataResponse.json();
        }        

        this.instrument_names = data.instrument_names || [];
        this.orbit_names = data.orbit_names || [];
        this.metrics = data.metrics || [];
        this.functions_tools = data.functions_tools || [];
        // this.tools = data.tools || {};

        console.log('Instrument Names:', this.instrument_names);
        console.log('Orbit Names:', this.orbit_names);  
        console.log('Metrics:', this.metrics);
        console.log('Functions:', this.functions_tools);
        
        this.loading = false;
      } catch (error) {
        console.error('Error loading data:', error);
        this.loading = false;
        // Show error notification here
      }
    },
    methods: {
      onProblemTypeChange() {
        // Reset selections when problem type changes
        this.selectedMetrics = [];
        this.metricOptions = {};
        this.selectedFunctions = [];
        this.selectedTools = {};
        this.selectedInstruments = [];
        this.selectedOrbits = [];
      },
      
      onMetricChange(metric) {
        if (this.selectedMetrics.includes(metric) && !this.metricOptions[metric]) {
          // Default to minimize when a metric is selected
          this.$set(this.metricOptions, metric, 'min');
        }
      },
      
      onFunctionChange(func) {
        if (this.selectedFunctions.includes(func) && !this.selectedTools[func]) {
            // Initialize empty array for selected tools
            this.$set(this.selectedTools, func, []);
        }
        },
      
      getFunctionTools(func) {
        return this.functions_tools[func] || [];
      },
      
      toggleInstrument(name) {
        const index = this.selectedInstruments.indexOf(name);
        if (index === -1) {
          this.selectedInstruments.push(name);
        } else {
          this.selectedInstruments.splice(index, 1);
        }
      },
      
      toggleOrbit(name) {
        const index = this.selectedOrbits.indexOf(name);
        if (index === -1) {
          this.selectedOrbits.push(name);
        } else {
          this.selectedOrbits.splice(index, 1);
        }
      },
      
      formatLabel(key) {
        // Convert camelCase to space-separated words
        if (key.startsWith('@')) {
          return key; // Leave @type as is
        }
        return key
          // Insert a space before all uppercase letters
          .replace(/([A-Z])/g, ' $1')
          // Replace first char with uppercase
          .replace(/^./, str => str.toUpperCase());
      },
      
      removeArrayItem(parentKey, key, index) {
        this.settings[parentKey][key].splice(index, 1);
      },
      
      addArrayItem(parentKey, key) {
        if (this.newItems[key] && this.newItems[key].trim()) {
          this.settings[parentKey][key].push(this.newItems[key]);
          this.newItems[key] = '';
        }
      },
      
      async saveConfiguration() {
        if (!this.validateForm()) {
            return;
        }
        
        // Set loading state
        this.submitting = true;
        
        // Format metrics with their min/max settings
        const metricOptions = {};
        this.selectedMetrics.forEach(metric => {
        metricOptions[metric] = this.metricOptions[metric] || 'min';
        });
        
        // Format functions with their selected tools
        const functionTools = {};
        this.selectedFunctions.forEach(func => {
        functionTools[func] = this.selectedTools[func] || [];
        });
        
        // Prepare the configuration to send
        const configuration = {
        problem_name: this.problemName,
        problem_type: this.problemType,
        evaluation: {
            metrics: metricOptions,
            functions: functionTools
        },
        design: {
            instruments: this.selectedInstruments,
            orbits: this.selectedOrbits
        },
        settings: this.settings
        };
        
        console.log('Saving configuration:', configuration);
        
        try {
        let reqData = new FormData();
        reqData.append('configuration', JSON.stringify(configuration));
        // Send configuration to backend API
        const response = await fetchPost(API_URL + 'eoss/tse/start-assigning-tse', reqData);
        
        console.log('API Response:', response);
        
        if (response.ok) {
            // Show success message
            // alert('Problem configuration saved successfully!');
            
            // If you want to redirect to a results page
            // if (response.task_id) {
            // // You can redirect to a task status or results page
            //   window.location.href = `/results?task_id=${response.task_id}`;
            // }

            const formulation = this.$children[0].getFormulationData();
    
            try {
              // Save formulation to backend
              let reqData = new FormData();
              const response = await fetchPost(API_URL + 'eoss/problem/create',reqData );
              
              const result = await response.json();
              
              if (result.success) {
                // Store problem ID in localStorage for potential recovery
                localStorage.setItem('lastGeneratedProblem', result.problem_id);
                
                // Redirect to tradespace view with new problem
                window.location.href = `index.html?problem=${result.problem_id}&generated=true`;
              } else {
                alert('Failed to save problem formulation');
              }
            } catch (error) {
              console.error('Error saving problem formulation:', error);
              alert('An error occurred while saving the problem');
            }


        } else {
            // Show error message
            const errorMessage = (response && response.message) ? response.message : 'Unknown error occurred';
            alert(`Error: ${errorMessage}`);
        }
        } catch (error) {
        console.error('Error submitting configuration:', error);
        alert('Failed to submit configuration. Please try again.');
        } finally {
        this.submitting = false;
        }
    },
    
    validateForm() {
        // Basic validation before submission
        if (!this.problemName.trim()) {
        alert('Please enter a problem name');
        return false;
        }
        
        if (!this.problemType) {
        alert('Please select a problem type');
        return false;
        }
        
        if (this.selectedMetrics.length === 0) {
        alert('Please select at least one metric');
        return false;
        }
        
        if (this.selectedFunctions.length === 0) {
        alert('Please select at least one function');
        return false;
        }
        
        // Check if all selected functions have at least one tool
        let missingTools = false;
        this.selectedFunctions.forEach(func => {
        if (!this.selectedTools[func] || this.selectedTools[func].length === 0) {
            missingTools = true;
        }
        });
        
        if (missingTools) {
        alert('Please select at least one tool for each function');
        return false;
        }
        
        if (this.selectedInstruments.length === 0) {
        alert('Please select at least one instrument');
        return false;
        }
        
        if (this.selectedOrbits.length === 0) {
        alert('Please select at least one orbit');
        return false;
        }
        
        return true;
    }
    }
  }
  </script>
  
  <style scoped>
  .selectable-items {
    max-height: 250px;
    overflow-y: auto;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
  }
  
  .selectable-item {
    padding: 0.5rem;
    cursor: pointer;
    border-bottom: 1px solid #f5f5f5;
  }
  
  .selectable-item:hover {
    background-color: #f5f5f5;
  }
  
  .selectable-item.is-selected {
    background-color: #3273dc;
    color: white;
  }
  
  .card {
    height: 100%;
  }
  </style>