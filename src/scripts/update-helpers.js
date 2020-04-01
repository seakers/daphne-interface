import {fetchGet, fetchPost} from "./fetch-helpers";


export async function update__table_row(data, update_table, return_cols, row_types) {
    let field_entries = [];
    for(let x=0;x<return_cols.length;x++){
        let row_key = return_cols[x];
        let row_type = row_types[x];
        let field_entry = '';
        if(data.items[x] === null){
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






export async function update__one_to_many() {
    return 0
}