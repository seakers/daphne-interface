import gql from "graphql-tag";



// ____                  _   _        _ _           _
// |  _ \            /\  | | | |      (_) |         | |
// | |_) |_   _     /  \ | |_| |_ _ __ _| |__  _   _| |_ ___
// |  _ <| | | |   / /\ \| __| __| '__| | '_ \| | | | __/ _ \
// | |_) | |_| |  / ____ \ |_| |_| |  | | |_) | |_| | ||  __/
// |____/ \__, | /_/    \_\__|\__|_|  |_|_.__/ \__,_|\__\___|
//         __/ |
//        |___/


const RequirementRuleAttribute = gql`
query myQuery($problem_id: Int!) {
  attr_rules: Requirement_Rule_Attribute(where: {problem_id: {_eq: $problem_id}}) {
    id
    type
    justification
    meas: Measurement {
      name
    }
    meas_attr: Measurement_Attribute {
      name
    }
    subobj: Stakeholder_Needs_Subobjective {
      name
      description
      weight
    }
    scores
    thresholds
  }
}`;

const RequirementRuleAttributeFilters = gql`
query myQuery($problem_id: Int!, $instrument: String, $measurement: String, $measurement_attr: String, $subobjective: String, $objective: String, $panel: String) {
    attr_rules_filter: Requirement_Rule_Attribute(where: {problem_id: {_eq: 4}, Measurement: {Join__Instrument_Measurements: {Instrument: {name: {_ilike: $instrument}}}, name: {_ilike: $measurement}}, Measurement_Attribute: {name: {_ilike: $measurement_attr}}, Stakeholder_Needs_Subobjective: {name: {_ilike: $subobjective}, Stakeholder_Needs_Objective: {name: {_ilike: $objective}, Stakeholder_Needs_Panel: {name: {_ilike: $panel}}}}}) {
        id
        type
        justification
        meas: Measurement {
          name
        }
        meas_attr: Measurement_Attribute {
          name
        }
        subobj: Stakeholder_Needs_Subobjective {
          name
          description
          weight
        }
        scores
        thresholds
  }
}`;


// ____           _____
// |  _ \         / ____|
// | |_) |_   _  | |     __ _ ___  ___
// |  _ <| | | | | |    / _` / __|/ _ \
// | |_) | |_| | | |___| (_| \__ \  __/
// |____/ \__, |  \_____\__,_|___/\___|
//         __/ |
//        |___/



export {
    RequirementRuleAttribute,
    RequirementRuleAttributeFilters
}
