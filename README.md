# jsonator

jsonator is app to help with manipulating json text streams.

[![Build Status](https://drone.io/github.com/mac-/jsonator/status.png)](https://drone.io/github.com/mac-/jsonator/latest)
[![NPM version](https://badge.fury.io/js/jsonator.png)](http://badge.fury.io/js/jsonator)
[![Dependency Status](https://david-dm.org/mac-/jsonator.png)](https://david-dm.org/mac-/jsonator)

[![NPM](https://nodei.co/npm/jsonator.png?downloads=true&stars=true)](https://nodei.co/npm/jsonator/)

## Installation

	npm install -g jsonator

## Usage

jsonator takes data piped to it via stdin, manipulates the data based on the options used, and pipes the data back to stdout.

You can run jsonator with the -h flag to see the various options:

	$ jsonator -h

	  Usage: jsonator [options]

	  Options:

	    -h, --help                output usage information
	    -V, --version             output the version number
	    -o, --operation <string>  (Optional) the operation to perform on the property (get, set, exists, delete, increment, decrement, not, contains, push, pop, shift, unshift) Defaults to: "set"
	    -p, --property <string>   (Required) the property (using dot notation for sub properties) to operate on
	    -t, --type <type>         (Optional) the data type of the value Defaults to: "string"
	    -v, --value <value>       (Optional) the data to apply with the given operation

## Examples

### `get` operation

```
$ echo "{\"id\":\"fnord\"}" | jsonator -o get -p id
"fnord"
```

```
$ echo "{\"id\":{\"type\":\"string\"}}" | jsonator -o get -p id
{"type":"string"}
```

```
$ echo "{\"id\":{\"type\":\"string\"}}" | jsonator -o get -p id.type
"string"
```

```
$ echo "{\"id\":{\"values\":[\"1\",\"2\"]}}" | jsonator -o get -p id.values[0]
"1"
```

### `set` operation

```
$ echo "{\"id\":\"fnord\"}" | jsonator -o set -p id -v 1234
{"id":"1234"}
```

```
$ echo "{\"id\":\"fnord\"}" | jsonator -o set -p id -v 1234 -t number
{"type":1234}
```

```
$ echo "{\"id\":{\"type\":\"string\"}}" | jsonator -o set -p id.type -v number -t string
{"id":{"type":"number"}}
```

```
$ echo "{\"id\":{\"values\":[\"1\",\"2\"]}}" | jsonator -o set -p id.values[0] -v 6 -t number
{"id":{"values":[6,"2"]}}
```

### `exists` operation

```
$ echo "{\"id\":\"fnord\"}" | jsonator -o exists -p id
true
```

```
$ echo "{\"id\":\"fnord\"}" | jsonator -o exists -p type
false
```

```
$ echo "{\"id\":{\"type\":\"string\"}}" | jsonator -o exists -p id.type
true
```

```
$ echo "{\"id\":{\"values\":[\"1\",\"2\"]}}" | jsonator -o exists -p id.values[0]
true
```

### `delete` operation

```
$ echo "{\"id\":\"fnord\"}" | jsonator -o delete -p id
{}
```

```
$ echo "{\"id\":\"fnord\", \"type\":\"string\"}" | jsonator -o delete -p type
{"id":"fnord"}
```

```
$ echo "{\"id\":{\"type\":\"string\"}}" | jsonator -o delete -p id.type
{"id":{}}
```

```
$ echo "{\"id\":{\"values\":[{\"i\":\"1\"},\"2\"]}}" | jsonator -o delete -p id.values[0].i
{"id":{"values":[{},"2"]}}
```

### `increment` operation

```
$ echo "{\"id\":1}" | jsonator -o increment -p id
{"id":2}
```

```
$ echo "{\"id\":\"fnord\", \"type\":100}" | jsonator -o increment -p type
{"id":"fnord","type":101}
```

```
$ echo "{\"id\":{\"values\":[{\"i\":1},2]}}" | jsonator -o increment -p id.values[1]
{"id":{"values":[{"i":1},3]}}
```

```
$ echo "{\"id\":{\"values\":[{\"i\":1},\"2\"]}}" | jsonator -o increment -p id.values[0].i
{"id":{"values":[{"i":2},"2"]}}
```

### `decrement` operation

```
$ echo "{\"id\":1}" | jsonator -o decrement -p id
{"id":0}
```

```
$ echo "{\"id\":\"fnord\", \"type\":100}" | jsonator -o decrement -p type
{"id":"fnord","type":99}
```

```
$ echo "{\"id\":{\"values\":[{\"i\":1},2]}}" | jsonator -o decrement -p id.values[1]
{"id":{"values":[{"i":1},1]}}
```

```
$ echo "{\"id\":{\"values\":[{\"i\":1},\"2\"]}}" | jsonator -o decrement -p id.values[0].i
{"id":{"values":[{"i":0},"2"]}}
```

### `not` operation

```
$ echo "{\"id\":false}" | jsonator -o not -p id
{"id":true}
```

```
$ echo "{\"id\":{\"values\":[{\"i\":1},false]}}" | jsonator -o not -p id.values[1]
{"id":{"values":[{"i":1},true]}}
```


### `contains` operation

```
$ echo "{\"ids\":[1,2,3]}" | jsonator -o contains -p ids -v 1
false
```

```
$ echo "{\"ids\":[1,2,3]}" | jsonator -o contains -p ids -v 1 -t number
true
```

```
$ echo "{\"ids\":[{\"type\":\"number\"},2,3]}" | jsonator -o contains -p ids -v "{\"type\":\"number\"}" -t object
true
```

### `push` operation

```
$ echo "{\"ids\":[1,2,3]}" | jsonator -o push -p ids -v 1
{"ids":[1,2,3,"1"]}
```

```
$ echo "{\"ids\":[1,2,3]}" | jsonator -o push -p ids -v 1 -t number
{"ids":[1,2,3,1]}
```

```
$ echo "{\"ids\":[1,2,3]}" | jsonator -o push -p ids -v "{\"type\":\"number\"}" -t object
{"ids":[1,2,3,{"type":"number"}]}
```

### `pop` operation

```
$ echo "{\"ids\":[1,2,3]}" | jsonator -o pop -p ids
{"ids":[1,2]}
```

```
$ echo "{\"ids\":[1,2,{\"type\":\"number\"}]}" | jsonator -o pop -p ids
{"ids":[1,2]}
```

```
$ echo "{\"ids\":[1,2,{\"types\":[\"number\"]}]}" | jsonator -o pop -p ids[2].types
{"ids":[1,2,{"types":[]}]}
```

### `shfit` operation

```
$ echo "{\"ids\":[1,2,3]}" | jsonator -o shift -p ids
{"ids":[2,3]}
```

```
$ echo "{\"ids\":[1,2,{\"type\":\"number\"}]}" | jsonator -o shift -p ids
{"ids":[2,{"type":"number"}]}
```

```
$ echo "{\"ids\":[1,2,{\"types\":[\"number\"]}]}" | jsonator -o shift -p ids[2].types
{"ids":[1,2,{"types":[]}]}
```

### `unshift` operation

```
$ echo "{\"ids\":[1,2,3]}" | jsonator -o unshift -p ids -v 1
{"ids":["1",1,2,3]}
```

```
$ echo "{\"ids\":[1,2,3]}" | jsonator -o unshift -p ids -v 1 -t number
{"ids":[1,1,2,3]}
```

```
$ echo "{\"ids\":[1,2,3]}" | jsonator -o unshift -p ids -v "{\"type\":\"number\"}" -t object
{"ids":[{"type":"number"},1,2,3]}
```

## License

The MIT License (MIT) Copyright (c) 2013 Mac Angell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.