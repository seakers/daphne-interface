const Stakeholder_Needs_Panel = {
    "col_types": ['pk', 'string', 'string', 'double'],
    "col_titles": ['ID', 'Name', 'Description', 'weight'],
    "col_keys": ['id', 'name', 'description', 'weight'],
    "row_object_mapper": {},
    "selected_id": null, 
    "selected_index": null,
    "selected_name": null, "insert_state": false,
    "relationship": { 
        "child": ['Stakeholder_Needs_Objective'],
        "type": "one-to-many",
        "parent": "Problem",
        "join": null,
        "foreign_key_field": "problem_id",
    },
    "display_name": "Panels",
    "table_name": "Stakeholder_Needs_Panel",
    "state": {
        "mutable": true,
        "appendable": true,
        "selectable": true,
        "hidden": false,
        "closeable": false
    }
};

const Stakeholder_Needs_Objective = {
    "col_types": ['pk', 'string', 'string', 'double'],
    "col_titles": ['ID', 'Name', 'Description', 'weight'],
    "col_keys": ['id', 'name', 'description', 'weight'],
    "row_object_mapper": {},
    "selected_id": null, 
    "selected_index": null,
    "selected_name": null, "insert_state": false,
    "relationship": { 
        "child": ['Stakeholder_Needs_Subobjective'],
        "type": "one-to-many",
        "parent": "Stakeholder_Needs_Panel",
        "join": null,
        "foreign_key_field": "panel_id",
    },
    "display_name": "Objectives",
    "table_name": "Stakeholder_Needs_Objective",
    "state": {
        "mutable": true,
        "appendable": true,
        "selectable": true,
        "hidden": false,
        "closeable": false
    }
};

const Stakeholder_Needs_Subobjective = {
    "col_types": ['pk', 'string', 'string', 'double'],
    "col_titles": ['ID', 'Name', 'Description', 'weight'],
    "col_keys": ['id', 'name', 'description', 'weight'],
    "row_object_mapper": {},
    "selected_id": null, 
    "selected_index": null,
    "selected_name": null, "insert_state": false,
    "relationship": { 
        "child": null,
        "type": "one-to-many",
        "parent": "Stakeholder_Needs_Objective",
        "join": null,
        "foreign_key_field": "problem_id",
    },
    "display_name": "Subobjectives",
    "table_name": "Stakeholder_Needs_Subobjective",
    "state": {
        "mutable": true,
        "appendable": true,
        "selectable": false,
        "hidden": false,
        "closeable": false,
    }
};


export {
    Stakeholder_Needs_Panel,
    Stakeholder_Needs_Objective,
    Stakeholder_Needs_Subobjective,
}