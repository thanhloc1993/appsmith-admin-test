@cms @teacher @learner
@syllabus @studyplan @studyplan-item-teacher-edit

Feature: Teacher unarchives study plan items
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a content book
        And school admin has created a matched studyplan for student
        And teacher is at student's studyplan detail screen

    #TCID:None
    Scenario Outline: Teacher unarchives study plan items
        Given teacher has archived all study plan items
        When teacher unarchives "<number>" study plan items
        Then teacher sees the items with "active" status
        And student does not see archived items in todo and book screen
        And student sees active items in todo and book screen
        Examples:
            | number |
            | one    |
            | some   |
            | all    |

    #TCID:None
    Scenario Outline: Teacher unarchives all study plan items in topics
        Given teacher has archived all study plan items
        When teacher unarchives study plan items of "<number>" topics
        Then teacher sees the items of the topics with "active" status
        And student does not see archived items of the topics in todo and book screen
        And student sees active items of the topics in todo and book screen
        Examples:
            | number |
            | one    |
            | some   |
            | all    |