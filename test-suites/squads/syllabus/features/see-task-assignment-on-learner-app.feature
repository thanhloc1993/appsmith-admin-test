@cms @learner
@syllabus @task-assignment @task-assignment-common

Feature: See task assignment on learner app
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content with a task assignment" book
        And school admin has created a matched studyplan for student
        And school admin goes to a task assignment detail page of the content book
        And school admin edits task assignment setting to include random n required fields
        # n <= 5, setting fields = [text note, duration, correctness, understanding level, file attachment]
        And school admin sees the edited task assignment setting on CMS

    #TCID:syl-0889
    Scenario Outline: Student can see task assignment in book flow
        When student goes to task assignment in "<learning flow>" from Home Screen
        Then student sees task assignment with required fields

        Examples:
            | learning flow |
            | todo flow     |
            | course flow   |
