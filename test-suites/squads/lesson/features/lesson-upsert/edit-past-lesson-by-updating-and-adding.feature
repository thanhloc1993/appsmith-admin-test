@cms @teacher @teacher2 @learner @learner2
@lesson
@lesson-upsert
@ignore

Feature: School admin can edit past lesson which has no lesson report by updating and adding
    Background:
        Given "school admin" logins CMS
        And "teacher T1" logins Teacher App
        And "student S1" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened editing lesson page

    Scenario: School admin can update date&time in past lesson
        When "school admin" updates lesson date to the previous date of yesterday
        And "school admin" updates start & end time before 11:55 PM
        And "school admin" saves the changes of the lesson
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated lesson on CMS
        And "school admin" sees lesson moved to "past" lessons list page

    Scenario: School admin can update date&time in past lesson to future lesson
        When "school admin" updates lesson date to the next date of tomorrow
        And "school admin" updates start & end time from 7AM to 9AM
        And "school admin" saves the changes of the lesson
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated lesson on CMS
        And "school admin" sees lesson still in "future" lessons list page

    Scenario Outline: School admin can update <field> in past lesson
        When "school admin" updates "<field>" of lesson
        And "school admin" saves the changes of the lesson
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated lesson's "<field>"
        And "school admin" sees lesson still in "past" lessons list page
        Examples:
            | field           |
            | teaching medium |

    Scenario: School admin can add teacher in past lesson
        Given "teacher T2" logins Teacher App
        #need refactor
        When "school admin" adds "teacher T2" into the lesson
        And "school admin" saves the changes of the lesson
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees added "teacher T2" in detailed lesson info page on CMS
        And "teacher T2" sees the "past" lesson on Teacher App

    Scenario: School admin can add student in past lesson
        Given "student S2" with course and enrolled status has logged Learner App
        When "school admin" adds "student S2" into the lesson
        And "school admin" saves the changes of the lesson
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees added "student S2" in detailed lesson info page on CMS
        And "teacher T1" sees added "student S2" in student list of "past" lesson on Teacher App
        And "student S2" sees the new lesson on Learner App

    Scenario Outline: School admin can not edit past lesson
        When "school admin" clears "<field>" value of the lesson
        And "school admin" saves the changes of the lesson
        Then "school admin" sees alert message in "<field>" area in editing lesson page
        And "school admin" is still in editing lesson page
        Examples:
            | field  |
            | center |
