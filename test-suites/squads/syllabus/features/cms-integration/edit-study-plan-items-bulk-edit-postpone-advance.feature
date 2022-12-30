@cms
@cms-syllabus-integration
@syllabus
@book @studyplan

Feature: [Integration] School admin update multiple study plan items with postpone advance tabs

  Background:
    Given "school admin" logins CMS
    And school admin has created a new course without any location
    And school admin has created a "content without quiz" book
    And school admin has created a matched study plan with active and archived items

  Scenario Outline: School admin bulk edits study plan items with <tab> action in <type> study plan
    Given school admin is at the "<type>" study plan details page
    When school admin edits the study plan content
    And school admin selects "one" topics in "<type>" study plan
    # Add some values first
    And school admin selects "<action>" in bulk edit menu
    And school admin updates study plan items with "<date>" and "<time>" which are available for studying
    # Then revise date with postpone/advance
    And school admin updates study plan items with "<tab>" action
    Then school admin sees study plan items in "<type>" study plan are changed with "<tab>" days

    Examples:
      | type                      | action                                      | date       | time       | tab      |
      | 1 of [master, individual] | 1 of [Edit Available From, Edit Start Date] | start date | start time | advance  |
      | 1 of [master, individual] | 1 of [Edit Available Until, Edit Due Date]  | end date   | end time   | postpone |
