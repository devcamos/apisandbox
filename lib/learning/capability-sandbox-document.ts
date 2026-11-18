// Only this fixed document enters srcdoc. Learner code is sent to its worker via postMessage.
export const capabilitySandboxDocument = String.raw`<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; worker-src blob:; connect-src 'none'; base-uri 'none'; form-action 'none'">
<title>Capability sandbox</title>
<script>
"use strict";
window.addEventListener("message", ({ source, origin, data }) => {
  if (source !== parent || typeof data?.code !== "string" || !Array.isArray(data.inputs)) return;

  // The browser must assign this frame an opaque origin before any code runs.
  if (self.origin !== "null") return;

  const url = URL.createObjectURL(new Blob([
    'onmessage = ({ data }) => {\ntry {\n',
    data.code,
    '\nconst output = JSON.stringify(data.map(input => solve(input)));\n',
    'postMessage(output.length <= 8000 ? { output } : { error: "Output exceeded 8,000 characters." });\n',
    '} catch (error) { postMessage({ error: String(error).slice(0, 500) }); }\n};',
  ], { type: "text/javascript" }));
  const worker = new Worker(url);
  URL.revokeObjectURL(url);
  let timeout;

  function finish(result) {
    clearTimeout(timeout);
    worker.terminate();
    parent.postMessage({ capabilitySandbox: true, ...result }, origin);
  }

  timeout = setTimeout(() => finish({ error: "Execution timed out." }), 1500);
  worker.onmessage = ({ data: result }) => {
    if (typeof result?.output === "string" && result.output.length <= 8000) finish({ output: result.output });
    else finish({ error: String(result?.error || "Invalid output.").slice(0, 500) });
  };
  worker.onerror = event => finish({ error: (event.message || "The program could not start.").slice(0, 500) });
  worker.postMessage(data.inputs);
}, { once: true });
</script>
</html>`
