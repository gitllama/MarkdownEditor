const fs = require('fs');

/* ----------------------------------------------------------------------------
igxl datalog reader

data structure
{
  "Lot No + Co Lot" : {
    " Wf No " : [
      "device" : {
        x : null,
        y : null,
        value : null
      }
    ]
  }
}
---------------------------------------------------------------------------- */

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

exports.getBin = function(txt){
  const rLot = /^    Lot: (.*)$/m;
  const rWf = /^    Wf : (.*)$/m;
  const reg = /Device#([0-9]+)\(([0-9]+),([0-9]+)\) Bin=([0-9]+) Sort=([0-9]+) (\w+)/g;
  try {
    let dst = {}
    let lot = (rLot.exec(txt)[1]).trim();
    let wf = (rWf.exec(txt)[1].split("-")).pop().trim();

    let result;
    dst[lot] = {}
    dst[lot][wf] = {}
    while (result = reg.exec(txt)) {
      dst[lot][wf][parseInt(result[1])] = ({
        "x" : result[2],
        "y" : result[3],
        "bin" : result[4],
        "sort" : result[5]
      })
    }
    return dst;
  } catch (err) {
    console.log(err)
    return {}
  }
}

exports.getMeasured = function(txt){
  // const rDev = /^    Device#: (.*)$/m;
  // const rLot = /^    Lot: (.*)$/m;
  // const rWf = /^    Wf : (.*)$/m;
  // const rCoord = /^    Coord : QY([0-9]*)X([0-9]*)$/m;
  //const reg = /^    Device#:([\s\S]*?)^=========================================================================$/mg;
  const reg = new RegExp(
      "^    Device#:([\\s\\d]*?)"
    + "    Date:([\\s\\S]*?)"
    + "    Prog:([\\s\\S]*?)"
    + "    Lot:([\\s\\S]*?)"
    + "    Wf :([\\s\\S]*?)"
    + "    Coord : QY([0-9]*)X([0-9]*)$"
    + "([\\s\\S]*?)"
    + "^ Site    Sort     Bin[\\s]*"
    + "------------------------------------[\\s]*"
    + "([\\s\\d]{6})([\\s\\d]{10})([\\s\\d]{9})$"
  , 'gm');
  //const rResult = /^ ([\s\d]{11})([\s\d]{6})(.{9})(.{26})(.{15})([\s\d]{10})(.{15})(.{15})(.{15})(.{15})/mg;
  const rResult = /^ ([\s\d]{11})([\s\d]{6})(.{9})(.*)(.{15})(.{15})(.{15})(.{15})(.{10})/mg;

  try {
    let matchdevice;
    let matchtest;
    let dst = {}
    //txt.match(reg).forEach((n) => {
    while (matchdevice = reg.exec(txt)) {
      let chipno = parseInt(matchdevice[1]);
      let lot = matchdevice[4].trim();
      let wf = (matchdevice[5].split("-")).pop().trim();
      let x = parseInt(matchdevice[7]);
      let y = parseInt(matchdevice[6]);

      let n = matchdevice[8];

      let sort = matchdevice[10];
      let bin = matchdevice[11];

      // let chipno = parseInt(rDev.exec(n)[1]);
      // let lot =(rLot.exec(n)[1]).trim();
      // let wf = (rWf.exec(n)[1]).trim();
      // let coord = rCoord.exec(n);
      // let x = parseInt(coord[2]);
      // let y = parseInt(coord[1]);
      if(dst[lot] == null) dst[lot] = {}
      if(dst[lot][wf] == null) dst[lot][wf] = {}
      dst[lot][wf][chipno] = {
        "x" : x,
        "y" : y,
        "bin" : bin,
        "sort" : sort
      }

      while (matchtest = rResult.exec(n)) {
        let number = parseInt(matchtest[1]);
        let site = matchtest[2];
        let result = matchtest[3].trim();

        let testName = matchtest[4].split(/\s+/);
        // let pin = arry[2].trim();
        // let channel = arry[6].trim();
        let low = matchtest[5].trim();
        let measured = matchtest[6].trim();
        let high = matchtest[7].trim();
        let force = matchtest[8].trim();
        let loc = matchtest[9].trim();

        dst[lot][wf][chipno][`${testName[0].trim()} ${testName[1].trim()}`] = {
          "result" : result,
          "measured" : measured,
          "value" : unitParseFloat(measured)
        }
      }
    };
    return dst;
  } catch (err) {
    console.log(err)
    return {};
  }
}

