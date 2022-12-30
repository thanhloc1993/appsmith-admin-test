@cms
@lesson
@lesson-group-upsert

Feature: School admin auto allocate student to the lesson has been created before that
  Background:
    Given "school admin" logins CMS

  Scenario: School admin auto allocate student in creating lesson page
    Given "school admin" has created a new "student" with course and class during "within 30 days since now"
    And "school admin" has gone to lesson management page
    And "school admin" has opened creating lesson page
    When "school admin" fills lesson date so that "start date < lesson date < end date"
    And "school admin" fills location and course
    And "school admin" fills class which is the same as the student's class
    Then "school admin" sees added "student" to the lesson's student info

  Scenario Outline: School admin auto allocate student to the <status> one time lesson that has been created before that
    Given "school admin" has created course and imported class for the course
    And "school admin" has created a "<status>" "One Time" group lesson in "future" without student
    And "school admin" has created a new "student" with available course and class during "start date < lesson date < end date"
    When "school admin" goes to detailed lesson info page
    Then "school admin" sees added newly "student" in lesson detail page
    Examples:
      | status    |
      | Draft     |
      | Published |

  Scenario Outline: School admin auto allocate student to the <status> weekly recurring lesson that has been created before that
    Given "school admin" has created course and imported class for the course
    And "school admin" has created a "<status>" "Weekly Recurring" group lesson in "future" without student
    And "school admin" has created a new "student" with available course and class during "end date = lesson date"
    When "school admin" goes to detailed lesson info page
    Then "school admin" sees added newly "student" in lesson detail page
    Examples:
      | status    |
      | Draft     |
      | Published |
