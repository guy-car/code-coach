# Stable Code Sandbox Pattern

**Last stable:** 2024-06-14

## CRITICAL: DO NOT MODIFY WITHOUT UNDERSTANDING

This pattern is tested and stable for executing user code in a safe, single-scope environment. It avoids variable scope issues and inconsistent results.

---

## Working Pattern

1. **String replacement:** Replace `// Your code here` in the setup with the user's code.
2. **Single execution:** Use `new Function()` to execute the combined code in a single scope.
3. **Return variable:** Extract the target variable name from the setup and return it.

### Example

- **Setup:** `const arr = [1,2]; // Your code here; console.log(arr);`
- **User:** `arr.push(3)`
- **Combined:** `const arr = [1,2]; arr.push(3); console.log(arr); return arr;`

---

## Failed Approaches (Do NOT use)

- ❌ Multiple `eval()` calls (creates separate scopes)
- ❌ Wrapping in a function (breaks variable access)
- ❌ Executing setup and user code separately (scope isolation)

---

## Why This Works

- All code runs in a single execution context
- Variables are accessible as expected
- No scope isolation or hoisting issues

---

## WARNING

> **Do not change this pattern without understanding why previous attempts failed.**
> If you must change it, document the reason and thoroughly test for scope and variable access issues. 