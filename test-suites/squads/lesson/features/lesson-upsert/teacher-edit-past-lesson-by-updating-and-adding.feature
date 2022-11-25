@cms @cms2 @teacher @teacher2 @learner @learner2
@lesson
@lesson-upsert
@ignore

Feature: Teacher can edit past lesson which has no lesson report by updating and adding
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "teacher T1" logins Teacher App
        And "student S1" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "teacher" has gone to detailed lesson info page
        And "teacher" has opened editing lesson page

    Scenario: Teacher can update date&time in past lesson to past lesson
        When "teacher" updates lesson date to the previous date of yesterday
        And "teacher" updates start & end time before 11:55 PM
        And "teacher" saves the changes of the lesson
        Then "teacher" is redirected to detailed lesson info page
        And "teacher" sees updated lesson on CMS
        And "teacher" sees lesson moved to "past" lessons list page

    Scenario: Teacher can update date&time in past lesson
        When "teacher" updates lesson date to the next date of tomorrow
        And "teacher" updates start & end time from 7AM to 9AM
        And "teacher" saves the changes of the lesson
        Then "teacher" is redirected to detailed lesson info page
        And "teacher" sees updated lesson on CMS
        And "teacher" sees lesson still in "future" lessons list page

    Scenario Outline: Teacher can update <field> in past lesson
        When "teacher" updates "<field>" of lesson
        And "teacher" saves the changes of the lesson
        Then "teacher" is redirected to detailed lesson info page
        And "teacher" sees updated lesson's "<field>"
        And "teacher" sees lesson still in "past" lessons list page
        Examples:
            | field  |
            | teaching medium |

    Scenario: Teacher can add teacher in past lesson
        Given "teacher T2" logins Teacher App
        When "teacher" adds "teacher T2" into the lesson
        And "teacher" saves the changes of the lesson
        Then "teacher" is redirected to detailed lesson info page
        And "teacher" sees added "teacher T2" in detailed lesson info page on CMS
        And "teacher T2" sees the "past" lesson on Teacher App

    Scenario: Teacher can add student in past lesson
        Given "student S2" with course and enrolled status has logged Learner App
        When "teacher" adds "student S2" into the lesson
        And "teacher" saves the changes of the lesson
        Then "teacher" is redirected to detailed lesson info page
        And "teacher" sees added "student S2" in detailed lesson info page on CMS
        And "teacher T1" sees added "student S2" in student list of "past" lesson on Teacher App
        And "student S2" sees the new lesson on Learner App

    Scenario Outline: Teacher can not edit past lesson
        When "teacher" clears "<field>" value of the lesson
        And "teacher" saves the changes of the lesson
        Then "teacher" sees alert message in "<field>" area in editing lesson page
        And "teacher" is still in editing lesson page
        Examples:
            | field  |
            | center |