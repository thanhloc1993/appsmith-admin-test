@cms
@user @student-info
@ignore
Feature: Fail to edit student info on CMS

    Background:
        Given "school admin" logins CMS

    Scenario Outline: Can not edit student without required field
        Given school admin has created a student with student info
        When school admin edits a student with missing "<requiredField>"
        Then school admin sees error message
        And school admin sees the student with new data is not saved
        Examples:
            | requiredField |
            | name          |
            | grade         |
