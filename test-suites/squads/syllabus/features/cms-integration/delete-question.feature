@cms
@cms-syllabus-integration
@syllabus @question @question-common

Feature: [Integration] School admin deletes question

    Background:
        Given "school admin" logins CMS
        And school admin has created a "1 LO with a random question type" book
        And school admin goes to book detail page
        And school admin goes to LO detail page

    Scenario Outline: School admin can delete question in <place>
        When school admin deletes the question in "<place>"
        Then school admin sees message "You have deleted question successfully"
        And school admin does not see the deleted question on CMS

        Examples:
            | place                   |
            | question list           |
            | question detail preview |
