@cms @teacher @learner @parent
@communication
@support-chat
@ignore

Feature: Learner views chat group information in conversation

    Background:
        Given "school admin" logins CMS
        And "school admin" has created student with parent P1, parent P2 info
        And "student" logins Learner App
        And "parent P1", "parent P2" logins Learner App
        And "teacher T1", "teacher T2" logins Teacher App
        And "teacher T1", "teacher T2" has joined student S1, parent chat groups

    Scenario Outline: Display name of teacher in <userType> chat group that have one teacher
        When "teacher T1" sends a text message in "<userType>" chat group
        Then "<userAccount>" sees "teacher T1" message display with "teacher T1" name
        Examples:
            | userType | userAccount             |
            | student  | student                 |
            | parent   | parent P1 and parent P2 |

    Scenario Outline: Display name of teacher in <userType> chat group that have multiple teachers
        When "teacher T1" sends a text message in "<userType>" chat group
        And "teacher T2" sends a text message in "<userType>" chat group
        Then "<userAccount>" sees "teacher T1" message display with "teacher T1" name
        And  "<userAccount>" sees "teacher T2" message display with "teacher T2" name
        Examples:
            | userType | userAccount             |
            | student  | student                 |
            | parent   | parent P1 and parent P2 |

    Scenario Outline: Display name of teacher in <userType> chat group after edit teacher name
        Given school admin has edited name of "teacher T1", "teacher T2"
        When "teacher T1" sends a text message in "<userType>" chat group
        And "teacher T2" sends a text message in "<userType>" chat group
        Then "<userAccount>" sees "teacher T1" message display with "teacher T1" new name
        And  "<userAccount>" sees "teacher T2" message display with "teacher T2" new name
        Examples:
            | userType | userAccount             |
            | student  | student                 |
            | parent   | parent P1 and parent P2 |

    Scenario Outline: Display name of <sender> in parent chat group
        When "<sender>" sends a text message
        Then "<receiver>" sees new message display with name of "<sender>"
        Examples:
            | sender    | receiver  |
            | parent P1 | parent P2 |
            | parent P2 | parent P1 |