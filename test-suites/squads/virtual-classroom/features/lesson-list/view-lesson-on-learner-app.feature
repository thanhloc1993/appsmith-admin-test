@cms @learner
@virtual-classroom
@virtual-classroom-lesson-list

Feature: View lesson on desired date in lesson calendar on Learner App

  Background:
    Given "school admin" logins CMS
    And "student" with course and enrolled status has logged Learner App
    And school admin has created a lesson of lesson management on a specific date
    And "student" has gone to lesson tab on Learner App
    And "student" has opened calendar on Learner App

  Scenario: Student can view all lesson on desired date in lesson calendar on Learner App
    When "student" chooses desired lesson's date to view lesson
    Then "student" sees lesson in lesson list on Learner App
