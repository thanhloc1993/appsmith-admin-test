@cms @teacher @learner
@syllabus @studyplan @studyplan-item-teacher-edit

Feature: Teacher updates study plan items school date
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a content book
        And school admin has created a new course without any location
        And school admin has created a matched studyplan "with" track school progress for student
        And teacher is at student's studyplan detail screen

    #TCID:None
    Scenario Outline: Teacher edit study plan items school date
        When teacher updates "<number>" study plan items school date to new date
        Then teacher sees the edited items with updated school date
        Examples:
            | number |
            | one    |
            | some   |
            | all    |