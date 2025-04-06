# this is a makefile to locally compile the ts files

buildall:
	npm install
	npx tsc

build:
	npx tsc
	npx @tailwindcss/cli -i public/styles/tailwind_in.css -o public/styles/tailwind_out.css

clean:
	rm -rf build

fclean: clean
	rm -r node_modules
	
re: clean build