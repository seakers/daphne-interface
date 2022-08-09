import gql from 'graphql-tag';



// ----- INSTRUMENT.VUE
const InstrumentQuery = gql`
query MyQuery($selected_group_id: Int) {
    Instrument(where: {Group: {id: {_eq: $selected_group_id}}}) {
    id
    name
    Join__Instrument_Characteristics_aggregate {
      aggregate {
        count
      }
    }
  }
}`;

const InstrumentAttributeQuery = gql`
query MyQuery($selected_group_id: Int) {
    Instrument_Attribute(where: {Group: {id: {_eq: $selected_group_id}}}) {
      id
      name
      slot_type
      type
      Join__Instrument_Attribute_Values {
        Accepted_Value {
          id
          value
        }
      }
    }
  }
`;



// ----- INSTRUMENT LIBRARY .VUE

const DeleteInstrument = gql`
mutation MyQuery($instrument_id: Int) {
  delete_Instrument(where: {id: {_eq: $instrument_id}}) {
    affected_rows
  }
}`;

const DeleteInstrumentAttribute = gql`
mutation MyQuery($instrument_id: Int) {
  delete_Join__Instrument_Characteristic(where: {instrument_id: {_eq: $instrument_id}}) {
    affected_rows
  }
}`;

const DeleteInstrumentAssignation = gql`
mutation MyQuery($instrument_id: Int) {
  delete_Join__Problem_Instrument(where: {instrument_id: {_eq: $instrument_id}}) {
    affected_rows
  }
}`;

const DeleteInstrumentMeasurement = gql`
mutation MyQuery($instrument_id: Int) {
  delete_Join__Instrument_Measurement(where: {instrument_id: {_eq: $instrument_id}}) {
    affected_rows
  }
}`;

const DeleteInstrumentMeasurementValues = gql`
mutation MyQuery($instrument_id: Int) {
  delete_Join__Instrument_Capability(where: {instrument_id: {_eq: $instrument_id}}) {
    affected_rows
  }
}`;

// ----- ADD INSTRUMENT .VUE

const AddInstrument = gql`
mutation MyQuery($group_id: Int, $name: String) {
  insert_Instrument_one(object: {group_id: $group_id, name: $name}) {
    group_id
    name
  }
}`;



// ----- CLONE INSTRUMENT .VUE


// insert new global instrument, get ID: done
const CloneInstrument = gql`
mutation MyQuery($group_id: Int, $new_name: String) {
    insert_Instrument_one(object: {group_id: $group_id, name: $new_name}) {
      id
      name
    }
  }
`;


// get / clone characteristics
const GetInstrumentAttributes = gql`
query MyQuery($instrument_id: Int, $problem_id: Int) {
    Join__Instrument_Characteristic(where: {instrument_id: {_eq: $instrument_id}, problem_id: {_eq: $problem_id}}) {
        id
        group_id
        problem_id
        instrument_id
        instrument_attribute_id
        value
    }
  }
`;

const CloneInstrumentAttributes = gql`
mutation MyQuery($objects: [Join__Instrument_Characteristic_insert_input!]!) {
    insert_Join__Instrument_Characteristic(objects: $objects) {
        affected_rows
    }
  }
`;

// get / clone capabilities
const GetInstrumentCapabilities = gql`
query MyQuery($instrument_id: Int) {
    Join__Instrument_Capability(where: {instrument_id: {_eq: $instrument_id}}) {
        id
        group_id
        instrument_id
        measurement_id
        measurement_attribute_id
        value
    }
  }
`;

const CloneInstrumentCapabilities = gql`
mutation MyQuery($objects: [Join__Instrument_Capability_insert_input!]!) {
    insert_Join__Instrument_Capability(objects: $objects) {
        affected_rows
    }
  }
`;


// get / clone measurements
const GetInstrumentMeasurements = gql`
query MyQuery($instrument_id: Int, $problem_id: Int) {
    Join__Instrument_Measurement(where: {instrument_id: {_eq: $instrument_id}, problem_id: {_eq: $problem_id}}) {
        id
        problem_id
        instrument_id
        measurement_id
    }
  }
`;

const CloneInstrumentMeasurements = gql`
mutation MyQuery($objects: [Join__Instrument_Measurement_insert_input!]!) {
    insert_Join__Instrument_Measurement(objects: $objects) {
        affected_rows
    }
  }
`;




// ----- INSTRUMENT ATTRIBUTE LIBRARY .VUE

const InstrumentSpecificAttributeQuery = gql`
query MyQuery($instrument_id: Int, $problem_id: Int) {
    Instrument(where: {id: {_eq: $instrument_id}}) {
      id
      name
      Join__Instrument_Characteristics(where: {problem_id: {_eq: $problem_id}}) {
        Instrument_Attribute {
          id
          name
          slot_type
          type
          Join__Instrument_Attribute_Values {
            Accepted_Value {
              id
              value
            }
          }
        }
        id
        instrument_attribute_id
        group_id
        instrument_id
        value
      }
    }
  }
`;


const ProblemInstrumentQuery = gql`
query MyQuery($instrument_id: Int) {
    Join__Problem_Instrument(where: {instrument_id: {_eq: $instrument_id}}) {
    instrument_id
    Problem {
      id
      name
    }
  }
  }
`;

