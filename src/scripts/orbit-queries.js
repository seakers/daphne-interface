import gql from 'graphql-tag';



//   ____       _     _ _
//  / __ \     | |   (_) |
// | |  | |_ __| |__  _| |_ ___
// | |  | | '__| '_ \| | __/ __|
// | |__| | |  | |_) | | |_\__ \
//  \____/|_|  |_.__/|_|\__|___/



// GLOBAL ORBITS
const OrbitQuery = gql`
query MyQuery($selected_group_id: Int) {
    Orbit(where: {Group: {id: {_eq: $selected_group_id}}}) {
      id
      name
      attributes: Join__Orbit_Attributes_aggregate {
        aggregate {
          count
        }
      }
    }
}`;

// PROBLEM ORBITS
const OrbitAssignation = gql`
query MyQuery($group_id: Int!, $orbit_id: Int!) {
  Problem(where: {Group: {id: {_eq: $group_id}}}) {
    id
    name
    Join__Problem_Orbits_aggregate(where: {orbit_id: {_eq: $orbit_id}}) {
      aggregate {
        count
      }
    }
  }
}`;

// GLOBAL ORBIT ATTRIBUTES
const OrbitAttributeQuery = gql`
query MyQuery($selected_group_id: Int) {
    Orbit_Attribute(where: {Group: {id: {_eq: $selected_group_id}}}) {
      id
      name
      slot_type
      type
      Join__Orbit_Attribute_Values {
        Accepted_Value {
          id
          value
        }
      }
    }
  }
`;

// PROBLEM ORBIT ATTRIBUTES
const OrbitSpecificAttributeQuery = gql`
query MyQuery($orbit_id: Int, $problem_id: Int) {
    Orbit(where: {id: {_eq: $orbit_id}}) {
      id
      name
      Join__Orbit_Attributes {
        Orbit_Attribute {
          id
          name
          slot_type
          type
          Join__Orbit_Attribute_Values {
            Accepted_Value {
              id
              value
            }
          }
        }
        id
        orbit_attribute_id
        group_id
        orbit_id
        value
      }
    }
  }
`;


// ---> CLONE ORBIT
const CloneOrbit = gql`
mutation MyQuery($group_id: Int, $new_name: String) {
    insert_Orbit_one(object: {group_id: $group_id, name: $new_name}) {
      id
      name
    }
  }
`;

const CloneOrbitAttribute = gql`
mutation MyQuery($orbit_attribute_id: Int, $orbit_id: Int, $group_id: Int, $value: String) {
    insert_Join__Orbit_Attribute_one(object: {orbit_attribute_id: $orbit_attribute_id, orbit_id: $orbit_id, value: $value, group_id: $group_id}) {
      id
      Group {
        name
      }
      Orbit {
        name
      }
      Orbit_Attribute {
        name
      }
    }
  }
`;


// ---> ASSIGN PROBLEM
const AssignOrbit = gql`
mutation MyQuery($problem_id: Int, $orbit_id: Int) {
  insert_Join__Problem_Orbit(objects: {problem_id: $problem_id, orbit_id: $orbit_id}) {
    returning {
      Orbit {
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
const DeassignOrbit = gql`
mutation MyQuery($orbit_id: Int, $problem_id: Int) {
  delete_Join__Problem_Orbit(where: {orbit_id: {_eq: $orbit_id}, problem_id: {_eq: $problem_id}}) {
    returning {
      Orbit {
        name
      }
      Problem {
        name
      }
    }
  }
}
`;


// ---> Delete orbit
const DeleteOrbitAttribute = gql`
mutation MyQuery($orbit_id: Int) {
  delete_Join__Orbit_Attribute(where: {orbit_id: {_eq: $orbit_id}}) {
    affected_rows
  }
}`;

// ---> Delete orbit attributes
const DeleteOrbit = gql`
mutation MyQuery($orbit_id: Int) {
  delete_Orbit(where: {id: {_eq: $orbit_id}}) {
    affected_rows
  }
}`;

// ---> Delete orbit assignation
const DeleteOrbitAssignation = gql`
mutation MyQuery($orbit_id: Int) {
  delete_Join__Problem_Orbit(where: {orbit_id: {_eq: $orbit_id}}) {
    affected_rows
  }
}`;


const AddOrbit = gql`
mutation MyQuery($group_id: Int, $name: String) {
  insert_Orbit_one(object: {group_id: $group_id, name: $name}) {
    group_id
    name
  }
}`;


const SetOrbitAttributeValue = gql`
mutation MyQuery($orbit_attribute_id: Int, $value: String) {
  update_Join__Orbit_Attribute(where: {id: {_eq: $orbit_attribute_id}}, _set: {value: $value}) {
    affected_rows
  }
}`;

const InsertOrbitAttributeValue = gql`
mutation MyQuery($group_id: Int, $orbit_attribute_id: Int, $orbit_id: Int, $value: String) {
  insert_Join__Orbit_Attribute_one(object: {group_id: $group_id, orbit_attribute_id: $orbit_attribute_id, orbit_id: $orbit_id, value: $value}) {
    Group {
      name
    }
    Orbit {
      name
    }
    Orbit_Attribute {
      name
    }
    value
  }
}`;





const InsertOrbitAttribute = gql`
mutation MyQuery($group_id: Int, $name: String, $type: String, $slot_type: String) {
  insert_Orbit_Attribute_one(object: {group_id: $group_id, name: $name, type: $type, slot_type: $slot_type}) {
    Group {
      name
    }
    name
  }
}`;


const DeleteGlobalOrbitAttribute = gql`
mutation MyQuery($orbit_attribute_id: Int!) {
  delete_Orbit_Attribute_by_pk(id: $orbit_attribute_id) {
    name
  }
}`;

const DeleteLocalOrbitAttribute = gql`
mutation MyQuery($orbit_attribute_join_id: Int!) {
  delete_Join__Orbit_Attribute_by_pk(id: $orbit_attribute_join_id) {
    Orbit_Attribute {
      name
    }
  }
}`;


export {
    OrbitQuery,
    OrbitAttributeQuery,
    OrbitAssignation,
    OrbitSpecificAttributeQuery,
    CloneOrbit,
    CloneOrbitAttribute,
    AssignOrbit,
    DeassignOrbit,
    DeleteOrbit,
    DeleteOrbitAttribute,
    DeleteOrbitAssignation,
    AddOrbit,
    SetOrbitAttributeValue,
    InsertOrbitAttributeValue,
    DeleteLocalOrbitAttribute,
    InsertOrbitAttribute,
    DeleteGlobalOrbitAttribute
}










