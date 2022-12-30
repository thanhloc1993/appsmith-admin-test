@cms @teacher @learner
@syllabus @exam-lo-common @exam-lo-to-review

Feature: Teacher filters LO with type exam

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And school admin has created a "student" with course under first granted location
        And "student" logins Learner App
        And school admin has created a exam lo with settings
            | manualGrading | totalQuestions |
            | off           | 1              |
            | on            | 1              |
        And school admin has created a matched studyplan for course
        And student submitted 2 exam los

    Scenario: Teacher views exam lo in to-review screen
        When "teacher" goes to "To Review" on Teacher App
        And teacher select lo type filter is exam
        Then teacher sees exam lo with manual grading is on
        And teacher can not see exam lo with manual grading is off