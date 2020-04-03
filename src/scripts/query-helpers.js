import {fetchPost} from "./fetch-helpers";


export async function query__many_to_many(pk, pk_table, join_relationship, fk_table, return_cols, row_types) {
    let query = {};
    query.query = `{
        ${pk_table}(where: {id: {_eq: ${pk}}}) {
            ${join_relationship} {
            ${fk_table} {
                ${return_cols.join(' ')}
            }
            }
        }
    }`
    let dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(query));
    let json_data = await dataResponse.json();
    let rows = json_data.data[pk_table][0][join_relationship];
    return await format_query(rows, fk_table, return_cols, pk, 'many-to-many', row_types);
}


export async function query__one_to_many(pk, pk_table, fk_table, return_cols, row_types) {
    let query = {};
    query.query = `{
        ${fk_table}(where: {${pk_table}: {id: {_eq: ${pk}}}}) {
          ${return_cols.join(' ')}
        }
    }`
    let dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(query));
    let json_data = await dataResponse.json();
    let rows = json_data.data[fk_table];
    return await format_query(rows, fk_table, return_cols, pk, 'one-to-many', row_types);
}





// pk, pk_table, fk_table, return_cols, row_types
export async function query__table(table, pk) {
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

    let rows = null;
    console.log("QUERY", json_data, query.query);
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