# Example

```wfmap
{
  "mode" : "legend",
  "config" : {
    "wfsize" : 200,
    "offsetX" : 12.2,
    "offsetY" : 4.0,
    "chipSizeX" : 24.8,
    "chipSizeY" : 17.2,
    "countX" : 9,
    "countY" : 12,
    "edge" : 5,
    "notch" : 9,
    "notchside" : 0
  },
  "legend" : {
    "mode" : "colorscale",
    "colorscale" : {
      "domain": [1,2,60],
      "range":["green","yellow","red"]
    }
  }
}
```

```wfmap
{
  "mode": "memory",
  "title" : "AS06250-01-22",
  "lot" : "AS06250-01",
  "wf" : "22",
  "value" : ["bin"]
}
```

```wfmap
{
  "mode": "memory",
  "lot" : "AS06250-01",
  "wf" : "23",
  "value" : ["bin"]
}
```

```wfmap
{
  "mode": "memory",
  "lot" : "AS06250-01",
  "wf" : "24",
  "value" : ["bin"]
}
```

```wfmap
{
  "mode": "memory",
  "title" : "wf 25",
  "lot" : "AS06250-01",
  "wf" : "25",
  "value" : ["bin"]
}
```

```wfmap
{
  "mode" : "legend",
  "legend" : {
    "mode" : "colorscale",
    "text" : false,
    "colorscale" : {
      "text" : false,
      "domain": [1,2,60],
      "range":["green","yellow","red"]
    }
  }
}
```

```wfmap
{
  "mode": "memory",
  "title" : "AS06250-01-22",
  "lot" : "AS06250-01",
  "wf" : "22",
  "value" : ["IDD_Active_Max AV33", "value"]
}
```