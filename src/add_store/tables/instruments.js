const Instrument = {
    "col_types": [
        "pk",
        "string",
    ],
    "col_titles": [
        "ID",
        "Name",
    ],
    "col_keys": [
        "id",
        "name",
    ],
    "row_object_mapper": {},
    "selected_id": null, "selected_index": null,
    "selected_name": null, "insert_state": false,
    "relationship": { 
        "child": ['Instrument_Capability', 'Instrument_Characteristic'],
        "type": "one-to-many",
        "parent": "Group",
        "join": "Join__Group_Instruments",
        "foreign_key_field": 'group_id',
    },
    "display_name": "Instruments",
    "table_name": "Instrument",
    "state": {
        "mutable": true,
        "appendable": true,
        "selectable": true,
        "hidden": false,
        "closeable": false
    }
};

const Instrument_Capability = {
    "col_types": [
        "pk",
        "int",
        "int",
        "string",
        "string"
    ],
    "col_titles": [
        "ID",
        "Instrument ID",
        "Measurement Attribute ID",
        "Measurement Name",
        "Value"

    ],
    "col_keys": [
        "id",
        "instrument_id",
        "measurement_attribute_id",
        "measurement_name",
        "value"
    ],
    "row_object_mapper": {},
    "selected_id": null, "selected_index": null,
    "selected_name": null, "insert_state": false,
    "relationship": { 
        "child": null,
        "type": "one-to-many",
        "parent": "Instrument",
        "join": null,
        "foreign_key_field": 'instrument_id',
    },
    "display_name": "Capabilities",
    "table_name": "Instrument_Capability",
    "state": {
        "mutable": true,
        "appendable": true,
        "selectable": false,
        "hidden": false,
        "closeable": false
    }
};

const Instrument_Characteristic = {
    "col_types": [
        "pk",
        "int",
        "int",
        "string",
    ],
    "col_titles": [
        "ID",
        "Instrument ID",
        "Characteristic ID",
        "Value"

    ],
    "col_keys": [
        "id",
        "instrument_id",
        "instrument_attribute_id",
        "value"
    ],
    "row_object_mapper": {},
    "selected_id": null, "selected_index": null,
    "selected_name": null, "insert_state": false,
    "relationship": { 
        "child": null,
        "type": "one-to-many",
        "parent": "Instrument",
        "join": null,
        "foreign_key_field": 'instrument_id',
    },
    "display_name": "Characteristics",
    "table_name": "Instrument_Characteristic",
    "state": {
        "mutable": true,
        "appendable": true,
        "selectable": false,
        "hidden": false,
        "closeable": false
    }
};






export {
    Instrument,
    Instrument_Capability,
    Instrument_Characteristic
}