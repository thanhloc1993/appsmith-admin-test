@ignore
Feature: Teacher search chat groups

    Scenario: Teacher searches chat groups by student name and filter popup
        Given teacher has sent message to "student S1"
        And teacher has sent message to "parent P2"
        When teacher searches student's name in conversation screen on Teacher App
            | type      | student name      |
            | full name | student S1's name |
        And teacher filters chat groups in conversation screen on Teacher App
            | message type | contact filter | courses    |
            | all          | all            | all course |
        Then teacher sees all chat groups matches with the above filters

    Scenario: Teacher searches chat groups by filter popup only
        Given teacher has sent message to "student S1"
        And teacher has sent message to "parent P2"
        When teacher filters chat groups in conversation screen on Teacher App
            | message type | contact filter | courses  |
            | not reply    | student        | course 1 |
        Then teacher sees all chat groups matches with the above filters