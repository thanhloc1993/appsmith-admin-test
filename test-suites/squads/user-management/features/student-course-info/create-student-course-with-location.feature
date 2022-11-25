@cms @teacher @learner
@user @student-course

Feature: Add Student-Course with Location on CMS

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And school admin has imported location master data
        And school admin selects all locations on location setting

    Scenario Outline: Add single student-course with location
        Given school admin has created a student belong to "location L1"
        And school admin has created a "course" belong to "location L1"
        When school admin wants to add a new student-course
        And school admin adds a new "<status>" "course" with "location L1"
        Then school admin sees the "course" with "location L1" added for the student
        And teacher sees the "course" on Teacher App
        And teacher sees the student in the "course" on Teacher App
        And student logins Learner App successfully with credentials which school admin gives
        And student "<result>" the "course" on Learner App
        Examples:
            | status      | result       |
            | available   | sees         |
            | unavailable | does not see |

    Scenario Outline: Add multiple student-courses with "<condition>" location
        Given school admin has created a student belong to "<student location>"
        And school admin has created a "course C1" belong to "<course 1 location>"
        And school admin has created a "course C2" belong to "<course 2 location>"
        When school admin wants to add a new student-course
        And school admin adds a new "available" "course C1" with "<course 1 location>"
        And school admin adds a new "unavailable" "course C2" with "<course 2 location>"
        Then school admin sees the "course C1" with "<course 1 location>" added for the student
        And school admin sees the "course C2" with "<course 2 location>" added for the student
        And teacher sees the "course C1 & course C2" on Teacher App
        And teacher sees the student in the "course C1" on Teacher App
        And teacher sees the student in the "course C2" on Teacher App
        And student logins Learner App successfully with credentials which school admin gives
        And student "sees" the "course C1" on Learner App
        And student "does not see" the "course C2" on Learner App

        Examples:
            | condition | student location          | course 1 location | course 2 location |
            | same      | location L1               | location L1       | location L1       |
            | different | location L1 & location L2 | location L1       | location L2       |

    @ignore
    Scenario: Add student-course with archived location
        Given school admin has created a student belong to "location L1 & location L2"
        And school admin has created a "course C1" belong to "location L1 & location L2"
        And school admin archives "location L1"
        When school admin wants to add a new student-course
        And school admin selects "course C1"
        And school admin wants to select location
        Then school admin "does not see" "location L1" in the dropdown list
        And school admin "sees" "location L2" in the dropdown list

    @ignore
    Scenario: Add student-course with changed location name
        Given school admin has created a student belong to "location L1"
        And school admin has created a "course C1" belong to "location L1"
        And school admin changes name of "location L1"
        When school admin wants to add a new student-course
        And school admin selects "course C1"
        And school admin wants to select location
        And school admin sees location changed name in the dropdown list

    @ignore
    Scenario Outline: Add student-course with missing class field
        Given school admin has created a student belong to "location L1"
        And school admin has created a "course C1" belong to "location L1" and "class C1"
        When school admin wants to add a new student-course
        And school admin adds a new "<status>" "course C1" with "location L1" and without "class C1"
        Then school admin sees the "course C1" with "location L1" and without "class C1" added for the student
        And teacher sees the "course C1" on Teacher App
        And teacher sees the student in the "Course C1" on Teacher App
        And student logins Learner App successfully with credentials which school admin gives
        And student "<result>" the "course C1" on Learner App
        Examples:
            | status      | result       |
            | available   | sees         |
            | unavailable | does not see |

    Scenario: Add multiple student_courses with different classes
        Given school admin has created a student belong to "location L1 & location L2"
        And school admin has created a "course C1" belong to "location L1" and "class C1"
        And school admin has created a "course C2" belong to "location L2" and "class C2"
        When school admin wants to add a new student-course
        And school admin adds a new "available" "course C1" with "location L1" and "class C1"
        And school admin adds a new "unavailable" "course C2" with "location L2" and "class C2"
        Then school admin sees the "course C1" with "location L1" and "class C1" added for the student
        And school admin sees the "course C2" with "location L2" and "class C2" added for the student
        And teacher sees the "course C1 & course C2" on Teacher App
        And teacher sees the student in the "course C1" on Teacher App
        And teacher sees the student in the "course C2" on Teacher App
        And student logins Learner App successfully with credentials which school admin gives
        And student "sees" the "course C1" on Learner App
        And student "does not see" the "course C2" on Learner App