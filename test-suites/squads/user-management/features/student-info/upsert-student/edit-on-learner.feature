@cms @teacher @learner @parent
@user @student-info @parent-info
Feature: Edit info on Learner App

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And school admin has created a student with parent info and "available" course
        And student logins Learner App successfully with credentials which school admin gives
        And new parent logins Learner App successfully with credentials which school admin gives

    Scenario Outline: Edit student <profile> on Learner App
        When "student" changes "<profile>" on Learner App
        And "student" cancels the changes
        And "student" edits "<profile>" on Learner App
        Then "student" sees the edited "<profile>" on Learner App
        ### TODO: Ask Communication team about avatar when search student to compose notification
        And school admin sees the edited "student" "<profile>" on CMS
        And teacher sees the edited "student" "<profile>" on Teacher App
        And parent sees the edited "<profile>" on Learner App
        Examples:
            | profile |
            ### Disable edit name on Learner App
            # | name    |
            | avatar  |

    ### CMS: UI not show but we can compare link URL of parent's avatar
    Scenario Outline: Edit parent <profile> on Learner App
        When "parent" changes "<profile>" on Learner App
        And "parent" cancels the changes
        And "parent" edits "<profile>" on Learner App
        Then "parent" sees the edited "<profile>" on Learner App
        And school admin sees the edited "parent" "<profile>" on CMS
        ### TODO: Implement verify parent name in chat
        And teacher sees the edited "parent" "<profile>" on Teacher App
        Examples:
            | profile |
            ### Disable edit name on Learner App
            # | name    |
            | avatar  |
