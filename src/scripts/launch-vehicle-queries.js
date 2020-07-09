import gql from 'graphql-tag';


//  _                            _      __      __  _     _      _
// | |                          | |     \ \    / / | |   (_)    | |
// | |     __ _ _   _ _ __   ___| |__    \ \  / /__| |__  _  ___| | ___
// | |    / _` | | | | '_ \ / __| '_ \    \ \/ / _ \ '_ \| |/ __| |/ _ \
// | |___| (_| | |_| | | | | (__| | | |    \  /  __/ | | | | (__| |  __/
// |______\__,_|\__,_|_| |_|\___|_| |_|     \/ \___|_| |_|_|\___|_|\___|



const LaunchVehicleQuery = gql`
query MyQuery($selected_group_id: Int) {
  Launch_Vehicle(where: {Group: {id: {_eq: $selected_group_id}}}) {
    id
    name
    attributes: Join__Launch_Vehicle_Attributes_aggregate {
      aggregate {
        count
      }
    }
  }
}`;

// GLOBAL LV ATTRIBUTES
const LaunchVehicleAttributeQuery = gql`
query MyQuery($selected_group_id: Int) {
    Launch_Vehicle_Attribute(where: {Group: {id: {_eq: $selected_group_id}}}) {
      id
      name
      slot_type
      type
      Join__Launch_Vehicle_Attribute_Values {
        Accepted_Value {
          id
          value
        }
      }
    }
  }
`;



const DeleteLaunchVehicle = gql`
mutation MyQuery($launch_vehicle_id: Int) {
  delete_Launch_Vehicle(where: {id: {_eq: $launch_vehicle_id}}) {
    affected_rows
  }
}`;

const DeleteLaunchVehicleAttribute = gql`
mutation MyQuery($launch_vehicle_id: Int) {
  delete_Join__Launch_Vehicle_Attribute(where: {launch_vehicle_id: {_eq: $launch_vehicle_id}}) {
    affected_rows
  }
}`;

const DeleteLaunchVehicleAssignation = gql`
mutation MyQuery($launch_vehicle_id: Int) {
  delete_Join__Problem_Launch_Vehicle(where: {launch_vehicle_id: {_eq: $launch_vehicle_id}}) {
    affected_rows
  }
}`;





const LaunchVehicleSpecificAttributeQuery = gql`
query MyQuery($launch_vehicle_id: Int, $problem_id: Int) {
    Launch_Vehicle(where: {id: {_eq: $launch_vehicle_id}}) {
      id
      name
      Join__Launch_Vehicle_Attributes {
        Launch_Vehicle_Attribute {
          id
          name
          slot_type
          type
          Join__Launch_Vehicle_Attribute_Values {
            Accepted_Value {
              id
              value
            }
          }
        }
        id
        launch_vehicle_attribute_id
        group_id
        launch_vehicle_id
        value
      }
    }
  }
`;


const CloneLaunchVehicle = gql`
mutation MyQuery($group_id: Int, $new_name: String) {
    insert_Launch_Vehicle_one(object: {group_id: $group_id, name: $new_name}) {
      id
      name
    }
  }
`;

const CloneLaunchVehicleAttribute = gql`
mutation MyQuery($launch_vehicle_attribute_id: Int, $launch_vehicle_id: Int, $group_id: Int, $value: String) {
    insert_Join__Launch_Vehicle_Attribute_one(object: {launch_vehicle_attribute_id: $launch_vehicle_attribute_id, launch_vehicle_id: $launch_vehicle_id, value: $value, group_id: $group_id}) {
      id
      Group {
        name
      }
      Launch_Vehicle {
        name
      }
      Launch_Vehicle_Attribute {
        name
      }
    }
  }
`;

const AddLaunchVehicle = gql`
mutation MyQuery($group_id: Int, $name: String) {
  insert_Launch_Vehicle_one(object: {group_id: $group_id, name: $name}) {
    group_id
    name
  }
}`;


