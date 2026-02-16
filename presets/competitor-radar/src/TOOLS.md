# TOOLS.md - Competitor Radar Tools

## GitHub (`gh` CLI)
Track competitor repos, releases, issues, and pull requests.
- Use `gh api` for querying competitor repo activity
- Use `gh release list -R org/repo` for releases
- Use `gh api repos/org/repo/commits` for recent commits
- Use `gh api repos/org/repo/pulls?state=closed` for merged PRs

## Web Browsing
Visit competitor websites, changelogs, and news articles.
- Check competitor homepages for feature updates
- Check `/changelog`, `/blog`, `/releases` pages
- Search news sites for competitor mentions

## Slack (if configured)
Post daily competitive briefs to the team channel.
- Use structured reports with sections
- Tag relevant team members for action items

## Your Project
_Configure after setup:_
# Example:
# - Name: MyProject
# - GitHub: org/my-project
# - Website: https://myproject.com

## Competitor Roster
_Configure after setup:_
# Example:
# - Name: CompetitorA
#   GitHub: org/competitor-a
#   Website: https://competitor-a.com
#   Notes: Direct competitor, strong on integrations
#
# - Name: CompetitorB
#   GitHub: org/competitor-b
#   Website: https://competitor-b.com
#   Notes: New entrant, growing fast

## Focus Areas
_Configure after setup:_
# Example:
# - Pricing changes
# - New integrations
# - Performance benchmarks
# - Developer experience features
