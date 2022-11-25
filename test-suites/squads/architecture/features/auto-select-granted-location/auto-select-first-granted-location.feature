@cms
@architecture
@architecture-location

Feature: Auto select first granted location
  Background:
    Given "school admin" logins CMS

  Scenario: School admin can see default location is first granted location
    Then "school admin" sees first granted location name under user name
    And "school admin" sees student list which matches first granted location

  Scenario: School admin can see first granted location checkbox is checked
    When "school admin" opens location settings in nav bar on CMS
    Then "school admin" sees first granted location is checked

  Scenario: School admin can't save empty location on location setting
    When "school admin" opens location settings in nav bar on CMS
    And "school admin" deselects first granted location
    And "school admin" save location setting dialog
    Then "school admin" sees error snackbar
    And "school admin" still sees location setting dialog