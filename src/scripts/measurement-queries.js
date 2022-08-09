import gql from 'graphql-tag';



const MeasurementQuery = gql`
query MyQuery($selected_group_id: Int) {
    Measurement(where: {Group: {id: {_eq: $selected_group_id}}}) {
      id
      name
      attributes: Join__Instrument_Capabilities_aggregate {
        aggregate {
          count
        }
      }
    }
}`;

const MeasurementAttributeQuery = gql`
query MyQuery($selected_group_id: Int) {
    Measurement_Attribute(where: {Group: {id: {_eq: $selected_group_id}}}) {
      id
      name
      slot_type
      type
      Join__Measurement_Attribute_Values {
        Accepted_Value {
          id
          value
        }
      }
    }
  }
`;


// ---> DELETE MEASUREMENT START: deletes all problem measurement attribute values
const DeleteMeasurementAttribute = gql`
mutation MyQuery($measurement_id: Int) {
  delete_Join__Instrument_Capability(where: {measurement_id: {_eq: $measurement_id}}) {
    affected_rows
  }
}`;

const DeleteMeasurement = gql`
mutation MyQuery($measurement_id: Int) {
  delete_Measurement(where: {id: {_eq: $measurement_id}}) {
    affected_rows
  }
}`;
// ---> DELETE MEASUREMENT END




// ---> Delete measurement assignation
const DeleteMeasurementAssignation = gql`
mutation MyQuery($measurement_id: Int) {
  delete_Join__Instrument_Measurement(where: {measurement_id: {_eq: $measurement_id}}) {
    affected_rows
  }
}`;




const AddMeasurement = gql`
mutation MyQuery($group_id: Int, $name: String) {
  insert_Measurement_one(object: {group_id: $group_id, name: $name}) {
    group_id
    name
  }
}`;



const CloneMeasurement = gql`
mutation MyQuery($group_id: Int, $new_name: String) {
    insert_Measurement_one(object: {group_id: $group_id, name: $new_name}) {
      id
      name
    }
  }
`;

const CloneMeasurementAttribute = gql`
mutation MyQuery($measurement_attribute_id: Int, $measurement_id: Int, $group_id: Int, $problem_id: Int, $value: String) {
    insert_Join__Instrument_Capability_one(object: {measurement_attribute_id: $measurement_attribute_id, measurement_id: $measurement_id, value: $value, group_id: $group_id, problem_id: $problem_id}) {
      id
      Group {
        name
      }
      Measurement {
        name
      }
      Measurement_Attribute {
        name
      }
    }
  }
`;
// ---> CLONE MEASUREMENTS END





const MeasurementAssignation = gql`
query MyQuery($group_id: Int!, $measurement_id: Int!, $problem_id: Int!) {
  Instrument(where: {Group: {id: {_eq: $group_id}}}) {
    id
    name
    Join__Instrument_Measurements_aggregate(where: {measurement_id: {_eq: $measurement_id}, problem_id: {_eq: $problem_id}}) {
      aggregate {
        count
      }
    }
  }
}`;


const AssignMeasurement = gql`
mutation MyQuery($instrument_id: Int, $measurement_id: Int, $problem_id: Int) {
  insert_Join__Instrument_Measurement(objects: {instrument_id: $instrument_id, measurement_id: $measurement_id, problem_id: $problem_id}) {
    returning {
      Measurement {
        name
      }
      Instrument {
        name
      }
    }
  }
}
`;

// ---> DE-ASSIGN PROBLEM
const DeassignMeasurement = gql`
mutation MyQuery($instrument_id: Int, $measurement_id: Int, $problem_id: Int) {
  delete_Join__Instrument_Measurement(where: {instrument_id: {_eq: $instrument_id}, measurement_id: {_eq: $measurement_id}, problem_id: {_eq: $problem_id}}) {
    returning {
      Measurement {
        name
      }
      Instrument {
        name
      }
    }
  }
}
`;

const DeassignMeasurementAttribute = gql`
mutation MyQuery($instrument_id: Int, $measurement_id: Int) {
  delete_Join__Instrument_Capability(where: {measurement_id: {_eq: $measurement_id}, instrument_id: {_eq: $instrument_id}}) {
    affected_rows
  }
}
`;

const GroupProblems = gql`
query MyQuery($group_id: Int) {
  Problem(where: {group_id: {_eq: $group_id}}) {
    id
    name
  }
}
`;






