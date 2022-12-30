@cms @teacher @learner
@syllabus @studyplan @studyplan-course

Feature: Filter study plan on student course study plan detail
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created 5 simple content books
        And school admin has created matched study plans for every book for student
        And teacher is at student's studyplan detail screen

    #TCID:None
    Scenario: Select a study plan randomly
        When teacher selects studyplan on student course study plan
        Then teacher sees study plan items grouped by topics