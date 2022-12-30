@cms @teacher @learner
@syllabus @studyplan @studyplan-item-teacher-edit

Feature: Update study plan items time
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a content book
        And school admin has created a matched studyplan for student
        And teacher is at student's studyplan detail screen

    #TCID:None
    Scenario Outline: Teacher cannot update study plan items with start date later than end date
        Given teacher selects "<number>" study plan items
        And teacher selects updating study plan items time
        When teacher chooses start date later than end date
        Then teacher sees save button is disabled
        Examples:
            | number |
            | one    |
            | some   |
            | all    |