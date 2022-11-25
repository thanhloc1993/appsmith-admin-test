@cms @teacher @learner
@virtual-classroom
@virtual-classroom-polling-stop-and-end

Feature: Student cannot submit their answer when teacher stops polling
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    # Case 1: Student doesn't chooses any options in answer bar and then teacher stops answer
    Scenario: Student cannot submit when he doesn't choose any option in answer bar and then teacher stops answer
        Given "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "A" option
        And "teacher" has started polling on Teacher App
        And "student" has seen answer bar with 4 options on Learner App
        And "student" has not chosen any polling option on Learner App
        When "teacher" stops polling on Teacher App
        Then "student" sees submit button is disabled on Learner App
        And "student" sees option "A" is green on Learner App

    # Case 2: Student chooses random one options in answer bar (not submit) and then teacher stops answer
    Scenario Outline: Student cannot submit when he chooses an options in answer bar (not submit) and then teacher stops answer
        Given "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "A" option
        And "teacher" has started polling on Teacher App
        And "student" has seen answer bar with 4 options on Learner App
        And "student" has chosen "<option>" option on Learner App
        When "teacher" stops polling on Teacher App
        Then "student" sees submit button is disabled on Learner App
        And "student" sees option "A" is green on Learner App
        Examples:
            | option |
            | A      |
            | B      |
            | C      |
            | D      |