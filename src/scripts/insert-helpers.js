import {fetchGet, fetchPost} from "./fetch-helpers";

export async function insert__many_to_many(data, insert_table, join_relationship, pk_field_name, pk_field_value, return_cols, row_types) {
    for(let x=1;x<row_types.length;x++){
        if(row_types[x] === 'string'){
            data.items[x-1].value = `"${data.items[x-1].value}"`;
        }
    }

    let field_entries = [];
    for(let x=0;x<data.items.length;x++){
        let field_entry = `${data.items[x].key}: ${data.items[x].value}`; // --> data[x].value will have to be enclosed in quotes if it is a string
        field_entries.push(field_entry);
    }

     // 1. Insert row into database
    let field_entry_string = field_entries.join(', ');
    let query = {};
    let insert_statement = `insert_${insert_table}`;
    query.query = `mutation {
        ${insert_statement}(objects: {${field_entry_string}, ${join_relationship}: {data: {${pk_field_name}: ${pk_field_value}}}}) {
            returning {
            ${return_cols.join(' ')}
            }
        }
    }`

    let dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(query));
    let json_data = await dataResponse.json();
    console.log("insert response", json_data, query.query);

    return await format_insert(json_data, data.index, return_cols, insert_statement, insert_table);
}

export async function insert__one_to_many(data, insert_table, fk_field_name, fk_field_value, return_cols, row_types) {
    for(let x=1;x<row_types.length;x++){
        if(row_types[x] === 'string'){
            if(data.items[x-1].value.charAt(0) !== '"'){
                data.items[x-1].value = `"${data.items[x-1].value}"`;
            }
        }
        if(row_types[x] === 'list'){
            data.items[x-1].value = `"{${data.items[x-1].value}}"`;
        }
    }

    let field_entries = [];
    for(let x=0;x<data.items.length;x++){
        let field_entry = `${data.items[x].key}: ${data.items[x].value}`; // --> data[x].value will have to be enclosed in quotes if it is a string
        field_entries.push(field_entry);
    }

    let field_entry_string = field_entries.join(', ');
    let insert_statement = `insert_${insert_table}`;

    let query = {};
    query.query = `mutation {
        ${insert_statement}(objects: {${field_entry_string}, ${fk_field_name}: ${fk_field_value}}) {
          returning {
            ${return_cols.join(' ')}
          }
        }
    }`

    let dataResponse = await fetchPost(GRAPH_QL_URL + '', JSON.stringify(query));
    let json_data = await dataResponse.json();
    console.log("insert response", json_data, query.query);

    return await format_insert(json_data, data.index, return_cols, insert_statement, insert_table);
}


export async function format_insert(json_data, index, return_cols, insert_statement, table_name){
    let insert_object = {};
    insert_object['index'] = index;
    insert_object['selected_state'] = false;
    insert_object['editing_state'] = false;
    insert_object['table_name'] = table_name;
    insert_object['objects'] = {};
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











