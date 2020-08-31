import { client } from "../vassar";
import gql from "graphql-tag";
import {GetArchitectures, UpdateArchitectureStatusBatch} from "./instrument-queries";



const InsertProblem = gql`
mutation myMutation($group_id: Int, $problem_name: String) {
    insert_Problem_one(object: {group_id: $group_id, name: $problem_name, reload_problem: false}) {
    id
  }
}
`;

const ProblemDesigns = gql`
query MyQuery($problem_id: Int) {
  Architecture(where: {problem_id: {_eq: $problem_id}}) {
    problem_id
    user_id
    input
    science
    cost
    ga
    improve_hv
    eval_status
    critique
  }
}`;

const BulkDesignInsert = gql`
mutation myMutation($designs: [Architecture_insert_input!]!) {
  insert_Architecture(objects: $designs) {
    affected_rows
  }
}
`;


export async function clone_problem(old_problem_id, group_id, new_problem_name, clone_designs){


    // 1. INSERT GROUP PROBLEM
    let new_problem_id = await insert_new_group_problem(group_id, new_problem_name);

    // 2. CLONE DESIGNS
    if(clone_designs === true){
        await clone_problem_designs(old_problem_id, new_problem_id);
    }

    // 3. CLONE ENTRIES FROM: Join__Problem_Instrument
    await clone_problem_instrument_assignation(old_problem_id, new_problem_id);

    // 4. CLONE ENTRIES FROM: Join__Instrument_Characteristic
    await clone_problem_instrument_characteristics(old_problem_id, new_problem_id);

    // 5. CLONE ENTRIES FROM: Join__Problem_Orbit
    await clone_problem_orbit_assignation(old_problem_id, new_problem_id);

    // 6. CLONE ENTRIES FROM: Join__Problem_Launch_Vehicle
    await clone_problem_launch_vehicle_assignation(old_problem_id, new_problem_id);

    // 7. CLONE ENTRIES FROM: Inheritence_Attribute
    await clone_problem_inheritence_attributes(old_problem_id, new_problem_id);

    // 8. CLONE ENTRIES FROM: Fuzzy_Attribute
    await clone_problem_fuzzy_attributes(old_problem_id, new_problem_id);

    // 9. CLONE ENTRIES FROM: Mission_Attribute
    await clone_problem_mission_attributes(old_problem_id, new_problem_id);

    // 10. PROBLEM STAKEHOLDER INFORMATION
    await clone_problem_stakeholder_panels(old_problem_id, new_problem_id);

}



export async function insert_new_group_problem(group_id, new_problem_name){
    console.log("insert_new_group_problem");

    let problem_insert = await client.mutate({
        mutation: InsertProblem,
        variables: {
            group_id: group_id,
            problem_name: new_problem_name,
        },
        update: (cache, { data: { update_arch_status } }) => {console.log(update_arch_status);},
    });
    let new_problem_id = problem_insert.data.insert_Problem_one.id;
    console.log("--> NEW PROBLEM ID", new_problem_id);
    return new_problem_id;
}

export async function clone_problem_designs(old_problem_id, new_problem_id){
    console.log("clone_problem_designs");

    let old_designs = await client.query({
        deep: true,
        fetchPolicy: 'no-cache',
        query: ProblemDesigns,
        variables: {
            problem_id: old_problem_id,
        }
    });
    let designs = old_designs['data']['Architecture'];
    let designs_insert = [];

    // Iterate over designs and change problem id
    for(let x=0;x<designs.length;x++){
        // designs[x].problem_id = new_problem_id;
        let new_design = {
            'problem_id': new_problem_id,
            'user_id': designs[x].user_id,
            'input': designs[x].input,
            'science': designs[x].science,
            'cost': designs[x].cost,
            'ga': designs[x].ga,
            'improve_hv': designs[x].improve_hv,
            'eval_status': designs[x].eval_status,
            'critique': designs[x].critique,
        };
        designs_insert.push(new_design);
    }
    console.log("--> DESIGNS", designs);

    // Insert changed designs
    let insert_designs = await client.mutate({
        mutation: BulkDesignInsert,
        variables: {
            designs: designs_insert,
        },
        update: (cache, { data: { update_arch_status } }) => {console.log(update_arch_status);},
    });
    console.log("--> CLONED DESIGNS", insert_designs);
}

