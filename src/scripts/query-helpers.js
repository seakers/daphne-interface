import {fetchGet, fetchPost} from "./fetch-helpers";


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




export async function format_query(rows, fk_table, return_cols, pk, format_type, column_types){
    let row_objects = [];

    // Iterate over each of the row objects
    for(let x=0;x<rows.length;x++){
        let row = rows[x];
        let row_object = {};

        // Iterate over each row's columns
        let items = [];
        for(let y=0;y<return_cols.length;y++){
            let column_type = column_types[y];
            let row_data = null;

            // row_data will be parsed depending on the query type
            if(format_type === 'many-to-many'){
                row_data = row[fk_table];
            }
            else{
                row_data = row;
            }

            // The column text will be computed based on the row
            if(column_type === 'list'){
                items.push(row_data[return_cols[y]].join(','));
            }
            else{
                items.push(row_data[return_cols[y]]);
            }
            
            // TODO: incorrect
            row_object['objects'] = row_data;
        }

        row_object['items'] = items;
        row_object['selected_state'] = false;
        row_object['editing_state'] = false;
        row_object['table_name'] = fk_table;
        row_object['foreign_key'] = pk;
        row_objects.push(row_object);
    }
    row_objects.sort((a, b) => (a.objects.id > b.objects.id) ? 1 : -1);
    for(let x=0;x<row_objects.length;x++){
        row_objects[x]['index'] = x;
    }
    return row_objects;
}