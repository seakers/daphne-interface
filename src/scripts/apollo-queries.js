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












const GlobalInstrumentQuery = gql`
query MyQuery($problem_id: Int!) {
  Join__Instrument_Characteristic(where: {problem_id: {_eq: $problem_id}}, distinct_on: [instrument_id]) {
    Instrument {
        id
        name
    }
  }
}`;

const LocalInstrumentQuery = gql`
query MyQuery($problem_id: Int!) {
  Join__Problem_Instrument(where: {problem_id: {_eq: $problem_id}}) {
    Instrument {
      id
      name
    }
  }
}`;

const LocalOrbitQuery = gql`
query MyQuery($problem_id: Int!) {
  Join__Problem_Orbit(where: {problem_id: {_eq: $problem_id}}) {
    Orbit {
      id
      name
    }
  }
}`;




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







const DaphneGroupQuery = gql`
query MyQuery($user_pk: Int) {
    user_groups: Group(where: {Join__AuthUser_Groups: {auth_user: {id: {_eq: $user_pk}}}}) {
      id
      name
    }
}`;

const DaphneProblemQuery = gql`
query MyQuery($group_id: Int) {
    user_problems: Problem(where: {Group: {id: {_eq: $group_id}}}) {
      id
      name
    }
}`;






const ArchitectureQuery = gql`
subscription ArchitectureQuery($problem_id: Int, $input_list: [String!]) {
    Architecture(where: {problem_id: {_eq: $problem_id}, input: {_nin: $input_list}, ga: {_eq: false}, eval_status: {_eq: true}}) {
    id
    user_id
    ga
    eval_status
    input
    science
    cost
  }
}`;

const ArchitectureEvalCount = gql`
subscription MyQuery($problem_id: Int) {
    Architecture_aggregate(where: {problem_id: {_eq: $problem_id}, eval_status: {_eq: false}}) {
    aggregate {
      count
    }
  }
}`;














const UserArchitectureQuery = gql`
query MyQuery($problem_id: Int) {
    Architecture(where: {problem_id: {_eq: $problem_id}, ga: {_eq: false}}) {
    id
    user_id
    ga
    eval_status
    input
    science
    cost
  }
}`;

const UserArchitectureSubscription = gql`
subscription MyQuery($problem_id: Int) {
    Architecture(where: {problem_id: {_eq: $problem_id}, ga: {_eq: false}}) {
    id
    user_id
    ga
    eval_status
    input
    science
    cost
  }
}`;





const GaArchitectureQuery = gql`
query MyQuery($problem_id: Int) {
    Architecture(where: {problem_id: {_eq: $problem_id}, ga: {_eq: true}}) {
    id
    user_id
    ga
    eval_status
    input
    science
    cost
  }
}`;

const GaArchitectureSubscription = gql`
subscription MyQuery($problem_id: Int) {
    Architecture(where: {problem_id: {_eq: $problem_id}, ga: {_eq: true}, improve_hv: {_eq: false}}) {
    id
    user_id
    ga
    eval_status
    input
    science
    cost
  }
}`;






const ProblemReload = gql`
subscription MyQuery($problem_id: Int!) {
  problem_status: Problem_by_pk(id: $problem_id) {
    reload_problem
  }
}`;


const SetProblemReload = gql`
mutation MyMutation($problem_id: Int!, $reload_status: Boolean!) {
  update_Problem_by_pk(pk_columns: {id: $problem_id}, _set: {reload_problem: $reload_status}) {
    name
    reload_problem
  }
}`;




export {
    OrbitQuery,
    OrbitAttributeQuery,
    OrbitAttributeJoinQuery,
    ProblemQuery,
    OrbitAttributeAcceptedValuesQuery,
    DaphneGroupQuery,
    DaphneProblemQuery,
    GlobalInstrumentQuery,
    LocalInstrumentQuery,
    LocalOrbitQuery,
    ArchitectureQuery,
    ArchitectureEvalCount,
    UserArchitectureQuery,
    UserArchitectureSubscription,
    GaArchitectureQuery,
    GaArchitectureSubscription,
    ProblemReload,
    SetProblemReload
}
