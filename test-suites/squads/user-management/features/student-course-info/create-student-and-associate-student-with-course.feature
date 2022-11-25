@cms @teacher @learner
@user @student-course
Feature: Create student and associate student with course on CMS

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    Scenario Outline: Create student and associate student with course which has <condition>
        When school admin creates a new student with course which has "<condition>"
        Then school admin sees newly created student on CMS
        And teacher sees newly created student on Teacher App
        And student logins Learner App successfully with credentials which school admin gives
        And student "<result>" the course on Learner App when "<condition>"

        Examples:
            | condition                              | result       |
            | start date <= current date <= end date | sees         |
            | start date > current date              | does not see |
            | end date < current date                | does not see |
            | start date = end date = current date   | sees         |
            | start date = end date > current date   | does not see |
            | start date = end date < current date   | does not see |
