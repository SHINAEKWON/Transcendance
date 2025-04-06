buildall:
	npm install
	npx tsc

build:
	npx tsc
	npx @tailwindcss/cli -i styles/tailwind_in.css -o styles/tailwind_out.css

clean:
	rm -rf build

fclean: clean
	rm -r node_modules
	
re: clean build
