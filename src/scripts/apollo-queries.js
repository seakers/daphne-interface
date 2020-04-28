import gql from 'graphql-tag';



const OrbitQuery = gql`
query MyQuery($selected_group_id: Int) {
    Orbit(where: {Group: {id: {_eq: $selected_group_id}}}) {
        id
        name
    }
}`;

const OrbitAttributeQuery = gql`
query MyQuery($selected_group_id: Int) {
    Orbit_Attribute(where: {Group: {id: {_eq: $selected_group_id}}}) {
      id
      name
      slot_type
      type
    }
  }
`;

const OrbitAttributeAcceptedValuesQuery = gql`
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





  const LaunchVehicleQuery = gql`
query MyQuery {
    Launch_Vehicle(where: {Group: {id: {_eq: 1}}}) {
        id
        name
    }
}`;



















const OrbitAttributeJoinQuery = gql`
query MyQuery($selected_orbit_id: Int, $selected_group_id: Int) {
    Join__Orbit_Attribute(where: {orbit_id: {_eq: $selected_orbit_id}, group_id: {_eq: $selected_group_id}}) {
      Orbit_Attribute {
        name
      }
      value
      Problem {
        name
      }
      Orbit {
        id
        name
      }
    }
  }  
`;

const ProblemQuery = gql`
query MyQuery($selected_group_id: Int) {
    Problem(where: {group_id: {_eq: $selected_group_id}}) {
      id
      name
    }
}`;



export {
    OrbitQuery,
    LaunchVehicleQuery,
    OrbitAttributeQuery,
    OrbitAttributeJoinQuery,
    ProblemQuery,
    OrbitAttributeAcceptedValuesQuery,
}