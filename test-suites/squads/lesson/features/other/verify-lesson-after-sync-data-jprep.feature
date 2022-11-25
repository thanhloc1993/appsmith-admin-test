@cms @teacher @learner @jprep
@lesson
@ignore

Feature: Verify lesson after sync data
    Background:
        Given system has synced teacher from partner
        And system has synced student from partner
        And system has synced course from partner
        And staff creates school admin account for partner manually
        And "school admin" logins CMS
        And "student" logins Learner App
        And "teacher" logins Teacher App

    Scenario: View online lesson after sync data
        When system syncs lesson with online lesson
        Then school admin sees the lesson on CMS
        And "teacher" sees the lesson on Teacher App
        And "student" sees the lesson on Learner App

    Scenario Outline: Can not view <lesson type> after sync data
        When system syncs lesson with "<lesson type>"
        Then school admin does not see the lesson on CMS
        And "teacher" does not see the lesson on Teacher App
        And "student" does not see the lesson on Learner App
        Examples:
            | lesson type |
            | hybrid      |
            | offline     |

    Scenario Outline: View edited lesson after sync data
        When system syncs lesson with "<edit field>"
        Then school admin sees updated lesson on CMS
        And "teacher" sees updated lesson on Teacher App
        And "student" sees updated lesson on Learner App
        Examples:
            | edit field      |
            | lesson name     |
            | start date time |
            | end date time   |

    Scenario: Can not view deleted lesson after sync data
        When system syncs lesson which is deleted
        Then school admin does not see the lesson on CMS
        And "teacher" does not see the lesson on Teacher App
        And "student" does not see the lesson on Learner App

    Scenario Outline: Verify student after sync data
        When system syncs lesson after "<editing>" student to new lesson
        Then school admin "<action>" student on CMS
        And "teacher" "<action>" student on Teacher App
        And "student" "<action>" the lesson on Learner App
        Examples:
            | editing  | action       |
            | adding   | sees         |
            | removing | does not see |
