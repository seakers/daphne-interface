const Requirement_Rule_Attribute = {
    "col_types": [
        "pk",
        // "string",
        // "string",
        // "string",
        "string",
        "list",
        "list",
        "string",
        "string",
        "string",
        "string",
        "string"
    ],
    "col_titles": [
        "ID",
        // "Subobjective",
        // "Measurement",
        // "Attribute",
        "Rule Type",
        "Thresholds",
        "Scores",
        "Justification",
        "Subobjective",
        "Subobjective Description",
        "Measurement",
        "Attribute"
    ],
    "col_keys": [
        "id",
        // "subobjective_id",
        // "measurement_id",
        // "measurement_attribute_id",
        "type",
        "thresholds",
        "scores",
        "justification"
    ],
    "col_keys_nested": {
        "Stakeholder_Needs_Subobjective": ["name", "description"],
        "Measurement": ["name"],
        "Measurement_Attribute": ["name"]
    },
    "row_object_mapper": {},
    "selected_id": null,
    "selected_index": null,
    "selected_name": null, "insert_state": false,
    "relationship": {
        "child": null,
        "type": "one-to-many-nested",
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
        "closeable": false,
        "cloneable": false,
    }
};

const Requirement_Rule_Case = {
    "col_types": [
        "pk",
        "string",
        "string",
        "string",
        "string"
    ],
    "col_titles": [
        "ID",
        "Subobjective",
        "Measurement",
        "Rule",
        "Value"
    ],
    "col_keys": [
        "id",
        "subobjective_id",
        "measurement_id",
        "rule",
        "value"
    ],
    "row_object_mapper": {},
    "selected_id": null,
    "selected_index": null,
    "selected_name": null, "insert_state": false,
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
        "closeable": false,
        "cloneable": false,
    }
};




export {
    Requirement_Rule_Attribute,
    Requirement_Rule_Case,
}
