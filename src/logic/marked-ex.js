import actions from '../actions';
import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import Immutable from 'immutable';
//import crypto from 'crypto'; //ハッシュ化

//import wavedrom from 'wavedrom';
import mermaid from 'mermaid';
import fs from 'fs';
import marked from 'marked';
import hljs from 'highlight.js';
import wfmap from './wfmap.js';

mermaid.mermaidAPI.initialize({
  startOnLoad: false,
  gantt: {
    axisFormat: '%m-%d'
  }
});

const highlightlanguage = {
  ['mermaid'] : (code)=>{
    let dst;
    mermaid.mermaidAPI.render(
      `mermaid-${Date.now()}`,
      code,
      (svgCode)=>( dst = svgCode )
    )
    return dst;
  },
  ['wfmap'] : (code)=>{
    return wfmap.render(code)
  },
  ['default'] : (code, lang)=>{
    return hljs.getLanguage(lang) ? hljs.highlight(lang, code, true).value : code;
  }
};

export function markdownCreate(code, split, config, callback){

  let renderer = new marked.Renderer();
/*
  renderer.heading =(text, level)=> {
    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return '<h' + level + '><a name="' +
                  escapedText +
                   '" class="anchor" href="#' +
                   escapedText +
                   '"><span class="header-link"></span></a>' +
                    text + '</h' + level + '>';
  }
*/

  let highlight =(code, lang)=>{
    try {
      switch(lang){
        case '':
          return;
        case 'header':
          if(callback) callback(code);
          return "";
        case 'mermaid':
          return highlightlanguage['mermaid'](code);
        case 'wfmap':
          return highlightlanguage['wfmap'](code);
        default:
          return highlightlanguage['default'](code, lang);
      }
    } catch(error) {
      //dst = code;
    }
  };
  marked.setOptions({
    langPrefix: ''
  });
  let mark = marked(code, {
        renderer: renderer,
        highlight: highlight,
        langPrefix: 'language-'
    });

  mark = mark.replace('<pre><code class="language-header">\n</code></pre>', "" ) ;

  if(split)
    return mark.split("<hr>");
  else
    return mark;
}
