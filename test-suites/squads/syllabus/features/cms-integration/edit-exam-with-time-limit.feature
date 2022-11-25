@cms
@syllabus
@cms-syllabus-integration
@exam-lo @staging

Feature: [Integration] Edit exam with time limit

    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content with 1 LO exam" book
        And school admin goes to book detail page
        And school admin goes to exam LO edit page

    Scenario: School admin edits exam with time limit setting
        When school admin edits exam with time limit setting is "1 of [null, 1, 120, 180]"
        Then school admin sees message "You have updated learning objective successfully"
        And school admin sees exam detail with time limit on CMS

    Scenario: School admin edits exam with invalid time limit setting
        When school admin edits exam with time limit setting is "1 of [0, 200]"
        Then school admin sees time limit's validation error message
