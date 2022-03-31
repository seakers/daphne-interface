import gql from "graphql-tag";


const LearningModuleQuery = gql`

    query LearningModuleQuery($user_id: Int!) {
        modules: LearningModule(where: {Join__User_LearningModules: {user_id: {_eq: $user_id}}}) {
            id
            name
            icon
            join_info: Join__User_LearningModules(where: {user_id: {_eq: $user_id}}){
                slide_idx
            }
            slides: Slides(where: {user_id: {_eq: $user_id}}, order_by: {idx: asc}) {
                id
                idx
                correct
                choice_id
                answered
                type
                src
                question_id
                module_id
                attempts
                question: Question {
                    choices
                    difficulty
                    discrimination
                    explanation
                    guessing
                    id
                    text
                    topic_list: Join__Question_Topics {
                        topic: Topic {
                            id
                            name
                        }
                    }
                }
            }
        }
    }
`;

const ExcelExerciseQuery = gql`

    query ExcelExerciseQuery($user_id: Int!) {
        exercises: ExcelExercise(where: {ExcelExerciseCompletions: {user_id: {_eq: $user_id}}}) {
            id
            name
            completion: ExcelExerciseCompletions {
                id
                is_completed
                reason
            }
        }
    }
`;


const AbilityLevelQuery = gql`

    query AbilityLevelQuery($user_id: Int!) {
        topics: Topic(where: {AbilityParameters: {user_id: {_eq: $user_id}}}) {
            id
            name
            ability_level: AbilityParameters {
                value
            }
        }
    }
`;

const TestHistoryQuery = gql`

    query TestHistoryQuery($user_id: Int!) {
        tests: Test(where: {user_id: {_eq: $user_id}}, order_by: {date: asc}) {
            questions: TestQuestions {
                id
                correct
                choice_id
                answered
                test_id
                question_id
                question: Question {
                    text
                    id
                    guessing
                    explanation
                    discrimination
                    difficulty
                    choices
                    Join__Question_Topics {
                        Topic {
                            name
                        }
                    }
                }
            }
            type
            num_questions
            in_progress
            id
            duration
            date
            score
        }
    }
`;






const SingleModuleQuery = gql`

    query TestHistoryQuery($user_id: Int!, $module_id: Int!) {
        module: LearningModule_by_pk(id: $module_id) {
            id
            name
            icon
            slides: Slides(where: {user_id: {_eq: $user_id}}, order_by: {idx: asc}) {
                id
                idx
                correct
                choice_id
                src
                type
                attempts
                answered
                question: Question {
                    text
                    choices
                    explanation
                    difficulty
                    discrimination
                    guessing
                    topics: Join__Question_Topics {
                        topic: Topic {
                            name
                        }
                    }
                }
            }
        }
    }
`;









// ----------------------------------------------------------------------------------------------------------------------------------------------------------------

const ExcelMasterySub = gql`

    subscription ExcelMasterySub($user_id: Int!) {
        excel_exercises_db: ExcelExerciseCompletion(where: {user_id: {_eq: $user_id}}) {
            id
            is_completed
            reason
            exercise: ExcelExercise {
                id
                name
            }
        }
    }
`;

const TestHistoryMasterySub = gql`

    subscription TestHistoryMasterySub($user_id: Int!) {
        tests: Test(where: {user_id: {_eq: $user_id}, in_progress: {_eq: false}}, order_by: {date: asc}) {
            date
            duration
            id
            in_progress
            num_questions
            score
            type
            questions: TestQuestions_aggregate {
                aggregate {
                    count
                }
            }
        }
    }
`;
const AbilityParameterMasterySub = gql`

    subscription AbilityParameterMasterySub($user_id: Int!) {
        parameters: AbilityParameter(where: {user_id: {_eq: $user_id}, value: {_is_null: false}}) {
            value
            topic: Topic {
                name
            }
        }
    }
`;












const MessageSubscription = gql`

    subscription MessageSubscription($user_id: Int!) {
        messages_db: Message(where: {user_id: {_eq: $user_id}, cleared: {_eq: false}}, order_by: {date: asc}) {
            id
            date
            sender
            text
            cleared
            more_info
        }
    }
`;




const ModuleLinkSubscription = gql`

    subscription ModuleLinkSubscription($user_id: Int!) {
        modules_db: LearningModule(where: {Join__User_LearningModules: {user_id: {_eq: $user_id}}}) {
            id
            name
            icon
            course
            status
            slides: Slides(where: {user_id: {_eq: $user_id}}, order_by: {idx: asc}) {
                type
                answered
            }
        }
    }
`;


const SlideIdxQuery = gql`

    query SlideIdxQuery($user_id: Int!, $module_id: Int!) {
        entry: Join__User_LearningModule(where: {user_id: {_eq: $user_id}, LearningModule: {id: {_eq: $module_id}}}) {
            slide_idx
        }
    }
`;

