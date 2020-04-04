const Group = {
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
        "parent": "auth_user",
        "join": "Join__AuthUser_Groups",
        "foreign_key_field": 'user_id',
    },
    "display_name": "Groups",
    "table_name": "Group",
    "state": {
        "mutable": false,
        "appendable": false,
        "selectable": true,
        "hidden": false,
        "closeable": false
    }
};

const Problem = {
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
        "closeable": false
    }
};

const auth_user = {
    "col_types": ["int"],
    "col_titles": ["ID"],
    "col_keys": ["id"],
    "row_object_mapper": {},
    "selected_id": null, "selected_index": null,
    "selected_name": null,
    "relationship": {
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
        "closeable": false
    }
};

export {
    Group,
    Problem,
    auth_user
}