const LaunchVehicleAssignation = gql`
query MyQuery($group_id: Int!, $launch_vehicle_id: Int!) {
  Problem(where: {Group: {id: {_eq: $group_id}}}) {
    id
    name
    Join__Problem_Launch_Vehicles_aggregate(where: {launch_vehicle_id: {_eq: $launch_vehicle_id}}) {
      aggregate {
        count
      }
    }
  }
}`;


// ---> ASSIGN PROBLEM
const AssignLaunchVehicle = gql`
mutation MyQuery($problem_id: Int, $launch_vehicle_id: Int) {
  insert_Join__Problem_Launch_Vehicle(objects: {problem_id: $problem_id, launch_vehicle_id: $launch_vehicle_id}) {
    returning {
      Launch_Vehicle {
        name
      }
      Problem {
        name
      }
    }
  }
}
`;


// ---> DE-ASSIGN PROBLEM
const DeassignLaunchVehicle = gql`
mutation MyQuery($launch_vehicle_id: Int, $problem_id: Int) {
  delete_Join__Problem_Launch_Vehicle(where: {launch_vehicle_id: {_eq: $launch_vehicle_id}, problem_id: {_eq: $problem_id}}) {
    returning {
      Launch_Vehicle {
        name
      }
      Problem {
        name
      }
    }
  }
}
`;



const DeleteGlobalLaunchVehicleAttribute = gql`
mutation MyQuery($launch_vehicle_attribute_id: Int!) {
  delete_Launch_Vehicle_Attribute_by_pk(id: $launch_vehicle_attribute_id) {
    name
  }
}`;



const DeleteLocalLaunchVehicleAttribute = gql`
mutation MyQuery($launch_vehicle_attribute_join_id: Int!) {
  delete_Join__Launch_Vehicle_Attribute_by_pk(id: $launch_vehicle_attribute_join_id) {
    Launch_Vehicle_Attribute {
      name
    }
  }
}`;


const SetLaunchVehicleAttributeValue = gql`
mutation MyQuery($launch_vehicle_attribute_id: Int, $value: String) {
  update_Join__Launch_Vehicle_Attribute(where: {id: {_eq: $launch_vehicle_attribute_id}}, _set: {value: $value}) {
    affected_rows
  }
}`;


const InsertLaunchVehicleAttributeValue = gql`
mutation MyQuery($group_id: Int, $launch_vehicle_attribute_id: Int, $launch_vehicle_id: Int, $value: String) {
  insert_Join__Launch_Vehicle_Attribute_one(object: {group_id: $group_id, launch_vehicle_attribute_id: $launch_vehicle_attribute_id, launch_vehicle_id: $launch_vehicle_id, value: $value}) {
    Group {
      name
    }
    Launch_Vehicle {
      name
    }
    Launch_Vehicle_Attribute {
      name
    }
    value
  }
}`;

const InsertLaunchVehicleAttribute = gql`
mutation MyQuery($group_id: Int, $name: String, $type: String, $slot_type: String) {
  insert_Launch_Vehicle_Attribute_one(object: {group_id: $group_id, name: $name, type: $type, slot_type: $slot_type}) {
    Group {
      name
    }
    name
  }
}`;



export {
    LaunchVehicleQuery,
    LaunchVehicleAttributeQuery,
    LaunchVehicleAssignation,
    LaunchVehicleSpecificAttributeQuery,
    DeleteLaunchVehicle,
    DeleteLaunchVehicleAttribute,
    DeleteLaunchVehicleAssignation,
    CloneLaunchVehicle,
    CloneLaunchVehicleAttribute,
    AddLaunchVehicle,
    AssignLaunchVehicle,
    DeassignLaunchVehicle,
    DeleteLocalLaunchVehicleAttribute,
    DeleteGlobalLaunchVehicleAttribute,
    SetLaunchVehicleAttributeValue,
    InsertLaunchVehicleAttributeValue,
    InsertLaunchVehicleAttribute,
}
