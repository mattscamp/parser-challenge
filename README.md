Parsing Challenge
===================

Parse a log file and aggregate certain criteria using Node.

Directory Structure
-------------------------

* __lib/__ the actual code is stored within the lib. Designed using an OOP mannterism: parser.js contains a Parser class
* __test/__ all our mocha tests. Corresponding files from lib are in here
* __bin/__ where our compailed application lives
* __package.json__ project dependencies
* __Makefile__ the make file is used to run the Mocha tests

Dependencies
--------------------

* __[mocha](https://github.com/visionmedia/mocha)__
* __[event-stream](https://github.com/dominictarr/event-stream)__


Compiling and Running
-----------------------------------------

* Install the [current stable version of Node.JS](http://nodejs.org/download/)
* Clone this repo _git clone https://github.com/mattscamp/parser-challenge
* Run _npm install_ within the project directory.
* Run _npm test_.
* Run ./bin/parser for sample output
