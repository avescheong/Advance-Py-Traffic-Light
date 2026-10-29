/**
 * Argon - Python Tokenizer & AST Parser
 * Parses kid-friendly Python subset:
 * if, elif, else, =, ==, !=, <, >, <=, >=, and, or, not, True, False, commands
 */
window.Argon = window.Argon || {};

class PyErr extends Error {}
    const createPyError = (lineNum, message) => new PyErr("Line " + lineNum + ": " + message);

    function compileConditionExpression(exprText, allowedVarNames, lineNum) {
      if (!exprText) {
        throw createPyError(lineNum, 'Add a question after if, like light == "red"');
      }
      const tokenRegex = /\s+|"[^"\\]*"|'[^'\\]*'|\d+(?:\.\d+)?|[A-Za-z_]\w*|==|!=|>=|<=|>|<|\(|\)/y;
      let jsExpr = "";
      let pos = 0;
      let match;

      while (pos < exprText.length) {
        tokenRegex.lastIndex = pos;
        match = tokenRegex.exec(exprText);
        if (!match) {
          const badChar = exprText[pos];
          const hintMsg = badChar === "="
            ? "Use two equals == to compare. One = is for saving a value."
            : badChar === "!"
            ? "Use != for “is not equal”, or the word not."
            : "I don’t understand “" + badChar + "” here.";
          throw createPyError(lineNum, hintMsg);
        }
        const token = match[0];
        pos = tokenRegex.lastIndex;

        if (/^\s+$/.test(token)) { jsExpr += " "; continue; }
        if (token === "and") jsExpr += "&&";
        else if (token === "or") jsExpr += "||";
        else if (token === "not") jsExpr += "!";
        else if (token === "True") jsExpr += "true";
        else if (token === "False") jsExpr += "false";
        else if (token === "==") jsExpr += "===";
        else if (token === "!=") jsExpr += "!==";
        else if (/^[A-Za-z_]/.test(token)) {
          if (!allowedVarNames.includes(token)) {
            throw createPyError(
              lineNum,
              'I don’t know the word “' + token + '”. Text words need quotes, like "red". Sensor names I know: ' + allowedVarNames.join(", ")
            );
          }
          jsExpr += "e." + token;
        } else {
          jsExpr += token;
        }
      }

      try {
        return new Function("e", "return (" + jsExpr + ")");
      } catch (err) {
        throw createPyError(lineNum, "This question doesn’t look right. Check your quotes and brackets.");
      }
    }

    function parsePythonProgram(sourceCode, initialVarNames) {
      const lines = [];
      sourceCode
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/\t/g, "    ")
        .split("\n")
        .forEach((rawLine, idx) => {
          const trimmed = rawLine.trim();
          if (trimmed && trimmed[0] !== "#") {
            lines.push({
              n: idx + 1,
              ind: rawLine.length - rawLine.trimStart().length,
              s: trimmed
            });
          }
        });

      const knownVars = initialVarNames.slice();
      let cursor = 0;

      function parseIndentedSubBlock(parentHeader) {
        if (cursor >= lines.length || lines[cursor].ind <= parentHeader.ind) {
          throw createPyError(parentHeader.n, "After the colon : the next line must be indented. Press Tab.");
        }
        return parseBlockAtIndent(lines[cursor].ind);
      }

      function parseBranchHeader(lineObj, keyword) {
        if (!lineObj.s.endsWith(":")) {
          throw createPyError(lineObj.n, "Don’t forget the colon : at the end of the line.");
        }
        const conditionStr = lineObj.s.slice(keyword.length, -1).trim();
        return compileConditionExpression(conditionStr, knownVars, lineObj.n);
      }

      function parseIfStatement(ifLineObj) {
        const branches = [{
          c: parseBranchHeader(ifLineObj, "if"),
          b: parseIndentedSubBlock(ifLineObj),
          n: ifLineObj.n,
          s: ifLineObj.s
        }];
        let elseBlock = null;
        let elseLineNum = 0;

        while (cursor < lines.length && lines[cursor].ind === ifLineObj.ind) {
          const nextLine = lines[cursor];
          if (/^elif\b/.test(nextLine.s)) {
            cursor++;
            branches.push({
              c: parseBranchHeader(nextLine, "elif"),
              b: parseIndentedSubBlock(nextLine),
              n: nextLine.n,
              s: nextLine.s
            });
          } else if (/^else\b/.test(nextLine.s)) {
            cursor++;
            if (!/^else\s*:$/.test(nextLine.s)) {
              throw createPyError(nextLine.n, "else stands alone with a colon, like this: else:");
            }
            elseBlock = parseIndentedSubBlock(nextLine);
            elseLineNum = nextLine.n;
            break;
          } else {
            break;
          }
        }
        return { t: "if", br: branches, els: elseBlock, elsN: elseLineNum };
      }

      function parseSimpleStatement(lineObj) {
      let match;
      if (Argon.isActionCommand ? Argon.isActionCommand(lineObj.s) : /^(stop|slow|go|crawl)$/.test(lineObj.s)) {
        throw createPyError(lineObj.n, "Add round brackets to run the command: " + lineObj.s + "()");
      }
      if ((match = lineObj.s.match(/^([a-z_]+)\(\s*\)$/))) {
        const validCommands = Argon.getActions ? Argon.getActions() : ["stop", "slow", "go", "crawl"];
        if (!validCommands.includes(match[1])) {
          throw createPyError(lineObj.n, `I don't know the command '${match[1]}()'. Available commands: ${validCommands.map(c => c + "()").join(", ")}`);
        }
        return { t: "call", n: lineObj.n, f: match[1] };
      }
      if ((match = lineObj.s.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/))) {
        const key = match[1];
        const valFn = compileConditionExpression(match[2], knownVars, lineObj.n);
        if (!knownVars.includes(key)) knownVars.push(key);
        return { t: "set", n: lineObj.n, k: key, v: valFn };
      }
      throw createPyError(lineObj.n, "I don't understand this line. Check your spelling!");
    }

    function parseBlockAtIndent(expectedIndent) {
        const statements = [];
        while (cursor < lines.length) {
          const lineObj = lines[cursor];
          if (lineObj.ind < expectedIndent) break;
          if (lineObj.ind > expectedIndent) {
            throw createPyError(lineObj.n, "This line is indented too far.");
          }
          cursor++;
          if (/^if\b/.test(lineObj.s)) {
            statements.push(parseIfStatement(lineObj));
          } else if (/^(elif|else)\b/.test(lineObj.s)) {
            throw createPyError(lineObj.n, "“" + lineObj.s.split(/\W/)[0] + "” needs an if above it, lined up in the same column.");
          } else {
            statements.push(parseSimpleStatement(lineObj));
          }
        }
        return statements;
      }

      if (!lines.length) throw new PyErr("Type some Python code first!");
      const ast = parseBlockAtIndent(lines[0].ind);
      if (cursor < lines.length) {
        throw createPyError(lines[cursor].n, "This line is not lined up with the code above.");
      }
      return ast;
    }

Argon.PyErr = PyErr;
Argon.createPyError = createPyError;
Argon.compileConditionExpression = compileConditionExpression;
Argon.parsePythonProgram = parsePythonProgram;
