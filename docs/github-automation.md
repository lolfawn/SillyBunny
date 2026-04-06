# GitHub Automation Setup

SillyBunny uses several GitHub Actions workflows to label issues and pull requests, post canned comments, mark linked issues done, and manage stale items.

## Default behavior

No extra repository setup is required.

If the repository does not define the optional bot credentials below, the workflows fall back to the built-in `github.token` and continue to run with the permissions granted in each workflow file.

This is the recommended setup for forks and for smaller repositories that do not need a dedicated bot identity.

## Optional GitHub App setup

If you want the automation to run as a dedicated GitHub App instead of the default Actions bot, create and install a GitHub App, then add these repository settings:

- Repository variable: `ST_BOT_APP_ID`
- Repository secret: `ST_BOT_PRIVATE_KEY`

`ST_BOT_PRIVATE_KEY` should contain the full PEM private key for the app.

Once both values are present, the workflows automatically mint an app token and use it instead of `github.token`.

## Recommended app permissions

The app should be installed on this repository and granted at least:

- `Contents: Read-only`
- `Issues: Read and write`
- `Pull requests: Read and write`
- `Metadata: Read-only`

If you expand the automation later, review the workflow permissions before broadening the app scope.

## Why keep the app path

The fallback token path is enough for normal repository automation, but a GitHub App is still useful when you want:

- A stable bot identity separate from `github-actions[bot]`
- Easier credential rotation without changing workflow code
- Tighter control over which repositories the automation can access

## Verifying the setup

To verify the fallback path, push a branch or update a pull request and confirm the relevant workflows pass.

To verify the app path, add both settings above and trigger one of the label/comment workflows again. The workflow logs should show the app token step running instead of being skipped.
