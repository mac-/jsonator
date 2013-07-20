# jsonator

jsonator is app to help with manipulating json text streams.

[![Build Status](https://secure.travis-ci.org/mac-/jsonator.png)](http://travis-ci.org/mac-/jsonator)
[![NPM version](https://badge.fury.io/js/jsonator.png)](http://badge.fury.io/js/jsonator)
[![Dependency Status](https://david-dm.org/mac-/jsonator.png)](https://david-dm.org/mac-/jsonator)

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

### get

	$ echo "{\"id\":\"fnord\"}" | jsonator -o get -p id
	"fnord"

	$ echo "{\"id\":{\"type\":\"string\"}}" | jsonator -o get -p id
	{"type":"string"}

	$ echo "{\"id\":{\"type\":\"string\"}}" | jsonator -o get -p id.type
	"string"

	$ echo "{\"id\":{\"values\":[\"1\",\"2\"]}}" | jsonator -o get -p id.values[0]
	"1"

### set

	$ echo "{\"id\":\"fnord\"}" | jsonator -o set -p id -v 1234
	{"id":"1234"}

	$ echo "{\"id\":\"fnord\"}" | jsonator -o set -p id -v 1234 -t number
	{"type":1234}

	$ echo "{\"id\":{\"type\":\"string\"}}" | jsonator -o set -p id.type -v number -t string
	{"id":{"type":"number"}}

	$ echo "{\"id\":{\"values\":[\"1\",\"2\"]}}" | jsonator -o set -p id.values[0] -v 6 -t number
	{"id":{"values":[6,"2"]}}

## License

The MIT License (MIT) Copyright (c) 2013 Mac Angell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.