export async function clone_problem_instrument_assignation(old_problem_id, new_problem_id){
    console.log("clone_problem_instrument_assignation");

    // 1. QUERY ROWS
    const Query = gql`
        query myQuery($problem_id: Int) {
          Join__Problem_Instrument(where: {problem_id: {_eq: $problem_id}}) {
            instrument_id
            problem_id
          }
        }
    `;
    let rows_request = await client.query({
        deep: true,
        fetchPolicy: 'no-cache',
        query: Query,
        variables: {
            problem_id: old_problem_id,
        }
    });

    // 2. CLONE ROWS
    let rows = rows_request['data']['Join__Problem_Instrument'];
    let clones = [];
    for(let x=0;x<rows.length;x++){
        let clone = {
            'instrument_id': rows[x].instrument_id,
            'problem_id': new_problem_id
        };
        clones.push(clone);
    }

    // 3. INDEX CLONES
    const BulkInsert = gql`
        mutation myMutation($clones: [Join__Problem_Instrument_insert_input!]!) {
          insert_Join__Problem_Instrument(objects: $clones) {
            affected_rows
          }
        }
    `;
    let insert_clones = await client.mutate({
        mutation: BulkInsert,
        variables: {
            clones: clones,
        },
        update: (cache, { data: { update_arch_status } }) => {console.log(update_arch_status);},
    });
    console.log("--> CLONED Join__Problem_Instrument", insert_clones);
}

export async function clone_problem_instrument_characteristics(old_problem_id, new_problem_id){
    console.log("clone_problem_instrument_characteristics");

    // 1. QUERY ROWS
    const Query = gql`
        query myQuery($problem_id: Int) {
          Join__Instrument_Characteristic(where: {problem_id: {_eq: $problem_id}}) {
            group_id
            instrument_attribute_id
            instrument_id
            problem_id
            value
          }
        }
    `;
    let rows_request = await client.query({
        deep: true,
        fetchPolicy: 'no-cache',
        query: Query,
        variables: {
            problem_id: old_problem_id,
        }
    });

    // 2. CLONE ROWS
    let rows = rows_request['data']['Join__Instrument_Characteristic'];
    let clones = [];
    for(let x=0;x<rows.length;x++){
        let clone = {
            'group_id': rows[x].group_id,
            'instrument_attribute_id': rows[x].instrument_attribute_id,
            'instrument_id': rows[x].instrument_id,
            'problem_id': new_problem_id,
            'value': rows[x].value,
        };
        clones.push(clone);
    }

    // 3. INDEX CLONES
    const BulkInsert = gql`
        mutation myMutation($clones: [Join__Instrument_Characteristic_insert_input!]!) {
          insert_Join__Instrument_Characteristic(objects: $clones) {
            affected_rows
          }
        }
    `;
    let insert_clones = await client.mutate({
        mutation: BulkInsert,
        variables: {
            clones: clones,
        },
        update: (cache, { data: { update_arch_status } }) => {console.log(update_arch_status);},
    });
    console.log("--> CLONED Join__Instrument_Characteristic", insert_clones);


}

export async function clone_problem_orbit_assignation(old_problem_id, new_problem_id){
    console.log("clone_problem_orbit_assignation");

    // 1. QUERY ROWS
    const Query = gql`
        query myQuery($problem_id: Int) {
          Join__Problem_Orbit(where: {problem_id: {_eq: $problem_id}}) {
            orbit_id
            problem_id
          }
        }
    `;
    let rows_request = await client.query({
        deep: true,
        fetchPolicy: 'no-cache',
        query: Query,
        variables: {
            problem_id: old_problem_id,
        }
    });

    // 2. CLONE ROWS
    let rows = rows_request['data']['Join__Problem_Orbit'];
    let clones = [];
    for(let x=0;x<rows.length;x++){
        let clone = {
            'orbit_id': rows[x].orbit_id,
            'problem_id': new_problem_id
        };
        clones.push(clone);
    }

    // 3. INDEX CLONES
    const BulkInsert = gql`
        mutation myMutation($clones: [Join__Problem_Orbit_insert_input!]!) {
          insert_Join__Problem_Orbit(objects: $clones) {
            affected_rows
          }
        }
    `;
    let insert_clones = await client.mutate({
        mutation: BulkInsert,
        variables: {
            clones: clones,
        },
        update: (cache, { data: { update_arch_status } }) => {console.log(update_arch_status);},
    });
    console.log("--> CLONED Join__Problem_Orbit", insert_clones);
}

