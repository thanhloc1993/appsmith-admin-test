@cms @teacher @learner @learner2
@virtual-classroom
@virtual-classroom-raise-hand

Feature: Raise hand order in student list is chronological order
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student S1, student S2" with course and enrolled status have logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student S1, student S2" have joined lesson on Learner App

    Scenario: Teacher sees the only student raise hand in the first position in student list
        When "student S1" turns on raise hand on Learner App
        Then "student S1" sees active raise hand icon on Learner App
        And "teacher" "can see" active "student S1"'s raise hand icon in the first position in student list on Teacher App

    Scenario: Teacher sees students raise hand by chronological order in student list when all learners turn on raise hand
        Given "student S1, student S2" have turned on raise hand on Learner App
        Then "student S1" sees active raise hand icon on Learner App
        And "student S2" sees active raise hand icon on Learner App
        And "teacher" "can see" active "student S1"'s raise hand icon in the first position in student list on Teacher App
        And "teacher" "can see" active "student S2"'s raise hand icon in the second position in student list on Teacher App

    Scenario: Scenario: Teacher sees students raise hand by chronological order in student list after one student turns off raise hand
        Given "student S1, student S2" have turned on raise hand on Learner App
        When "student S1" turns off raise hand on Learner App
        Then "student S2" sees active raise hand icon on Learner App
        And "teacher" "can see" active "student S2"'s raise hand icon in the first position in student list on Teacher App
