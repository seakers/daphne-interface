const Measurement_Attribute = {
    "col_types": [
        "pk",
        "string",
        "string",
        "string",
    ],
    "col_titles": [
        "ID",
        "Name",
        "Slot Type",
        "Value Type",
    ],
    "col_keys": [
        "id",
        "name",
        "slot_type",
        "attribute_type",
    ],
    "row_object_mapper": {},
    "selected_id": null, 
    "selected_index": null,
    "selected_name": null, 
    "insert_state": false,
    "relationship": { 
        "child": null,
        "type": "one-to-many",
        "parent": "Problem",
        "join": null,
        "foreign_key_field": "problem_id",
    },
    "display_name": "Measurement",
    "table_name": "Measurement_Attribute",
    "state": {
        "mutable": false,
        "appendable": false,
        "selectable": false,
        "hidden": false,
        "closeable": false
    }
};
const Instrument_Attribute = {
    "col_types": [
        "pk",
        "string",
        "string",
        "string",
    ],
    "col_titles": [
        "ID",
        "Name",
        "Slot Type",
        "Value Type",
    ],
    "col_keys": [
        "id",
        "name",
        "slot_type",
        "attribute_type",
    ],
    "row_object_mapper": {},
    "selected_id": null, 
    "selected_index": null,
    "selected_name": null, 
    "insert_state": false,
    "relationship": { 
        "child": null,
        "type": "one-to-many",
        "parent": "Problem",
        "join": null,
        "foreign_key_field": "problem_id",
    },
    "display_name": "Instrument",
    "table_name": "Instrument_Attribute",
    "state": {
        "mutable": true,
        "appendable": true,
        "selectable": false,
        "hidden": false,
        "closeable": false
    }
};
const Mission_Attribute = {
    "col_types": [
        "pk",
        "string",
        "string",
        "string",
    ],
    "col_titles": [
        "ID",
        "Name",
        "Slot Type",
        "Value Type",
    ],
    "col_keys": [
        "id",
        "name",
        "slot_type",
        "attribute_type",
    ],
    "row_object_mapper": {},
    "selected_id": null, 
    "selected_index": null,
    "selected_name": null, 
    "insert_state": false,
    "relationship": { 
        "child": null,
        "type": "one-to-many",
        "parent": "Problem",
        "join": null,
        "foreign_key_field": "problem_id",
    },
    "display_name": "Mission",
    "table_name": "Mission_Attribute",
    "state": {
        "mutable": true,
        "appendable": true,
        "selectable": false,
        "hidden": false,
        "closeable": false
    }
};
const Orbit_Attribute = {
    "col_types": [
        "pk",
        "string",
        "string",
        "string",
    ],
    "col_titles": [
        "ID",
        "Name",
        "Slot Type",
        "Value Type",
    ],
    "col_keys": [
        "id",
        "name",
        "slot_type",
        "attribute_type",
    ],
    "row_object_mapper": {},
    "selected_id": null, 
    "selected_index": null,
    "selected_name": null, 
    "insert_state": false,
    "relationship": { "child": null,
        "type": "one-to-many",
        "parent": "Problem",
        "join": null,
        "foreign_key_field": 
        "problem_id",
    },
    "display_name": "Orbit",
    "table_name": "Orbit_Attribute",
    "state": {
        "mutable": true,
        "appendable": true,
        "selectable": false,
        "hidden": false,
        "closeable": false
    }
};
const Launch_Vehicle_Attribute = {
    "col_types": [
        "pk",
        "string",
        "string",
        "string",
    ],
    "col_titles": [
        "ID",
        "Name",
        "Slot Type",
        "Value Type",
    ],
    "col_keys": [
        "id",
        "name",
        "slot_type",
        "attribute_type",
    ],
    "row_object_mapper": {},
    "selected_id": null, 
    "selected_index": null,
    "selected_name": null, 
    "insert_state": false,
    "relationship": { 
        "child": null,
        "type": "one-to-many",
        "parent": "Problem",
        "join": null,
        "foreign_key_field": "problem_id",
    },
    "display_name": "Launch Vehicle",
    "table_name": "Launch_Vehicle_Attribute",
    "state": {
        "mutable": true,
        "appendable": true,
        "selectable": false,
        "hidden": false,
        "closeable": false
    }
};



export {
    Measurement_Attribute,
    Instrument_Attribute,
    Mission_Attribute,
    Orbit_Attribute,
    Launch_Vehicle_Attribute
}