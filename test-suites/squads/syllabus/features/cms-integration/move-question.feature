@cms
@cms-syllabus-integration
@syllabus @question @question-common

Feature: [Integration] School admin moves question

    Background:
        Given "school admin" logins CMS
        And school admin has created a "1 LO learning with (2-3) random questions type" book
        And school admin goes to book detail page
        And school admin goes to LO detail page

    Scenario Outline: School admin can move question <direction>
        Given school admin selects a question is not at "<position>"
        When school admin moves that question "<direction>"
        Then school admin sees message "You have moved item successfully"
        And school admin sees that question is moved "<direction>" on CMS

        Examples:
            | position | direction |
            | top      | up        |
            | bottom   | down      |
