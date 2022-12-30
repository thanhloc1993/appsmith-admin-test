@cms @learner @teacher
@virtual-classroom
@virtual-classroom-join-leave

Feature: Can view or can not view a completed lesson on Learner App
  Background:
    Given "school admin" logins CMS
    And "teacher" logins Teacher App
    And "student" with course and enrolled status has logged Learner App

  Scenario: Student can view a lesson that has been completed within the last 24 hours in lesson list
    Given school admin has created a lesson of lesson management that has been completed in the last 24 hours
    And "teacher" has applied center location in location settings on Teacher App
    When "student" goes to lesson tab on Learner App
    Then "student" "sees" lesson in lesson list on Learner App

  Scenario: Student can not view a lesson that has been completed after the last 24 hours in lesson list
    Given school admin has created a lesson of lesson management that has been completed before 24 hours ago
    And "teacher" has applied center location in location settings on Teacher App
    When "student" goes to lesson tab on Learner App
    Then "student" "does not see" lesson in lesson list on Learner App
