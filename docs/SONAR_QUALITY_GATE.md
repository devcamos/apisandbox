# SonarCloud quality gate (pragmatic defaults)

This repo mixes **product code** (APIs, auth, billing) with **long-form learning UI** (phases, demos). A strict “Sonar way” gate on **new code** often conflicts with intentional repetition in curriculum pages. Use SonarCloud to align the gate with that split.

## Recommended approach

1. **Keep strict rules on real product surface**  
   Do not over-exclude `app/api/**`, `lib/services/**`, `middleware.ts`, or Stripe/auth paths. Fix hotspots and bugs there first.

2. **Tune the Quality Gate (not the scanner)**  
   In [SonarCloud](https://sonarcloud.io) → **your project** → **Project Settings** → **Quality Gate**:
   - Create or pick a gate (e.g. duplicate **Sonar way** and name it `API Sandbox – default`).
   - **Security rating on new code**: if the project is in stabilization, set the required rating to **B** instead of **A** (then tighten back to A as issues are cleared).
   - **Reliability rating on new code**: same pattern (**B** while clearing debt, **A** when green).
   - **Duplication on new code**: for content-heavy apps, **3%** is often unrealistic; **10–15%** is a common pragmatic ceiling while you extract shared layout/components. Lower it over time.

   Official reference: [Quality Gates](https://docs.sonarsource.com/sonarcloud/improving/quality-gates/) and [Managing quality gates](https://docs.sonarsource.com/sonarcloud/administering-sonarcloud/managing-quality-gates/).

3. **Copy-paste (CPD) exclusions in-repo**  
   `sonar-project.properties` sets `sonar.cpd.exclusions` for curriculum trees only. That reduces noise on **duplication %** without disabling analysis of those files for other rules.

4. **CI vs decoration**  
   GitHub Actions uploads analysis + coverage; the **pass/fail** of the SonarCloud check follows the **Quality Gate** you attach to the project. Branch protection should require the gate you actually intend to enforce.

## Mapping “A → B”

| Condition (example) | Stricter (release) | Pragmatic (while fixing) |
|---------------------|--------------------|---------------------------|
| Security rating (new code) | A | B |
| Reliability rating (new code) | A | B |
| Duplicated lines (new code) | ≤ 3% | ≤ 10–15% |

Revert to stricter rows once metrics stay green for several analyses.
