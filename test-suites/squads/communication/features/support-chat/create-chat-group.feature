@cms @teacher @learner @parent @parent2
@communication
@support-chat

Feature: Create chat group
  Background:
    Given "school admin" logins CMS
    And "school admin" has filtered organization on location settings
    And "teacher T1" logins Teacher App

  Scenario: Chat group for student is created when admin creates student with student info only
    Given school admin has created a student "student" with "0 parents", "0 visible courses"
    And "teacher T1" has filtered location in location settings on Teacher App with student locations
    When "student" logins Learner App
    Then "student" sees student chat group on Learner App
    And teacher sees student chat group in Unjoined tab on Teacher App

  Scenario: Chat group for student and parent is created when admin creates student with parent info
    Given school admin has created a student "student" with "1 parents", "0 visible courses"
    And "teacher T1" has filtered location in location settings on Teacher App with student locations
    And "student" logins Learner App
    And "parent P1" of "student" logins Learner App
    Then "student" sees student chat group on Learner App
    And "parent P1" of "student" sees parent chat group on Learner App
    And teacher sees both student chat group & parent chat group in Unjoined tab on Teacher App
    And chat groups with students are shown by student name
    And chat groups with parents are shown by student name and has Parent tag

  Scenario: Chat group for student and parents is created when admin creates student with many parents' info
    Given school admin has created a student "student S1" with "2 parents", "0 visible courses"
    And "teacher T1" has filtered location in location settings on Teacher App with student locations
    And "teacher T1" is at the conversation screen on Teacher App
    When "student S1" logins Learner App
    And "parent P1" of "student S1" logins Learner App
    And "parent P2" of "student S1" logins Learner App
    Then "student S1" sees student chat group on Learner App
    And "parent P1" and "parent P2" of "student S1" are in the same chat group
    And "teacher T1" sees student & parent chat group of "student S1" in Unjoined tab on Teacher App

  Scenario: New chat group is created for a parent who has more than 1 child
    Given school admin has created a student "student S2" with "1 parents", "0 visible courses"
    And "teacher T1" has filtered location in location settings on Teacher App with student locations
    And "teacher T1" is at the conversation screen on Teacher App
    When school admin create "student S1" with parent of "student S2"
    And "student S1" logins Learner App
    And "parent P1" of "student S1" logins Learner App
    Then "student S1" sees student chat group on Learner App
    And "parent P1" sees parent chat group of "student S1, student S2" on Learner App
    And "teacher T1" sees student & parent chat group of "student S1" in Unjoined tab on Teacher App
    And "teacher T1" sees student & parent chat group of "student S2" in Unjoined tab on Teacher App

  Scenario: New parent chat group is created when admin adds new parent for an existed student
    Given school admin has created a student "student S1" with "0 parents", "0 visible courses"
    And "teacher T1" has filtered location in location settings on Teacher App with student locations
    And "teacher T1" is at the conversation screen on Teacher App
    When school admin adds new "parent P1" for "student S1" at CMS
    Then "teacher T1" sees "parent P1" of "student S1" chat group in Unjoined tab on Teacher App
    And "parent P1" of "student S1" logins Learner App
    And "parent P1" of "student S1" sees parent chat group on Learner App

  Scenario: New parent chat group is created when admin adds existed parent for an existed student
    Given school admin has created a student "student S1" with "0 parents", "0 visible courses"
    And school admin has created a student "student S2" with "1 parents", "0 visible courses"
    And "teacher T1" has filtered location in location settings on Teacher App with student locations
    And "teacher T1" is at the conversation screen on Teacher App
    When school admin adds existed parent of "student S2" for "student S1" at CMS
    Then "teacher T1" sees "parent P1" of "student S1" chat group in Unjoined tab on Teacher App
    And "parent P1" of "student S1" logins Learner App
    And "parent P1" of "student S1" sees parent chat group on Learner App

  Scenario: Add new parent to existing chat group when admin adds new parent for a student which already has parent
    Given school admin has created a student "student S1" with "1 parents", "0 visible courses"
    And "teacher T1" has filtered location in location settings on Teacher App with student locations
    When school admin adds new "parent P2" for "student S1" at CMS
    And "parent P1" of "student S1" logins Learner App
    And "parent P2" of "student S1" logins Learner App
    Then "parent P1" of "student S1" sees parent chat group on Learner App
    And "parent P2" of "student S1" sees parent chat group on Learner App
    And "parent P1" and "parent P2" of "student S1" are in the same chat group

  Scenario: Add new parent to existing chat group when admin adds existed parent for a student which already has parent
    Given school admin has created a student "student S1" with "1 parents", "0 visible courses"
    And school admin has created a student "student S2" with "1 parents", "0 visible courses"
    And "teacher T1" has filtered location in location settings on Teacher App with student locations
    When school admin adds existed parent of "student S2" for "student S1" at CMS
    And "parent P1" of "student S1" logins Learner App
    And "parent P2" of "student S1" logins Learner App
    Then "parent P1" of "student S1" sees parent chat group on Learner App
    And "parent P2" of "student S1" sees parent chat group on Learner App
    And "parent P1" and "parent P2" of "student S1" are in the same chat group
