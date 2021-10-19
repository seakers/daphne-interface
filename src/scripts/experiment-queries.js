import gql from 'graphql-tag';



const ExperimentProblem = gql`
query MyQuery($problem_name: String) {
  Problem(where: {group_id: {_eq: 1}, name: {_eq: $problem_name}}) {
    id
  }
}`;





export {
    ExperimentProblem,



}
