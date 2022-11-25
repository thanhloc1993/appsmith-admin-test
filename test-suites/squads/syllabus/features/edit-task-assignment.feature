@cms @teacher @learner
@syllabus @task-assignment @task-assignment-common

Feature: Edit task assignment
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content with a task assignment" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0072,syl-0073
    Scenario Outline: Student and teacher can see the edited task assignment's <info> when admin edits task assignment's <info>
        Given school admin is at book detail page
        When school admin edits task assignment "<info>"
        Then school admin sees the edited task assignment "<info>" on CMS
        And student sees the edited task assignment "<info>" on Learner App
        And teacher sees the edited task assignment "<info>" on Teacher App

        Examples:
            | info        |
            | name        |
            | description |
            | attachments |