const DeleteGlobalMeasurementAttribute = gql`
mutation MyQuery($measurement_attribute_id: Int!) {
  delete_Measurement_Attribute_by_pk(id: $measurement_attribute_id) {
    name
  }
}`;

const DeleteGlobalMeasurementAttributeChildren = gql`
mutation MyQuery($measurement_attribute_id: Int!) {
  delete_Join__Instrument_Capability(where: {measurement_attribute_id: {_eq: $measurement_attribute_id}}) {
    affected_rows
  }
}`;





const DeleteLocalMeasurementAttribute = gql`
mutation MyQuery($measurement_attribute_join_id: Int!) {
  delete_Join__Instrument_Capability_by_pk(id: $measurement_attribute_join_id) {
    Measurement_Attribute {
      name
    }
  }
}`;


// ---> LOCAL MEASUREMENT ATTRIBUTES
const MeasurementSpecificAttributeQuery = gql`
query MyQuery($measurement_id: Int, $instrument_id: Int) {
    Measurement(where: {id: {_eq: $measurement_id}}) {
      id
      name
      Join__Instrument_Capabilities(where: {instrument_id: {_eq: $instrument_id}}) {
        Measurement_Attribute {
          id
          name
          slot_type
          type
          Join__Measurement_Attribute_Values {
            Accepted_Value {
              id
              value
            }
          }
        }
        id
        measurement_attribute_id
        group_id
        measurement_id
        instrument_id
        value
      }
    }
  }
`;


const MeasurementInstrumentQuery = gql`
query MyQuery($measurement_id: Int!) {
  Join__Instrument_Measurement(where: {measurement_id: {_eq: $measurement_id}}, distinct_on: instrument_id) {
    Instrument {
      id
      name
    }
  }
}`;

const GlobalInstruments = gql`
query MyQuery($group_id: Int) {
  Instrument(where: {group_id: {_eq: $group_id}}) {
    id
    name
  }
}`;


const InstrumentQueryProblem = gql`
query MyQuery($instrument_id: Int) {
  Join__Problem_Instrument(where: {instrument_id: {_eq: $instrument_id}}) {
    Problem {
      id
      name
    }
  }
}`;


const InsertMeasurement = gql`
mutation MyQuery($problem_id: Int, $measurement_id: Int, $instrument_id: Int,) {
  insert_Join__Instrument_Measurement_one(object: {problem_id: $problem_id, measurement_id: $measurement_id, instrument_id: $instrument_id}) {
    Problem {
      id
      name
    }
  }
}`;





// ---- set measurement attribute vue
const SetMeasurementAttributeValue = gql`
mutation MyQuery($measurement_attribute_id: Int, $value: String) {
  update_Join__Instrument_Capability(where: {id: {_eq: $measurement_attribute_id}}, _set: {value: $value}) {
    affected_rows
  }
}`;

const InsertMeasurementAttributeValue = gql`
mutation MyQuery($group_id: Int, $measurement_attribute_id: Int, $measurement_id: Int, $instrument_id: Int, $value: String) {
  insert_Join__Instrument_Capability_one(object: {group_id: $group_id, measurement_attribute_id: $measurement_attribute_id, measurement_id: $measurement_id, instrument_id: $instrument_id, value: $value}) {
    Group {
      name
    }
    Measurement {
      name
    }
    Instrument {
      name
    }
    Measurement_Attribute {
      name
    }
    value
  }
}`;















export {
    MeasurementQuery,
    MeasurementAttributeQuery,
    DeleteMeasurementAttribute,
    DeleteMeasurement,
    AddMeasurement,
    CloneMeasurementAttribute,
    CloneMeasurement,
    MeasurementSpecificAttributeQuery,
    MeasurementAssignation,
    AssignMeasurement,
    DeassignMeasurement,
    DeassignMeasurementAttribute,
    GroupProblems,
    DeleteMeasurementAssignation,
    DeleteGlobalMeasurementAttribute,
    DeleteLocalMeasurementAttribute,
    MeasurementInstrumentQuery,
    GlobalInstruments,
    InstrumentQueryProblem,
    InsertMeasurement,
    InsertMeasurementAttributeValue,
    SetMeasurementAttributeValue,
    DeleteGlobalMeasurementAttributeChildren




}
