@cms @teacher @learner @learner2
@virtual-classroom
@virtual-classroom-raise-hand

Feature: Turn off raise hand by student and teacher
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student S1, student S2" with course and enrolled status have logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student S1, student S2" have joined lesson on Learner App
        And "student S1, student S2" have turned on raise hand on Learner App

    Scenario: Student can turn off raise hand
        When "student S1" turns off raise hand on Learner App
        Then "student S1" sees inactive raise hand icon on Learner App
        And "student S2" still sees active raise hand icon on Learner App
        And "teacher" still sees active raise hand icon in main screen on Teacher App
        And "teacher" "can not see" active "student S1"'s raise hand icon in the second position in student list on Teacher App
        And "teacher" "can see" active "student S2"'s raise hand icon in the first position in student list on Teacher App

    Scenario: Teacher can turn off individual raise hand of student
        When "teacher" turns off "student S1"'s raise hand in the first position in student list on Teacher App
        Then "teacher" "can not see" active "student S1"'s raise hand icon in the second position in student list on Teacher App
        And "teacher" "can see" active "student S2"'s raise hand icon in the first position in student list on Teacher App
        And "teacher" still sees active raise hand icon in main screen on Teacher App
        And "student S1" sees inactive raise hand icon on Learner App
        And "student S2" still sees active raise hand icon on Learner App

    Scenario: Teacher can turn off all raise hand of students
        When "teacher" hands off all student's raise hand on Teacher App
        Then "teacher" does not see any active raise hand icon in student list on Teacher App
        And "teacher" sees inactive raise hand icon in main screen on Teacher App
        And "student S1" sees inactive raise hand icon on Learner App
        And "student S2" sees inactive raise hand icon on Learner App