export async function clone_problem_launch_vehicle_assignation(old_problem_id, new_problem_id){
    console.log("clone_problem_launch_vehicle_assignation");

    // 1. QUERY ROWS
    const Query = gql`
        query myQuery($problem_id: Int) {
          Join__Problem_Launch_Vehicle(where: {problem_id: {_eq: $problem_id}}) {
            launch_vehicle_id
            problem_id
          }
        }
    `;
    let rows_request = await client.query({
        deep: true,
        fetchPolicy: 'no-cache',
        query: Query,
        variables: {
            problem_id: old_problem_id,
        }
    });

    // 2. CLONE ROWS
    let rows = rows_request['data']['Join__Problem_Launch_Vehicle'];
    let clones = [];
    for(let x=0;x<rows.length;x++){
        let clone = {
            'launch_vehicle_id': rows[x].launch_vehicle_id,
            'problem_id': new_problem_id
        };
        clones.push(clone);
    }

    // 3. INDEX CLONES
    const BulkInsert = gql`
        mutation myMutation($clones: [Join__Problem_Launch_Vehicle_insert_input!]!) {
          insert_Join__Problem_Launch_Vehicle(objects: $clones) {
            affected_rows
          }
        }
    `;
    let insert_clones = await client.mutate({
        mutation: BulkInsert,
        variables: {
            clones: clones,
        },
        update: (cache, { data: { update_arch_status } }) => {console.log(update_arch_status);},
    });
    console.log("--> CLONED Join__Problem_Launch_Vehicle", insert_clones);
}

export async function clone_problem_inheritence_attributes(old_problem_id, new_problem_id){
    console.log("clone_problem_inheritence_attributes");

    // 1. QUERY ROWS
    const Query = gql`
        query myQuery($problem_id: Int) {
          Inheritence_Attribute(where: {problem_id: {_eq: $problem_id}}) {
            problem_id
            copySlotName1
            copySlotName2
            copySlotType1
            matchingSlotName1
            matchingSlotName2
            matchingSlotType1
            module
            template1
            template2
          }
        }
    `;
    let rows_request = await client.query({
        deep: true,
        fetchPolicy: 'no-cache',
        query: Query,
        variables: {
            problem_id: old_problem_id,
        }
    });

    // 2. CLONE ROWS
    let rows = rows_request['data']['Inheritence_Attribute'];
    let clones = [];
    for(let x=0;x<rows.length;x++){
        let clone = {
            'problem_id': new_problem_id,
            'copySlotName1': rows[x].copySlotName1,
            'copySlotName2': rows[x].copySlotName2,
            'copySlotType1': rows[x].copySlotType1,
            'matchingSlotName1': rows[x].matchingSlotName1,
            'matchingSlotName2': rows[x].matchingSlotName2,
            'matchingSlotType1': rows[x].matchingSlotType1,
            'module': rows[x].module,
            'template1': rows[x].template1,
            'template2': rows[x].template2,
        };
        clones.push(clone);
    }

    // 3. INDEX CLONES
    const BulkInsert = gql`
        mutation myMutation($clones: [Inheritence_Attribute_insert_input!]!) {
          insert_Inheritence_Attribute(objects: $clones) {
            affected_rows
          }
        }
    `;
    let insert_clones = await client.mutate({
        mutation: BulkInsert,
        variables: {
            clones: clones,
        },
        update: (cache, { data: { update_arch_status } }) => {console.log(update_arch_status);},
    });
    console.log("--> CLONED Inheritence_Attribute", insert_clones);
}

