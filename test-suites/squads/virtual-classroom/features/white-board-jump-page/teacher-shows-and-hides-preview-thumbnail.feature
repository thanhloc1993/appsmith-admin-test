@cms @teacher @learner
@virtual-classroom
@virtual-classroom-jump-page

Feature: Teacher shows and hides preview thumbnail
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher" has shared lesson's "pdf" on Teacher App

    Scenario: Teacher can show the preview slide of pdf material
        When "teacher" shows preview thumbnail
        Then "teacher" sees active Preview icon in the main bar on Teacher App
        And "teacher" sees pdf slide on the left side
        And "teacher" sees the first pdf page is framed and displayed in the beginning of the slide
        And "student" sees "pdf" on Learner App

    Scenario: Teacher can hide the preview slide of pdf material
        Given "teacher" has shown preview thumbnail
        When "teacher" hides preview thumbnail
        Then "teacher" sees inactive Preview icon in the main bar on Teacher App
        And "teacher" does not see pdf slide on the left side
        And "student" sees "pdf" on Learner App

    Scenario: Teacher will not see active preview icon when they leave lesson then rejoin
        Given "teacher" has shown preview thumbnail
        When "teacher" leaves lesson on Teacher App
        And "teacher" rejoins lesson
        Then "teacher" sees inactive Preview icon in the main bar on Teacher App
        And "teacher" does not see pdf slide on the left side
        And "teacher" still sees current lesson's "pdf" normally on Teacher App