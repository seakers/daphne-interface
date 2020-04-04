const Instrument = {
    "col_types": [
        "int",
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
    "selected_name": null,
    "relationship": {
        "type": "many-to-many",
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
        "int",
        "string",
    ],
    "col_titles": [
        "ID",
        "Instrument ID",
        "Measurement",
        "Value"

    ],
    "col_keys": [
        "id",
        "instrument_id",
        "measurement_name",
        "value"
    ],
    "row_object_mapper": {},
    "selected_id": null, "selected_index": null,
    "selected_name": null,
    "relationship": {
        "type": "many-to-many",
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






export {
    Instrument,
    Instrument_Capability
}