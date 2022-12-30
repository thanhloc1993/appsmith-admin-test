@cms @teacher @teacher2
@communication
@support-chat @support-chat-info

Feature: Teacher views participant list

    Background:
        Given "school admin" logins CMS
        And "school admin" has filtered organization on location settings
        And school admin has created a student "student S1" with "2 parents", "0 visible courses"
        And "teacher T1, teacher T2" login Teacher App
        And "teacher T1, teacher T2" has filtered location in location settings on Teacher App with student locations
        And "teacher T1, teacher T2" is at the conversation screen on Teacher App
        And "teacher T1" joined "student S1" group chat and "parent P1" group chat successfully
        And "teacher T2" joined "student S1" group chat and "parent P1" group chat successfully

    Scenario Outline: Display all members in <type> chat group
        When "teacher T1" goes to participant list of "<type>" conversation on Teacher App
        Then "teacher T1" sees "teacher T1, teacher T2" in participant list
        And "teacher T1" sees "<type>" of "student S1" in participant list
        # check name of participant list/ avatar, name/ avatar of student, name/ avatar of teacher
        Examples:
            | type       |
            | student S1 |
            | parent P1  |

    Scenario Outline: Participant list is updated after teacher leaves conversation in <type> chat group
        Given "teacher T2" has accessed to the conversation of "<type>" chat group
        When "teacher T1" goes to participant list of "<type>" conversation on Teacher App
        And "teacher T2" leaves "<type>" chat group
        Then "teacher T1" does not see "teacher T2" in participant list
        And "teacher T1" sees "<type>" of "student S1" in participant list
        Examples:
            | type       |
            | student S1 |
            | parent P1  |

    Scenario: Participant list is updated after parent leaves conversation in parent chat group
        When "teacher T1" goes to participant list of "parent P1" conversation on Teacher App
        And school admin remove relationship between "parent P1" and "student S1"
        Then "teacher T1" does not see "parent P1" of "student S1" in participant list
        And "teacher T1" sees "teacher T1, teacher T2" in participant list
        And "teacher T1" sees "parent P2" of "student S1" in participant list

    Scenario Outline: Participant list is updated after teacher rejoins conversation in <type> chat group
        When "teacher T1" goes to participant list of "<type>" conversation on Teacher App
        And "teacher T2" leaves "<type>" chat group
        And "teacher T2" joins "<type>" chat group
        Then "teacher T1" sees "teacher T1, teacher T2" in participant list
        And "teacher T1" sees "<type>" of "student S1" in participant list
        Examples:
            | type       |
            | student S1 |
            | parent P1  |

    Scenario: Participant list is updated after parent rejoins conversation in parent chat group
        When school admin remove relationship between "parent P1" and "student S1"
        And school admin adds "parent P1" for "student S1"
        And "teacher T1" can access the "parent P1" conversation on Teacher App
        And "teacher T1" goes to participant list of "parent P1" conversation on Teacher App
        Then "teacher T1" sees "teacher T1, teacher T2" in participant list
        And "teacher T1" sees "parent P1, parent P2" of "student S1" in participant list

    Scenario: Teacher can view student information
        When "teacher T1" goes to participant list of "student S1" conversation on Teacher App
        And "teacher T1" selects to view information of "student S1" in participant list
        Then "teacher T1" sees "student S1" information on Teacher App
