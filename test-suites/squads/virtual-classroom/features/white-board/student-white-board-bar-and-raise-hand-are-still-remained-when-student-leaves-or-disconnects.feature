@cms @teacher @learner
@virtual-classroom
@virtual-classroom-white-board

Feature: White board permission and active raise hand are still kept when student leave or disconnect then rejoin
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "student" has turned on raise hand on Learner App
        And "teacher" has shared pdf on Teacher App
        And "teacher" has enabled white board of "student" on Teacher App

    Scenario: White board permission and active raise hand are still kept when student leaves then rejoins lesson
        When "student" leaves lesson on Learner App
        And "student" rejoins lesson
        Then "student" sees active raise hand icon on Learner App
        And "student" sees white board bar on Learner App
        And "student" sees annotate icon on Learner App
        And "teacher" sees active raise hand icon in main screen on Teacher App
        And "teacher" "can see" active "student"'s raise hand icon in the first position in student list on Teacher App
        And "teacher" sees "active" "student" annotate icon in student list on Teacher App

    Scenario: White board permission and active raise hand are still kept when student disconnects then reconnects lesson
        When "student" disconnects on Learner App
        And "student" reconnects on Learner App
        Then "student" sees active raise hand icon on Learner App
        And "student" sees white board bar on Learner App
        And "student" sees annotate icon on Learner App
        And "teacher" sees active raise hand icon in main screen on Teacher App
        And "teacher" "can see" active "student"'s raise hand icon in the first position in student list on Teacher App
        And "teacher" sees "active" "student" annotate icon in student list on Teacher App