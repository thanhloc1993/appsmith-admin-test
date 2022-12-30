@cms @learner
@syllabus @exam-lo-common @exam-lo-timer

@staging
Feature: Create exam-lo with timer setting
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content with 1 LO exam has 1 question" book
        And school admin has created a matched studyplan for student
        And school admin is at book detail page
        And school admin goes to the LO "exam LO" detail page

    Scenario Outline: School admin changes exam lo's time limit
        Given school admin changes exam lo's time limit to "<time limit>"
        When student opens the exam lo instruction screen from "Course screen"
        Then student sees exam lo's time limit with matched setting

        Examples:
            | time limit           |
            | random from 1 to 180 |
            | null                 |
