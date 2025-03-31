#!/bin/bash

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
fi

# Add all files
echo "Adding files to git..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Initial commit"

# Add GitHub remote (replace with your repository URL)
echo "Adding GitHub remote..."
git remote add origin https://github.com/YOUR_USERNAME/movifi-repo.git

# Push to main branch
echo "Pushing to GitHub..."
git push -u origin main

echo "Deployment process completed!"
echo "Please go to your GitHub repository settings and enable GitHub Pages:"
echo "1. Go to Settings > Pages"
echo "2. Under 'Source', select 'GitHub Actions'"
echo "3. Your site will be available at: https://YOUR_USERNAME.github.io/movifi-repo/" 