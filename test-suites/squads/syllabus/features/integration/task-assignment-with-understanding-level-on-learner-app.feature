@cms @learner
@syllabus @task-assignment @task-assignment-common

Feature: Task assignment which required items has understanding level on Learner app
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content with a task assignment" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0951
    Scenario: Student can select emoticon in a task assignment
        Given school admin edits required items in task assignment to include "Understanding level"
        When student is on task assignment detail screen
        Then student selects one of three emoticons
        And student sees emoticon is selected

    #TCID:syl-0895
    Scenario: Student can select another emoticon in a task assignment
        Given school admin edits required items in task assignment to include "Understanding level"
        When student is on task assignment detail screen
        Then student has selected one of three emoticons
        And student selects another emoticon
        And student sees previous emoticon is deselected
        And student sees emoticon is selected