const DeleteLocalInstrumentAttribute = gql`
mutation MyQuery($instrument_attribute_join_id: Int!) {
  delete_Join__Instrument_Characteristic_by_pk(id: $instrument_attribute_join_id) {
    Instrument_Attribute {
      name
    }
  }
}`;


const DeleteGlobalInstrumentAttribute = gql`
mutation MyQuery($instrument_attribute_id: Int!) {
  delete_Instrument_Attribute_by_pk(id: $instrument_attribute_id) {
    name
  }
}`;

const DeleteGlobalInstrumentAttributeChildren = gql`
mutation MyQuery($instrument_attribute_id: Int!) {
  delete_Join__Instrument_Characteristic(where: {instrument_attribute_id: {_eq: $instrument_attribute_id}}) {
    affected_rows
  }
}`;






// ----- SET INSTRUMENT ATTRIBUTE .VUE

const SetInstrumentAttributeValue = gql`
mutation MyQuery($instrument_attribute_id: Int, $value: String) {
  update_Join__Instrument_Characteristic(where: {id: {_eq: $instrument_attribute_id}}, _set: {value: $value}) {
    affected_rows
  }
}`;

const InsertInstrumentAttributeValue = gql`
mutation MyQuery($group_id: Int, $instrument_attribute_id: Int, $problem_id: Int, $instrument_id: Int, $value: String) {
  insert_Join__Instrument_Characteristic_one(object: {group_id: $group_id, instrument_attribute_id: $instrument_attribute_id, problem_id: $problem_id, instrument_id: $instrument_id, value: $value}) {
    Group {
      name
    }
    Problem {
      name
    }
    Instrument {
      name
    }
    Instrument_Attribute {
      name
    }
    value
  }
}`;







// ----- ASSIGN INSTRUMENT .VUE
const InstrumentAssignation = gql`
query MyQuery($group_id: Int!, $instrument_id: Int!) {
  Problem(where: {Group: {id: {_eq: $group_id}}}) {
    id
    name
    Join__Problem_Instruments_aggregate(where: {instrument_id: {_eq: $instrument_id}}) {
      aggregate {
        count
      }
    }
  }
}`;
const AssignInstrument = gql`
mutation MyQuery($problem_id: Int, $instrument_id: Int) {
  insert_Join__Problem_Instrument(objects: {problem_id: $problem_id, instrument_id: $instrument_id}) {
    returning {
      Instrument {
        name
      }
      Problem {
        name
      }
    }
  }
}
`;
const DeassignInstrument = gql`
mutation MyQuery($instrument_id: Int, $problem_id: Int) {
  delete_Join__Problem_Instrument(where: {instrument_id: {_eq: $instrument_id}, problem_id: {_eq: $problem_id}}) {
    returning {
      Instrument {
        name
      }
      Problem {
        name
      }
    }
  }
}
`;


const GetArchitectures = gql`
query MyQuery($problem_id: Int) {
  Architecture(where: {problem_id: {_eq: $problem_id}}) {
    id
    input
    eval_status
  }
}`;

const UpdateArchitecture = gql`
mutation MyQuery($arch_id: Int, $new_input: String, $eval_status: Boolean) {
  update_Architecture(where: {id: {_eq: $arch_id}}, _set: {input: $new_input, eval_status: $eval_status}) {
    affected_rows
  }
}`;

const UpdateArchitectureStatus = gql`
mutation MyQuery($arch_id: Int, $eval_status: Boolean) {
  update_Architecture(where: {id: {_eq: $arch_id}}, _set: {eval_status: $eval_status}) {
    affected_rows
  }
}`;

const UpdateArchitectureStatusBatch = gql`
mutation MyQuery($arch_ids: [Int!]!, $eval_status: Boolean) {
  update_Architecture(where: {id: {_in: $arch_ids}}, _set: {eval_status: $eval_status}) {
    affected_rows
  }
}`;

const GetNumInstruments = gql`
query MyQuery($problem_id: Int!) {
  Join__Problem_Instrument(where: {problem_id: {_eq: $problem_id}}) {
    Instrument {
      id
      name
    }
    problem_id
  }
}`;

const GetNumOrbits = gql`
query MyQuery($problem_id: Int) {
  Join__Problem_Orbit(where: {problem_id: {_eq: $problem_id}}) {
    Orbit {
      id
      name
    }
  }
}`;








export {
    InstrumentQuery,
    InstrumentAttributeQuery,
    DeleteInstrumentAttribute,
    DeleteInstrument,
    DeleteInstrumentAssignation,
    DeleteInstrumentMeasurement,
    DeleteInstrumentMeasurementValues,
    AddInstrument,
    InstrumentAssignation,
    AssignInstrument,
    DeassignInstrument,
    CloneInstrument,
    CloneInstrumentAttributes,
    GetInstrumentAttributes,
    GetInstrumentCapabilities,
    CloneInstrumentCapabilities,
    GetInstrumentMeasurements,
    CloneInstrumentMeasurements,
    InstrumentSpecificAttributeQuery,
    ProblemInstrumentQuery,
    DeleteLocalInstrumentAttribute,
    DeleteGlobalInstrumentAttribute,
    DeleteGlobalInstrumentAttributeChildren,
    SetInstrumentAttributeValue,
    InsertInstrumentAttributeValue,
    GetArchitectures,
    UpdateArchitecture,
    GetNumInstruments,
    GetNumOrbits,
    UpdateArchitectureStatus,
    UpdateArchitectureStatusBatch
}
