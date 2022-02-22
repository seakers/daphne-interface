





export function parse_root_node(query) {

    let record = query.records[0];
    let root = {
        id: 1,
        _color: '#4CAF50',
        _size: 20,
        name: record._fields[0],
        type: record._fields[1],
        initial_params: JSON.parse(record._fields[2])
    }
    return root;
}


export function parse_decision_nodes(query) {

    let records = query.records;
    let decisions = [];

    for(let x=0;x<records.length;x++){
        let record = records[x];
        let id = x + 2;
        let decision = {
            id: id,
            _color: '#877b67',
            name: record._fields[0],
            type: record._fields[1],
            decisions: JSON.parse(record._fields[2]),
            // dependencies: record._fields[3]
        };
        decisions.push(decision);
    }

    return decisions;
}


export function parse_design_node(query) {

    let record = query.records[0];
    let design = {
        _color: '#F44336',
        name: record._fields[0],
        type: record._fields[1],
        designs: JSON.parse(record._fields[2])
    }
    return design;
}


export function parse_child_nodes(query) {
    let decisions = [];

    // There should only be one root node
    let records = query.records;

    for(let x=0;x<records.length;x++){
        let record = records[x];
        let decision = {
            name: record._fields[0],
            type: record._fields[1],
        };
        decisions.push(decision);
    }

    return decisions;
}


