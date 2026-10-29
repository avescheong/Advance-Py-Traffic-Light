/**
 * Argon - Python AST Interpreter & Step Tracer
 * Executes parsed AST nodes, tracks variables, conditions, and car action calls.
 */
window.Argon = window.Argon || {};

function traceProgramExecution(astNodes, env, traceEvents) {
      for (const node of astNodes) {
        if (node.t === "call") {
          traceEvents.push({ k: "call", n: node.n, f: node.f });
        } else if (node.t === "set") {
          env[node.k] = node.v(env);
          traceEvents.push({ k: "set", n: node.n, key: node.k, val: env[node.k], env: Object.assign({}, env) });
        } else {
          let branchTaken = false;
          for (const branch of node.br) {
            const result = !!branch.c(env);
            traceEvents.push({ k: "cond", n: branch.n, s: branch.s, r: result, env: Object.assign({}, env) });
            if (result) {
              traceProgramExecution(branch.b, env, traceEvents);
              branchTaken = true;
              break;
            }
          }
          if (!branchTaken && node.els) {
            traceEvents.push({ k: "else", n: node.elsN });
            traceProgramExecution(node.els, env, traceEvents);
          }
        }
      }
    }

Argon.traceProgramExecution = traceProgramExecution;
