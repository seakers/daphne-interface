import * as _ from 'lodash-es';
import {client} from '../vassar';
import {
    InsertDatasetMutation,
    InsertDatasetArchsMutation,
    InsertDatasetArchSingleMutation,
    DatasetCounterQuery,
    LocalOrbitQuery
} from "./apollo-queries";
import {AssignInstrument, DeassignInstrument} from "./instrument-queries";
import {AssignOrbit, DeassignOrbit} from "./orbit-queries";




export async function generate_dataset_name(user_id, problem_id){

    let response = await client.query({
        deep: true,
        query: DatasetCounterQuery,
        variables: {
            user_id: user_id,
            problem_id: problem_id
        }
    });
    let count = response['data']['Dataset_aggregate']['aggregate']['count'];
    let title = "exp-user-" + user_id + "-#" + count;
    return title;
}



export async function index_instrument_changes(inst_items, problem_id){

    // --> 1. Remove appropriate instruments
    let inst_remove = inst_items.to_remove;
    for(let x=0;x<inst_remove.length;x++){
        let remove_assignation = await client.mutate({
            mutation: DeassignInstrument,
            variables: {
                problem_id: problem_id,
                instrument_id: inst_remove[x].id
            },
            update: (cache, { data: { remove_instrument_assignation } }) => {
                // Read the data from our cache for this query.
                // eslint-disable-next-line
                console.log(remove_instrument_assignation);
            },
        });
    }

    // --> 2. Add appropriate instruments
    let inst_add = inst_items.to_add;
    for(let x=0;x<inst_add.length;x++){
        let remove_assignation = await client.mutate({
            mutation: AssignInstrument,
            variables: {
                problem_id: problem_id,
                instrument_id: inst_add[x].id
            },
            update: (cache, { data: { insert_instrument_assignation } }) => {
                // Read the data from our cache for this query.
                // eslint-disable-next-line
                console.log(insert_instrument_assignation);
            },
        });
    }
}


export async function index_orbit_changes(orb_items, problem_id){

    // --> 1. Remove appropriate orbits
    let orb_remove = orb_items.to_remove;
    for(let x=0;x<orb_remove.length;x++){
        let add_assignation = await client.mutate({
            mutation: DeassignOrbit,
            variables: {
                problem_id: problem_id,
                orbit_id: orb_remove[x].id,
            },
            update: (cache, { data: { insert_orbit_assignation } }) => {
                console.log("--> cache", insert_orbit_assignation);
            },
        });
    }

    // --> 2. Add appropriate orbits
    let orb_add = orb_items.to_add;
    for(let x=0;x<orb_add.length;x++){
        let add_assignation = await client.mutate({
            mutation: AssignOrbit,
            variables: {
                problem_id: problem_id,
                orbit_id: orb_add[x].id,
            },
            update: (cache, { data: { insert_orbit_assignation } }) => {
                console.log("--> cache", insert_orbit_assignation);
            },
        });
    }

}



export async function index_new_dataset(group_id, problem_id, user_id, name, architectures){

    // --> 1. INSERT NEW DATASET
    let new_dataset_insert = await client.mutate({
        mutation: InsertDatasetMutation,
        variables: {
            group_id: group_id,
            problem_id: problem_id,
            user_id: user_id,
            name: name,
        },
        update: (cache, { data: { insert_dataset } }) => {
            // Read the data from our cache for this query.
            // eslint-disable-next-line
            console.log(insert_dataset);
        },
    });
    let new_dataset_id = new_dataset_insert.data.insert_Dataset_one.id;
    console.log("--> NEW DATASET", new_dataset_id);





    // --> INSERT CONSOLIDATED ARCHITECTURES
    console.log("--> INDEXING ARCHITECTURE")
    for(let x=0;x<architectures.length;x++){
        let arch = architectures[x];
        let arch_insert = await client.mutate({
            mutation: InsertDatasetArchSingleMutation,
            variables: {
                cost: arch.cost,
                dataset_id: new_dataset_id,
                eval_status: arch.eval_status,
                ga: arch.ga,
                improve_hv: arch.improve_hv,
                input: arch.input,
                problem_id: problem_id,
                science: arch.science,
                user_id: user_id
            },
            update: (cache, { data: { insert_archs } }) => {console.log(insert_archs);},
        });
    }

    return new_dataset_id;
}









