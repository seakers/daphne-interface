import {fetchPost} from "./fetch-helpers";



export async function vassar_update(table, row_object) {
    let entry_id = row_object.objects.id;
    let col_keys = table.col_keys;
    let col_types = table.col_types;
    let items = row_object.items;
    let field_entries = [];

    // FOR EACH item
    // for(let x=0;x<items.length;x++){
    for(let x=0;x<table.col_keys.length;x++){
        let field_entry = '';
        let col_key = col_keys[x];    // name
        let col_type = col_types[x];  // string
        let item = items[x];          // SMAP
        if(item === null | item === "NAN"){
            continue;
        }

        if(col_type === 'pk'){
            continue;
        }
        else if(col_type === 'string'){
            field_entry = `${col_key}: "${item.replace(/"/g,'')}"`;
        }
        else if(col_type === 'list'){
            field_entry = `${col_key}: "{${item.join(',')}}"`;
        }
        else if(col_type == undefined){
            continue;
        }
        else{
            field_entry = `${col_key}: ${item}`;
        }
        field_entries.push(field_entry);
    }


    let field_entry_string = field_entries.join(', ');
    let update_statement = `update_${row_object.table_name}`;

    // UPDATE QUERY
    let query = {};
    query.query = `mutation {
        ${update_statement}(where: {id: {_eq: ${entry_id}}}, _set: {${field_entry_string}}) {
          returning {
            ${col_keys.join(' ')}
          }
        }
    }`
    
    // let dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(query));
    let dataResponse = await fetchPost('http://localhost:6002/v1/graphql', JSON.stringify(query));
    console.log("--> Update", query.query, dataResponse);
    let json_data = await dataResponse.json();
    return 0
}








// data --> row_object
export async function vassar_insert(table, data, fk) {
    console.log("DDDDDD", data);

    let items = data.items;
    let field_entries = [];
    let col_types = table.col_types;
    let col_keys = table.col_keys;

    // INSERT VALUES
    for(let x=0;x<items.length;x++){
        let col_type = col_types[x];
        let col_key = col_keys[x];
        let field_entry = '';
        let item = data.items[x];
        if(item === null | item === "NAN"){
            continue;
        }

        if(col_type === 'pk'){
            continue;
        }
        else if(col_type === 'string'){
            field_entry = `${col_key}: "${item.replace(/"/g,'')}"`;
        }
        else if(col_type === 'list'){
            field_entry = `${col_key}: "{${item.join(',')}}"`;
        }
        else{
            field_entry = `${col_key}: ${item}`;
        }
        field_entries.push(field_entry);
    }

    
    // INSERT QUERY
    let query = {};
    let insert_statement = `insert_${table.table_name}`;
    let field_entry_string = field_entries.join(', ');
    if(table.relationship.type === 'many-to-many'){
        query.query = `mutation {
            ${insert_statement}(objects: {${field_entry_string}, ${table.relationship.join}: {data: {${table.relationship.foreign_key_field}: ${fk}}}}) {
                returning {
                ${table.col_keys.join(' ')}
                }
            }
        }`
    }
    else if(table.relationship.type === 'one-to-many'){
        let fk_string = '';
        fk_string = fk_string + ` ${table.relationship.foreign_key_field}: ${fk}`;
        if('foreign_key_field_2' in table.relationship){
            fk_string = fk_string + `, ${table.relationship.foreign_key_field_2}: ${data.foreign_key_2}`
        }


        query.query = `mutation {
            ${insert_statement}(objects: {${field_entry_string}, ${fk_string}}) {
              returning {
                ${table.col_keys.join(' ')}
              }
            }
        }`
    }
    
    // let dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(query));
    let dataResponse = await fetchPost('http://localhost:6002/v1/graphql', JSON.stringify(query));
    console.log("--> INSERT", query.query, dataResponse);
    let json_data = await dataResponse.json();
    

    return await format_insert(json_data, data.index, table.col_keys, insert_statement, table.table_name, fk, table);
}

export async function format_insert(json_data, index, return_cols, insert_statement, table_name, fk, table){
    let insert_object = {};
    insert_object['index'] = index;
    insert_object['selected_state'] = false;
    insert_object['editing_state'] = false;
    insert_object['table_name'] = table_name;
    insert_object['objects'] = {};
    insert_object['foreign_key'] = fk;
    insert_object['col_types'] = table.col_types;
    insert_object['relationship'] = table.relationship;
    insert_object['hidden'] = false;
    let items = [];
    for(let x=0;x<return_cols.length;x++){
        let field_name = return_cols[x];
        let field_value = json_data.data[insert_statement].returning[0][field_name];
        insert_object['objects'][field_name] = field_value;
        items.push(field_value);
    }
    insert_object['items'] = items; 
    return insert_object;
}













