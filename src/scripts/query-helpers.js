import {fetchPost} from "./fetch-helpers";



export async function vassar_update(data, update_table, return_cols, row_types) {
    let field_entries = [];
    for(let x=0;x<return_cols.length;x++){
        let row_key = return_cols[x];
        let row_type = row_types[x];
        let field_entry = '';
        if(data.items[x] === null || data.items[x] === "NaN"){
            continue;
        }

        // Do type operations here
        if(row_type === 'string'){
            if(data.items[x].charAt(0) === '"'){
                field_entry = `${row_key}: ${data.items[x]}`;
            }
            else{
                field_entry = `${row_key}: "${data.items[x]}"`;
            }
        }
        else if(row_type === 'list'){
            field_entry = `${row_key}: "{${data.items[x]}}"`;
        }
        else{
            field_entry = `${row_key}: ${data.items[x]}`;
        }

        // Skip if const ID field
        if(row_key !== 'id'){
            field_entries.push(field_entry);
        }
    }
    let field_entry_string = field_entries.join(', ')

    let update_statement = `update_${update_table}`
    let query = {};
    query.query = `mutation {
        ${update_statement}(where: {id: {_eq: ${data.objects.id}}}, _set: {${field_entry_string}}) {
          returning {
            ${return_cols.join(' ')}
          }
        }
    }`
    let dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(query));
    let json_data = await dataResponse.json();
    console.log("UPDATE QUERY", query.query, json_data);
    return 0
}

export async function vassar_insert(table, data, fk) {

    for(let x=1;x<table.col_types.length;x++){
        if(table.col_types[x] === 'string'){
            if(data.items[x-1].value.charAt(0) !== '"'){
                data.items[x-1].value = `"${data.items[x-1].value}"`;
            }
        }
        if(table.col_types[x] === 'list'){
            data.items[x-1].value = `"{${data.items[x-1].value}}"`;
        }
    }

    let field_entries = [];
    for(let x=0;x<data.items.length;x++){
        let field_entry = `${data.items[x].key}: ${data.items[x].value}`; // --> data[x].value will have to be enclosed in quotes if it is a string
        field_entries.push(field_entry);
    }

    let field_entry_string = field_entries.join(', ');
    let insert_statement = `insert_${table.table_name}`;

    let query = {};


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
        query.query = `mutation {
            ${insert_statement}(objects: {${field_entry_string}, ${table.relationship.foreign_key_field}: ${fk}}) {
              returning {
                ${table.col_keys.join(' ')}
              }
            }
        }`
    }
    

    let dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(query));
    let json_data = await dataResponse.json();
    console.log("insert response", json_data, query.query);

    return await format_insert(json_data, data.index, table.col_keys, insert_statement, table.table_name, fk);
}

export async function vassar_query(table, pk) {
    let query = {};
    if(table.relationship.type === 'one-to-many'){
        query.query = `{
            ${table.table_name}(where: {${table.relationship.parent}: {id: {_eq: ${pk}}}}) {
              ${table.col_keys.join(' ')}
            }
        }`
    }
    else if(table.relationship.type === 'many-to-many'){
        query.query = `{
            ${table.relationship.parent}(where: {id: {_eq: ${pk}}}) {
                ${table.relationship.join} {
                ${table.table_name} {
                    ${table.col_keys.join(' ')}
                }
                }
            }
        }`
    }
    let dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(query));
    let json_data = await dataResponse.json();
    console.log("--> QUERY", json_data);

    let rows = null;
    // console.log("QUERY", json_data, query.query);
    if(table.relationship.type === 'one-to-many'){
        rows = json_data.data[table.table_name];
    }
    else if(table.relationship.type === 'many-to-many'){
        rows = json_data.data[table.relationship.parent][0][table.relationship.join];
    }
    return await format_query(rows, table, pk);

}



export async function format_insert(json_data, index, return_cols, insert_statement, table_name, fk){
    let insert_object = {};
    insert_object['index'] = index;
    insert_object['selected_state'] = false;
    insert_object['editing_state'] = false;
    insert_object['table_name'] = table_name;
    insert_object['objects'] = {};
    insert_object['foreign_key'] = fk;
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

export async function format_query(rows, table, pk){
    let return_object = {};
    let row_objects = [];

    // For each ROW
    for(let x=0;x<rows.length;x++){

        // Get the row dictionary
        let row = rows[x];
        let row_data = null;
        if(table.relationship.type === 'many-to-many'){
            row_data = row[table.table_name];
        }
        else if(table.relationship.type === 'one-to-many'){
            row_data = row;
        }
        
        // Initialize row_object
        let row_object = {};
        let items = [];

        // Iterate over each row's objects
        for(let y=0;y<table.col_keys.length;y++){
            let column_type = table.col_types[y];
            let column_key = table.col_keys[y];
            let column_entry = row_data[column_key];

            // Different operations for different column_types
            if(column_type === 'list'){
                if(column_entry === null){
                    items.push('');
                }
                else{
                    items.push(column_entry.join(','));
                }
            }
            else{
                items.push(column_entry);
            }            
        }

        row_object['objects'] = row_data;
        row_object['items'] = items;
        row_object['selected_state'] = false;
        row_object['editing_state'] = false;
        row_object['hidden'] = false;
        row_object['table_name'] = table.table_name;
        row_object['foreign_key'] = pk;               
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