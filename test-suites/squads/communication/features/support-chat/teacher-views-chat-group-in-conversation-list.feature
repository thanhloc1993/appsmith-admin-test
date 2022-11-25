@cms @teacher @learner @parent
@communication
@support-chat
@ignore

Feature: Teacher views chat group information in conversation list

    Background:
        Given "school admin" logins CMS
        And "school admin" has created student S1 with parent P1 info
        And "student S1" logins Learner App
        And "parent P1" logins Learner App
        And "teacher" logins Teacher App
        And "teacher" has joined student S1, parent P1 chat groups
        And "teacher" is at conversation list

    Scenario Outline: Name of <userType> chat group is student name
        When "teacher" views "<userType>" chat group
        Then "teacher" sees name of "<userType>" chat group is "student S1 name"
        Examples:
            | userType   |
            | student S1 |
            | parent P1  |

    Scenario: <userType> chat group avatar display student avatar
        Given "student S1" has updated avatar on Learner App
        And "parent P1" has updated avatar on Learner App
        When "teacher" views student chat group in conversation list
        And "teacher" views parent parent chat group in conversation list
        Then "teacher" sees student chat group avatar is student S1 avatar
        And "teacher" sees parent chat group avatar is student S1 avatar

    Scenario Outline: <messageDescription> displays at <userAccount> chat group's thread in conversation list
        When "<userAccount>" sends "<messageType>" message in "<userAccount>" chat group
        Then "teacher" sees "<messageDescription>" under chat group name
        Examples:
            | messageType | userAccount                  | messageDescription                |
            | text        | 1 of [student S1, parent P1] | text message                      |
            | image       | student S1                   | Student S1 has sent an attachment |
            | pdf         | student S1                   | Student S1 has sent an attachment |
            | image       | parent P1                    | Parent P1 has sent an attachment  |
            | pdf         | parent P1                    | Parent P1 has sent an attachment  |

    Scenario Outline: Display <userAccount> chat group with newest message on top conversation list
        When "<userAccount>" sends new text message in "<userAccount>" chat group
        Then "teacher" sees "<userAccount>" chat group is on top in conversation lists
        Examples:
            | userAccount |
            | student S1  |
            | parent P1   |