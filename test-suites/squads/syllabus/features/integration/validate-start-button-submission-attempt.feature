@cms @learner
@syllabus @exam-lo-common @exam-lo-submission-attempt

@staging
Feature: Validate start button at instruction screen with submission attempt setting
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student
        And school admin is at book detail page
        And school admin goes to the LO "exam LO" detail page
        And school admin changes exam lo's submission attempt to "2"
        And school admin creates 1 questions of each question type in Exam LO
        And student does and submit exam lo 2 times with randomness

    Scenario: Exam LO has submission attempt is 2, Student submit 2 times, Start button is disabled
        When student opens the exam lo attempt history screen
        And student press take again button at exam lo attempt history screen
        Then student sees start button in instruction screen is "disabled"

    Scenario Outline: Admin changed number of attempts to <maximum attempt>, Start button is <state>
        When school admin changes exam lo's submission attempt to "<maximum attempt>"
        And student refreshes their browser
        And student opens the exam lo attempt history screen
        And student press take again button at exam lo attempt history screen
        Then student sees start button in instruction screen is "<state>"

        Examples:
            | maximum attempt | state    |
            | 1               | disabled |
            | null            | enabled  |
            | 3               | enabled  |