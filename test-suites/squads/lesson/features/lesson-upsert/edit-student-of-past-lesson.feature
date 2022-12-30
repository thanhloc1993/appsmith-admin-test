@cms @cms2 @teacher @learner @learner2
@lesson
@lesson-upsert
@ignore

Feature: School admin can edit student of past lesson which has lesson report
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "teacher" has logged Teacher App with available account
        And "student S1" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management that has been completed over 24 hours
        And "student S2" with course and enrolled status has logged Learner App
        And "teacher" has gone to detailed lesson info page
        And "teacher" has created an individual lesson report
        And "school admin" has gone to detailed lesson info page

    Scenario: School admin can add student in past lesson
        Given "school admin" has opened editing lesson page
        When "school admin" adds "student S2" into the lesson
        And "school admin" saves the changes of the lesson
        And "teacher" reloads detailed lesson info page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees added "student S2" in detailed lesson info page on CMS
        And "teacher" sees added "student S2" in student list of lesson report on CMS
        And "student S2" sees the new lesson on Learner App

    Scenario: School admin can cancel adding student in past lesson
        Given "school admin" has opened editing lesson page
        And "school admin" has added "student S2" into the lesson
        When "school admin" leaves editing lesson page
        And "teacher" reloads detailed lesson info page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" does not see "student S2" in detailed lesson info page on CMS
        And "teacher" does not see "student S2" in student list of lesson report on CMS
        And "student S2" does not see the "past" lesson on Learner App

    Scenario: School admin can remove student in past lesson
        Given "school admin" has opened editing lesson page
        And "school admin" has added "student S2" into the lesson
        When "school admin" removes "student S1" from the lesson
        And "school admin" saves the changes of the lesson
        And "teacher" reloads detailed lesson info page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" does not see "student S1" in detailed lesson info page on CMS
        And "teacher" does not see "student S1" in student list of lesson report on CMS
        And "teacher" sees added "student S2" in student list of lesson report on CMS
        And "student S1" does not see the "past" lesson on Learner App
        And "student S2" still sees the "past" lesson on Learner App

    Scenario: School admin can cancel removing student in past lesson
        Given "school admin" has opened editing lesson page
        And "school admin" has removed "student S1" from the lesson
        When "school admin" leaves editing lesson page
        And "teacher" reloads detailed lesson info page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees added "student S1" in detailed lesson info page on CMS
        And "teacher" sees added "student S1" in student list of lesson report on CMS
        And "student S1" still sees the "past" lesson on Learner App
