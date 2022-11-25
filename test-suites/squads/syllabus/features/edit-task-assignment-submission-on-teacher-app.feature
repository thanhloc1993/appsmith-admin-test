@cms @teacher @learner
@syllabus @task-assignment @task-assignment-common

Feature: Edit task assignment submission on teacher app
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content with a task assignment" book
        And school admin has created a matched studyplan for student
        And school admin edits required items in task assignment to include duration and n of remaining required items
        When student is on task assignment detail screen
        Then student fills all required fields with data on Learner App
        And student submits the task assignment
        And teacher sees the submission with matched data on teacher dashboard

    #TCID:syl-0917
    Scenario: Teacher edits values in student's task submission
        Given teacher edits student's task submission
        Then teacher sees values in student's task submission edited
        And teacher sees task assignment's status is unchanged
        And student sees values in student's task submission "edited"

    #TCID:syl-0918
    Scenario: Teacher edits any value in student's task submission to null
        Given teacher edits value in student's task submission to empty data
        Then teacher can't edits student's task submission
        And teacher sees task assignment's status is unchanged
        And student sees values in student's task submission "unchanged"

    #TCID:syl-0919
    Scenario Outline: Teacher can not edit "<type>" in student's task submission
        Given teacher edits "<type>" in student's task submission
        Then teacher can't edit student's task submission

        Examples:
            | type          |
            | complete date |
            | duration      |
