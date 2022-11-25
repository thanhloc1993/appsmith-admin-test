@cms
@cms-syllabus-integration
@syllabus @task-assignment

Feature: [Integration] School admin views task assignment
    Background:
        Given "school admin" logins CMS
        And school admin is at book page
        And school admin has created a "simple content with a task assignment" book
        And school admin is at book detail page

    #TCID:syl-0019
    Scenario: School admin views task assignment
        When school admin views created task assignment
        Then school admin sees task assignment's info
