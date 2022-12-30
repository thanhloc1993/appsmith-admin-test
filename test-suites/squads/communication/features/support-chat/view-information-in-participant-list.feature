@cms @teacher @learner @parent
@communication
@support-chat @support-chat-info

Feature: Check information in participant list

    Background:
        Given "school admin" logins CMS
        And "school admin" has filtered organization on location settings
        And school admin has created a student "student S1" with "1 parents", "0 visible courses"
        And "teacher T1" logins Teacher App
        And "teacher" has filtered location in location settings on Teacher App with student locations
        And "teacher T1" is at the conversation screen on Teacher App
        And "teacher T1" joined "student S1" group chat and "parent P1" group chat successfully

    Scenario Outline: Name and avatar of participant list in <type> chat group is updated
        When school admin updates "student S1" name
        And "student S1" logins Learner App
        And "student S1" updates avatar on Learner App
        And "teacher T1" can access the "<type>" conversation on Teacher App
        And "teacher T1" goes to participant list of "<type>" conversation on Teacher App
        Then "teacher T1" sees name of participant list is updated
        And "teacher T1" sees avatar of participant list is updated
        Examples:
            | type       |
            | student S1 |
            | parent P1  |

    #TODO: update test grade information when ticket: https://manabie.atlassian.net/browse/LT-8572 finished
    Scenario: Student information is updated in participant list
        When school admin updates "student S1" name
        # When school admin updates student name and grade
        And "student S1" logins Learner App
        And "student S1" updates avatar on Learner App
        # Then teacher sees name and grade of student in participant list is updated
        And "teacher T1" can access the "student S1" conversation on Teacher App
        And "teacher T1" goes to participant list of "student S1" conversation on Teacher App
        Then "teacher T1" sees name of "student S1" in participant list is updated
        And "teacher T1" sees avatar of "student S1" in participant list is updated

    Scenario: Parent information is updated in participant list
        Given "parent P1" of "student S1" logins Learner App
        When "parent P1" updates avatar on Learner App
        And "teacher T1" can access the "parent P1" conversation on Teacher App
        And "teacher T1" goes to participant list of "parent P1" conversation on Teacher App
        Then "teacher T1" sees "parent P1" avatar of "student S1" in participant list is updated

    Scenario: Teacher information is updated in participant list
        When school admin updates "teacher T1" name
        And "teacher T1" refresh page & access the "student S1" conversation on Teacher App
        And "teacher T1" goes to participant list of "student S1" conversation on Teacher App
        Then "teacher T1" sees name of "teacher T1" in participant list is updated