export async function clone_problem_fuzzy_attributes(old_problem_id, new_problem_id){
    console.log("clone_problem_fuzzy_attributes");

    // 1. QUERY ROWS
    const Query = gql`
        query myQuery($problem_id: Int) {
         Fuzzy_Attribute(where: {problem_id: {_eq: $problem_id}}) {
            name
            parameter
            problem_id
            unit
            id
          }
        }
    `;
    let rows_request = await client.query({
        deep: true,
        fetchPolicy: 'no-cache',
        query: Query,
        variables: {
            problem_id: old_problem_id,
        }
    });

    // 2. CLONE ROWS
    let rows = rows_request['data']['Fuzzy_Attribute'];
    let clones = [];
    let old_ids = [];
    for(let x=0;x<rows.length;x++){
        let clone = {
            'name': rows[x].name,
            'parameter': rows[x].parameter,
            'problem_id': new_problem_id,
            'unit': rows[x].unit,
        }
        old_ids.push(rows[x].id); // old_fuzzy_attr_id
        clones.push(clone);
    }

    // 3. INDEX CLONES ONE BY ONE
    const BulkInsert = gql`
        mutation myMutation($clone: Fuzzy_Attribute_insert_input!) {
          insert_Fuzzy_Attribute_one(object: $clone) {
            id
          }
        }
    `;
    for(let x=0;x<clones.length;x++){
        let clone             = clones[x];
        let old_fuzzy_attr_id = old_ids[x];

        let insert_clone = await client.mutate({
            mutation: BulkInsert,
            variables: {
                clone: clone,
            },
            update: (cache, { data: { update_arch_status } }) => {console.log(update_arch_status);},
        });
        let new_fuzzy_attr_id = insert_clone.data.insert_Fuzzy_Attribute_one.id;
        await clone_problem_fuzzy_value(old_fuzzy_attr_id, new_fuzzy_attr_id);
    }
}

export async function clone_problem_fuzzy_value(old_fuzzy_attr_id, new_fuzzy_attr_id){
    console.log("clone_problem_fuzzy_value");

    // 1. QUERY ROWS
    const Query = gql`
        query myQuery($fuzzy_attribute_id: Int) {
          Fuzzy_Value(where: {fuzzy_attribute_id: {_eq: $fuzzy_attribute_id}}) {
            fuzzy_attribute_id
            maximum
            mean
            minimum
            value
            id
          }
        }
    `;
    let rows_request = await client.query({
        deep: true,
        fetchPolicy: 'no-cache',
        query: Query,
        variables: {
            fuzzy_attribute_id: old_fuzzy_attr_id,
        }
    });

    // 2. CLONE ROWS
    let rows = rows_request['data']['Fuzzy_Value'];
    let clones = [];
    for(let x=0;x<rows.length;x++){
        let clone = {
            'fuzzy_attribute_id': new_fuzzy_attr_id,
            'maximum': rows[x].maximum,
            'mean': rows[x].mean,
            'minimum': rows[x].minimum,
            'value': rows[x].value,
        };
        clones.push(clone);
    }

    // 3. INDEX CLONES
    const BulkInsert = gql`
        mutation myMutation($clones: [Fuzzy_Value_insert_input!]!) {
          insert_Fuzzy_Value(objects: $clones) {
            affected_rows
          }
        }
    `;
    let insert_clones = await client.mutate({
        mutation: BulkInsert,
        variables: {
            clones: clones,
        },
        update: (cache, { data: { update_arch_status } }) => {console.log(update_arch_status);},
    });
    console.log("--> CLONED Fuzzy_Value", insert_clones);
}

export async function clone_problem_mission_attributes(old_problem_id, new_problem_id){
    console.log("clone_problem_mission_attributes");

    // 1. QUERY ROWS
    const Query = gql`
        query myQuery($problem_id: Int) {
         Mission_Attribute(where: {problem_id: {_eq: $problem_id}}) {
            id
            name
            problem_id
            slot_type
            type
          }
        }
    `;
    let rows_request = await client.query({
        deep: true,
        fetchPolicy: 'no-cache',
        query: Query,
        variables: {
            problem_id: old_problem_id,
        }
    });

    // 2. CLONE ROWS
    let rows = rows_request['data']['Mission_Attribute'];
    let clones = [];
    let old_ids = [];
    for(let x=0;x<rows.length;x++){
        let clone = {
            'name': rows[x].name,
            'slot_type': rows[x].slot_type,
            'problem_id': new_problem_id,
            'type': rows[x].type,
        }
        old_ids.push(rows[x].id); // old_mission_attr_id
        clones.push(clone);
    }

    // 3. INDEX CLONES ONE BY ONE
    const BulkInsert = gql`
        mutation myMutation($clone: Mission_Attribute_insert_input!) {
          insert_Mission_Attribute_one(object: $clone) {
            id
          }
        }
    `;
    for(let x=0;x<clones.length;x++){
        let clone               = clones[x];
        let old_mission_attr_id = old_ids[x];

        let insert_clone = await client.mutate({
            mutation: BulkInsert,
            variables: {
                clone: clone,
            },
            update: (cache, { data: { update_arch_status } }) => {console.log(update_arch_status);},
        });
        let new_mission_attr_id = insert_clone.data.insert_Mission_Attribute_one.id;
        await clone_problem_mission_attributes_value(old_mission_attr_id, new_mission_attr_id);
    }
}

