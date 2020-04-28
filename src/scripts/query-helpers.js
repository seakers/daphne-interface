import {fetchPost} from "./fetch-helpers";



export async function vassar_update(table, row_object) {
    let entry_id = row_object.objects.id;
    let col_keys = table.col_keys;
    let col_types = table.col_types;
    let items = row_object.items;
    let field_entries = [];

    // FOR EACH item
    for(let x=0;x<items.length;x++){
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

    let dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(query));
    let json_data = await dataResponse.json();
    console.log("--> Update", query.query, json_data);
    return 0
}

// data --> row_object
export async function vassar_insert(table, data, fk) {
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
    console.log("--> INSERT", json_data, query.query);

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
    // console.log("--> QUERY", json_data);

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



export async function format_query(rows, table, pk){
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
        
        // ROW OBJECT
        let row_object = {};
        let items = [];

        // FOR EACH column
        for(let y=0;y<table.col_keys.length;y++){
            let column_type = table.col_types[y];
            let column_key = table.col_keys[y];
            let column_entry = row_data[column_key];
            items.push(column_entry);          
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