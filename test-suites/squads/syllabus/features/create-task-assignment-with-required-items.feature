@cms @teacher @learner
@syllabus @task-assignment @task-assignment-common

Feature: School admin creates task assignment with required items
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin is at book page
        And school admin has created a "has chapter and topic only" book
        And school admin has created a matched studyplan for student
        And school admin is at book detail page

    #TCID:syl-0889
    @blocker
    Scenario: School admin creates a task assignment with required items
        Given school admin creates a task assignment with "any required item"
        And school admin sees "any required item" on created task assignment
        And school admin sees a new task assignment on CMS
        And school admin modifies that task assignment available for studying
        When student is on task assignment detail screen
        Then student sees task assignment with required fields
        And teacher is on task assignment detail screen
        And teacher sees task assignment with required fields