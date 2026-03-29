name: Workflow Reference

on:
  # This is just a utility/documentation file - it's not meant to run
  # Reference the actual workflows from .github/workflows/ directory
  workflow_dispatch:

jobs:
  documentation:
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "# GitHub Actions Workflows Reference" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "This document outlines all automated workflows in this repository." >> $GITHUB_STEP_SUMMARY
          echo "For detailed setup instructions, see COMPLETE_CI_CD_GUIDE.md" >> $GITHUB_STEP_SUMMARY
