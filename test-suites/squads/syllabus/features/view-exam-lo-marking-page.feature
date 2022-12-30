@cms @learner @teacher
@syllabus @exam-lo @exam-lo-common
@staging

Feature: View Exam LO Marking Page

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And "teacher" logins Teacher App

    Scenario Outline: Teacher view exam lo with manual grading is <status> in marking page from study plan page
        Given school admin has created a "exam lo with manual grading is <status>" book
        And school admin has created a matched studyplan for student
        And student practices exam lo
        And student does some questions at exam lo
        And student submits exam lo
        When teacher goes to student study plan page
        And teacher goes to marking page from student study plan
        Then teacher sees marking page display as "<mode>" mode
        Examples:
            | status | mode |
            | on     | edit |
            | off    | view |
