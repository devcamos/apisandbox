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

## Local analysis (before push)

Use the same **`sonar-project.properties`** as CI so results match.

1. **Token**  
   [SonarCloud](https://sonarcloud.io) → **My Account** → **Security** → generate a token. Export it or add `SONAR_TOKEN=...` to **`.env.local`** (gitignored).

2. **Coverage**  
   The scanner expects **`coverage/lcov.info`**. One-shot:

   ```bash
   npm run sonar:local:full
   ```

   Or: `npm run test:unit -- --coverage` then `npm run sonar:local`.

3. **Docker**  
   `npm run sonar:local` runs **`sonarsource/sonar-scanner-cli`** in Docker (same stack as most CI setups). Override the image with **`SONAR_SCANNER_IMAGE`** if your org pins a tag.

4. **Optional overrides**  
   Copy **`sonar-project.local.properties.example`** → **`sonar-project.local.properties`** (gitignored). Each `key=value` line becomes a scanner `-D` flag—for example `sonar.qualitygate.wait=false` for a faster upload-only run.

5. **Branch / target**  
   The script sets **`sonar.branch.name`** from the current Git branch and **`sonar.branch.target`** to **`main`** (override with **`SONAR_BRANCH_NAME`** / **`SONAR_BRANCH_TARGET`** if your default branch differs).

## IDE: catch issues before the Quality Gate

Install **SonarQube for IDE** (Sonar’s official extension; often still listed as *SonarLint* in marketplaces). In **Connected mode**, the IDE uses the same SonarCloud **quality profile** and rules as the server, so many bugs, hotspots, and smells show up **while you edit**, instead of only after push.

1. Install the extension for your editor ([VS Code](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode), [JetBrains](https://plugins.jetbrains.com/plugin/7973-sonarlint), [Visual Studio](https://marketplace.visualstudio.com/items?itemName=SonarSource.SonarLintforVisualStudio2022), [Eclipse](https://marketplace.eclipse.org/content/sonarlint-eclipse)).
2. Open **Connected mode** / **SonarQube Cloud** setup in the extension UI.
3. Add a connection with a **user token** from SonarCloud → **My Account** → **Security** (same kind of token as for local scan; not a CI-only project token unless your org allows it).
4. Bind this repo’s folder to SonarCloud project **`devcamos_apisandbox`**, organization **`devcamos`** (see root **`sonar-project.properties`**).

Docs: [Connected mode (VS Code)](https://docs.sonarsource.com/sonarqube-for-ide/vs-code/team-features/connected-mode-setup), [IntelliJ](https://docs.sonarsource.com/sonarqube-for-ide/intellij/team-features/connected-mode), [Visual Studio](https://docs.sonarsource.com/sonarqube-for-ide/visual-studio/team-features/connected-mode).

**Together:** IDE for fast feedback on rules and issues → **`npm run sonar:local:full`** to verify coverage + full analysis → **CI** for the authoritative Quality Gate.

## Mapping “A → B”

| Condition (example) | Stricter (release) | Pragmatic (while fixing) |
|---------------------|--------------------|---------------------------|
| Security rating (new code) | A | B |
| Reliability rating (new code) | A | B |
| Duplicated lines (new code) | ≤ 3% | ≤ 10–15% |

Revert to stricter rows once metrics stay green for several analyses.
