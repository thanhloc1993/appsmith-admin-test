@cms @teacher @learner @learner2
@virtual-classroom
@virtual-classroom-raise-hand

Feature: Student turns on Raise hand
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student S1, student S2" with course and enrolled status have logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student S1" has joined lesson on Learner App
        And "student S2" has joined lesson on Learner App

    # @blocker
    Scenario: Student can turn on Raise hand
        When "student S1" turns on raise hand on Learner App
        Then "student S1" sees active raise hand icon on Learner App
        And "student S2" sees inactive raise hand icon on Learner App
        And "teacher" sees active raise hand icon in main screen on Teacher App
        And "teacher" "can see" active "student S1"'s raise hand icon in the first position in student list on Teacher App
        And "teacher" "can not see" active "student S2"'s raise hand icon in the second position in student list on Teacher App