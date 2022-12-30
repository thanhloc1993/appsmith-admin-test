@cms @teacher @learner @parent
@communication
@support-chat
@ignore

Feature: Teacher views chat group information in conversation

    Background:
        Given "school admin" logins CMS
        And "school admin" has created student S1 with parent P1, parent P2 info
        And "student S1" logins Learner App
        And "parent P1", "parent P2" logins Learner App
        And "teacher T1", "teacher T2" logins Teacher App
        And "teacher T1", "teacher T2" has joined student S1, parent P1, parent P2 chat groups

    Scenario Outline: <teacherAccount> sees name of <userAccount> display in <userType> chat group
        Given "<teacherAccount>" is at "<userType>" chat group
        When "<userAccount>" sends text message in "<userType>" chat group
        Then "<teacherAccount>" sees new text message display with name of "<userAccount>"
        Examples:
            | teacherAccount | userAccount                             | userType |
            | teacher T2     | 1 of [teacher T1, student S1]           | student  |
            | teacher T1     | 1 of [teacher T2, student S1]           | student  |
            | teacher T2     | 1 of [teacher T1, parent P1, parent P2] | parent   |
            | teacher T1     | 1 of [teacher T2, parent P1, parent P2] | parent   |

    Scenario Outline: <teacherAccount> sees new name of <userAccount> display in <userType> chat group
        Given "<teacherAccount>" is at "<userType>" chat group
        When school admin edit the name of "<userAccount>"
        And "<userAccount>" sends text message in  "<userType>" chat group
        Then "<teacherAccount>" sees new text message display with name of "<userAccount>"
        Examples:
            | teacherAccount | userAccount                   | userType |
            | teacher T2     | 1 of [teacher T1, student S1] | student  |
            | teacher T1     | 1 of [teacher T2, student S1] | student  |
            | teacher T2     | teacher T1                    | parent   |
            | teacher T1     | teacher T2                    | parent   |