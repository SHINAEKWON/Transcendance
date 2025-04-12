# this is a makefile to locally compile the ts files

build:
	npm install
	npx tsc
	npx @tailwindcss/cli -i styles/tailwind_in.css -o styles/tailwind_out.css

clean:
	rm -rf build
	rm -f styles/tailwind_out.css
	rm -rf node_modules
	
re: clean build