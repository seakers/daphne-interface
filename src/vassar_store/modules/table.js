import { vassar_query, vassar_insert, vassar_update } from "../../scripts/query-helpers";
import { Measurement_Attribute, Instrument_Attribute, Mission_Attribute, Orbit_Attribute, Launch_Vehicle_Attribute} from "../tables/attributes";
import { Walker_Mission_Analysis, Power_Mission_Analysis, Launch_Vehicle_Mission_Analysis } from "../tables/mission-analysis";
import { Group, Problem, auth_user } from "../tables/problems";
import { Requirement_Rule_Attribute, Requirement_Rule_Case } from "../tables/requirements";
import { Stakeholder_Needs_Panel, Stakeholder_Needs_Objective, Stakeholder_Needs_Subobjective } from "../tables/stakeholders";
import { Instrument, Instrument_Capability, Instrument_Characteristic } from "../tables/instruments"
import { migrations } from "../tables/migrations";
import * as _ from 'lodash-es';
import Vue from 'vue';

const state = {
    user_id: null,
    migrations: migrations,
    tables: {
        'auth_user': auth_user,
        'Group': Group,
        'Problem': Problem,

        'Instrument': Instrument,
        'Instrument_Capability': Instrument_Capability,
        'Instrument_Characteristic': Instrument_Characteristic,

        'Stakeholder_Needs_Panel': Stakeholder_Needs_Panel,
        'Stakeholder_Needs_Objective': Stakeholder_Needs_Objective,
        'Stakeholder_Needs_Subobjective': Stakeholder_Needs_Subobjective,

        'Requirement_Rule_Attribute': Requirement_Rule_Attribute,
        'Requirement_Rule_Case': Requirement_Rule_Case,

        'Walker_Mission_Analysis': Walker_Mission_Analysis,
        'Power_Mission_Analysis': Power_Mission_Analysis,
        'Launch_Vehicle_Mission_Analysis': Launch_Vehicle_Mission_Analysis,

        'Measurement_Attribute': Measurement_Attribute,
        'Instrument_Attribute': Instrument_Attribute,
        'Mission_Attribute': Mission_Attribute,
        'Orbit_Attribute': Orbit_Attribute,
        'Launch_Vehicle_Attribute': Launch_Vehicle_Attribute,
    },

};

const getters = {
    //--------------\\
    //  Get Tables  \\
    //--------------\\
    groups__group_table(state){
        return state.tables.Group;
    },
    problems__problem_table(state){
        return state.tables.Problem;
    },

    instruments__instrument_table(state){
        return state.tables.Instrument;
    },
    instruments__capability_table(state){
        return state.tables.Instrument_Capability;
    },
    instruments__characteristic_table(state){
        return state.tables.Instrument_Characteristic;
    },

    stakeholders__panel_table(state){
        return state.tables.Stakeholder_Needs_Panel;
    },
    stakeholders__objective_table(state){
        return state.tables.Stakeholder_Needs_Objective;
    },
    stakeholders__subobjective_table(state){
        return state.tables.Stakeholder_Needs_Subobjective;
    },

    requirements__case_table(state){
        return state.tables.Requirement_Rule_Attribute;
    },
    requirements__attribute_table(state){
        return state.tables.Requirement_Rule_Case;
    },

    analysis__walker_table(state){
        return state.tables.Walker_Mission_Analysis;
    },
    analysis__power_table(state){
        return state.tables.Power_Mission_Analysis;
    },
    analysis__launch_vehicle_table(state){
        return state.tables.Launch_Vehicle_Mission_Analysis;
    },

    attributes__measurement_table(state){
        return state.tables.Measurement_Attribute;
    },
    attributes__instrument_table(state){
        return state.tables.Instrument_Attribute;
    },
    attributes__mission_table(state){
        return state.tables.Mission_Attribute;
    },
    attributes__orbit_table(state){
        return state.tables.Orbit_Attribute;
    },
    attributes__launch_vehicle_table(state){
        return state.tables.Launch_Vehicle_Attribute;
    },


    //------------------\\
    //  Get Selections  \\
    //------------------\\
    groups__group_selection(state){
        return state.tables.Group.selected_id;
    },
    problems__problem_selection(state){
        return state.tables.Problem.selected_id;
    },

    instruments__instrument_selection(state){
        return state.tables.Instrument.selected_id;
    },
    instruments__capability_selection(state){
        return state.tables.Instrument_Capability.selected_id;
    },
    instruments__characteristic_selection(state){
        return state.tables.Instrument_Characteristic.selected_id;
    },

    stakeholders__panel_selection(state){
        return state.tables.Stakeholder_Needs_Panel.selected_id;
    },
    stakeholders__objective_selection(state){
        return state.tables.Stakeholder_Needs_Objective.selected_id;
    },
    stakeholders__subobjective_selection(state){
        return state.tables.Stakeholder_Needs_Subobjective.selected_id;
    },

    requirements__case_selection(state){
        return state.tables.Requirement_Rule_Attribute.selected_id;
    },
    requirements__attribute_selection(state){
        return state.tables.Requirement_Rule_Case.selected_id;
    },

    analysis__walker_selection(state){
        return state.tables.Walker_Mission_Analysis.selected_id;
    },
    analysis__power_selection(state){
        return state.tables.Power_Mission_Analysis.selected_id;
    },
    analysis__launch_vehicle_selection(state){
        return state.tables.Launch_Vehicle_Mission_Analysis.selected_id;
    },

    attributes__measurement_selection(state){
        return state.tables.Measurement_Attribute.selected_id;
    },
    attributes__instrument_selection(state){
        return state.tables.Instrument_Attribute.selected_id;
    },
    attributes__mission_selection(state){
        return state.tables.Mission_Attribute.selected_id;
    },
    attributes__orbit_selection(state){
        return state.tables.Orbit_Attribute.selected_id;
    },
    attributes__launch_vehicle_selection(state){
        return state.tables.Launch_Vehicle_Attribute.selected_id;
    },
};

