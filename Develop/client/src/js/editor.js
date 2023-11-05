// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from './database';
import { header } from './header';


const debounce = (fn, delay) => {
  let timeoutID = null;
  return function () {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
};
export default class {
  constructor() {
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector("#main"), {
      value: "",
      mode: "javascript",
      theme: "monokai",
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // When the editor is ready, set the value to whatever is stored in indexeddb.
    // Fall back to localStorage if nothing is stored in indexeddb, and if neither is available, set the value to header.
    getDb().then((data) => {
      console.info('Loaded data from IndexedDB, injecting into editor');
      this.editor.setValue(data?.value || header);
    }).catch((err) => {
      console.error('Failed to load data from IndexedDB:', err);

      const localData = localStorage.getItem('content');
      this.editor.setValue(localData || header);
    });
    this.editor.on('change', debounce(() => {
      const content = this.editor.getValue();
      localStorage.setItem('content', content);
      putDb(content).catch((err) => {
        console.error('Failed to save data to IndexedDB:', err);
      });
    }, 500));
    // Save the content of the editor when the editor itself is loses focus
    this.editor.on("blur", () => {
      console.log("The editor has lost focus");
      putDb(localStorage.getItem("content"));
    });
  }
}