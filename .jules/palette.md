## 2026-04-12 - Prevent large lockfiles in PRs
**Learning:** Running `pnpm test` and `pnpm lint` in the repository can generate a large `pnpm-lock.yaml` file if it was previously missing or ignored.
**Action:** Always check `git status` before committing to ensure unintended lockfiles are discarded (`git reset HEAD <file>` and `rm <file>`) to keep the PR focused and under the 50 lines limit.
