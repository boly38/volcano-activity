# volcano-activity OPS guide

## HowTo setup

* git clone
* then install deps:
````bash
npm run install 
````

## HowTo deploy on cyclic (PROD)

* build package : ./dist

````bash
  ./scripts/deliver.sh
 ````
* push the result as `cyclic` orphan branch via `peaceiris/actions-gh-pages@v3` (or move under `cd ./dist`) 
* cyclic detects push of this branch to run app deployment using :

````bash
npm run start 
````
This will run app backend with last front-end (`dist/ui/`)


## HowTo run locally (DEV)

Start backend + dynamic front-end:

````bash
npm run dev 
````

This will run locally backend and front-end `start` (`react-scripts start`) in parallel using `concurrently`.
