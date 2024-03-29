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


const AllProblemsQuery = gql`
    query MyQuery {
        Problem {
            id
            name
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
query group_list($user_pk: Int) {
    user_groups: Group(where: {Join__AuthUser_Groups: {auth_user: {id: {_eq: $user_pk}}}}) {
      id
      name
    }
}`;

const DaphneProblemQuery = gql`
query problem_list($group_id: Int) {
    user_problems: Problem(where: {Group: {id: {_eq: $group_id}}}) {
      id
      name
    }
}`;

const ProblemByNameQuery = gql`
query problem_by_name($problem_name: String = "") {
  problem: Problem(where: {name: {_eq: $problem_name}}) {
    id
    name
  }
}`;

const DaphneDatasetQuery = gql`
query dataset_list($user_pk: Int, $group_id: Int, $problem_id: Int) {
  user_datasets: Dataset(where: {_and: [{problem_id: {_eq: $problem_id}}, {_or: [{user_id: {_is_null: true}}, {user_id: {_eq: $user_pk}}]}, {_or: [{group_id: {_is_null: true}}, {group_id: {_eq: $group_id}}]}]}) {
    id
    name
    user_id
    Group {
      name
    }
  }
}`;

const DaphneDatasetIdQuery = gql`
query current_dataset($dataset_id: Int!) {
  current_dataset: Dataset(where: {id: {_eq: $dataset_id}}) {
    id
    name
    user_id
    Problem {
      id
      name
    }
    Group {
      id
      name
    }
  }
}`;

const DatasetByNameQuery = gql`
query dataset_by_name($dataset_name: String = "", $problem_id: Int = -1, $user_id: Int = -1) {
  dataset: Dataset(where: {name: {_eq: $dataset_name}, problem_id: {_eq: $problem_id}, user_id: {_eq: $user_id}}) {
    id
    name
  }
}`;






const ArchitectureQuery = gql`
subscription ArchitectureQuery($problem_id: Int, $dataset_id: Int, $id_list: [Int!]) {
    Architecture(order_by: {id: asc}, where: {problem_id: {_eq: $problem_id}, dataset_id: {_eq: $dataset_id}, id: {_nin: $id_list}, _or:[{ga: {_eq: false}}, {ga: {_eq: true}, improve_hv: {_eq: true}}], eval_status: {_eq: true}}) {
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
subscription ArchitectureEvalCount($problem_id: Int, $dataset_id: Int) {
    Architecture_aggregate(where: {problem_id: {_eq: $problem_id}, dataset_id: {_eq: $dataset_id}, eval_status: {_eq: false}}) {
    aggregate {
      count
    }
  }
}`;














const UserArchitectureQuery = gql`
query MyQuery($problem_id: Int) {
    Architecture(order_by: {id: asc}, where: {problem_id: {_eq: $problem_id}, ga: {_eq: false}}) {
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
    Architecture(order_by: {id: asc}, where: {problem_id: {_eq: $problem_id}, ga: {_eq: false}}) {
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
    Architecture(order_by: {id: asc}, where: {problem_id: {_eq: $problem_id}, ga: {_eq: true}}) {
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
    Architecture(order_by: {id: asc}, where: {problem_id: {_eq: $problem_id}, ga: {_eq: true}, improve_hv: {_eq: false}}) {
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



const UserGroups = gql`
query myQuery($user_id: Int!) {
  auth_user: auth_user_by_pk(id: $user_id) {
    join: Join__AuthUser_Groups {
      Group {
        id
        name
      }
    }
  }
}`;


const DaphneUsers = gql`
query myQuery{
  users: auth_user {
    id
    email
  }
}`;






export {
    OrbitQuery,
    OrbitAttributeQuery,
    OrbitAttributeJoinQuery,
    ProblemQuery,
    ProblemByNameQuery,
    OrbitAttributeAcceptedValuesQuery,
    DaphneGroupQuery,
    DaphneProblemQuery,
    DaphneDatasetQuery,
    DaphneDatasetIdQuery,
    DatasetByNameQuery,
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
    SetProblemReload,
    UserGroups,
    DaphneUsers,
    AllProblemsQuery
}
