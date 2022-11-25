@cms @cms2
@architecture
@architecture-location

Feature: Show and disable unauthorized location
  Background:
    Given "school admin" logins CMS
    And "teacher" logins CMS

  Scenario Outline: Teacher sees unauthorized locations in location dialog and unable to select
    Given school admin has created user group with location "<location>" with role "Teacher"
    And school admin has updated the teacher user group
    When "teacher" opens location settings in nav bar on CMS
    Then "teacher" sees "<number>" unauthorized location in location dialog and unable to select on CMS
    Examples:
      | location | number |
      | brand    | 1      |
      | center   | 2      |