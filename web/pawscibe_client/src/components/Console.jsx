import React, { useEffect, useState } from 'react';
import * as p5 from 'p5';
import ConsoleEmulator from 'react-console-emulator';

const Console = ({ code, language, open }) => {
  const [pyodide, setPyodide] = useState(null);

  useEffect(() => {
    const loadPyodideAsync = async () => {
      try {
        if (window.loadPyodide) {
          const pyodide = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
          });
          setPyodide(pyodide);
          console.log('Pyodide loaded', pyodide);
        } else {
          throw new Error('Pyodide script not loaded');
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadPyodideAsync();
  }, []);

  const commands = {
    run: {
      description: 'Run the provided code',
      fn: async () => {
        if (language === 'javascript') {
          try {
            const result = eval(code);
            return result;
          } catch (error) {
            return error.message;
          }
        } else if (language === 'python') {
          if (pyodide) {
            try {
              const result = await pyodide.runPythonAsync(code);
              return result;
            } catch (error) {
              return error.message;
            }
          } else {
            return 'Pyodide is still loading...';
          }
        } else if (language === 'html' || language === 'css') {
          const sketch = p => {
            p.setup = () => {
              p.createCanvas(p.windowWidth, p.windowHeight);
              p.noLoop();
              p.background(255);
              p.fill(0);
              p.text(code, 10, 10);
            };
          };
          new p5(sketch);
        } else if (language === 'c' || language === 'c++') {
          return 'C/C++ execution in the browser is not supported yet.';
        }
      },
    },
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {open && (
        <ConsoleEmulator
          commands={commands}
          promptLabel={'User@Pawscribe:~$'}
        />
      )}
    </div>
  );
};

export default Console;
