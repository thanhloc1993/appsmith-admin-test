@cms @learner
@syllabus @exam-lo-common @exam-lo-submission-attempt

@staging
Feature: Create exam-lo with submission attempt setting
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content with 1 LO exam has 1 question" book
        And school admin has created a matched studyplan for student
        And school admin is at book detail page
        And school admin goes to the LO "exam LO" detail page

    Scenario Outline: School admin changes exam lo's submission attempt
        Given school admin changes exam lo's submission attempt to "<maximum attempt>"
        When student opens the exam lo instruction screen from "Course screen"
        Then student sees exam lo's allowed attempt with matched setting

        Examples:
            | maximum attempt           |
            | random from 1 to 99       |
            | null                      |
