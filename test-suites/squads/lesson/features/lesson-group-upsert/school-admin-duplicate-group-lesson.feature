@cms
@lesson
@lesson-group-upsert

Feature: School Admin can duplicate group lesson
  Background:
    Given "school admin" logins CMS
    And "school admin" has gone to lesson management page

  Scenario Outline: School admin can duplicate "<savingMethod>" group Lesson
    Given "school admin" has created a "<savingMethod>" group lesson with filled all information
    And "school admin" has applied "all child locations of parent" location
    And "school admin" has gone to detailed lesson info page
    When "school admin" clicks duplicate group lesson button
    Then "school admin" is redirected to new create lesson info page in the current tab
    And "school admin" sees all information is copied from the previous group lesson
    And "school admin" sees Recurring Settings is "One Time"
    And "school admin" sees attendance info "Status", "Notice", "Reason", "Note" of students is blank
    And "school admin" "can not see" the end date field
    Examples:
      | savingMethod     |
      | One Time         |
      | Weekly Recurring |

  Scenario: School Admin can create one time group lesson after duplicating weekly recurring group lesson
    Given "school admin" has created a "Weekly Recurring" group lesson with filled all information in the "future"
    And "school admin" has applied "all child locations of parent" location
    And "school admin" has gone to detailed lesson info page of the "future" lesson in the first of the recurring chain
    And "school admin" has clicked duplicate group lesson button
    And "school admin" has selected "One Time" Recurring Settings
    When "school admin" published the duplicated group lesson
    Then "school admin" is redirected to "future" lessons list page
    And "school admin" sees newly duplicated lesson in the "future" on the list on CMS
    And "school admin" sees created weekly recurring lesson and duplicated lesson on the "future" lessons list on CMS

  Scenario: School Admin can create weekly recurring group lesson after duplicating one time group lesson
    Given "school admin" has created a "One Time" group lesson with filled all information in the "past"
    And "school admin" has applied "all child locations of parent" location
    And "school admin" has gone to detailed lesson info page
    And "school admin" has clicked duplicate group lesson button
    And "school admin" has selected "Weekly Recurring" Recurring Settings
    And "school admin" has filled end date is lesson date of next month
    When "school admin" published the duplicated group lesson
    Then "school admin" is redirected to "past" lessons list page
    And "school admin" sees created weekly recurring lesson within the repeat duration on the "past" lessons list on CMS
    And "school admin" sees created weekly recurring lesson within the repeat duration on the "future" lessons list on CMS
    And "school admin" "can see" selected the lesson to duplicating in the "past"
