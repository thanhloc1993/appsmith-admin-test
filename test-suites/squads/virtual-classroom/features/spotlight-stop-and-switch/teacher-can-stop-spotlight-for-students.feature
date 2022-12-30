@cms @teacher @teacher2 @learner @learner2
@virtual-classroom
@virtual-classroom-spotlight-stop-and-switch

Feature: All teachers can stop spotlight for students
    Background:
        Given "school admin" logins CMS
        And "teacher T1" logins Teacher App
        And "teacher T2" logins Teacher App
        And "student S1, student S2" with course and enrolled status have logged Learner App
        And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student S1, student S2" have joined lesson on Learner App

    Scenario Outline: Main teacher can stop spotlighting for students
        Given "teacher T1, teacher T2" have turned on their camera on Teacher App
        And "teacher T1" has spotlighted "<user>" on Teacher App
        When "teacher T1" stops spotlighting "<user>" on Teacher App
        Then "teacher T1, teacher T2" do not see "<user>" stream is covered with white frame in the gallery view on Teacher App
        And "student S1, student S2" do not see "<user>" stream with camera "active" in the main screen on Learner App
        And "student S1, student S2" see "<user>" in the gallery view on Learner App
        Examples:
            | user       |
            | teacher T1 |
            | teacher T2 |

    Scenario Outline: Other teacher can stop spotlighting for students
        Given "teacher T1, teacher T2" have turned on their camera on Teacher App
        And "teacher T1" has spotlighted "<user>" on Teacher App
        When "teacher T2" stops spotlighting "<user>" on Teacher App
        Then "teacher T1, teacher T2" do not see "<user>" stream is covered with white frame in the gallery view on Teacher App
        And "student S1, student S2" do not see "<user>" stream with camera "active" in the main screen on Learner App
        And "student S1, student S2" see "<user>" in the gallery view on Learner App
        Examples:
            | user       |
            | teacher T1 |
            | teacher T2 |

    Scenario: Teacher can stop spotlighting specific student for students
        Given "teacher T1" has spotlighted "student S1" on Teacher App
        When "teacher T1" stops spotlighting "student S1" on Teacher App
        Then "teacher T1, teacher T2" do not see "student S1" stream is covered with white frame in the gallery view on Teacher App
        And "student S1, student S2" do not see "student S1" stream with camera "inactive" in the main screen on Learner App
        And "student S1, student S2" do not see "student S1" in the gallery view on Learner App