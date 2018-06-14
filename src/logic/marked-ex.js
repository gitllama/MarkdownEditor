//import crypto from 'crypto'; //ハッシュ化

//import wavedrom from 'wavedrom';
import mermaid from 'mermaid';
import fs from 'fs';
import marked from 'marked';
import hljs from 'highlight.js';
import wfmap from 'wfmap';
import Plotly from 'plotly.js';
import * as jsdiff from 'diff';

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
  ['mermaid'] : (code, lang)=>{
    let dst;
    mermaid.mermaidAPI.render(
      `mermaid-${Date.now()}`,
      code,
      (svgCode)=>( dst = svgCode )
    )
    return dst;
  },
  ['wfmap'] : (code, lang)=>{
    let node = document.createElement("div")
    return wfmap.render(code, node).innerHTML
  },
  ['plotly'] : (code, lang)=>{
    let node = document.createElement("div");
    Plotly.newPlot(node, JSON.parse(code));
    return '\n</code></pre>'
            + node.outerHTML
            + '<pre><code class="language-plotly">'
  },
  ['orderwfmap'] : (code, lang)=>{
    let obj = JSON.parse(code);

    let dst = ""
    + '<div class="orderwfmap">'
    + '<div class="singlewfmap">'
    + wfmap.render({"mode" : obj["mode"],"data": obj["data"][0]}, document.createElement("div")).innerHTML
    + '</div><div class="singlewfmap">'
    + wfmap.render({"mode" : obj["mode"],"data": obj["data"][1]}, document.createElement("div")).innerHTML
    + '</div><div class="singlewfmap">'
    + wfmap.render({"mode" : obj["mode"],"data": obj["data"][2]}, document.createElement("div")).innerHTML
    + "</div></div>"

    return dst;
  },
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
      if (lang.toLowerCase() in highlightlanguage) {
        return highlightlanguage[lang](code, lang.toLowerCase());
      }else if(lang.toLowerCase() == 'header'){
        header = JSON.parse(code) || {}
        return "";
      }else{
        return hljs.getLanguage(lang) ? hljs.highlight(lang, code, true).value : code;
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
      .replace(/<pre><code class="language-plotly">([\s\S]*?)<\/code><\/pre>/g, '$1' )
      .replace(/<pre><code class="language-orderwfmap">([\s\S]*?)<\/code><\/pre>/g, '$1' );

  // console.log(mark)

  return { "value" : mark, "header" : header };
}
