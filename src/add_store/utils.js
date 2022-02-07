

export function get_node_color(node_type){
    let color = 'blue';
    switch (node_type){
        case 'DownSelecting':
            color = '#21CCCC';
            break;
        case 'Assigning':
            color = '#FFE330';
            break;
        case 'Connecting':
            color = '#FF7D7B';
            break;
        case 'Partitioning':
            color = '#C5FF2D';
            break;
        case 'Permuting':
            color = '#5D94FF';
            break;
        case 'StandardForm':
            color = '#FF9DEE';
            break;
    }
    return color;
}





export function parse_root_node(query) {
    // There should only be one root node
    let record = query.records[0];
    let root = {
        id: 1,
        _color: 'green',
        name: record._fields[0],
        type: record._fields[1],
        initial_params: JSON.parse(record._fields[2])
    }
    console.log("--> ROOT NODE", root);
    return root;
}


export function parse_decision_nodes(query) {
    let decisions = [];

    // There should only be one root node
    let records = query.records;


    for(let x=0;x<records.length;x++){
        let record = records[x];
        let id = x + 2;
        let color = 'blue';

        switch (record._fields[1]){
            case 'DownSelecting':
                color = '#21CCCC';
                break;
            case 'Assigning':
                color = '#FFE330';
                break;
            case 'Connecting':
                color = '#FF7D7B';
                break;
            case 'Partitioning':
                color = '#C5FF2D';
                break;
            case 'Permuting':
                color = '#5D94FF';
                break;
            case 'StandardForm':
                color = '#FF9DEE';
                break;
        }

        let decision = {
            id: id,
            _color: color,
            name: record._fields[0],
            type: record._fields[1],
            decisions: JSON.parse(record._fields[2]),
            // dependencies: record._fields[3]
        };
        decisions.push(decision);
    }

    console.log("--> DECISION NODES", decisions);
    return decisions;
}


export function parse_design_node(query) {
    // There should only be one root node
    let record = query.records[0];
    let design = {
        _color: 'red',
        name: record._fields[0],
        type: record._fields[1],
        designs: JSON.parse(record._fields[2])
    }
    console.log("--> DESIGN NODE", design);
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