export async function vassar_query(table, pk, pk2=null) {
    let query = {};

    // console.log("---> vassar_query");
    // console.log(table);
    // console.log(pk);





    if(table.relationship.type === 'one-to-many'){
        query.query = `{
            ${table.table_name}(where: {${table.relationship.parent}: {id: {_eq: ${pk}}}}) {
              ${table.col_keys.join(' ')}
            }
        }`
    }
    else if(table.relationship.type === 'many-to-many'){
        query.query = `{
            ${table.relationship.join}(where: {${table.relationship.parent}: {id: {_eq: ${pk}}}}) {
                ${table.table_name} {
                    ${table.col_keys.join(' ')}
                }
            }
        }`
    }
    else if(table.relationship.type === 'one-to-many-nested'){
        let foreign_tables = Object.keys(table.col_keys_nested);
        let foreign_fields_flat = "";
        for(let y=0; y < foreign_tables.length; y++){
            foreign_fields_flat = foreign_fields_flat + ` ${foreign_tables[y]} { ${table.col_keys_nested[foreign_tables[y]].join(' ')} } `
        }
        query.query = `{
            ${table.table_name}(where: {${table.relationship.parent}: {id: {_eq: ${pk}}}}) {
              ${table.col_keys.join(' ')}
              ${foreign_fields_flat}
            }
        }`
    }

    // let dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(query));
    let dataResponse = await fetchPost('http://localhost:6002/v1/graphql', JSON.stringify(query));
    console.log("---> QUERY - RESPONSE", query.query, dataResponse);
    let json_data = await dataResponse.json();

    let rows = null;
    // console.log("---> JSON DATA", json_data, query.query);
    if(table.relationship.type === 'one-to-many'){
        rows = json_data.data[table.table_name];
    }
    else if(table.relationship.type === 'many-to-many'){
        rows = json_data.data[table.relationship.join];
    }
    else if(table.relationship.type === 'one-to-many-nested'){
        rows = json_data.data[table.table_name];
    }

    return await format_query(rows, table, pk);

}

export async function format_query(rows, table, pk, pk2=null){
    // console.log("---> Formatting data", rows);


    let return_object = {};
    let row_objects = [];

    // For each ROW
    for(let x=0;x<rows.length;x++){

        // PARSE row_data
        let row = rows[x];
        let row_data = null;
        if(table.relationship.type === 'many-to-many'){
            row_data = row[table.table_name];
        }
        else if(table.relationship.type === 'one-to-many'){
            row_data = row;
        }
        else if(table.relationship.type === 'one-to-many-nested'){
            row_data = row;
        }
        
        // ROW OBJECT
        let row_object = {};
        let items = [];

        // FOR EACH column
        for(let y=0;y<table.col_keys.length;y++){
            let column_type  = table.col_types[y];
            let column_key   = table.col_keys[y];
            let column_entry = row_data[column_key];
            items.push(column_entry);          
        }

        // NESTED QUERY PARAMETERS
        if(table.relationship.type === 'one-to-many-nested'){
            let foreign_tables = Object.keys(table.col_keys_nested);
            for(let y=0; y < foreign_tables.length; y++){
                let foreign_table        = foreign_tables[y];
                let foreign_table_params = table.col_keys_nested[foreign_table];
                for(let z=0; z < foreign_table_params.length; z++){
                    let foreign_table_param = foreign_table_params[z];
                    items.push(row_data[foreign_table][foreign_table_param])
                }
            }
        }


        // ROW OBJECT INFORMATION
        row_object['objects'] = row_data;
        row_object['items'] = items;
        row_object['selected_state'] = false;
        row_object['editing_state'] = false;
        row_object['hidden'] = false;
        row_object['table_name'] = table.table_name;
        row_object['col_types'] = table.col_types;
        row_object['foreign_key'] = pk;
        row_object['foreign_key_2'] = pk2;               
        row_object['relationship'] = table.relationship;
        row_objects.push(row_object);
    }
    row_objects.sort((a, b) => (a.objects.id > b.objects.id) ? 1 : -1);
    for(let x=0;x<row_objects.length;x++){
        row_objects[x]['index'] = x;
    }
    return_object['row_objects'] = row_objects;          // Row objects for: Problem
    return_object['table_name']   = table.table_name;    // Problem
    return_object['foreign_key'] = pk;                   // Group ID: 1
    return_object['relationship'] = table.relationship;  // Problem - relationship
    return return_object;
}