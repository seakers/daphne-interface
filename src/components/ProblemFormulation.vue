<!-- filepath: /Users/mahima/Documents/daphne-eo/daphne-interface/src/components/ProblemFormulation.vue -->
<template>
    <section class="section problem-formulation">
      <div class="container is-fluid">
        <!-- Navbar -->
        <nav class="navbar is-light" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <a class="navbar-item" href="index.html">
              <strong>DAPHNE EO</strong>
            </a>
            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasic">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
          <div id="navbarBasic" class="navbar-menu">
            <div class="navbar-start">
              <div class="navbar-item">
                <h1 class="title is-4">Problem Formulation</h1>
              </div>
            </div>
          </div>
        </nav>
        
        <!-- Main Content -->
        <div class="section content-section">
          <div class="box">
            <!-- Problem type selection -->
            <div class="field">
              <label class="label">Select Problem Type</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="selectedProblemType">
                    <option disabled value="">-- Select problem type --</option>
                    <option value="assigning">Assigning</option>
                    <option value="combining">Combining</option>
                  </select>
                </div>
              </div>
            </div>
            <!-- Render dynamic child only if a problem type has been selected -->
            <component v-if="currentComponent" :is="currentComponent"></component>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import AssigningProblemFormulation from './AssigningProblemFormulation.vue';
  import CombiningProblemFormulation from './CombiningProblemFormulation.vue';
  
  export default {
    name: "ProblemFormulation",
    components: {
      AssigningProblemFormulation,
      CombiningProblemFormulation
    },
    data() {
      return {
        selectedProblemType: ""
      };
    },
    computed: {
      currentComponent() {
        if (this.selectedProblemType === "assigning") {
          return "AssigningProblemFormulation";
        } else if (this.selectedProblemType === "combining") {
          return "CombiningProblemFormulation";
        }
        return null;
      }
    }
  };
  </script>
  
  <style scoped>
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
  }
  
  .section.problem-formulation {
    min-height: 100vh;
    background: #f5f7fa;
    padding: 1rem 0;
  }
  
  /* Full-width container */
  .container.is-fluid {
    max-width: 100% !important;
    padding: 0 1.5rem;
  }
  
  /* Navbar tweaks for a clean look */
  .navbar {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .navbar .navbar-item h1.title {
    margin: 0;
  }
  
  /* Content section styling */
  .section.content-section {
    padding: 2rem 0;
  }
  
  /* Increase the content box width */
  .box {
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    padding: 2rem;
    width: 100%;
    max-width: 100%;  /* Increased max-width to use more space */
    margin: 0 auto;     /* Center the box horizontally if it's smaller than the screen */
  }
  
  /* Field and select styling */
  .field {
    margin-bottom: 1.5rem;
  }
  .select select {
    font-size: 1rem;
  }
  </style>