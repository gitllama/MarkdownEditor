//import crypto from 'crypto'; //ハッシュ化

//import wavedrom from 'wavedrom';
import mermaid from 'mermaid';
import fs from 'fs';
import marked from 'marked';
import hljs from 'highlight.js';
import wfmap from 'wfmap';
//import Plotly from 'plotly.js';
import * as jsdiff from 'diff';
import * as igxl from './igxl.js';
import deepAssign from 'deep-assign';
import Asciidoctor from 'asciidoctor.js';

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
  ['mermaid'] : (code, lang, data)=>{
    let dst;
    mermaid.mermaidAPI.render(
      `mermaid-${Date.now()}`,
      code,
      (svgCode)=>( dst = svgCode )
    )
    return dst;
  },
  ['wfmap'] : (code, lang, data)=>{
    let obj = JSON.parse(code);
    let dst = "";//'<div class="orderwfmap">';
    let wfArry = Array.isArray(obj["data"]) ? obj["data"] : [obj["data"]]
    wfArry.forEach((wf)=>{
      let sglwf = deepAssign({}, obj)
      if(wf["mode"] == "memory" && data != null){
        sglwf["data"] = wf;
        sglwf["data"]["chip"] = igxl.convert(data, wf["lot"], wf["wf"], wf["value"]);
      }else{
        sglwf["data"] = wf
      }
      let node = document.createElement("div")
      //dst = dst + `<div class="singlewfmap">${wfmap.render(sglwf, node).innerHTML}</div>`
      dst = dst + `${wfmap.render(sglwf, node).innerHTML}`
    });
    return dst + '</div>';
  },
  ['plotly'] : (code, lang, data)=>{
    // let node = document.createElement("div");
    // Plotly.newPlot(node, JSON.parse(code));
    // return '\n</code></pre>'
    // + node.outerHTML
    // + '<pre><code class="language-plotly">'
  }
};

function initMermaid(obj){
  mermaid.mermaidAPI.initialize(checkObject(obj, ["mermaid"]));
}


function initRender(){
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
  return renderer;
}

function markedEx(code, config, data){

  let header = {};
  let highlight =(code, lang)=>{
    try {
      if (lang.toLowerCase() in highlightlanguage) {
        return highlightlanguage[lang](code, lang.toLowerCase(), data);
      }else if(lang.toLowerCase() == 'header'){
        header = JSON.parse(code) || {}
        return "";
      }else{
        return hljs.getLanguage(lang) ? hljs.highlight(lang, code, true).value : code;
      }
    } catch(error) {
      console.log(error)
    }
  };

  marked.setOptions({ langPrefix : ''});
  let mark = marked(code, Object.assign(
    {
      renderer: initRender(),
      highlight: highlight,
      langPrefix: 'language-'
    },
    checkObject(config, ["marked"])
  ));

  mark = mark
      .replace(/<pre><code class="language-header">\n<\/code><\/pre>/g, "" )
      .replace(/<pre><code class="language-plotly">([\s\S]*?)<\/code><\/pre>/g, '$1' )
      .replace(/<pre><code class="language-wfmap">([\s\S]*?)<\/code><\/pre>/g, `<div>$1</div>` );

  return { "value" : mark, "header" : header }
}

function asciidoctorEx(code, config, data){
  let asciidoctor = Asciidoctor();

  asciidoctor.Extensions.register(function (){
    this.block(function (){
      const self = this;
      self.named('shout'); //[named]
      self.onContext('paragraph');//div class name
      self.process(function (parent, reader){
        const lines = reader.getLines().map((l)=>{
          return l.toUpperCase();
        });
        return self.createBlock(parent, 'paragraph', lines);
      });
    });
  });

  asciidoctor.Extensions.register(function (){
    this.block(function (){
      const self = this;
      self.named('mermaid');
      self.onContext('literal');
      self.process(function (parent, reader){
        let mermaidcode = reader.getString()
        let dst;
        mermaid.mermaidAPI.render(
          `mermaid-${Date.now()}`,
          mermaidcode,
          (svgCode)=>( dst = svgCode )
        )
        return self.createBlock(parent, 'pass', dst);
      });
    });
  });

  // asciidoctor.Extensions.register(function (){
  //   this.block(function (){
  //     const self = this;
  //     self.named('mermaid');
  //     self.onContext('literal');
  //     self.process(function (parent, reader){
  //       let mermaidcode = reader.getString()
  //       return self.createBlock(parent, 'pass', highlightlanguage["wfmap"]());
  //     });
  //   });
  // });

  let mark = asciidoctor.convert(code);
  let header = {
    "title" : null,
    "no" : null,
    "caution" : null
  }

  return { "value" : mark, "header" : header }
}



export function markdownCreate(code, config, data, type){

  initMermaid(config);
  let mark;
  if(type == "adoc"){
    return asciidoctorEx(code, config, data);
  }else{
    return markedEx(code, config, data);
  }
}
// http://asciidoctor.github.io/asciidoctor.js/master/
// https://github.com/asciidoctor/asciidoctor-browser-extension/blob/f4961737a468ff1d485c5a8db7db29872700ad1e/app/js/vendor/asciidoctor-chart-block-macro.js




// var asciidoctor = Asciidoctor()
// asciidoctor.Extensions.register(function () {
//   this.treeProcessor(function () {
//     var self = this
//     self.process(function (doc) {
//       var blocks = doc.getBlocks()
//       for(var i=0;i<blocks.length;i++){
//         blocks[i].id('id', 'p'+i)
//       }
//       return doc
//     })
//   })
// })
