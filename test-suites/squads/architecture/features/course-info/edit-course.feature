@cms @teacher @learner
@architecture @course
Feature: Edit course

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And school admin has created a student with parent info and "available" course
        And student logins Learner App successfully with credentials which school admin gives

    Scenario Outline: Edit course <item>
        When school admin edits course "<item>" after clicking Edit button in the "<UI>"
        Then school admin sees the edited course "<item>" on CMS
        And teacher sees the edited course "<item>" on Teacher App
        And student sees the edited course "<item>" on Learner App

        Examples:
            | item   | UI                   |
            | name   | Course details       |
            | avatar | Course details       |
            | avatar | Course Settings page |