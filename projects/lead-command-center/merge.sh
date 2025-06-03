#!/bin/bash
set -e

echo "Syncing and merging branches..."

# Fetch all latest changes
git fetch --all
echo "Fetched latest changes"

# Get the latest develop
git checkout develop
git pull origin develop
echo "Updated develop branch"

# Get the latest feature/workflow-launcher
git checkout feature/workflow-launcher
git pull origin feature/workflow-launcher
echo "Updated feature/workflow-launcher branch"

# Check for conflicts
echo "Checking for conflicts between branches..."
CONFLICTS=$(git merge-tree $(git merge-base develop feature/workflow-launcher) develop feature/workflow-launcher | grep -c "^\+<<<<<<<")
if [ $CONFLICTS -gt 0 ]; then
  echo "There are potential conflicts. Please resolve manually."
  exit 1
fi

# Merge develop into feature branch if needed
echo "Making sure feature branch has latest from develop..."
git merge develop -m "Merge latest develop changes into feature/workflow-launcher"

# Checkout develop and merge the feature branch
git checkout develop
echo "Merging feature/workflow-launcher into develop..."
git merge feature/workflow-launcher -m "Merge feature/workflow-launcher into develop"

echo "Merge completed successfully."
echo "You are now on the develop branch with all changes from feature/workflow-launcher."
echo "Use 'git push origin develop' to push these changes to remote if desired." 