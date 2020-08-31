const Group = {
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
    "selected_id": null,
    "selected_index": null,
    "selected_name": null, "insert_state": false,
    "relationship": {
        "type": "many-to-many",
        "child": ['Problem', 'Instrument'],
        "parent": "auth_user",
        "join": "Join__AuthUser_Group",
        "foreign_key_field": 'user_id',
    },
    "display_name": "Groups",
    "table_name": "Group",
    "state": {
        "mutable": false,
        "appendable": false,
        "selectable": true,
        "hidden": false,
        "closeable": false,
        "cloneable": false,
    }
};

const Problem = {
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
    "selected_id": null,
    "selected_index": null,
    "selected_name": null, "insert_state": false,
    "relationship": {
        "child": [
            'Stakeholder_Needs_Panel',
            'Requirement_Rule_Attribute',
            'Requirement_Rule_Case',
            'Walker_Mission_Analysis',
            'Power_Mission_Analysis',
            'Launch_Vehicle_Mission_Analysis',
            'Measurement_Attribute',
            'Instrument_Attribute',
            'Mission_Attribute',
            'Orbit_Attribute',
            'Launch_Vehicle_Attribute'
        ],
        "type": "one-to-many",
        "parent": "Group",
        "join": "Join__Problem_Groups",
        "foreign_key_field": 'group_id',
    },
    "display_name": "Problems",
    "table_name": "Problem",
    "state": {
        "mutable": true,
        "appendable": true,
        "selectable": true,
        "hidden": false,
        "closeable": false,
        "cloneable": false,
    }
};

const auth_user = {
    "col_types": ["int"],
    "col_titles": ["ID"],
    "col_keys": ["id"],
    "row_object_mapper": {},
    "selected_id": null,
    "selected_index": null,
    "selected_name": null, "insert_state": false,
    "relationship": {
        "child": null,
        "type": "many-to-many",
        "parent": null,
        "join": "Join__AuthUser_Groups",
        "foreign_key_field": null,
    },
    "display_name": "Groups",
    "table_name": "Group",
    "state": {
        "mutable": false,
        "appendable": false,
        "selectable": true,
        "hidden": false,
        "closeable": false,
        "cloneable": false,
    }
};

export {
    Group,
    Problem,
    auth_user
}
