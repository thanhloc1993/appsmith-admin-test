@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-join-leave

Feature: Can join a live lesson
  Background:
    Given "school admin" logins CMS
    And "student" with course and enrolled status has logged Learner App
    And "teacher T1, teacher T2" login Teacher App
    And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
    And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
    And "teacher T1" has joined lesson of lesson management on Teacher App
    And "student" has joined lesson on Learner App

  Scenario: Teacher can join a lesson after other teacher has joined
    When "teacher T2" joins lesson of lesson management on Teacher App
    Then "teacher T1, teacher T2" see itself in gallery view on Teacher App
    And "teacher T1, teacher T2" sees student in gallery view on Teacher App
    And student sees all teacher in gallery view on Learner App