const actions = {

    //--------------\\
    //  Query Rows  \\
    //--------------\\
    async query_groups({state, commit}){
        let pk = state.tables.auth_user.selected_id;
        let table = state.tables.Group;
        let query_return = await vassar_query(table, pk);
        commit('table__set_rows', query_return);

        // Iterate over all of the groups
        let group__row_objects = state.tables.Group.row_object_mapper[state.user_id];
        for(let x=0;x<group__row_objects.length;x++){
            let group__row_object_id = group__row_objects[x].objects.id;
            let query_problems = await vassar_query(state.tables.Problem, group__row_object_id);
            commit('table__set_rows', query_problems);

            let query_instruments = await vassar_query(state.tables.Instrument, group__row_object_id);
            commit('table__set_rows', query_instruments);
        }
    },

    async query_instruments({state, commit}){
        let instrument__row_objects = state.tables.Instrument.row_object_mapper[state.tables.Group.selected_id];
        for(let x=0;x<instrument__row_objects.length;x++){
            let instrument__row_object_id = instrument__row_objects[x].objects.id;
            let query_capabilities = await vassar_query(state.tables.Instrument_Capability, instrument__row_object_id);
            commit('table__set_rows', query_capabilities);

            let query_characteristics = await vassar_query(state.tables.Instrument_Characteristic, instrument__row_object_id);
            commit('table__set_rows', query_characteristics);
        }
    },

    async query__problem_info({state, commit}){

        // Mission Analysis
        let problem_id = state.tables.Problem.selected_id;
        for(let x=0;x<state.migrations.analysis.length;x++){
            let migration = state.migrations.analysis[x];
            let query_return = await vassar_query(state.tables[migration], problem_id);
            commit('table__set_rows', query_return);
        }
        // Requirement Rules
        for(let x=0;x<state.migrations.requirements.length;x++){
            let migration = state.migrations.requirements[x];
            let query_return = await vassar_query(state.tables[migration], problem_id);
            commit('table__set_rows', query_return);
        }
        // Attributes
        for(let x=0;x<state.migrations.attributes.length;x++){
            let migration = state.migrations.attributes[x];
            let query_return = await vassar_query(state.tables[migration], problem_id);
            commit('table__set_rows', query_return);
        }
        // --- Stakeholders 
        // Panels
        let query_return = await vassar_query(state.tables.Stakeholder_Needs_Panel, problem_id);
        commit('table__set_rows', query_return);

        // Objectives
        let panel_keys = Object.keys(state.tables.Stakeholder_Needs_Panel.row_object_mapper)
        for(let x=0;x<panel_keys.length;x++){
            let panel_key = panel_keys[x];
            let panel_rows = state.tables.Stakeholder_Needs_Panel.row_object_mapper[panel_key];
            for(let y=0;y<panel_rows.length;y++){
                let panel_row = panel_rows[y];
                let panel_row_id = panel_row.objects.id;
                let query_return = await vassar_query(state.tables.Stakeholder_Needs_Objective, panel_row_id);
                commit('table__set_rows', query_return);
            }
        }

        // Subobjectives
        let objective_keys = Object.keys(state.tables.Stakeholder_Needs_Objective.row_object_mapper)
        for(let x=0;x<objective_keys.length;x++){
            let objective_key = objective_keys[x];
            let objective_rows = state.tables.Stakeholder_Needs_Objective.row_object_mapper[objective_key];
            for(let y=0;y<objective_rows.length;y++){
                let objective_row = objective_rows[y];
                let objective_row_id = objective_row.objects.id;
                let query_return = await vassar_query(state.tables.Stakeholder_Needs_Subobjective, objective_row_id);
                commit('table__set_rows', query_return);
            }
        }
    },


    //--------------\\
    //  Select Row  \\
    //--------------\\
    async tables__unselect_tables({state, dispatch, commit}, table_name){

        // Recursively unselect all child tables
        let children = state.tables[table_name].relationship.child;
        if(children !== null){
            for(let x=0;x<children.length;x++){
                await dispatch('tables__unselect_tables', children[x]);
            }
        }
        // Unselect self
        commit('tables__unselect_table', table_name);
    },


    //------------\\
    //  Edit Row  \\
    //------------\\
    async tables__commit_edit({state, commit}, row_object){
        let table_selected = state.tables[row_object.table_name];
        let rows = table_selected.row_object_mapper[row_object.foreign_key];

        // Check for row changes
        if(JSON.stringify(row_object.items) != JSON.stringify(rows[row_object.index].items)){
            await vassar_update(row_object, row_object.table_name, table_selected.col_keys, table_selected.col_types);
            commit('tables__update_row', row_object);
            commit('tables__reset_edit_all', row_object);
        }
    },


    //--------------\\
    //  Insert Row  \\
    //--------------\\
    async tables__insert_row({state, commit}, row_object){
        console.log("INSERT ROW", row_object);
        let table = state.tables[row_object.table_name];
        let insert_object = await vassar_insert(table, row_object, row_object.foreign_key);
        commit('tables__insert_row_local', insert_object);
    },  
};




