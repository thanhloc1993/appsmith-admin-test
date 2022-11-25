@cms @teacher @learner
@syllabus @task-assignment @task-assignment-common

Feature: Remove task assignment on teacher web
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content with a task assignment" book
        And school admin has created a matched studyplan for student
        And school admin goes to a task assignment detail page of the content book
        And school admin edits task assignment setting to include random n required fields
        # n <= 5, setting fields = [text note, duration, correctness, understanding level, file attachment]
        And school admin sees the edited task assignment setting on CMS
    
    #TCID:syl-0920
    Scenario: Teacher removes task assignment submission submitted by student
        Given student is on task assignment detail screen
        And student fills all required fields with data on Learner App
        And student submits the task assignment
        And teacher sees the submission with matched data on teacher dashboard
        # matched data = complete date, status and grade (if correctness is required)
        When teacher removes the task assignment submission
        Then teacher sees the submission with incomplete status on task assignment detail screen
        And teacher sees empty data on task assignment detail screen on Teacher App
        And teacher sees empty data on teacher dashboard
        # empty data = no complete date && no grade  && 'incomplete' status
        And student is on task assignment detail screen
        And student sees empty data on task assignment detail screen on Learner App
        And student sees task assignment not submitted in todo page
    
    #TCID:syl-0920
    Scenario: Teacher removes task assignment submission submitted by teacher
        Given teacher is at student's studyplan detail screen
        And teacher fills all required fields with data on Teacher App
        And teacher submits the task assignment
        And teacher sees the submission with matched data on teacher dashboard
        # matched data = complete date, status and grade (if correctness is required)
        When teacher removes the task assignment submission
        Then teacher sees the submission with incomplete status on task assignment detail screen
        And teacher sees empty data on task assignment detail screen on Teacher App
        And teacher sees empty data on teacher dashboard
        # empty data = no complete date && no grade  && 'incomplete' status
        And student is on task assignment detail screen
        And student sees empty data on task assignment detail screen on Learner App
        And student sees task assignment not submitted in todo page