export async function clone_problem_mission_attributes_value(old_mission_attr_id, new_mission_attr_id){
    console.log("clone_problem_mission_attributes_value");

    // 1. QUERY ROWS
    const Query = gql`
        query myQuery($attribute_id: Int) {
          Join__Mission_Attribute_Values(where: {attribute_id: {_eq: $attribute_id}}) {
            attribute_id
            value_id
          }
        }
    `;
    let rows_request = await client.query({
        deep: true,
        fetchPolicy: 'no-cache',
        query: Query,
        variables: {
            attribute_id: old_mission_attr_id,
        }
    });

    // 2. CLONE ROWS
    let rows = rows_request['data']['Join__Mission_Attribute_Values'];
    let clones = [];
    for(let x=0;x<rows.length;x++){
        let clone = {
            'attribute_id': new_mission_attr_id,
            'value_id': rows[x].value_id,
        };
        clones.push(clone);
    }

    // 3. INDEX CLONES
    const BulkInsert = gql`
        mutation myMutation($clones: [Join__Mission_Attribute_Values_insert_input!]!) {
          insert_Join__Mission_Attribute_Values(objects: $clones) {
            affected_rows
          }
        }
    `;
    let insert_clones = await client.mutate({
        mutation: BulkInsert,
        variables: {
            clones: clones,
        },
        update: (cache, { data: { update_arch_status } }) => {console.log(update_arch_status);},
    });
    console.log("--> CLONED Join__Mission_Attribute_Values", insert_clones);
}

export async function clone_problem_stakeholder_panels(old_problem_id, new_problem_id){
    console.log("clone_problem_stakeholder_panels");

    // 1. QUERY STAKEHOLDER NEEDS PANELS on old_problem_id
    const Query = gql`
        query myQuery($problem_id: Int) {
          Stakeholder_Needs_Panel(where: {problem_id: {_eq: $problem_id}}) {
            id
            problem_id
            name
            description
            weight
            index_id
          }
        }
    `;
    let rows_request = await client.query({
        deep: true,
        fetchPolicy: 'no-cache',
        query: Query,
        variables: {
            problem_id: old_problem_id,
        }
    });

    // 2. CLONE ROWS
    let rows = rows_request['data']['Stakeholder_Needs_Panel'];
    let clones = [];
    let ids    = [];
    for(let x=0;x<rows.length;x++){
        let clone = {
            'problem_id': new_problem_id,
            'name': rows[x].name,
            'description': rows[x].description,
            'weight': rows[x].weight,
            'index_id': rows[x].index_id,
        };
        ids.push(rows[x].id);
        clones.push(clone);
    }

    // 3. FOR EACH panel_id object, insert new identical stakeholder_needs_panel entry with new_problem_id and get: new_panel_id
    //    - then call clone_problem_stakeholder_objective with new_panel_id and new_problem_id
    const BulkInsert = gql`
        mutation myMutation($clone: Stakeholder_Needs_Panel_insert_input!) {
          insert_Stakeholder_Needs_Panel_one(object: $clone) {
            id
          }
        }
    `;
    for(let x=0;x<clones.length;x++){
        let clone               = clones[x];
        let old_panel_id        = ids[x];

        let insert_clone = await client.mutate({
            mutation: BulkInsert,
            variables: {
                clone: clone,
            },
            update: (cache, { data: { update_arch_status } }) => {console.log(update_arch_status);},
        });
        let new_panel_id = insert_clone.data.insert_Stakeholder_Needs_Panel_one.id;
        await clone_problem_stakeholder_objective(old_panel_id, new_panel_id, new_problem_id);
    }
}

