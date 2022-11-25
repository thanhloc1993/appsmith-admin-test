@cms @teacher @learner
@virtual-classroom
@virtual-classroom-polling-join-and-leave

Feature: Student still can submit their answer when all teacher leaves lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: Student can submit their answer when all teacher leaves lesson
        Given "teacher" has opened polling on Teacher App
        And "teacher" has added "E, F, G, H, I, J" to polling answer options on Teacher App
        And "teacher" has set correct answer is "A" option
        And "teacher" has started polling on Teacher App
        And "teacher" has left lesson on Teacher App
        When "student" submits "<answerOption>" option on Learner App
        And "teacher" rejoins lesson on Teacher App
        Then "teacher" sees submission is "1/1"
        And "teacher" sees accuracy is "<accuracyRate>"
        And "student" sees "<answerBanner>" banner on Learner App
        And "student" sees submit button is disabled on Learner App
        And "student" sees their selected "<answerOption>" option is "<answerColour>" on Learner App
        Examples:
            | answerOption             | answerBanner | answerColour | accuracyRate |
            | 1 of [B,C,D,E,F,G,H,I,J] | incorrect    | red          | 0.00%        |
            | A                        | correct      | green        | 100.00%      |