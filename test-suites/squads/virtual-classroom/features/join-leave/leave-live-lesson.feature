@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-join-leave

Feature: Leave a live lesson
  Background:
    Given "school admin" logins CMS
    And "teacher T1, teacher T2" login Teacher App
    And "student" with course and enrolled status has logged Learner App
    And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
    And "teacher T1, teacher T2" have applied center location in location settings on Teacher App

  Scenario: A teacher leaves the lesson by Leave Lesson button
    Given "teacher T1" has joined lesson of lesson management on Teacher App
    And "student" has joined lesson on Learner App
    When "teacher T1" leaves lesson on Teacher App
    Then "teacher T1" backs to lesson detail screen on Teacher App
    And "student" sees message Teacher has left the class on Learner App
    And "teacher T1" is not shown in gallery view on Learner App

  Scenario: One of teachers leaves the lesson by Leave Lesson button
    Given "teacher T1" has joined lesson of lesson management on Teacher App
    And "teacher T2" has joined lesson of lesson management on Teacher App
    And "student" has joined lesson on Learner App
    When "teacher T1" leaves lesson on Teacher App
    Then "teacher T1" backs to lesson detail screen on Teacher App
    And "teacher T1" is not shown in gallery view on "teacher T2"'s Teacher App
    And "teacher T2" is shown in gallery view on Learner App

  Scenario: Student leaves the lesson on Learner App
    Given "teacher T1" has joined lesson of lesson management on Teacher App
    And "student" has joined lesson on Learner App
    When "student" leaves lesson on Learner App
    Then "student" backs to lesson list on Learner App
    And "teacher T1" does not see student in the lesson on Teacher App

  Scenario: One teacher leaves the lesson by End lesson for all button
    Given "teacher T1" has joined lesson of lesson management on Teacher App
    And "teacher T2" has joined lesson of lesson management on Teacher App
    And "student" has joined lesson on Learner App
    When "teacher T1" ends lesson for all on Teacher App
    Then "teacher T1" backs to lesson detail screen on Teacher App
    And "teacher T2" have to end lesson on Teacher App
    And "student" has to end lesson on Learner App