@cms @teacher @learner @teacher2 @learner2
@virtual-classroom
@virtual-classroom-pin-user

Feature: Teacher can pin or unpin user
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student S1, student S2" with course and enrolled status have logged Learner App
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student S1, student S2" have joined lesson on Learner App

    Scenario: Teacher can pin themselves and does not affect on other teacher and student side
        When "teacher T1" "Pin for me" themselves on Teacher App
        Then "teacher T1" sees themselves stream with "camera" "inactive" in the main screen on Teacher App
        And "teacher T1" does not see themselves in the gallery view on Teacher App
        And "teacher T2" does not see "teacher T1" stream with "camera" in the main screen on Teacher App
        And "student S1, student S2" see "teacher T1" in the gallery view on Learner App

    Scenario: Teacher can pin other teacher and does not affect on other teacher and student side
        Given "teacher T2" has turned on their camera on Teacher App
        When "teacher T1" "Pin for me" "teacher T2" on Teacher App
        Then "teacher T1" sees "teacher T2" stream with "camera" "active" in the main screen on Teacher App
        And "teacher T1" does not see "teacher T2" in the gallery view on Teacher App
        And "student S1, student S2" see "teacher T2" in the gallery view on Learner App

    Scenario: Teacher can pin student and does not affect on other teacher and student side
        When "teacher T1" "Pin for me" "student S1" on Teacher App
        Then "teacher T1" sees "student S1" stream with "camera" "inactive" in the main screen on Teacher App
        And "teacher T1" does not see "student S1" in the gallery view on Teacher App
        And "teacher T1" sees "student S2" with camera "inactive" in the gallery view on Teacher App
        And "teacher T2" sees "student S1" with camera "inactive" in the gallery view on Teacher App
        And "teacher T2" sees "student S2" with camera "inactive" in the gallery view on Teacher App

    Scenario: Teachers can pin their desired student and does not affect on other teacher and student side
        When "teacher T1" "Pin for me" "student S1" on Teacher App
        And "teacher T2" "Pin for me" "student S2" on Teacher App
        Then "teacher T1" sees "student S1" stream with "camera" "inactive" in the main screen on Teacher App
        And "teacher T1" does not see "student S1" in the gallery view on Teacher App
        And "teacher T1" sees "student S2" with camera "inactive" in the gallery view on Teacher App
        And "teacher T2" sees "student S2" stream with "camera" "inactive" in the main screen on Teacher App
        And "teacher T2" does not see "student S2" in the gallery view on Teacher App
        And "teacher T2" sees "student S1" with camera "inactive" in the gallery view on Teacher App

    Scenario: Teacher can unpin themselves and does not affect on other teacher and student side
        Given "teacher T1" has "Pin for me" themselves on Teacher App
        When "teacher T1" "Unpin" themselves on Teacher App
        Then "teacher T1" sees themselves with "camera" "inactive" in the gallery view on Teacher App
        And "teacher T1" does not see themselves stream with "camera" "inactive" in the main screen on Teacher App
        And "teacher T2" does not see "teacher T1" stream with "camera" in the main screen on Teacher App

    Scenario: Teacher can unpin other teacher and does not affect on other teacher and student side
        Given "teacher T2" has turned on their camera on Teacher App
        And "teacher T1" has "Pin for me" "teacher T2" on Teacher App
        When "teacher T1" "Unpin" "teacher T2" on Teacher App
        Then "teacher T1" sees "teacher T2" with camera "active" in the gallery view on Teacher App
        And "teacher T1" does not see "teacher T2" stream with "camera" in the main screen on Teacher App

    Scenario: Teacher can unpin student and does not affect on other teacher and student side
        Given "teacher T1" has "Pin for me" "student S1" on Teacher App
        When "teacher T1" "Unpin" "student S1" on Teacher App
        Then "teacher T1" sees "student S1" with camera "inactive" in the gallery view on Teacher App
        And "teacher T1" does not see "student S1" stream with "camera" in the main screen on Teacher App

    Scenario: Teachers can unpin their desired student and does not affect on other teacher and student side
        Given "teacher T1" has "Pin for me" "student S1" on Teacher App
        And "teacher T2" has "Pin for me" "student S2" on Teacher App
        When "teacher T1" "Unpin" "student S1" on Teacher App
        Then "teacher T1" does not see "student S1" stream with "camera" in the main screen on Teacher App
        And "teacher T1" sees "student S1" with camera "inactive" in the gallery view on Teacher App
        And "teacher T2" sees "student S2" stream with "camera" "inactive" in the main screen on Teacher App
        And "teacher T2" does not see "student S2" in the gallery view on Teacher App
