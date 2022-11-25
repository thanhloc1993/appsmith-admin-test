@cms @parent
@communication
@questionnaire-notification

Feature: Display correct student name in notification detail

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a parent with two children are "student S1" and "student S2"
        And "parent P1" of "student S1" logins Learner App
        And "school admin" sent a questionnaire notification to parent of "student S1" and "student S2"
            | questionType    | required | numberOfQuestions |
            | Multiple choice | true     | 1                 |
            | CheckBox        | true     | 1                 |
            | Short answer    | true     | 1                 |

    Scenario: Display correct student name in notification detail with the parent have many children
        When "parent P1" accesses to notification list
        Then "parent P1" sees two notification items in notification list
        And "parent P1" sees student name in notification detail of each notification display correctly
