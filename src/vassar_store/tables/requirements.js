const Requirement_Rule_Attribute = {
    "col_types": [
        "int",
        "string",
        "string",
        "string",
        "string",
        "list",
        "list",
        "string",
        "string",
        "string"
    ],
    "col_titles": [
        "ID",
        "Subobjective",
        "Measurement",
        "Attribute",
        "AttributeType",
        "Threshold",
        "Scores",
        "Justification",
        "Units",
        "Notes"
    ],
    "col_keys": [
        "id",
        "subobjective",
        "measurement",
        "attribute",
        "type",
        "threshold",
        "scores",
        "justification",
        "units",
        "notes"
    ],
    "row_object_mapper": {},
    "selected_id": null, 
    "selected_index": null,
    "selected_name": null,
    "relationship": { 
        "child": null,
        "type": "one-to-many",
        "parent": "Problem",
        "join": null,
        "foreign_key_field": "problem_id",
    },
    "display_name": "By Attribute",
    "table_name": "Requirement_Rule_Attribute",
    "state": {
        "mutable": true,
        "appendable": true,
        "selectable": false,
        "hidden": false,
        "closeable": false
    }
};

const Requirement_Rule_Case = {
    "col_types": [
        "int",
        "string",
        "string",
        "string",
        "string",
        "string",
        "string",
        "string",
        "string",
        "string"
    ],
    "col_titles": [
        "ID",
        "Subobjective",
        "Measurement",
        "Attribute",
        "AttributeType",
        "Threshold",
        "Scores",
        "Justification",
        "Units",
        "Notes"
    ],
    "col_keys": [
        "id",
        "subobjective",
        "measurement",
        "attribute",
        "type",
        "threshold",
        "scores",
        "justification",
        "units",
        "notes"
    ],
    "row_object_mapper": {},
    "selected_id": null, 
    "selected_index": null,
    "selected_name": null,
    "relationship": { 
        "child": null,
        "type": "one-to-many",
        "parent": "Problem",
        "join": null,
        "foreign_key_field": "problem_id",
    },
    "display_name": "By Case",
    "table_name": "Requirement_Rule_Case",
    "state": {
        "mutable": true,
        "appendable": true,
        "selectable": false,
        "hidden": false,
        "closeable": false
    }
};




export {
    Requirement_Rule_Attribute,
    Requirement_Rule_Case,
}