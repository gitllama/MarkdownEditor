//import crypto from 'crypto'; //ハッシュ化

//import wavedrom from 'wavedrom';
import mermaid from 'mermaid';
import fs from 'fs';
import marked from 'marked';
import hljs from 'highlight.js';
import wfmap from 'wfmap';
import Plotly from 'plotly.js';

mermaid.mermaidAPI.initialize({
  startOnLoad: false,
  gantt: {
    axisFormat: '%m-%d'
  }
});

var plotlylayout = {
  autosize: false,
  width: "100mm",
  height: "100mm",
  // margin: {
  //   l: 50,
  //   r: 50,
  //   b: 100,
  //   t: 100,
  //   pad: 4
  // },
  paper_bgcolor: '#7f7f7f',
  plot_bgcolor: '#c7c7c7'
};

function checkObject(obj, arr){
  if(obj == null) return null;
  let dst = null;
  if(arr.length > 1){
    if(obj[arr[0]]){
      let hoge = arr.slice()
      hoge.shift()
      return checkObject(obj[arr[0]],hoge)
    }else{
      return null;
    }
  }
  return obj[arr[0]];
}

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
    let node = document.createElement("div")
    return wfmap.render(code, node).innerHTML
  },
  ['plotly'] : (code)=>{
    let node = document.createElement("div");
    Plotly.newPlot(node, JSON.parse(code));
    return '\n</code></pre>'
            + node.outerHTML
            + '<pre><code class="language-plotly">'
  },
  ['default'] : (code, lang)=>{
    return hljs.getLanguage(lang) ? hljs.highlight(lang, code, true).value : code;
  }
};

export function markdownCreate(code, config){

  let renderer = new marked.Renderer();
  // renderer.heading =(text, level)=> {
  //   var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
  //   return '<h' + level + '><a name="' +
  //                 escapedText +
  //                  '" class="anchor" href="#' +
  //                  escapedText +
  //                  '"><span class="header-link"></span></a>' +
  //                   text + '</h' + level + '>';
  // }

  let header = {};
  let highlight =(code, lang)=>{
    try {
      switch(lang){
        case '':
          return;
        case 'header':
          header = JSON.parse(code) || {}
          return "";
        case 'mermaid':
          return highlightlanguage['mermaid'](code);
        case 'plotly':
          return highlightlanguage['plotly'](code);
        case 'wfmap':
          return highlightlanguage['wfmap'](code);
        default:
          return highlightlanguage['default'](code, lang);
      }
    } catch(error) {
      //dst = code;
    }
  };

  marked.setOptions({ langPrefix : ''});
  let mark = marked(code, Object.assign(
    {
      renderer: renderer,
      highlight: highlight,
      langPrefix: 'language-'
    },
    checkObject(config, ["marked"])
  ));

  mark = mark
          .replace(/<pre><code class="language-header">\n<\/code><\/pre>/g, "" )
          .replace(/<pre><code class="language-plotly">\n<\/code><\/pre>/g, "" );

  // console.log(mark)

  return { "value" : mark, "header" : header };
}