export function consolidate_architecture(insts, inst_changes, orbs, orb_changes, architecture){
    console.log("--> CONSOLIDATING ARCHITECTURE WITH CHANGES");
    let inst_add = inst_changes.to_add;
    let inst_remove = inst_changes.to_remove;
    let orb_add = orb_changes.to_add;
    let orb_remove = orb_changes.to_remove;
    let arch_inputs = architecture.input;
    let eval_status = true;



    let current_input = '';
    console.log("--> ORIGINAL INPUTS", arch_inputs, arch_inputs.length);

    // --> 1. ADD INSTRUMENTS
    console.log("--> INSTRUMENTS TO ADD", inst_add);
    let new_input = '';
    let num_insts = insts.length;
    for(let x=0; x<arch_inputs.length; x++){
        new_input = new_input + arch_inputs[x];
        if( (x+1) % num_insts == 0){
            for(let y=0; y<inst_add.length; y++){
                new_input = new_input + '0';
            }
        }
    }
    for(let x=0;x<inst_add.length;x++){
        insts.push(inst_add[x].name);
    }
    current_input = _.cloneDeep(new_input);
    console.log("--> NEW INSTRUMENT LIST", insts);



    // --> 2. REMOVE INSTRUMENTS
    console.log("--> INSTRUMENTS TO REMOVE", inst_remove);
    for(let x=0;x<inst_remove.length;x++){
        new_input = '';
        let inst_name = inst_remove[x].name;
        let inst_pos = insts.indexOf(inst_name);

        for(let y=0;y<current_input.length;y++){
            if( (y-inst_pos) % insts.length != 0){
                new_input = new_input + current_input[y];
            }
            else{
                if(current_input[y] == '1'){
                    eval_status = false;
                }
            }
        }
        current_input = _.cloneDeep(new_input);
        insts.splice(inst_pos, 1);
    }
    console.log("--> NEW INSTRUMENT LIST", insts, current_input.length);


    // --> 3. REMOVE ORBITS
    console.log("--> ORBITS TO REMOVE", orb_remove);
    for(let x=0;x<orb_remove.length;x++){
        new_input = '';
        let orb_name = orb_remove[x].name;
        let orb_pos = orbs.indexOf(orb_name);
        let orb_start_idx = orb_pos * insts.length;
        let orb_end_idx = orb_start_idx + (insts.length -1);

        for(let y=0;y<current_input.length;y++){
            if(y < orb_start_idx || y > orb_end_idx){
                new_input = new_input + current_input[y];
            }
            else{
                if(current_input[y] == '1'){
                    eval_status = false;
                }
            }
        }
        current_input = _.cloneDeep(new_input);
        orbs.splice(orb_pos, 1);
    }
    console.log("--> NEW ORBIT LIST", orbs, current_input.length);


    // --> 4. ADD ORBITS
    console.log("--> ORBITS TO ADD", orb_add);
    for(let x=0;x<orb_add.length;x++){
        let orb_name = orb_add[x].name;
        new_input = _.cloneDeep(current_input);
        for(let y=0;y<insts.length;y++){
            new_input = new_input + '0';
        }
        current_input = _.cloneDeep(new_input);
        orbs.push(orb_name);
    }
    console.log("--> NEW ORBIT LIST", orbs, current_input.length);

    console.log("--> FINAL ARCH INPUT", current_input.length, current_input);

    let result = {};
    result.input = current_input;
    result.eval_status = eval_status;
    return result;
}





























