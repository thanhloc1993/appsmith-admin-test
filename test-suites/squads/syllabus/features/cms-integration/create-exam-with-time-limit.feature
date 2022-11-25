@cms
@syllabus
@cms-syllabus-integration
@exam-lo @staging

Feature: [Integration] Create exam with time limit

    Background:
        Given "school admin" logins CMS
        And school admin has created a "has chapter and topic only" book

    Scenario: School admin creates exam with time limit setting
        Given school admin is at book detail page
        When school admin creates exam with time limit setting is "1 of [null, 1, 90, 180]"
        Then school admin sees message of creating successfully
        And school admin sees exam detail with time limit on CMS

    Scenario: School admin creates exam with invalid time limit setting
        Given school admin is at book detail page
        When school admin creates exam with time limit setting is "1 of [0, 200]"
        Then school admin sees time limit's validation error message
