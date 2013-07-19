clean:
	npm cache clean && rm -rf node_modules/*

install:
	rm -rf node_modules/* && npm install

update:
	make clean && rm -rf npm-shrinkwrap.json && npm install && npm shrinkwrap

test:
	./node_modules/.bin/jshint lib/* --config test/jshint/config.json
	@NODE_ENV=test ./node_modules/.bin/mocha --recursive --reporter spec --timeout 3000 test

test-cov:
	@NODE_ENV=test ./node_modules/.bin/mocha --require blanket --recursive --timeout 3000 -R travis-cov test

test-cov-html:
	@NODE_ENV=test ./node_modules/.bin/mocha --require blanket --recursive --timeout 3000 -R html-cov test > test/coverage.html
	xdg-open "file://${CURDIR}/test/coverage.html" &

.PHONY: test test-cov test-cov-html
