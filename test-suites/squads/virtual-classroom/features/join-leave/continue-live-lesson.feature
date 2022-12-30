@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-join-leave

Feature: Student interacts normally after teacher leaves lesson

  Background:
    Given "school admin" logins CMS
    And "teacher T1, teacher T2" login Teacher App
    And "student" with course and enrolled status has logged Learner App
    And "school admin" has created a individual lesson with start date&time is "within 10 minutes from now"
    And "teacher T1, teacher T2" have applied center location in location settings on Teacher App

  Scenario: Other participants can continue and interact in lesson after one teacher leaves lesson
    Given "teacher T1" has joined lesson of lesson management on Teacher App
    And "teacher T2" has joined lesson of lesson management on Teacher App
    And "student" has joined lesson on Learner App
    When "teacher T1" leaves lesson on Teacher App
    Then "teacher T2" continues lesson normally on Teacher App
    And "teacher T2" still interacts normally on Teacher App
    And "student" continues lesson normally on Learner App
    And "student" still interacts normally on Learner App
    And "teacher T2" ends lesson on Teacher App
    And "student" ends lesson on Learner App

  Scenario: Student can continue and interact in lesson after only one teacher leaves lesson
    Given "teacher T1" has joined lesson of lesson management on Teacher App
    And "student" has joined lesson on Learner App
    When "teacher T1" leaves lesson on Teacher App
    Then "student" continues lesson normally on Learner App
    And "student" still interacts normally on Learner App
    And "student" ends lesson on Learner App
