import gql from 'graphql-tag';



//   ____       _     _ _
//  / __ \     | |   (_) |
// | |  | |_ __| |__  _| |_ ___
// | |  | | '__| '_ \| | __/ __|
// | |__| | |  | |_) | | |_\__ \
//  \____/|_|  |_.__/|_|\__|___/

const AllProblemsQuery = gql`
    query MyQuery {
        Problem {
            id
            name
        }
    }
`;

const StakeholderMutation = gql`
mutation MyQuery($panel_id: Int!, $panel_weight: float8) {
  update_Stakeholder_Needs_Panel_by_pk(pk_columns: {id: $panel_id} _set: {weight: $panel_weight}) {
    id
    weight
  }
}
`;


const StakeholderQuery = gql`
query MyQuery($problem_id: Int) {
  Stakeholder_Needs_Panel(where: {problem_id: {_eq: $problem_id}}) {
    id
    name
    description
    weight
  }
}
`;


const DatasetCounterQuery = gql`
query MyQuery($user_id: Int, $problem_id: Int) {
  Dataset_aggregate(where: {problem_id: {_eq: $problem_id}, user_id: {_eq: $user_id}}) {
    aggregate {
      count
    }
  }
}`;

const InsertDatasetArchSingleMutation = gql`
mutation MyMutation($fairness: float8, $data_continuity: float8, $programmatic_risk: float8, $cost: float8, $dataset_id: Int, $eval_status: Boolean, $ga: Boolean, $improve_hv: Boolean, $input: String, $problem_id: Int, $science: float8, $user_id: Int) {
  insert_Architecture_one(
    object: {
        cost: $cost,
        dataset_id: $dataset_id,
        eval_status: $eval_status,
        ga: $ga,
        improve_hv: $improve_hv,
        input: $input,
        problem_id: $problem_id,
        science: $science,
        user_id: $user_id,
        fairness: $fairness,
        data_continuity: $data_continuity,
        programmatic_risk: $programmatic_risk
    }) {
        id
    }
}`;

const InsertDatasetArchsMutation = gql`
mutation MyMutation($archs: [Architecture_insert_input!]!) {
  insert_Architecture(objects: $archs){
    affected_rows
    returning {
      id
    }
  }
}`;


const InsertDatasetMutation = gql`
mutation MyMutation($group_id: Int, $problem_id: Int, $user_id: Int, $name: String) {
  insert_Dataset_one(object: {group_id: $group_id, problem_id: $problem_id, user_id: $user_id, name: $name}) {
    id
  }
}`;


const ArchitectureDatasetQuery = gql`
query MyQuery($problem_id: Int, $dataset_id: Int) {
  Architecture(where: {dataset_id: {_eq: $dataset_id}, problem_id: {_eq: $problem_id}, ga: {_eq: false}}) {
    input
    science
    cost
    eval_status
    ga
    improve_hv
    critique
    user_id
    fairness
    data_continuity
    programmatic_risk
  }
}`;

const ArchitectureDatasetGAQuery = gql`
query MyQuery($problem_id: Int, $dataset_id: Int) {
  Architecture(where: {dataset_id: {_eq: $dataset_id}, problem_id: {_eq: $problem_id}, ga: {_eq: true}, improve_hv: {_eq: true}}) {
    input
    science
    cost
    eval_status
    ga
    improve_hv
    critique
    user_id
    fairness
    data_continuity
    programmatic_risk
  }
}`;


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
    data_continuity
    fairness
    programmatic_risk
    ArchitectureScoreExplanations {
        panel_id
        satisfaction
    }
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
    OrbitAttributeAcceptedValuesQuery,
    DaphneGroupQuery,
    DaphneProblemQuery,
    DaphneDatasetQuery,
    DaphneDatasetIdQuery,
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
    ArchitectureDatasetQuery,
    InsertDatasetMutation,
    InsertDatasetArchsMutation,
    InsertDatasetArchSingleMutation,
    DatasetCounterQuery,
    StakeholderQuery,
    StakeholderMutation,
    ArchitectureDatasetGAQuery,
    AllProblemsQuery
}
