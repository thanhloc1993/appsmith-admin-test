@cms @teacher @learner
@syllabus @studyplan @studyplan-tracking

Feature: Track school progress on study plan
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content have 1 quiz" book
        And school admin has created a new course without any location

    #TCID:syl-0352
    Scenario Outline: Teacher can view school study date
        Given school admin has created a matched studyplan "<check>" track school progress for student
        When teacher is at student's studyplan detail screen
        Then teacher "<visible>" the school date column
        Examples:
            | check   | visible      |
            | with    | sees         |
            | without | does not see |