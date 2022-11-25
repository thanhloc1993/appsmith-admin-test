@cms @teacher @learner @parent
@communication
@support-chat

Feature: Join chat group

    Background:
        Given "school admin" logins CMS
        And school admin has created a student "student" with "1 parents", "0 visible courses"
        And "teacher" logins Teacher App
        And "teacher" has filtered location in location settings on Teacher App with student locations
        And "student" logins Learner App
        And "parent P1" of "student" logins Learner App
        And "student, parent P1" is at the conversation screen on Learner App

    Scenario: Teacher joins student and parent chat group
        Given teacher sees both student chat group & parent chat group in Unjoined tab on Teacher App
        When "teacher" joins "student" chat group
        And teacher sends text message to current conversation
        And "teacher" joins "parent P1" chat group
        And teacher sends text message to current conversation
        Then "student" sees teacher joins chat group successfully on Learner App
        And "parent P1" sees teacher joins chat group successfully on Learner App
        And teacher joins "student" chat group successfully
        And teacher joins "parent P1" chat group successfully

    @ignore
    Scenario: Teacher joins all chat groups at once time
        Given teacher sees both student chat group & parent chat group in Unjoined tab on Teacher App
        When teacher joins all chat groups on Teacher App
        Then teacher joins all student chat groups and all parent chat groups successfully
        And student sees teacher joins chat group successfully on Learner App
        And parent sees teacher joins chat group successfully on Learner App
