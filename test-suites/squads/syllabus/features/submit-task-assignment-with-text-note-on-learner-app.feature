@cms @teacher @learner
@syllabus @task-assignment @task-assignment-common

Feature: Submit task assignment which required items has text note on Learner app
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content with a task assignment" book
        And school admin has created a matched studyplan for student

    #TCID:syl-1086
    Scenario: Student can submit the task assignment with text note
        Given school admin edits required items in task assignment to include "Text note"
        When student is on task assignment detail screen
        Then student fills the task assignment with text note
        And student submits the task assignment
        And student sees task assignment submitted
        And teacher goes to task assignment detail screen
        And teacher sees the submission with text note

    #TCID:syl-1088
    Scenario: Student cannot submit the task assignment without text note
        Given school admin edits required items in task assignment to include "Text note"
        When student is on task assignment detail screen
        Then student fills the task assignment without text note
        And student cannot submit the task assignment on Learner App
