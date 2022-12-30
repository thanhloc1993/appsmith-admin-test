@cms @teacher @learner
@syllabus @task-assignment @task-assignment-common

Feature: Can submit task assignment on teacher web
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content with a task assignment" book
        And school admin has created a matched studyplan for student
        And teacher is at student's studyplan detail screen

    #TCID:syl-0916
    Scenario: Teacher can submit task assignment
        Given school admin goes to a task assignment detail page of the content book
        And school admin edits task assignment setting to include random n required fields
        # n <= 5, setting fields = [text note, duration, correctness, understanding level, file attachment]
        And school admin sees the edited task assignment setting on CMS
        When teacher fills all required fields with data on Teacher App
        Then teacher can submit the task assignment on Teacher App

    #TCID:syl-0915
    Scenario: Teacher cannot submit task assignment
        Given school admin goes to a task assignment detail page of the content book
        And school admin edits task assignment setting to include random n required fields
        # n <= 5, setting fields = [text note, duration, correctness, understanding level, file attachment]
        And school admin sees the edited task assignment setting on CMS
        When teacher fills a required field with no data on Teacher App
        Then teacher cannot submit the task assignment on Teacher App
