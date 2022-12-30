@cms @teacher @learner
@user @never-logged-in

Feature: Never logged in tag

    # Go through all following screens to check "Never logged in" tag
    # CMS: Student list, student detail
    # Teacher: Student tab in Live lesson in Course, Student tab in Course, Student information in Student, Study Plan in Student

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with parent info and "visible" course
        And "teacher" logins Teacher App

    Scenario Outline: "Never logged in" tag when create a new student
        When newly created student "<actions>" on Learner App
        Then school admin "<results>" Never logged in tag on Back Office
        And teacher "<results>" Never logged in tag on Teacher Web
        Examples:
            | actions        | results      |
            | does not login | sees         |
            | logins         | does not see |