export async function clone_problem_stakeholder_objective(old_panel_id, new_panel_id, new_problem_id){
    console.log("clone_problem_stakeholder_objective");

    // 1. QUERY STAKEHOLDER NEEDS OBJECTIVES on old_panel_id
    const Query = gql`
        query myQuery($panel_id: Int) {
          Stakeholder_Needs_Objective(where: {panel_id: {_eq: $panel_id}}) {
            id
            panel_id
            problem_id
            name
            description
            weight
          }
        }
    `;
    let rows_request = await client.query({
        deep: true,
        fetchPolicy: 'no-cache',
        query: Query,
        variables: {
            panel_id: old_panel_id,
        }
    });

    // 2. CLONE ROWS
    let rows = rows_request['data']['Stakeholder_Needs_Objective'];
    let clones = [];
    let ids    = [];
    for(let x=0;x<rows.length;x++){
        let clone = {
            'problem_id': new_problem_id,
            'panel_id': new_panel_id,
            'name': rows[x].name,
            'description': rows[x].description,
            'weight': rows[x].weight,
        };
        ids.push(rows[x].id);
        clones.push(clone);
    }


    // 3. FOR EACH objective_id object, insert new identical stakeholder_needs_objective entry with new_problem_id and new_panel_id and get: new_objective_id
    //    - then call clone_problem_stakeholder_subobjective with new_objective_id and new_problem_id
    const BulkInsert = gql`
        mutation myMutation($clone: Stakeholder_Needs_Objective_insert_input!) {
          insert_Stakeholder_Needs_Objective_one(object: $clone) {
            id
          }
        }
    `;
    for(let x=0;x<clones.length;x++){
        let clone               = clones[x];
        let old_objective_id    = ids[x];

        let insert_clone = await client.mutate({
            mutation: BulkInsert,
            variables: {
                clone: clone,
            },
            update: (cache, { data: { update_arch_status } }) => {console.log(update_arch_status);},
        });
        let new_objective_id = insert_clone.data.insert_Stakeholder_Needs_Objective_one.id;
        await clone_problem_stakeholder_subobjective(old_objective_id, new_objective_id, new_problem_id);
    }



}

export async function clone_problem_stakeholder_subobjective(old_objective_id, new_objective_id, new_problem_id){
    console.log("clone_problem_stakeholder_subobjective");

    // 1. QUERY STAKEHOLDER NEEDS SUBOBJECTIVES on old_objective_id
    const Query = gql`
        query myQuery($objective_id: Int) {
          Stakeholder_Needs_Subobjective(where: {objective_id: {_eq: $objective_id}}) {
            id
            objective_id
            problem_id
            name
            description
            weight
          }
        }
    `;
    let rows_request = await client.query({
        deep: true,
        fetchPolicy: 'no-cache',
        query: Query,
        variables: {
            objective_id: old_objective_id,
        }
    });

    // 2. CLONE ROWS
    let rows = rows_request['data']['Stakeholder_Needs_Subobjective'];
    let clones = [];
    let ids    = [];
    for(let x=0;x<rows.length;x++){
        let clone = {
            'problem_id': new_problem_id,
            'objective_id': new_objective_id,
            'name': rows[x].name,
            'description': rows[x].description,
            'weight': rows[x].weight,
        };
        ids.push(rows[x].id);
        clones.push(clone);
    }

    // 3. FOR EACH subobjective_id object, insert new identical stakeholder_needs_subobjective entry with new_problem_id and new_objective_id and get: new_subobjective_id
    //    - call clone_problem_requirement_rule_attributes with new_subobjective_id and new_problem_id
    //    - call clone_problem_requirement_rule_case       with new_subobjective_id and new_problem_id
    const BulkInsert = gql`
        mutation myMutation($clone: Stakeholder_Needs_Subobjective_insert_input!) {
          insert_Stakeholder_Needs_Subobjective_one(object: $clone) {
            id
          }
        }
    `;
    for(let x=0;x<clones.length;x++){
        let clone               = clones[x];
        let old_subobjective_id = ids[x];

        let insert_clone = await client.mutate({
            mutation: BulkInsert,
            variables: {
                clone: clone,
            },
            update: (cache, { data: { update_arch_status } }) => {console.log(update_arch_status);},
        });
        let new_subobjective_id = insert_clone.data.insert_Stakeholder_Needs_Subobjective_one.id;

        await clone_problem_requirement_rule_attributes(old_subobjective_id, new_subobjective_id, new_problem_id);
        await clone_problem_requirement_rule_case(old_subobjective_id, new_subobjective_id, new_problem_id);
    }
}

