# SillyBunny Contribution Guide

## Project Etiquette

BEFORE submitting a pull request, keep the following project philosophies and best practices in mind:

#### General philosophies

- SillyBunny is a derivative fork of [SillyTavern](https://github.com/SillyTavern/SillyTavern), not a replacement. Sustainability to upstream is critical: keep SillyBunny's general code compatibility as close to upstream as possible.
- Backwards compatibility with SillyTavern is a key design goal of the project. A user should be able to open SillyBunny, import their pre-existing SillyTavern settings, and feel right at home with SillyTavern's featureset.
- Follow KISS (keep it simple, stupid). A solution to a problem should not have any excess overreach. Always prefer a simple, modular approach to a problem or feature, using smaller PRs to address each individual problem.
- Changes to upstream should be self-contained in their own files where possible. With the exception of UI modifications, try to minimise actual changes to base SillyTavern code.
- When modifying base SillyTavern files, leave clear inline comments indicating where and why SillyBunny code diverges from upstream. This aids maintainers during future upstream merge conflict resolutions.
- Reuse existing metadata/state formats where possible instead of inventing new persistent structures.
- While Bun is the default runtime, Node.js backwards compatibility is required. Do not use Bun-exclusive APIs (such as Bun.file() or Bun.serve()) unless a standard Node.js fallback is included. Test all structural changes in both runtime environments.
- Keep fork-specific feature additions and upstream synchronization merges in separate pull requests. Mixing upstream code updates with SillyBunny feature logic complicates the review process.

#### Correct target branch

Always create pull requests using the `staging` branch; 99% of contributions should go there. This way, we can ensure stability before a proper release version.

You can still send a pull request for `release` in the following scenarios:

- Updating documentation.
- Updating GitHub Actions.
- Hotfixing a critical bug. (Note: Hotfixes merged into release must also be backported to staging to prevent regression in the next update)

#### PR Structure

Pull requests should use the following prefixes before the title:
- `fix` - a direct bug fix.
- `chore` - a simple maintenance change.
- `feature` - a new feature implementation.
- `sync` - synchronizing with upstream.

Titles themselves should be direct and address the exact changes made.

#### Release and hotfix hygiene

If you're helping ship a SillyBunny release, keep the release copy in sync with the code:

- Normal releases should bump every SillyBunny version reference that is user-facing or otherwise hardcoded, including the package version, the visible UI version strings, and the Horde fallback client string.
- Update the root `README.md` changelog, replacing the existing changelog with the most recent, then sync `.github/readme.md` by running `bash scripts/sync-readme-mirror.sh`. The GitHub README is a mirror, so do not edit it by hand.
- Hotfixes are an exception: skip the version bump, README updates, changelog pass, and Discord post. Just include a short bulleted list of exactly what was hotfixed.

Project maintainers will test and can change your code before merging. To keep our workflow smooth, please ensure the following:

- The "Allow edits from maintainers" option is checked.
- Avoid force-pushing your branch once the PR is out of draft state.

Include a Discord-friendly update summary for non-hotfix releases so the changes can be freely posted without rewriting notes from scratch, using the following formatting template:
```
**SillyBunny version XXX has released**
(quick summary of changes)

**Detailed Changelog**
(technical details but still human readable)

**How to update**
- Built-in updater: open Customize > Server and update from there.
- Git clone: run git pull.
- Launcher users: close and reopen Start.bat, Start.command, or start.sh.
- ZIP users: grab the new release directly.
```
#### Upstream sync

When a new, stable upstream SillyTavern version releases:

- Prioritize synchronizing to `staging` over new features and bug fixes.
- Check for code compatibility with the new version release.
- Resolve merge conflicts carefully, ensuring that upstream changes do not overwrite SillyBunny's custom UI modifications, Bun-specific optimizations, or additional features.
- Verify that any new upstream UI elements (such as new settings, menus, or buttons) integrate correctly into the fork's modified DOM structure.
- Review the upstream changelog to identify any newly added dependencies or modifications to metadata/state formats.
- Test the synchronized code in both Bun and Node.js environments to confirm that runtime parity is maintained.
- Complete the synchronization as a standalone pull request before applying fixes to current bug chores in separate, subsequent updates.

---

## Setting up the dev environment

1. Required software: git and bun.
2. An IDE or editor of your choice. Visual Studio Code is a safe default.
3. You can also use GitHub Codespaces which sets up everything for you.

## Getting the code ready

1. Register a GitHub account.
2. Fork this repository under your account.
3. Clone the fork onto your machine.
4. Open the cloned repository in the code editor.
5. Create a git branch (recommended), review the [git book](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control) if you haven't.
6. Make your changes and test them locally.
7. Commit the changes and push the branch to the remote repo.
8. Go to GitHub, and open a pull request, targeting the appropriate upstream branch.

### License

This program is licensed as free software under the [AGPL 3.0](https://www.gnu.org/licenses/agpl-3.0.html). This implies NO warranty, and due diligence to maintain adherence to the copyleft structure of the license. Any derivatives or modifications of this program must be released under the same license.

---

> [!WARNING]
> ### AI Disclaimer (Vibe Coding)
> LLMs are used liberally in this project to implement changes to the code. You are more than welcome to submit a PR with AI-assistance, as long as it aligns with the contribution guidelines.
