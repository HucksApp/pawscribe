import jsLogo from '../images/icons/js.svg';
import jsxLogo from '../images/icons/jsx.svg';
import tsLogo from '../images/icons/ts.svg';
import htmlLogo from '../images/icons/html.svg';
import cssLogo from '../images/icons/css.svg';
import pyLogo from '../images/icons/py.svg';
import cLogo from '../images/icons/c.svg';
import cppLogo from '../images/icons/cpp.svg';
import javaLogo from '../images/icons/java.svg';
import rubyLogo from '../images/icons/ruby.svg';

const codeIcon = type => {
  switch (type) {
    case 'js':
      return jsLogo;
    case 'ts':
      return tsLogo;
    case 'jsx':
      return jsxLogo;
    case 'html':
      return htmlLogo;
    case 'py':
      return pyLogo;
    case 'c':
      return cLogo;
    case 'cpp':
      return cppLogo;
    case 'css':
      return cssLogo;
    case 'java':
      return javaLogo;
    case 'rb':
      return rubyLogo;
    default:
      return;
  }
};

export const editorLang = type => {
  switch (type) {
    case 'js':
    case 'ts':
    case 'jsx':
      return 'javascript';
    case 'html':
      return 'html';
    case 'py':
      return 'python';
    case 'c':
      return 'c';
    case 'cpp':
      return 'cpp';
    case 'css':
      return 'css';
    case 'java':
      return 'java';
    case 'rb':
      return 'ruby';
    default:
      return;
  }
};

export default codeIcon;