function unitParseFloat(val){
  const Units = {
    "p" : "E-12",
    "n" : "E-9",
    "u" : "E-6",
    "m" : "E-3",
    "k" : "E+3",
    "K" : "E+3",
    "M" : "E+6",
    "G" : "E+9",
    "V" : "",
    "A" : "",
    "hz" : "",
    "LSB" : ""
  }
  if(val == null) return null;
  let hoge = val;
  Object.keys(Units).forEach((n)=>{
    hoge = hoge.replace(n, Units[n]);
  })
  hoge =  hoge.replace(" ", "");
  return parseFloat(hoge);
}

exports.convert = function(src, lot, wf, valArry){
  let dst = []
  let hoge = checkObject(src, [lot, wf])
  if(hoge != null){
    Object.keys(hoge).forEach((i)=>{
      dst.push({
        "x" : hoge[i]["y"],
        "y" : 11 - hoge[i]["x"],
        "value" : checkObject(hoge[i], valArry)
      });
    });
  }
  return dst;
}

// function getBin_old(path, wfno, wt2chip, dst){
//   let wfnostr = `${wfno}`;
//   try {
//
//     let txt = fs.readFileSync(path).toString();
//     let arr = txt.split(/\r\n|\r|\n/);
//
//     let chipno = null;
//     dst[wfnostr] = {};
//     arr.forEach((line, i, a)=>{
//       if(chipno == null){
//         //startの検索
//         let result = line.match(rDevice);
//         if(result != null) {
//           //一致するchipnoの取得
//           let devno = `${result[1]}`.trim();
//           chipno = wt2chip[devno]["n"]
//           dst[wfnostr][chipno] = {}
//           //dst[wfnostr][chipno]["start"] = i
//           dst[wfnostr][chipno]["x"] = wt2chip[devno]["x"]
//           dst[wfnostr][chipno]["y"] = wt2chip[devno]["y"]
//           dst[wfnostr][chipno]["wt"] = devno
//         }
//       }else{
//         if(line.match(rEnd) != null) {
//           //dst[wfnostr][chipno]["end"] = i
//           dst[wfnostr][chipno]["bin"] = a[i-1].split(/\s+/)[3]; //get bin no (1site only)
//           chipno = null;
//         }else{
//           isTestResult(line, dst[wfnostr][chipno])
//         }
//       }
//     });
//
//   } catch (err) {
//     console.log(err)
//     //dst[wfnostr] = {};
//
//   }
// }



// // map[chipno.toString()] = {};
// Object.keys(wfmap[wfno]).forEach((chipno)=>{
//   let start = wfmap[wfno][chipno]["start"]
//   let end = wfmap[wfno][chipno]["end"]
//   //let wtco = wfmap[wfno][chipno]["wt"]
//   let dst = logmatch.getMeasured(arr, start, end, "OS_Pch", "VDDCELL")
//   wfmap[wfno][chipno]["result"] = logmatch.unitParseFloat(dst);
// })

function getMeasured(arr, start, end, testname, pinname){


  for(let i = start;  i < end;  i++  ) {
    let dst = arr[i].match(reg);
    if(dst == null) continue;
    if(dst[rTestName].trim() != testname || dst[rPin].trim() != pinname) continue;
    return dst[rMeasured];
  }
  return null;
}

//------------------------------
// wt2chip[`${mapconfig[n]["wt"]}`] = `${n}`)
//
// wfselect.forEach((w)=>{
//   map[w.toString()] = {};
//   Object.keys(mapconfig).forEach((chip)=>{
//     let wtco = mapconfig[chip]["wt"]
//     let dst = getMeasured(
//       arr,
//       dic[wfno][wtco]["start"],
//       dic[wfno][wtco]["end"],
//       "OS_Pch", "VDDCELL"
//     );
//
//     map[w.toString()][chip.toString()] = unitParseFloat(dst);
//
//   })
// });



//------------------------------


// fs.readFile('Datalog.txt', 'utf8', (err, text) => {
//     let DeviceNos = [];
//     let arr = text.split(/\r\n|\r|\n/);
//     let chipno = -1;
//     arr.forEach((v , i)=>{
//       switch(chipno){
//         case -1:
//           let result = v.match(rDevice);
//           if(result != null) {
//             chipno = result[1];
//             dic[chipno] = {}
//             dic[chipno]["start"] = i
//           }
//           break;
//         default:
//           if(v.match(rEnd) != null) {
//             dic[chipno]["end"] = i
//             chipno = -1;
//           }
//           break;
//       }
//     });
//     console.log(dic)
// });
