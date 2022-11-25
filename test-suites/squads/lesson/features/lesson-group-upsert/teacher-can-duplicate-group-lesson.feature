@cms @cms2 @learner
@lesson
@lesson-group-upsert

Feature: Teacher can duplicate group lesson
  Background:
    Given "school admin" logins CMS
    And "teacher" logins CMS
    And "teacher" has gone to lesson management page
    And "student" with course and class and enrolled status has logged Learner App

  Scenario Outline: Teacher can duplicate "<savingMethod>" group Lesson
    Given "teacher" has created a "<savingMethod>" group lesson with filled all information
    And "teacher" has applied "all child locations of parent" location
    And "teacher" has gone to detailed lesson info page
    When "teacher" clicks duplicate group lesson button
    Then "teacher" is redirected to new create lesson info page in the current tab
    And "teacher" sees all information is copied from the previous group lesson
    And "teacher" sees Recurring Settings is "One Time"
    And "teacher" sees attendance info "Status", "Notice", "Reason", "Note" of students is blank
    And "teacher" "can not see" the end date field
    Examples:
      | savingMethod     |
      | One Time         |
      | Weekly Recurring |

  Scenario: Teacher can create one time group lesson after duplicating weekly recurring group lesson
    Given "teacher" has created a "Weekly Recurring" group lesson with filled all information in the "future"
    And "teacher" has applied "all child locations of parent" location
    And "teacher" has gone to detailed lesson info page of the "future" lesson in the first of the recurring chain
    And "teacher" has clicked duplicate group lesson button
    And "teacher" has selected "One Time" Recurring Settings
    When "teacher" published the duplicated group lesson
    Then "teacher" is redirected to "future" lessons list page
    And "teacher" sees newly duplicated lesson in the "future" on the list on CMS
    And "teacher" sees created weekly recurring lesson and duplicated lesson on the "future" lessons list on CMS

  Scenario: Teacher can create weekly recurring group lesson after duplicating one time group lesson
    Given "teacher" has created a "One Time" group lesson with filled all information in the "past"
    And "teacher" has applied "all child locations of parent" location
    And "teacher" has gone to detailed lesson info page
    And "teacher" has clicked duplicate group lesson button
    And "teacher" has selected "Weekly Recurring" Recurring Settings
    And "teacher" has filled end date is lesson date of next month
    When "teacher" published the duplicated group lesson
    Then "teacher" is redirected to "past" lessons list page
    And "teacher" sees created weekly recurring lesson within the repeat duration on the "past" lessons list on CMS
    And "teacher" sees created weekly recurring lesson within the repeat duration on the "future" lessons list on CMS
    And "teacher" "can see" selected the lesson to duplicating in the "past"