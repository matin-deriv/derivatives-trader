# Monorepo Cleanup & Trader Extraction

You are a Senior Architectural Engineer (`roo-arch`) reviewing a **React + TypeScript monorepo** containing multiple front-end packages. The goal of this task is to:

## Objectives

1. **Understand** the current monorepo structure and its key architectural patterns, especially around `trader` and `reports`.
2. **Identify redundant, outdated, or unnecessary files/dependencies** across the monorepo with focus on minimizing surface area.
3. **Recommend a clean-up strategy** that isolates what’s truly required for a dedicated **trading-only repository**.
4. **Propose a migration plan** that removes monorepo complexity and turns the `trader` package into a standalone project.

## Pre-Task Requirements

- Read and fully understand the outputs of the previous tasks:
    - `docs/architecture/architecture-prompt.md`
    - `docs/architecture/architecture-analysis.md`
- Use the existing architecture summary and dependency graphs as reference points.
- Once completed, document your findings in full under: `docs/architecture/monorepo-cleanup/analysis.md`

## Packages of Focus

- `trader` – the primary consumer-facing trading interface
- `reports` – supporting analytics and historical data components

## Step-by-Step Instructions

### Phase 1: Structure Mapping & Audit

1. **List all files and directories** under:
    - `packages/trader`
    - `packages/reports`
2. **Group files** based on their role (e.g., components, store, api, helpers, utils, tests).
3. **Cross-reference** file usage across the codebase:
    - Identify files that are:
        - Not imported anywhere (`dead code`)
        - Imported only in deprecated branches (e.g., `App`, not `AppV2`)
        - Test-only or legacy mocks no longer relevant
4. **Highlight duplications** with similar logic in `shared`, `components`, or `utils`.

### Phase 2: Dependency and Coupling Analysis

5. For both `trader` and `reports`:
    - **Build refined dependency graphs** that include:
        - External libraries
        - Inter-package dependencies
        - Shared/global types
    - **Mark high-coupling areas** where the package heavily depends on:
        - Core business logic (`core`)
        - Global stores (`stores`)
        - Legacy components or non-essential tooling
6. List **redundant or bloated dependencies** (e.g., unused libraries, over-engineered abstractions).

### Phase 3: Optimization & Extraction Plan

7. Propose a **lean package subset** required to run `trader` alone:
    - What components, stores, and utils should be retained?
    - Which shared packages need to be split or duplicated to remove coupling?
8. Identify **which packages/files** can be:
    - Deleted immediately
    - Marked for deprecation
    - Split into a `trader-shared` folder (e.g., constants, chart wrappers)
9. Suggest changes to:
    - Package.json dependencies
    - Webpack aliases
    - Store initialization logic

## Output Format

```yaml
monorepo_cleanup:
    package_audit:
        trader:
            unused_files:
                - path/to/dead-file.tsx
                - path/to/legacy/test-helper.ts
            overly_coupled_files:
                - trade-logic.tsx: depends on 8+ shared modules
        reports:
            unused_files: [...]
    redundant_dependencies:
        - lodash (used only in 2 utils)
        - date-fns (duplicated with moment)
    files_to_extract:
        - from: shared/constants
          to: trader/constants
          reason: only trader uses them
    standalone_plan:
        retain:
            - trader
            - components/Button, Input, Modal
            - utils/formatters.ts
        remove:
            - reports
            - core
            - App (legacy)
        replace:
            - shared/i18n → inline or import from `trader/locales`
    refactoring_notes:
        - Extract MobX stores into internal store folder with scoped usage
        - Replace Context wrappers with scoped StoreProvider in `trader`
        - Remove feature flags that control App vs AppV2 switching
```

## Repeated Review

- **IMPORTANT**

    - This is a very complex task.
    - You will first think hard and create/update the output.
    - Then, think hard again, review, and improve what you just produced.
    - You need to repeat this process 3 times.
    - Do **not** just bloat the results. Focus on requirement and guidelines vs our output.

- After **3 rounds**, create a new task and switch to `roo-arch` custom mode.
    - Ask it to "Verify the instructions at {location_of_this_prompt}".
    - Ask it to tell you where it saved the verification file.
    - When verification task is done you need to take over one more time.
    - Read that verification created during the task and find anything that needs to be sorted out and apply the changes.
    - Once verified, review the file and apply corrections as needed. You are then done.