const SlideIdxSub = gql`

    subscription SlideIdxSub($user_id: Int!, $module_id: Int!) {
        entry: Join__User_LearningModule(where: {user_id: {_eq: $user_id}, LearningModule: {id: {_eq: $module_id}}}) {
            slide_idx
        }
    }
`;








const ModuleQuery = gql`

    query ModuleQuery($user_id: Int!, $module_id: Int!) {
        module: LearningModule_by_pk(id: $module_id) {
            id
            name
            icon
            slides: Slides_aggregate(where: {user_id: {_eq: $user_id}}) {
                aggregate {
                    count
                }
            }
            topics: Join__LearningModule_Topics {
                topic: Topic {
                    id
                    name
                }
            }
        }
    }
`;



const SlidesQuery = gql`

    query SlidesQuery($user_id: Int!, $module_id: Int!) {
        slides: Slide(where: {user_id: {_eq: $user_id}, module_id: {_eq: $module_id}}, order_by: {idx: asc}) {
            type
            src
            idx
            id
            correct
            choice_id
            attempts
            answered
            graded
            question: Question {
                id
                text
                guessing
                explanation
                discrimination
                difficulty
                choices
                topics: Join__Question_Topics {
                    topic: Topic {
                        name
                    }
                }
            }
        }
    }
`;

const SlidesQueryFast = gql`

    query SlidesQueryFast($user_id: Int!, $module_id: Int!) {
        slides: Slide(where: {user_id: {_eq: $user_id}, module_id: {_eq: $module_id}, type: {_eq: "info"}}, order_by: {idx: asc}) {
            type
            idx
        }
    }
`;




const UpdateSlideIdx = gql`

    mutation UpdateSlideIdx($user_id: Int!, $module_id: Int!, $slide_idx: Int!) {
        update_Join__User_LearningModule(where: {module_id: {_eq: $module_id}, user_id: {_eq: $user_id}}, _set: {slide_idx: $slide_idx}) {
            affected_rows
        }
    }
`;

const UpdateSlide = gql`

    mutation UpdateSlide($slide_id: Int!, $answered: Boolean!, $correct: Boolean!, $attempts: Int!, $choice_id: Int!) {
        update_Slide_by_pk(pk_columns: {id: $slide_id}, _set: {answered: $answered, correct: $correct, attempts: $attempts, choice_id: $choice_id}) {
            id
        }
    }
`;



const InsertMessage = gql`
    mutation InsertMessage($user_id: Int!, $text: String!, $sender: String!, $more_info: String) {
        insert_Message_one(object: {user_id: $user_id, text: $text, sender: $sender, date: "now()", cleared: false, more_info: $more_info}) {
            id
        }
    }
`;


const InsertExam = gql`
    mutation InsertExam($user_id: Int!, $type: String!, $num_questions: Int!) {
        insert_Test_one(object: {date: "now()", user_id: $user_id, type: $type, score: null, num_questions: $num_questions, in_progress: true, duration: 10}) {
            id
        }
    }
`;

const InsertExamQuestion = gql`
    mutation InsertExamQuestion($choice_id: Int!, $correct: Boolean!, $question_id: Int!, $test_id: Int!) {
        insert_TestQuestion_one(object: {choice_id: $choice_id, correct: $correct, question_id: $question_id, test_id: $test_id, answered: true}) {
            id
        }
    }
`;



const ClearMessage = gql`
    mutation ClearMessage($message_id: Int!) {
        update_Message_by_pk(pk_columns: {id: $message_id}, _set: {cleared: true}) {
            id
        }
    }
`;



const ExamQuery = gql`

    query ExamQuery($user_id: Int!) {
        test: Test(where: {user_id: {_eq: $user_id}, in_progress: {_eq: true}}) {
            id
            date
            in_progress
            num_questions
            type
            questions: TestQuestions {
                answered
                correct
            }
        }
    }
`;

const SubmitExamQuery = gql`
    mutation SubmitExamQuery($exam_id: Int!, $score: String!, $duration: Int!) {
        update_Test_by_pk(pk_columns: {id: $exam_id}, _set: {in_progress: false, score: $score, duration: $duration}) {
            id
        }
    }
`;



// ----------------------------------------------------------------------------------------------------------------------------------------------------------------


















export {
    LearningModuleQuery,
    ExcelExerciseQuery,
    AbilityLevelQuery,
    TestHistoryQuery,
    SingleModuleQuery,
    SlideIdxQuery,
    ModuleQuery,
    SlidesQuery,
    UpdateSlideIdx,
    UpdateSlide,
    ModuleLinkSubscription,
    ExcelMasterySub,
    TestHistoryMasterySub,
    AbilityParameterMasterySub,
    MessageSubscription,
    InsertMessage,
    ClearMessage,
    SlideIdxSub,
    SlidesQueryFast,
    InsertExam,
    InsertExamQuestion,
    ExamQuery,
    SubmitExamQuery,
}