export async function clone_problem_requirement_rule_attributes(old_subobjective_id, new_subobjective_id, new_problem_id){
    console.log("clone_problem_requirement_rule_attributes");

    const Query = gql`
        query myQuery($subobjective_id: Int) {
          Requirement_Rule_Attribute(where: {subobjective_id: {_eq: $subobjective_id}}) {
            id
            measurement_id
            measurement_attribute_id
            problem_id
            subobjective_id
            type
            thresholds
            scores
            justification
          }
        }
    `;
    let rows_request = await client.query({
        deep: true,
        fetchPolicy: 'no-cache',
        query: Query,
        variables: {
            subobjective_id: old_subobjective_id,
        }
    });

    // 2. CLONE ROWS
    let rows = rows_request['data']['Requirement_Rule_Attribute'];
    let clones = [];
    let ids    = [];
    for(let x=0;x<rows.length;x++){
        let clone = {
            'problem_id': new_problem_id,
            'measurement_id': rows[x].measurement_id,
            'measurement_attribute_id': rows[x].measurement_attribute_id,
            'subobjective_id': new_subobjective_id,
            'type': rows[x].type,
            'thresholds': `{${rows[x].thresholds.join(',')}}`,
            'scores': `{${rows[x].scores.join(',')}}`,
            'justification': rows[x].justification
        };
        ids.push(rows[x].id);
        clones.push(clone);
    }

    // 3. INDEX CLONES
    const BulkInsert = gql`
        mutation myMutation($clones: [Requirement_Rule_Attribute_insert_input!]!) {
          insert_Requirement_Rule_Attribute(objects: $clones) {
            affected_rows
          }
        }
    `;
    let insert_clones = await client.mutate({
        mutation: BulkInsert,
        variables: {
            clones: clones,
        },
        update: (cache, { data: { update_arch_status } }) => {console.log(update_arch_status);},
    });
    console.log("--> CLONED Requirement_Rule_Attribute", insert_clones);



}

export async function clone_problem_requirement_rule_case(old_subobjective_id, new_subobjective_id, new_problem_id){
    console.log("clone_problem_requirement_rule_case");

    // 1. QUERY
    const Query = gql`
        query myQuery($subobjective_id: Int) {
          Requirement_Rule_Case(where: {subobjective_id: {_eq: $subobjective_id}}) {
            id
            measurement_id
            measurement_attribute_id
            problem_id
            subobjective_id
            rule
            value
          }
        }
    `;
    let rows_request = await client.query({
        deep: true,
        fetchPolicy: 'no-cache',
        query: Query,
        variables: {
            subobjective_id: old_subobjective_id,
        }
    });

    // 2. CLONE ROWS
    let rows = rows_request['data']['Requirement_Rule_Case'];
    let clones = [];
    let ids    = [];
    for(let x=0;x<rows.length;x++){
        let clone = {
            'problem_id': new_problem_id,
            'measurement_id': rows[x].measurement_id,
            'measurement_attribute_id': rows[x].measurement_attribute_id,
            'subobjective_id': new_subobjective_id,
            'rule': String(rows[x].rule),
            'value': String(rows[x].value)
        };
        ids.push(rows[x].id);
        clones.push(clone);
    }

    // 3. INDEX CLONES
    const BulkInsert = gql`
        mutation myMutation($clones: [Requirement_Rule_Case_insert_input!]!) {
          insert_Requirement_Rule_Case(objects: $clones) {
            affected_rows
          }
        }
    `;
    let insert_clones = await client.mutate({
        mutation: BulkInsert,
        variables: {
            clones: clones,
        },
        update: (cache, { data: { update_arch_status } }) => {console.log(update_arch_status);},
    });
    console.log("--> CLONED Requirement_Rule_Case", insert_clones);

}




























