/**
 * One-shot codemod: converts native alert()/confirm() call sites to the
 * premium notify() toasts and confirmDialog() modal.
 * - Preserves all surrounding logic; only the notification mechanism changes.
 * - Classification (deterministic):
 *     failed/Invalid/Unable/check the form   -> notify.error
 *     Please fill/enter/provide/select/check -> notify.warning
 *     everything else (added/updated/...)    -> notify.success
 * Run: node scripts/codemod-alerts.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components"];
const files = [];

function walk(dir) {
    for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        const s = statSync(p);
        if (s.isDirectory()) walk(p);
        else if (/\.tsx$/.test(name)) files.push(p);
    }
}
ROOTS.forEach(walk);

const isErr = (m) => /failed|invalid|unable|check the form|not allowed|already exists/i.test(m);
const isWarn = (m) => /please (fill|enter|provide|select|check)|required|missing/i.test(m);

let changed = 0;
for (const file of files) {
    let src = readFileSync(file, "utf8");
    if (!/[\s(]alert\(|[\s(]confirm\(/.test(src)) continue;
    const original = src;

    // ---- confirm() -> await confirmDialog(...) -------------------------
    // if (!confirm("MSG")) return;              (delete guards)
    src = src.replace(
        /if\s*\(!\s*confirm\((["'`][^"'`]*["'`])\)\)\s*return;/g,
        (_m, msg) => `if (!(await confirmDialog({ message: ${msg}, tone: "danger" }))) return;`
    );
    // const confirmDelete = confirm("MSG");
    src = src.replace(
      /const\s+(\w+)\s*=\s*confirm\((["'`][^"'`]*["'`])\);/g,
        (_m, name, msg) => `const ${name} = await confirmDialog({ message: ${msg}, tone: "danger" });`
    );
    // inline JSX: if (confirm("Delete?")) { ... }
    src = src.replace(
        /if\s*\(confirm\((["'`][^"'`]*["'`])\)\)/g,
        (_m, msg) => `if (await confirmDialog({ message: ${msg}, tone: "danger" }))`
    );

    // ---- alert() -> notify.* -------------------------------------------
    const classify = (m) => (isErr(m) ? "error" : isWarn(m) ? "warning" : "success");

    // if (COND) return alert(MSG);   -> if (COND) { notify.x(MSG); return; }
    src = src.replace(
        /if\s*\((.+?)\)\s*return\s+alert\((.+?)\);/g,
        (_m, cond, msg) => {
            const kind = classify(msg);
            return `if (${cond}) { notify.${kind}(${msg}); return; }`;
        }
    );
    // bare: alert(MSG);  (also `return alert` inside arrow already covered)
    src = src.replace(
        /(?<![\w.])alert\(([^\n]+?)\);/g,
        (_m, msg) => {
            const kind = classify(msg);
            return `notify.${kind}(${msg});`;
        }
    );

    if (src === original) continue;

    // ---- ensure imports after the "use client" directive ----------------
    const needsConfirm = /confirmDialog\(/.test(src) && !/import\s*\{[^}]*confirmDialog/.test(src);
    const needsNotify = /\bnotify\./.test(src) && !/import\s*\{[^}]*\bnotify\b[^}]*\}\s*from\s*"@\/components\/ui\/notify"/.test(src);
    let inject = "";
    if (needsNotify) inject += `import { notify } from "@/components/ui/notify";\n`;
    if (needsConfirm) inject += `import { confirmDialog } from "@/components/ui/ConfirmDialog";\n`;
    if (inject) {
        if (/^"use client";\s*$/m.test(src)) {
            src = src.replace(/^"use client";/m, `"use client";\n${inject.trimEnd()}`);
        } else {
            src = inject.trimEnd() + "\n" + src;
        }
    }

    writeFileSync(file, src);
    changed++;
    console.log("updated:", file);
}
console.log(`\n${changed} file(s) updated.`);
