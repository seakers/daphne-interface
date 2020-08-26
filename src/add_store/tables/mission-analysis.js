const Walker_Mission_Analysis = {
    "col_types": [
        "pk",
        "double",
        "double",
        "double",
        "string",
        "double",
        "double",
        "double",
        "double",
        "double",
        "double",
        "double",
        "string",
    ],
    "col_titles": [
        "ID",
        "Satellites Per-Plane",
        "Number of Sats",
        "Altitude",
        "Inclination",
        "FOV",
        "Average Global Revisit Time",
        "Average Revisit Time (tropics)",
        "Average Revisit Time (northern hemisphere)",
        "Average Revisit Time (southern hemisphere)",
        "Average Revisit Time (cold regions)",
        "Average Revisit Time (US)",
        "Mission Architecture"
    ],
    "col_keys": [
        "id",
        "sats_per_plane",
        "num_planes",
        "orbit_altitude",
        "orbit_inclination",
        "instrument_fov",
        "avg_revisit_time_global",
        "avg_revisit_time_tropics",
        "avg_revisit_time_northern_hemisphere",
        "avg_revisit_time_southern_hemisphere",
        "avg_revisit_time_cold_regiouis",
        "avg_revisit_time_us",
        "mission_architecture"
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
    "display_name": "Walker Constellations",
    "table_name": "Walker_Mission_Analysis",
    "state": {
        "mutable": true,
        "appendable": true,
        "selectable": false,
        "hidden": false,
        "closeable": false
    }
};

const Power_Mission_Analysis = {
    "col_types": [
        "pk",
        "string",
        "string",
        "double",
        "double",
        "string",
        "string",
        "double",
        "double",
        "double"
    ],
    "col_titles": [
        "ID",
        "Orbit",
        "Type",
        "Altitude",
        "Inclination",
        "RAAN",
        "Fraction of Sunlight",
        "Period",
        "Worst Sun Angles",
        "Max Eclipse Time"
    ],
    "col_keys": [
        "id",
        "orbit_id",
        "orbit_type",
        "altitude",
        "inclination",
        "RAAN",
        "fraction_of_sunlight",
        "period",
        "worst_sun_angles",
        "max_eclipse_time"
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
    "display_name": "Power Analysis",
    "table_name": "Power_Mission_Analysis",
    "state": {
        "mutable": true,
        "appendable": true,
        "selectable": false,
        "hidden": false,
        "closeable": false
    }
};

const Launch_Vehicle_Mission_Analysis = {
    "col_types": [
        "pk",
        "string",
        "double",
        "double",
        "list",
        "list",
        "list",
        "list",
        "list",
        "list",
        "list",
        "double"
    ],
    "col_titles": [
        "ID",
        "Vehicle",
        "Diameter",
        "Height",
        "Payload (GEO)",
        "Payload (LEO Polar)",
        "Payload (SSO)",
        "Payload (LEO Equat)",
        "Payload (MEO)",
        "Payload (HEO)",
        "Payload (ISS)",
        "Cost"
    ],
    "col_keys": [
        "id",
        "vehicle_id",
        "diameter",
        "height",
        "payload_geo",
        "payload_leo_polar",
        "payload_sso",
        "payload_leo_equat",
        "payload_meo",
        "payload_heo",
        "payload_iss",
        "cost"
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
    "display_name": "Launch Vehicles",
    "table_name": "Launch_Vehicle_Mission_Analysis",
    "state": {
        "mutable": true,
        "appendable": true,
        "selectable": false,
        "hidden": false,
        "closeable": false
    }
};

export {
    Walker_Mission_Analysis,
    Power_Mission_Analysis,
    Launch_Vehicle_Mission_Analysis,
}