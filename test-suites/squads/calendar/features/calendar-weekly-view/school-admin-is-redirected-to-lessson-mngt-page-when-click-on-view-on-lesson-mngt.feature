@cms
@calendar
@calendar-weekly-view
@ignore

Feature: School admin is redirected to lessonmgmt page when click on "View On Lesson Management" in lesson drawer
  Background:
    Given "school admin" logins CMS
    And "school admin" has gone to Calendar tab

  Scenario: School admin can redirect to lessonmgmt when click on "View On Lesson Management" in one-time individual lesson drawer
    Given "school admin" has created an one time "individual" lesson with lesson date of today and "location L1" by Add button
    And "school admin" has chosen "Center" as location type
    And "school admin" has chosen "location L1" as previous lesson location in location list
    When "school admin" opens lessons drawer
    Then "school admin" sees lesson item is matched with lesson drawer info
    And "school admin" sees "Published" tag in lesson drawer
    And "school admin" clicks on "View On Lesson Management"
    And "school admin" see new tab of lesson detailed page is opened

  Scenario: School admin can redirect to lessonmgmt when click on "View On Lesson Management" in one-time group lesson drawer
    Given "school admin" has created an one time "group" lesson with lesson date of today and "location L1" by Add button
    And "school admin" has chosen "Center" as location type
    And "school admin" has chosen "location L1" as previous lesson location in location list
    When "school admin" opens lessons drawer
    Then "school admin" sees lesson item is matched with lesson drawer info
    And "school admin" sees "Published" tag in lesson drawer
    And "school admin" clicks on "View On Lesson Management"
    And "school admin" see new tab of lesson detailed page is opened

  Scenario: School admin can redirect to lessonmgmt when click on "View On Lesson Management" in recurring individual lesson drawer
    Given "school admin" has created recurring "individual" lesson with lesson date in the future and "location L1" by Add button
    And "school admin" has chosen "Center" as location type
    And "school admin" has chosen "location L1" as previous lesson location in location list
    When "school admin" opens lessons drawer
    Then "school admin" sees all recurring lessons item is matched with lesson drawer info
    And "school admin" sees "Published" tag in lesson drawer
    And "school admin" sees "Repeat Duration" in all recurring lessons drawer
    And "school admin" clicks on "View On Lesson Management"
    And "school admin" see new tab of lesson detailed page is opened

  Scenario: School admin can redirect to lessonmgmt when click on "View On Lesson Management" in recurring group lesson drawer
    Given "school admin" has created recurring "group" lesson with lesson date in the future and "location L1" by Add button
    And "school admin" has chosen "Center" as location type
    And "school admin" has chosen "location L1" as previous lesson location in location list
    When "school admin" opens lessons drawer
    Then "school admin" sees all recurring lessons item is matched with lesson drawer info
    And "school admin" sees "Published" tag in lesson drawer
    And "school admin" sees "Repeat Duration" in all recurring lessons drawer
    And "school admin" clicks on "View On Lesson Management"
    And "school admin" see new tab of lesson detailed page is opened
