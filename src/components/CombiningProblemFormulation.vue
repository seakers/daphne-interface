<!-- filepath: /Users/mahima/Documents/daphne-eo/daphne-interface/src/components/CombiningProblemFormulation.vue -->
<template>
    <div class="container">
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
                <button class="button is-primary" @click="saveConfiguration" :disabled="submitting">
                  <strong>Save Configuration</strong>
                </button>
                <a class="button is-light" href="index.html">Back to Home</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
  
      <!-- Main Content -->
      <div class="section">
        <div v-if="loading" class="has-text-centered">
          <p class="is-size-5">Loading data...</p>
          <progress class="progress is-primary" max="100"></progress>
        </div>
        
        <div v-else>
          <!-- Problem Identification -->
          <!-- <div class="box">
            <h3 class="title is-4">Problem Identification</h3>
            <div class="field">
              <label class="label">Problem Name</label>
              <div class="control">
                <input class="input" type="text" placeholder="Enter problem name" v-model="problemName">
              </div>
            </div>
            <div class="field">
              <label class="label">Problem Type</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="problemType" disabled>
                    <option value="combining">Combinatorial</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
   -->
          <!-- Evaluation Space -->
          <div class="box">
            <h3 class="title is-4">Evaluation Space</h3>
            
            <div class="columns">
                <!-- Metrics Column -->
                <div class="column is-half">
                <h4 class="title is-5">Metrics</h4>
                <div class="field" v-for="(metric, idx) in metrics" :key="'metric-' + idx">
                    <div class="control">
                    <label class="checkbox">
                        <input type="checkbox" :value="metric" v-model="selectedMetrics">
                        {{ metric }}
                    </label>
                    <div v-if="selectedMetrics.includes(metric)" class="is-pulled-right">
                        <div class="select is-small">
                        <select v-model="metricOptions[metric]">
                            <option value="min">Minimize</option>
                            <option value="max">Maximize</option>
                        </select>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                
                <!-- Functions Column -->
                <div class="column is-half">
                <h4 class="title is-5">Functions</h4>
                <div class="field" v-for="func in functionNames" :key="'func-' + func">
                    <div class="control">
                    <label class="checkbox">
                        <input type="checkbox" :value="func" v-model="selectedFunctions" @change="onFunctionChange(func)">
                        {{ func }}
                    </label>
                    </div>
                    <div v-if="selectedFunctions.includes(func)" class="ml-4">
                    <p class="is-size-6"><strong>Tools for {{ func }}</strong></p>
                    <div class="field" v-for="(tool, tIndex) in getFunctionTools(func)" :key="'tool-' + tIndex">
                        <div class="control">
                        <label class="radio">
                            <input type="radio" :value="tool" v-model="selectedTools[func]">
                            {{ tool }}
                        </label>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
  
          <!-- Design Space -->
          <div class="box">
            <h3 class="title is-4">Design Space</h3>
            
            <!-- Constellation Parameters -->
            <h4 class="title is-5">Constellation Parameters</h4>
            <div class="columns is-multiline">
              <!-- Constellation Type -->
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">
                    Constellation Type
                  </label>
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select v-model="fixedValues.constellationType" disabled>
                        <option value="DELTA_HOMOGENEOUS">DELTA_HOMOGENEOUS</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Number of Satellites -->
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">
                    Number of Satellites
                    <label class="checkbox is-pulled-right">
                      <input type="checkbox" v-model="designVariables.numberSatellites"> Design Variable
                    </label>
                  </label>
                  <div v-if="designVariables.numberSatellites">
                    <div class="field has-addons" v-for="(val, idx) in designValues.numberSatellites" :key="'sat-' + idx">
                      <div class="control is-expanded">
                        <input class="input" type="number" placeholder="Value" v-model.number="designValues.numberSatellites[idx]">
                      </div>
                      <div class="control">
                        <button class="button is-danger" @click="removeDesignValue('numberSatellites', idx)" :disabled="designValues.numberSatellites.length <= 1">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <button class="button is-small is-primary mt-2" @click="addDesignValue('numberSatellites')">
                      <i class="fas fa-plus"></i> Add Value
                    </button>
                  </div>
                  <div v-else>
                    <input class="input" type="number" v-model.number="fixedValues.numberSatellites">
                  </div>
                </div>
              </div>
              
              <!-- Number of Planes -->
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">
                    Number of Planes
                    <label class="checkbox is-pulled-right">
                      <input type="checkbox" v-model="designVariables.numberPlanes"> Design Variable
                    </label>
                  </label>
                  <div v-if="designVariables.numberPlanes">
                    <div class="field has-addons" v-for="(val, idx) in designValues.numberPlanes" :key="'planes-' + idx">
                      <div class="control is-expanded">
                        <input class="input" type="number" placeholder="Value" v-model.number="designValues.numberPlanes[idx]">
                      </div>
                      <div class="control">
                        <button class="button is-danger" @click="removeDesignValue('numberPlanes', idx)" :disabled="designValues.numberPlanes.length <= 1">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <button class="button is-small is-primary mt-2" @click="addDesignValue('numberPlanes')">
                      <i class="fas fa-plus"></i> Add Value
                    </button>
                  </div>
                  <div v-else>
                    <input class="input" type="number" v-model.number="fixedValues.numberPlanes">
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Orbit Parameters -->
            <h4 class="title is-5 mt-4">Orbit Parameters</h4>
            <div class="columns is-multiline">
              <!-- Orbit Type -->
              <div class="column is-one-third">
                <div class="field">
                    <label class="label">
                    Orbit Type
                    <label class="checkbox is-pulled-right">
                        <input type="checkbox" v-model="designVariables.orbitType"> Design Variable
                    </label>
                    </label>
                    <div v-if="designVariables.orbitType">
                    <div class="field has-addons" v-for="(val, idx) in designValues.orbitType" :key="'orbit-' + idx">
                        <div class="control is-expanded">
                        <div class="select is-fullwidth">
                            <select v-model="designValues.orbitType[idx]">
                            <option v-for="type in orbitTypes" :key="type" :value="type">{{ type }}</option>
                            </select>
                        </div>
                        </div>
                        <div class="control">
                        <button class="button is-danger" @click="removeDesignValue('orbitType', idx)" :disabled="designValues.orbitType.length <= 1">
                            <i class="fas fa-trash"></i>
                        </button>
                        </div>
                    </div>
                    <button class="button is-small is-primary mt-2" @click="addDesignValue('orbitType')">
                        <i class="fas fa-plus"></i> Add Orbit Type
                    </button>
                    </div>
                    <div v-else>
                    <div class="select is-fullwidth">
                        <select v-model="fixedValues.orbitType">
                        <option v-for="type in orbitTypes" :key="type" :value="type">{{ type }}</option>
                        </select>
                    </div>
                    </div>
                </div>
              </div>
  
              <!-- Altitude -->
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">
                    Altitude (km)
                    <label class="checkbox is-pulled-right">
                      <input type="checkbox" v-model="designVariables.altitude"> Design Variable
                    </label>
                  </label>
                  <div v-if="designVariables.altitude">
                    <div class="field has-addons" v-for="(val, idx) in designValues.altitude" :key="'alt-' + idx">
                      <div class="control is-expanded">
                        <input class="input" type="number" placeholder="Value" v-model.number="designValues.altitude[idx]">
                      </div>
                      <div class="control">
                        <button class="button is-danger" @click="removeDesignValue('altitude', idx)" :disabled="designValues.altitude.length <= 1">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <button class="button is-small is-primary mt-2" @click="addDesignValue('altitude')">
                      <i class="fas fa-plus"></i> Add Value
                    </button>
                  </div>
                  <div v-else>
                    <input class="input" type="number" v-model.number="fixedValues.altitude">
                  </div>
                </div>
              </div>
              
              <!-- Inclination -->
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">
                    Inclination (deg)
                    <label class="checkbox is-pulled-right">
                      <input type="checkbox" v-model="designVariables.inclination"> Design Variable
                    </label>
                  </label>
                  <div v-if="designVariables.inclination">
                    <div class="field has-addons" v-for="(val, idx) in designValues.inclination" :key="'inc-' + idx">
                      <div class="control is-expanded">
                        <input class="input" type="number" placeholder="Value" v-model.number="designValues.inclination[idx]">
                      </div>
                      <div class="control">
                        <button class="button is-danger" @click="removeDesignValue('inclination', idx)" :disabled="designValues.inclination.length <= 1">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <button class="button is-small is-primary mt-2" @click="addDesignValue('inclination')">
                      <i class="fas fa-plus"></i> Add Value
                    </button>
                  </div>
                  <div v-else>
                    <input class="input" type="number" v-model.number="fixedValues.inclination">
                  </div>
                </div>
              </div>
              
              <!-- Eccentricity -->
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">Eccentricity</label>
                  <div class="control">
                    <input class="input" type="number" v-model.number="fixedValues.eccentricity" disabled>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Satellite Parameters -->
            <h4 class="title is-5 mt-4">Satellite Parameters</h4>
            <div class="columns is-multiline">
              <!-- Satellite Name -->
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">Satellite Name</label>
                  <div class="control">
                    <input class="input" type="text" v-model="fixedValues.satelliteName" disabled>
                  </div>
                </div>
              </div>
              
              <!-- Satellite Mass -->
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">Mass (kg)</label>
                  <div class="control">
                    <input class="input" type="number" v-model.number="fixedValues.satelliteMass" disabled>
                  </div>
                </div>
              </div>
              
              <!-- Dry Mass -->
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">Dry Mass (kg)</label>
                  <div class="control">
                    <input class="input" type="number" v-model.number="fixedValues.satelliteDryMass" disabled>
                  </div>
                </div>
              </div>
              
              <!-- Volume -->
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">Volume (m³)</label>
                  <div class="control">
                    <input class="input" type="number" v-model.number="fixedValues.satelliteVolume" disabled>
                  </div>
                </div>
              </div>
              
              <!-- Power -->
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">Power (W)</label>
                  <div class="control">
                    <input class="input" type="number" v-model.number="fixedValues.satellitePower" disabled>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Instrument Parameters -->
            <h4 class="title is-5 mt-4">Instrument Parameters</h4>
            <div class="columns is-multiline">
              <!-- Scan Technique -->
                <div class="column is-one-third">
                    <div class="field">
                        <label class="label">
                        Scan Technique
                        <label class="checkbox is-pulled-right">
                            <input type="checkbox" v-model="designVariables.scanTechnique"> Design Variable
                        </label>
                        </label>
                        <div v-if="designVariables.scanTechnique">
                        <div class="field has-addons" v-for="(val, idx) in designValues.scanTechnique" :key="'scan-' + idx">
                            <div class="control is-expanded">
                            <div class="select is-fullwidth">
                                <select v-model="designValues.scanTechnique[idx]">
                                <option v-for="technique in scanTechniques" :key="technique" :value="technique">{{ technique }}</option>
                                </select>
                            </div>
                            </div>
                            <div class="control">
                            <button class="button is-danger" @click="removeDesignValue('scanTechnique', idx)" :disabled="designValues.scanTechnique.length <= 1">
                                <i class="fas fa-trash"></i>
                            </button>
                            </div>
                        </div>
                        <button class="button is-small is-primary mt-2" @click="addDesignValue('scanTechnique')">
                            <i class="fas fa-plus"></i> Add Scan Technique
                        </button>
                        </div>
                        <div v-else>
                        <div class="select is-fullwidth">
                            <select v-model="fixedValues.scanTechnique">
                            <option v-for="technique in scanTechniques" :key="technique" :value="technique">{{ technique }}</option>
                            </select>
                        </div>
                        </div>
                    </div>
                </div>
              
              <!-- Focal Length -->
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">
                    Focal Length (m)
                    <label class="checkbox is-pulled-right">
                      <input type="checkbox" v-model="designVariables.focalLength"> Design Variable
                    </label>
                  </label>
                  <div v-if="designVariables.focalLength">
                    <div class="field has-addons" v-for="(val, idx) in designValues.focalLength" :key="'fl-' + idx">
                      <div class="control is-expanded">
                        <input class="input" type="number" step="0.1" placeholder="Value" v-model.number="designValues.focalLength[idx]">
                      </div>
                      <div class="control">
                        <button class="button is-danger" @click="removeDesignValue('focalLength', idx)" :disabled="designValues.focalLength.length <= 1">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <button class="button is-small is-primary mt-2" @click="addDesignValue('focalLength')">
                      <i class="fas fa-plus"></i> Add Value
                    </button>
                  </div>
                  <div v-else>
                    <input class="input" type="number" step="0.1" v-model.number="fixedValues.focalLength">
                  </div>
                </div>
              </div>
              
              <!-- Aperture Diameter -->
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">
                    Aperture Diameter (m)
                    <label class="checkbox is-pulled-right">
                      <input type="checkbox" v-model="designVariables.apertureDia"> Design Variable
                    </label>
                  </label>
                  <div v-if="designVariables.apertureDia">
                    <div class="field has-addons" v-for="(val, idx) in designValues.apertureDia" :key="'ap-' + idx">
                      <div class="control is-expanded">
                        <input class="input" type="number" step="0.1" placeholder="Value" v-model.number="designValues.apertureDia[idx]">
                      </div>
                      <div class="control">
                        <button class="button is-danger" @click="removeDesignValue('apertureDia', idx)" :disabled="designValues.apertureDia.length <= 1">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <button class="button is-small is-primary mt-2" @click="addDesignValue('apertureDia')">
                      <i class="fas fa-plus"></i> Add Value
                    </button>
                  </div>
                  <div v-else>
                    <input class="input" type="number" step="0.1" v-model.number="fixedValues.apertureDia">
                  </div>
                </div>
              </div>

              <!-- Number of Detectors (Along-Track) -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Detectors (Along-Track)
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.numberOfDetectorsRowsAlongTrack"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.numberOfDetectorsRowsAlongTrack">
                <div class="field has-addons" v-for="(val, idx) in designValues.numberOfDetectorsRowsAlongTrack" :key="'det-row-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="1" placeholder="Value" v-model.number="designValues.numberOfDetectorsRowsAlongTrack[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('numberOfDetectorsRowsAlongTrack', idx)" :disabled="designValues.numberOfDetectorsRowsAlongTrack.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('numberOfDetectorsRowsAlongTrack')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="1" v-model.number="fixedValues.numberOfDetectorsRowsAlongTrack">
                </div>
            </div>
            </div>
              
              <!-- Number of Detectors (Cross-Track) -->
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">
                    Detectors (Cross-Track)
                    <label class="checkbox is-pulled-right">
                      <input type="checkbox" v-model="designVariables.numberOfDetectorsColsCrossTrack"> Design Variable
                    </label>
                  </label>
                  <div v-if="designVariables.numberOfDetectorsColsCrossTrack">
                    <div class="field has-addons" v-for="(val, idx) in designValues.numberOfDetectorsColsCrossTrack" :key="'det-' + idx">
                      <div class="control is-expanded">
                        <input class="input" type="number" step="100" placeholder="Value" v-model.number="designValues.numberOfDetectorsColsCrossTrack[idx]">
                      </div>
                      <div class="control">
                        <button class="button is-danger" @click="removeDesignValue('numberOfDetectorsColsCrossTrack', idx)" :disabled="designValues.numberOfDetectorsColsCrossTrack.length <= 1">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <button class="button is-small is-primary mt-2" @click="addDesignValue('numberOfDetectorsColsCrossTrack')">
                      <i class="fas fa-plus"></i> Add Value
                    </button>
                  </div>
                  <div v-else>
                    <input class="input" type="number" step="100" v-model.number="fixedValues.numberOfDetectorsColsCrossTrack">
                  </div>
                </div>
              </div>
              
              <!-- F-Number -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                F-Number
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.Fnum"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.Fnum">
                <div class="field has-addons" v-for="(val, idx) in designValues.Fnum" :key="'fnum-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="0.1" placeholder="Value" v-model.number="designValues.Fnum[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('Fnum', idx)" :disabled="designValues.Fnum.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('Fnum')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="0.1" v-model.number="fixedValues.Fnum">
                </div>
            </div>
            </div>

            <!-- Operating Wavelength -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Operating Wavelength (m)
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.operatingWavelength"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.operatingWavelength">
                <div class="field has-addons" v-for="(val, idx) in designValues.operatingWavelength" :key="'wave-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="1e-7" placeholder="Value" v-model.number="designValues.operatingWavelength[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('operatingWavelength', idx)" :disabled="designValues.operatingWavelength.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('operatingWavelength')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="1e-7" v-model.number="fixedValues.operatingWavelength">
                </div>
            </div>
            </div>

            <!-- Bandwidth -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Bandwidth (m)
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.bandwidth"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.bandwidth">
                <div class="field has-addons" v-for="(val, idx) in designValues.bandwidth" :key="'bw-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="1e-7" placeholder="Value" v-model.number="designValues.bandwidth[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('bandwidth', idx)" :disabled="designValues.bandwidth.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('bandwidth')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="1e-7" v-model.number="fixedValues.bandwidth">
                </div>
            </div>
            </div>

            <!-- Optical System Efficiency -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Optical System Efficiency
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.opticsSysEff"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.opticsSysEff">
                <div class="field has-addons" v-for="(val, idx) in designValues.opticsSysEff" :key="'ose-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="0.05" min="0" max="1" placeholder="Value" v-model.number="designValues.opticsSysEff[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('opticsSysEff', idx)" :disabled="designValues.opticsSysEff.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('opticsSysEff')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="0.05" min="0" max="1" v-model.number="fixedValues.opticsSysEff">
                </div>
            </div>
            </div>

            <!-- Quantum Efficiency -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Quantum Efficiency
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.quantumEff"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.quantumEff">
                <div class="field has-addons" v-for="(val, idx) in designValues.quantumEff" :key="'qe-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="0.05" min="0" max="1" placeholder="Value" v-model.number="designValues.quantumEff[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('quantumEff', idx)" :disabled="designValues.quantumEff.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('quantumEff')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="0.05" min="0" max="1" v-model.number="fixedValues.quantumEff">
                </div>
            </div>
            </div>

            <!-- Number of Read Out Electronics -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Read Out Electronics
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.numOfReadOutE"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.numOfReadOutE">
                <div class="field has-addons" v-for="(val, idx) in designValues.numOfReadOutE" :key="'roe-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="1" placeholder="Value" v-model.number="designValues.numOfReadOutE[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('numOfReadOutE', idx)" :disabled="designValues.numOfReadOutE.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('numOfReadOutE')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="1" v-model.number="fixedValues.numOfReadOutE">
                </div>
            </div>
            </div>

            <!-- Target Black Body Temperature -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Black Body Temp (K)
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.targetBlackBodyTemp"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.targetBlackBodyTemp">
                <div class="field has-addons" v-for="(val, idx) in designValues.targetBlackBodyTemp" :key="'temp-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="1" placeholder="Value" v-model.number="designValues.targetBlackBodyTemp[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('targetBlackBodyTemp', idx)" :disabled="designValues.targetBlackBodyTemp.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('targetBlackBodyTemp')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="1" v-model.number="fixedValues.targetBlackBodyTemp">
                </div>
            </div>
            </div>

            <!-- Detector Width -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Detector Width (m)
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.detectorWidth"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.detectorWidth">
                <div class="field has-addons" v-for="(val, idx) in designValues.detectorWidth" :key="'dw-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="1e-6" placeholder="Value" v-model.number="designValues.detectorWidth[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('detectorWidth', idx)" :disabled="designValues.detectorWidth.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('detectorWidth')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="1e-6" v-model.number="fixedValues.detectorWidth">
                </div>
            </div>
            </div>

            <!-- Max Detector Exposure Time -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Max Exposure Time (s)
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.maxDetectorExposureTime"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.maxDetectorExposureTime">
                <div class="field has-addons" v-for="(val, idx) in designValues.maxDetectorExposureTime" :key="'exp-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="0.0001" placeholder="Value" v-model.number="designValues.maxDetectorExposureTime[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('maxDetectorExposureTime', idx)" :disabled="designValues.maxDetectorExposureTime.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('maxDetectorExposureTime')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="0.0001" v-model.number="fixedValues.maxDetectorExposureTime">
                </div>
            </div>
            </div>

            <!-- SNR Threshold -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                SNR Threshold
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.snrThreshold"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.snrThreshold">
                <div class="field has-addons" v-for="(val, idx) in designValues.snrThreshold" :key="'snr-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="1" placeholder="Value" v-model.number="designValues.snrThreshold[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('snrThreshold', idx)" :disabled="designValues.snrThreshold.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('snrThreshold')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="1" v-model.number="fixedValues.snrThreshold">
                </div>
            </div>
            </div>

            <!-- Instrument Name -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">Instrument Name</label>
                <div class="control">
                <input class="input" type="text" v-model="fixedValues.instrumentName" disabled>
                </div>
            </div>
            </div>

            <!-- Instrument Mass -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Instrument Mass (kg)
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.instrumentMass"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.instrumentMass">
                <div class="field has-addons" v-for="(val, idx) in designValues.instrumentMass" :key="'im-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="0.5" placeholder="Value" v-model.number="designValues.instrumentMass[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('instrumentMass', idx)" :disabled="designValues.instrumentMass.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('instrumentMass')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="0.5" v-model.number="fixedValues.instrumentMass">
                </div>
            </div>
            </div>

            <!-- Instrument Volume -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Instrument Volume (m³)
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.instrumentVolume"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.instrumentVolume">
                <div class="field has-addons" v-for="(val, idx) in designValues.instrumentVolume" :key="'iv-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="0.01" placeholder="Value" v-model.number="designValues.instrumentVolume[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('instrumentVolume', idx)" :disabled="designValues.instrumentVolume.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('instrumentVolume')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="0.01" v-model.number="fixedValues.instrumentVolume">
                </div>
            </div>
            </div>

            <!-- Instrument Power -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Instrument Power (W)
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.instrumentPower"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.instrumentPower">
                <div class="field has-addons" v-for="(val, idx) in designValues.instrumentPower" :key="'ip-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="1" placeholder="Value" v-model.number="designValues.instrumentPower[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('instrumentPower', idx)" :disabled="designValues.instrumentPower.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('instrumentPower')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="1" v-model.number="fixedValues.instrumentPower">
                </div>
            </div>
            </div>

            <!-- Sensor Orientation -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">Orientation Convention</label>
                <div class="control">
                <div class="select is-fullwidth">
                    <select v-model="fixedValues.orientationConvention" disabled>
                    <option value="SIDE_LOOK">SIDE_LOOK</option>
                    </select>
                </div>
                </div>
            </div>
            </div>

            <!-- Side Look Angle -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Side Look Angle (deg)
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.sideLookAngle"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.sideLookAngle">
                <div class="field has-addons" v-for="(val, idx) in designValues.sideLookAngle" :key="'sla-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="5" placeholder="Value" v-model.number="designValues.sideLookAngle[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('sideLookAngle', idx)" :disabled="designValues.sideLookAngle.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('sideLookAngle')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="5" v-model.number="fixedValues.sideLookAngle">
                </div>
            </div>
            </div>

            <!-- Field of View Section -->
            <div class="column is-full">
            <h5 class="title is-6">Field of View</h5>
            </div>

            <!-- Sensor Geometry -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">Sensor Geometry</label>
                <div class="control">
                <div class="select is-fullwidth">
                    <select v-model="fixedValues.sensorGeometry" disabled>
                    <option value="RECTANGULAR">RECTANGULAR</option>
                    </select>
                </div>
                </div>
            </div>
            </div>

            <!-- Full Cone Angle -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Full Cone Angle (deg)
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.fullConeAngle"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.fullConeAngle">
                <div class="field has-addons" v-for="(val, idx) in designValues.fullConeAngle" :key="'fca-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="5" placeholder="Value" v-model.number="designValues.fullConeAngle[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('fullConeAngle', idx)" :disabled="designValues.fullConeAngle.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('fullConeAngle')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="5" v-model.number="fixedValues.fullConeAngle">
                </div>
            </div>
            </div>

            <!-- Along Track FOV -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Along Track FOV (deg)
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.alongTrackFieldOfView"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.alongTrackFieldOfView">
                <div class="field has-addons" v-for="(val, idx) in designValues.alongTrackFieldOfView" :key="'atfov-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="5" placeholder="Value" v-model.number="designValues.alongTrackFieldOfView[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('alongTrackFieldOfView', idx)" :disabled="designValues.alongTrackFieldOfView.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('alongTrackFieldOfView')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="5" v-model.number="fixedValues.alongTrackFieldOfView">
                </div>
            </div>
            </div>

            <!-- Cross Track FOV -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Cross Track FOV (deg)
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.crossTrackFieldOfView"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.crossTrackFieldOfView">
                <div class="field has-addons" v-for="(val, idx) in designValues.crossTrackFieldOfView" :key="'ctfov-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="5" placeholder="Value" v-model.number="designValues.crossTrackFieldOfView[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('crossTrackFieldOfView', idx)" :disabled="designValues.crossTrackFieldOfView.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('crossTrackFieldOfView')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="5" v-model.number="fixedValues.crossTrackFieldOfView">
                </div>
            </div>
            </div>

            <!-- Height FOV Angle -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Height FOV Angle (rad)
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.angleHeightFov"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.angleHeightFov">
                <div class="field has-addons" v-for="(val, idx) in designValues.angleHeightFov" :key="'hfov-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="0.1" placeholder="Value" v-model.number="designValues.angleHeightFov[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('angleHeightFov', idx)" :disabled="designValues.angleHeightFov.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('angleHeightFov')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="0.1" v-model.number="fixedValues.angleHeightFov">
                </div>
            </div>
            </div>

            <!-- Width FOV Angle -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">
                Width FOV Angle (deg)
                <label class="checkbox is-pulled-right">
                    <input type="checkbox" v-model="designVariables.angleWidthFov"> Design Variable
                </label>
                </label>
                <div v-if="designVariables.angleWidthFov">
                <div class="field has-addons" v-for="(val, idx) in designValues.angleWidthFov" :key="'wfov-' + idx">
                    <div class="control is-expanded">
                    <input class="input" type="number" step="5" placeholder="Value" v-model.number="designValues.angleWidthFov[idx]">
                    </div>
                    <div class="control">
                    <button class="button is-danger" @click="removeDesignValue('angleWidthFov', idx)" :disabled="designValues.angleWidthFov.length <= 1">
                        <i class="fas fa-trash"></i>
                    </button>
                    </div>
                </div>
                <button class="button is-small is-primary mt-2" @click="addDesignValue('angleWidthFov')">
                    <i class="fas fa-plus"></i> Add Value
                </button>
                </div>
                <div v-else>
                <input class="input" type="number" step="5" v-model.number="fixedValues.angleWidthFov">
                </div>
            </div>
            </div>

            <!-- Tech Readiness Level -->
            <div class="column is-one-third">
            <div class="field">
                <label class="label">Tech Readiness Level</label>
                <div class="control">
                <input class="input" type="number" v-model.number="fixedValues.techReadinessLevel" disabled>
                </div>
            </div>
            </div>

              <!-- Data Rate -->
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">
                    Data Rate (Mbps)
                    <label class="checkbox is-pulled-right">
                      <input type="checkbox" v-model="designVariables.dataRate"> Design Variable
                    </label>
                  </label>
                  <div v-if="designVariables.dataRate">
                    <div class="field has-addons" v-for="(val, idx) in designValues.dataRate" :key="'dr-' + idx">
                      <div class="control is-expanded">
                        <input class="input" type="number" placeholder="Value" v-model.number="designValues.dataRate[idx]">
                      </div>
                      <div class="control">
                        <button class="button is-danger" @click="removeDesignValue('dataRate', idx)" :disabled="designValues.dataRate.length <= 1">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <button class="button is-small is-primary mt-2" @click="addDesignValue('dataRate')">
                      <i class="fas fa-plus"></i> Add Value
                    </button>
                  </div>
                  <div v-else>
                    <input class="input" type="number" v-model.number="fixedValues.dataRate">
                  </div>
                </div>
              </div>
              
              <!-- Bits Per Pixel -->
              <div class="column is-one-third">
                <div class="field">
                  <label class="label">
                    Bits Per Pixel
                    <label class="checkbox is-pulled-right">
                      <input type="checkbox" v-model="designVariables.bitsPerPixel"> Design Variable
                    </label>
                  </label>
                  <div v-if="designVariables.bitsPerPixel">
                    <div class="field has-addons" v-for="(val, idx) in designValues.bitsPerPixel" :key="'bpp-' + idx">
                      <div class="control is-expanded">
                        <input class="input" type="number" placeholder="Value" v-model.number="designValues.bitsPerPixel[idx]">
                      </div>
                      <div class="control">
                        <button class="button is-danger" @click="removeDesignValue('bitsPerPixel', idx)" :disabled="designValues.bitsPerPixel.length <= 1">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <button class="button is-small is-primary mt-2" @click="addDesignValue('bitsPerPixel')">
                      <i class="fas fa-plus"></i> Add Value
                    </button>
                  </div>
                  <div v-else>
                    <input class="input" type="number" v-model.number="fixedValues.bitsPerPixel">
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Analysis Settings -->
          <div class="box">
            <h3 class="title is-4">Settings</h3>
            
            <!-- Search Strategy -->
            <div class="field">
            <label class="label">Search Strategy</label>
            <div class="control">
                <input class="input" type="text" v-model="settings.searchStrategy" placeholder="MOEA">
            </div>
            </div>

            <!-- Proxy Models and Other Settings -->
            <div class="columns is-multiline">
                <div class="column is-half">
                <div class="field">
                    <label class="checkbox">
                    <input type="checkbox" v-model="settings.proxyInstrument">
                    Proxy Instrument
                    </label>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="checkbox">
                    <input type="checkbox" v-model="settings.proxyCostRisk">
                    Proxy Cost Risk
                    </label>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="checkbox">
                    <input type="checkbox" v-model="settings.proxyLaunch">
                    Proxy Launch
                    </label>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="checkbox">
                    <input type="checkbox" v-model="settings.proxyOrbits">
                    Proxy Orbits
                    </label>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="checkbox">
                    <input type="checkbox" v-model="settings.proxyValue">
                    Proxy Value
                    </label>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="checkbox">
                    <input type="checkbox" v-model="settings.proxyMaintenance">
                    Proxy Maintenance
                    </label>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="checkbox">
                    <input type="checkbox" v-model="settings.useCache">
                    Use Cache
                    </label>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="checkbox">
                    <input type="checkbox" v-model="settings.useThreading">
                    Use Threading
                    </label>
                </div>
                </div>
            </div>

            <!-- Search Parameters -->
            <h4 class="title is-5 mt-4">Search Parameters</h4>
            <div class="columns is-multiline">
                <div class="column is-half">
                <div class="field">
                    <label class="label">Max NFE</label>
                    <div class="control">
                    <input class="input" type="number" v-model.number="settings.searchParameters.maxNFE">
                    </div>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="label">Population Size</label>
                    <div class="control">
                    <input class="input" type="number" v-model.number="settings.searchParameters.populationSize">
                    </div>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="label">Epsilons</label>
                    <div class="control">
                    <input class="input" type="number" step="0.01" v-model.number="settings.searchParameters.epsilons">
                    </div>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="label">Size Tournament</label>
                    <div class="control">
                    <input class="input" type="number" v-model.number="settings.searchParameters.sizeTournament">
                    </div>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="label">P Crossover</label>
                    <div class="control">
                    <input class="input" type="number" step="0.1" min="0" max="1" v-model.number="settings.searchParameters.pCrossover">
                    </div>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="label">P Mutation</label>
                    <div class="control">
                    <input class="input" type="number" step="0.1" min="0" max="1" v-model.number="settings.searchParameters.pMutation">
                    </div>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="label">Alpha</label>
                    <div class="control">
                    <input class="input" type="number" step="0.1" min="0" max="1" v-model.number="settings.searchParameters.alpha">
                    </div>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="label">Beta</label>
                    <div class="control">
                    <input class="input" type="number" step="0.1" min="0" max="1" v-model.number="settings.searchParameters.beta">
                    </div>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="label">P Min</label>
                    <div class="control">
                    <input class="input" type="number" step="0.01" min="0" max="1" v-model.number="settings.searchParameters.pmin">
                    </div>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="label">NFE Trigger DM</label>
                    <div class="control">
                    <input class="input" type="number" v-model.number="settings.searchParameters.NFEtriggerDM">
                    </div>
                </div>
                </div>
                
                <div class="column is-half">
                <div class="field">
                    <label class="label">N Oper Repl</label>
                    <div class="control">
                    <input class="input" type="number" v-model.number="settings.searchParameters.nOperRepl">
                    </div>
                </div>
                </div>
                
                <!-- Integer Operators -->
                <div class="column is-full">
                <div class="field">
                    <label class="label">IOperators</label>
                    <div class="control">
                    <div class="select is-multiple is-fullwidth">
                        <select multiple v-model="settings.searchParameters.iOperators" size="3">
                        <option value="TwoPointCrossover">TwoPointCrossover</option>
                        <option value="IntegerUM">IntegerUM</option>
                        </select>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
  
          <!-- Submit Button -->
          <div class="field mt-5">
            <div class="control">
              <button class="button is-primary is-fullwidth" @click="saveConfiguration" :disabled="submitting">
                <span v-if="submitting">
                  <i class="fas fa-spinner fa-spin"></i> Saving...
                </span>
                <span v-else>
                  <i class="fas fa-save"></i> Save Configuration
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { fetchPost } from "../scripts/fetch-helpers";
  
  export default {
    name: "CombiningProblemFormulation",
    data() {
      return {
        loading: true,
        submitting: false,
        // Identification
        problemName: "Problem",
        problemType: "combining",
        // Evaluation
        metrics: [],
        scanTechniques: ["PUSHBROOM"],
        selectedMetrics: [],
        metricOptions: {},
        functions_tools: {},
        selectedFunctions: [],
        selectedTools: {},
        tools: {},
        orbitTypes:[],
        functions: [],
        // Design variables configuration:
        // If a flag is true, user provides an array from designValues; otherwise a single fixed value is used.
        designVariables: {
            numberSatellites: true,
            numberPlanes: false,
            altitude: true,
            inclination: true,
            focalLength: true,
            apertureDia: true,
            numberOfDetectorsColsCrossTrack: true,
            dataRate: true,
            bitsPerPixel: true,
            scanTechnique: false,
            numberOfDetectorsRowsAlongTrack: false,
            Fnum: false,
            operatingWavelength: false,
            bandwidth: false,
            opticsSysEff: false,
            quantumEff: false,
            numOfReadOutE: false,
            targetBlackBodyTemp: false,
            detectorWidth: false,
            maxDetectorExposureTime: false,
            snrThreshold: false,
            instrumentMass: false,
            instrumentVolume: false,
            instrumentPower: false,
            sideLookAngle: false,
            fullConeAngle: false,
            alongTrackFieldOfView: false,
            crossTrackFieldOfView: false,
            angleHeightFov: false,
            angleWidthFov: false,
        },
        // Default array values for design variables
        designValues: {
            numberSatellites: [1, 2, 3, 4, 5, 6],
            numberPlanes: [1, 2, 3, 4, 5],
            altitude: [400, 500, 600, 700, 800, 900],
            inclination: [30, 45, 60, 75, 90, 98],
            focalLength: [0.3, 0.4, 0.6, 0.8],
            apertureDia: [0.1, 0.2, 0.4, 0.6],
            numberOfDetectorsColsCrossTrack: [1000, 3000, 5000, 7000],
            dataRate: [10, 50, 100, 200, 500],
            bitsPerPixel: [4, 6, 8, 12, 16],
            scanTechnique: ["PUSHBROOM"],
            orbitType: ["SSO"],
            numberOfDetectorsRowsAlongTrack: [1, 2, 4, 8],
            Fnum: [2.0, 2.7, 3.5, 4.0],
            operatingWavelength: [4.0e-06, 4.2e-06, 4.5e-06],
            bandwidth: [1.5e-06, 1.9e-06, 2.2e-06],
            opticsSysEff: [0.65, 0.75, 0.85],
            quantumEff: [0.4, 0.5, 0.6],
            numOfReadOutE: [15, 25, 35],
            targetBlackBodyTemp: [280, 290, 300],
            detectorWidth: [2.5e-05, 3.0e-05, 3.5e-05],
            maxDetectorExposureTime: [0.0025, 0.0036, 0.0045],
            snrThreshold: [20, 25, 30],
            instrumentMass: [20, 28, 35],
            instrumentVolume: [0.1, 0.12, 0.15],
            instrumentPower: [25, 32, 40],
            sideLookAngle: [0, 15, 30],
            fullConeAngle: [20, 30, 40],
            alongTrackFieldOfView: [30, 40, 50],
            crossTrackFieldOfView: [90, 114, 130],
            angleHeightFov: [0.5, 0.628, 0.8],
            angleWidthFov: [100, 115.8, 130],
        },
        // Fixed values for non-design variable parameters
        fixedValues: {
            numberSatellites: 1,
            numberPlanes: 1,
            constellationType: "DELTA_HOMOGENEOUS",
            orbitType: "SSO",
            altitude: 600,
            inclination: 98,
            eccentricity: 0.0,
            satelliteName: "MicroMAS-2",
            satelliteMass: 28,
            satelliteDryMass: 2.5,
            satelliteVolume: 0.12,
            satellitePower: 9.1,
            scanTechnique: "PUSHBROOM",
            focalLength: 0.5,
            apertureDia: 0.2,
            Fnum: 2.7,
            operatingWavelength: 4.2e-06,
            bandwidth: 1.9e-06,
            opticsSysEff: 0.75,
            quantumEff: 0.5,
            numOfReadOutE: 25,
            targetBlackBodyTemp: 290,
            detectorWidth: 3.0e-05,
            maxDetectorExposureTime: 0.0036,
            snrThreshold: 25,
            numberOfDetectorsColsCrossTrack: 3000,
            dataRate: 100,
            bitsPerPixel: 8,
            numberOfDetectorsRowsAlongTrack: 1,
            instrumentName: "Landsat 10 Blue Band",
            instrumentMass: 28,
            instrumentVolume: 0.12,
            instrumentPower: 32,
            orientationConvention: "SIDE_LOOK",
            sideLookAngle: 0,
            sensorGeometry: "RECTANGULAR",
            fullConeAngle: 30,
            alongTrackFieldOfView: 40,
            crossTrackFieldOfView: 114,
            techReadinessLevel: 9,
            angleHeightFov: 0.628,
            angleWidthFov: 115.8,
        },
        // Analysis Settings
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
            populationSize: 50,
            epsilons: 0.05,
            sizeTournament: 2,
            pCrossover: 0.9,
            pMutation: 0.2,
            alpha: 0.8,
            beta: 0.7,
            pmin: 0.03,
            dOperators: [],
            iOperators: ["TwoPointCrossover", "IntegerUM"],
            NFEtriggerDM: 20,
            nOperRepl: 2
        }
        }
      };
    },
    computed: {
      // Return function names from tools dictionary
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
        this.orbitTypes = data.orbit_types || [];
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
      formatFunctionName(func) {
        return func.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
      },
      getFunctionTools(func) {
        return this.functions_tools[func] || [];
      },
      onFunctionChange(func) {
        if (this.selectedFunctions.includes(func) && !this.selectedTools[func]) {
          this.$set(this.selectedTools, func, []);
        }
      },
      addDesignValue(variable) {
        const vals = this.designValues[variable];
        const lastVal = vals[vals.length - 1];
        const newVal = typeof lastVal === "number" ? lastVal + (lastVal * 0.1) : lastVal;
        this.designValues[variable].push(newVal);
      },
      removeDesignValue(variable, idx) {
        if (this.designValues[variable].length > 1) {
          this.designValues[variable].splice(idx, 1);
        }
      },
      validateForm() {
        // Add any necessary form validations here.
        return true;
      },
      async saveConfiguration() {
        if (!this.validateForm()) return;
        this.submitting = true;
        try {
          // Format evaluation section
          const metricOpts = {};
          this.selectedMetrics.forEach(m => {
            metricOpts[m] = this.metricOptions[m] || "min";
          });
          const functionOpts = {};
          this.selectedFunctions.forEach(f => {
            functionOpts[f] = this.selectedTools[f] || [];
          });
          // Assemble the design space object:
          const designSpace = {
            spaceSegment: [{
              constellationType: "DELTA_HOMOGENEOUS",
              numberSatellites: this.designVariables.numberSatellites
                ? this.designValues.numberSatellites
                : this.fixedValues.numberSatellites,
              numberPlanes: this.designVariables.numberPlanes
                ? this.designValues.numberPlanes
                : this.fixedValues.numberPlanes,
              orbit: {
                orbitType: this.designVariables.orbitType
                  ? this.designValues.orbitType
                  : this.fixedValues.orbitType,
                altitude: this.designVariables.altitude
                  ? this.designValues.altitude
                  : this.fixedValues.altitude,
                inclination: this.designVariables.inclination
                  ? this.designValues.inclination
                  : this.fixedValues.inclination,
                eccentricity: this.fixedValues.eccentricity,
                "@type": "Orbit"
              },
              satellites: [{
                name: "MicroMAS-2",
                acronym: "MicroMAS-2",
                mass: 28,
                dryMass: 2.5,
                volume: 0.12,
                power: 9.1,
                commBand: ["X", "Ka"],
                payload: [{
                  id: "FireSat-Sensor",
                  scanTechnique: this.designVariables.scanTechnique
                    ? this.designValues.scanTechnique
                    : this.fixedValues.scanTechnique,
                  type: "passiveOpticalScanner",
                  numberOfDetectorsRowsAlongTrack: this.designVariables.numberOfDetectorsRowsAlongTrack
                    ? this.designValues.numberOfDetectorsRowsAlongTrack
                    : this.fixedValues.numberOfDetectorsRowsAlongTrack,
                  numberOfDetectorsColsCrossTrack: this.designVariables.numberOfDetectorsColsCrossTrack
                    ? this.designValues.numberOfDetectorsColsCrossTrack
                    : this.fixedValues.numberOfDetectorsColsCrossTrack,
                  Fnum: this.designVariables.Fnum
                    ? this.designValues.Fnum
                    : this.fixedValues.Fnum,
                  focalLength: this.designVariables.focalLength
                    ? this.designValues.focalLength
                    : this.fixedValues.focalLength,
                  apertureDia: this.designVariables.apertureDia
                    ? this.designValues.apertureDia
                    : this.fixedValues.apertureDia,
                  operatingWavelength: this.designVariables.operatingWavelength
                    ? this.designValues.operatingWavelength
                    : this.fixedValues.operatingWavelength,
                  bandwidth: this.designVariables.bandwidth
                    ? this.designValues.bandwidth
                    : this.fixedValues.bandwidth,
                  opticsSysEff: this.designVariables.opticsSysEff
                    ? this.designValues.opticsSysEff
                    : this.fixedValues.opticsSysEff,
                  quantumEff: this.designVariables.quantumEff
                    ? this.designValues.quantumEff
                    : this.fixedValues.quantumEff,
                  numOfReadOutE: this.designVariables.numOfReadOutE
                    ? this.designValues.numOfReadOutE
                    : this.fixedValues.numOfReadOutE,
                  targetBlackBodyTemp: this.designVariables.targetBlackBodyTemp
                    ? this.designValues.targetBlackBodyTemp
                    : this.fixedValues.targetBlackBodyTemp,
                  detectorWidth: this.designVariables.detectorWidth
                    ? this.designValues.detectorWidth
                    : this.fixedValues.detectorWidth,
                  maxDetectorExposureTime: this.designVariables.maxDetectorExposureTime
                    ? this.designValues.maxDetectorExposureTime
                    : this.fixedValues.maxDetectorExposureTime,
                  snrThreshold: this.designVariables.snrThreshold
                    ? this.designValues.snrThreshold
                    : this.fixedValues.snrThreshold,
                  name: "Landsat 10 Blue Band",
                  acronym: "Landsat 10 Blue Band",
                  mass: this.designVariables.instrumentMass
                    ? this.designValues.instrumentMass
                    : this.fixedValues.instrumentMass,
                  volume: this.designVariables.instrumentVolume
                    ? this.designValues.instrumentVolume
                    : this.fixedValues.instrumentVolume,
                  power: this.designVariables.instrumentPower
                    ? this.designValues.instrumentPower
                    : this.fixedValues.instrumentPower,
                  orientation: {
                    convention: "SIDE_LOOK",
                    sideLookAngle: this.designVariables.sideLookAngle
                      ? this.designValues.sideLookAngle
                      : this.fixedValues.sideLookAngle,
                    "@type": "Orientation"
                  },
                  fieldOfView: {
                    sensorGeometry: "RECTANGULAR",
                    fullConeAngle: this.designVariables.fullConeAngle
                      ? this.designValues.fullConeAngle
                      : this.fixedValues.fullConeAngle,
                    alongTrackFieldOfView: this.designVariables.alongTrackFieldOfView
                      ? this.designValues.alongTrackFieldOfView
                      : this.fixedValues.alongTrackFieldOfView,
                    crossTrackFieldOfView: this.designVariables.crossTrackFieldOfView
                      ? this.designValues.crossTrackFieldOfView
                      : this.fixedValues.crossTrackFieldOfView,
                    angle_height_fov: this.designVariables.angleHeightFov
                      ? this.designValues.angleHeightFov
                      : this.fixedValues.angleHeightFov,
                    angle_width_fov: this.designVariables.angleWidthFov
                      ? this.designValues.angleWidthFov
                      : this.fixedValues.angleWidthFov,
                    "@type": "FieldOfView"
                  },
                  dataRate: this.designVariables.dataRate
                    ? this.designValues.dataRate
                    : this.fixedValues.dataRate,
                  bitsPerPixel: this.designVariables.bitsPerPixel
                    ? this.designValues.bitsPerPixel
                    : this.fixedValues.bitsPerPixel,
                  techReadinessLevel: this.fixedValues.techReadinessLevel,
                  mountType: "BODY",
                  "@type": "Passive Optical Scanner"
                }],
                techReadinessLevel: 9,
                isGroundCommand: true,
                isSpare: false,
                propellantType: "MONO_PROP",
                stabilizationType: "AXIS_3",
                "@type": "Satellite"
              }],
              "@type": "Constellation"
            }]
          };
  
          // Build the final configuration object with evaluation, design, and settings
          const configuration = {
            problem_name: this.problemName,
            problem_type: this.problemType,
            evaluation: {
              metrics: metricOpts,
              functions: functionOpts
            },
            design: designSpace,
            settings: this.settings,
            // Also list which decisions are design variables
            combiningDecisions: Object.keys(this.designVariables).filter(key => this.designVariables[key])
          };
  
          console.log("Saving configuration:", configuration);
  
          // Use FormData to send JSON as before
          const reqData = new FormData();
          reqData.append("configuration", JSON.stringify(configuration));
          const response = await fetchPost(API_URL + "eoss/tse/start-combining-tse", reqData);
          console.log("API Response:", response);
          if (response && response.success) {
            alert("Problem configuration saved successfully!");
            if (response.task_id) {
              window.location.href = `/results?task_id=${response.task_id}`;
            }
          } else {
            alert("Error: " + (response.message || "Unknown error"));
          }
        } catch (error) {
          console.error("Error submitting configuration: ", error);
          alert("Failed to submit configuration. Please try again.");
        } finally {
          this.submitting = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    padding: 1rem;
  }
  .mt-2 {
    margin-top: 0.5rem;
  }
  .mt-4 {
    margin-top: 1rem;
  }
  .mt-5 {
    margin-top: 1.5rem;
  }
  .ml-4 {
    margin-left: 1rem;
  }
  </style>