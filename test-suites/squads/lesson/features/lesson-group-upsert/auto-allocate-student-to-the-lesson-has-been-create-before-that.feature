@cms
@lesson
@lesson-group-upsert
@ignore

Feature: School admin auto allocate student to the lesson has been created before that
  Background:
    Given "school admin" logins CMS
    And "school admin" has applied "all child locations of parent" location

  Scenario: School admin auto allocate student in creating lesson page
    Given "school admin" has created course and imported class for the course
    And "school admin" has created a new student and added course and class to the student
    And "school admin" has filled start date and end date within 30 days since now
    And "school admin" has gone to lesson management page
    When "school admin" opens creating lesson page
    And "school admin" fills lesson date so that "start date < lesson date < end date"
    And "school admin" fills location and course
    And "school admin" fills class which is the same as the student's class
    Then "school admin" sees added student to the lesson's student info

  Scenario Outline: School admin auto allocate student to the <status> one time lesson that has been created before that
    Given "school admin" has created course and imported class for the course
    And "school admin" has created a "<status>" one time "group" lesson in the "future"
    And school admin has created a "student S1" with student information
    And "school admin" has added course and class to the student which is the same as the lesson's class
    And "school admin" has filled start date and end date so that "start date < lesson date < end date"
    When "school admin" goes to lesson management page
    And "school admin" goes to detailed lesson info page
    Then "school admin" sees added student to the "<status>" lesson's student info
    Examples:
      | status    |
      | Draft     |
      | Published |

  Scenario Outline: School admin auto allocate student to the <status> weekly recurring lesson that has been created before that
    Given "school admin" has created course and imported class for the course
    And "school admin" has created a "<status>" "Weekly Recurring" group lesson with filled all information in the "future"
    And school admin has created a "student S1" with student information
    And "school admin" has added course and class to the student which is the same as the lesson's class
    And "school admin" has filled start date and end date so that "end date = lesson date"
    When "school admin" goes to lesson management page
    And "school admin" goes to detailed lesson info page in the chain
    Then "school admin" sees added student to the "<status>" lesson's student info
    Examples:
      | status    |
      | Draft     |
      | Published |
