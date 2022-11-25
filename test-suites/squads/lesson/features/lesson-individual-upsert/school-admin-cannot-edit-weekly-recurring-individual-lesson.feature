@cms
@lesson
@lesson-individual-upsert

Feature: School Admin cannot edit weekly recurring individual lesson
  Background:
    Given "school admin" logins CMS
    And "school admin" has created a weekly recurring individual lesson with lesson date in the future
    And "school admin" has applied "all child locations of parent" location
    And "school admin" has gone to detailed the newly "future" lesson info page
    And "school admin" has opened editing lesson page

  Scenario Outline: School Admin cannot edit weekly recurring individual lesson with "<action>"
    When "school admin" edits end date with "<action>"
    And "school admin" saves the changes of the lesson
    Then "school admin" sees inline errors message under both Lesson Date and End Date
    And "school admin" is still in editing the lesson page
    Examples:
      | action                 |
      | end date < lesson date |

  Scenario: School Admin cancels edit weekly recurring individual lesson
    When "school admin" edits all fields exclude the end date field
    And "school admin" saves the changes of the lesson
    And "school admin" cancels editing lesson
    Then "school admin" sees confirm popup editing lesson has been closed
    And "school admin" is still in editing the lesson page
    And "school admin" is still sees previous edited info
