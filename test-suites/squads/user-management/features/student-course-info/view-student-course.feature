@cms
@user @student-course
@ignore

Feature: View student course with location

    Background:
        Given "school admin" logins CMS
        And school admin has imported location master data

    Scenario: View student-course with archived location
        Given school admin has created a course belong to "location L1"
        And school admin has created a student belong to "location L1"
        When school admin adds a new course with "location L1"
        And school admin archives "location L1"
        And school admin reloads page
        And school admin is on "Course" tab
        Then school admin sees the student-course with archived location

    Scenario: View student-course with changed location name
        Given school admin has created a course belong to "location L1"
        And school admin has created a student belong to "location L1"
        When school admin adds a new course with "location L1"
        And school admin changes the name of "location L1"
        And school admin reloads page
        And school admin is on "Course" tab
        Then school admin sees the student-course with changed location name