const mutations = {
    //--------------\\
    //  Query Rows  \\
    //--------------\\
    table__set_rows(state, params){
        if(params.row_objects.length === 0){return;}
        let row_object_mapper = state.tables[params.table_name].row_object_mapper;
        Vue.set(row_object_mapper, params.foreign_key, _.cloneDeep(params.row_objects));
    },

    //--------------\\
    //  Select Row  \\
    //--------------\\
    tables__unselect_table(state, table_name){ // SUPER NEW
        let table = state.tables[table_name];
        table.selected_id = null;
        table.selected_name = null;
        table.selected_index = null;
        let keys = Object.keys(table.row_object_mapper);
        for(let x=0;x<keys.length;x++){
            let key = keys[x];
            let rows = table.row_object_mapper[key];
            for(let y=0;y<rows.length;y++){
                let row = rows[y];
                row.selected_state = false;
            }
        }
    },
    tables__select_table(state, row_object){ // SUPER NEW
        let table = state.tables[row_object.table_name];
        table.selected_id = row_object.objects.id;
        table.selected_index = row_object.index;
        if(row_object.table_name === 'Group' || row_object.table_name === 'Problem'){
            table.selected_name = row_object.objects.name;
        }
        table.row_object_mapper[row_object.foreign_key][row_object.index].selected_state = true;
    },
    

    //------------\\
    //  Edit Row  \\
    //------------\\
    tables__set_edit_state(state, row_object){
        let table_selected = state.tables[row_object.table_name];
        let rows = table_selected.row_object_mapper[row_object.foreign_key];
        for(let x=0;x<rows.length;x++){
            if(row_object.index === rows[x].index){
                rows[x]['editing_state'] = !(rows[x]['editing_state']);
            }
            else{
                rows[x]['editing_state'] = false;
            }
        }
    },
    tables__update_row(state, row_object){
        let table_selected = state.tables[row_object.table_name];
        let rows = table_selected.row_object_mapper[row_object.foreign_key];

        // TODO: we clone the ITEMS but we don't clone the OBJECTS
        rows[row_object.index].items = _.cloneDeep(row_object.items);
        if(table_selected.selected_id === row_object.objects.id){
            table_selected.selected_id = row_object.objects.id;
            table_selected.selected_name = row_object.items[1];
        }
    },
    tables__reset_edit_all(state, row_object){
        let table_selected = state.tables[row_object.table_name];
        let rows = table_selected.row_object_mapper[row_object.foreign_key];
        for(let x=0;x<rows.length;x++){
            rows[x]['editing_state'] = false;
        }
    },

    //--------------\\
    //  Insert Row  \\
    //--------------\\
    tables__insert_row_local(state, insert_object){
        let table_selected = state.tables[insert_object.table_name];
        let rows = table_selected.row_object_mapper[insert_object.foreign_key];
        rows.push(insert_object);
    },

    



    user__set_id(state, user_id){
        state.user_id = user_id;
        state.tables.auth_user.selected_id = user_id;
    },
};



export default {
    state,
    getters,
    actions,
    mutations
}