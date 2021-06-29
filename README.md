# @noma/typescript

This package aims to provide typings for the dynamically loaded noma plugins, which allows the noma exported parameters to be fully intellisensed.  
It also provides types for the default.yml noma config found in the .noma folder.

The only requirement for the type generation for plugins is that the plugin has a Typescript declaration file (.d.ts) residing right beside the index.js file, which describes the files default exported members as an interface.

## Installation
___
```
npm i -g @noma/typescript
```

## CLI Usage
___
```sh
noma-tsc [projectDirectory]
```

projectDirectory is a required argument, it can be both a relative or an absolute path.  

## CLI Example
___
Relative path:

```
noma-tsc .
``` 

Absolute path:

```
noma-tsc C:\Development\projects\test_server
``` 

## Code Usage
___
The generated file (NomaConfig.d.ts) allows you to instantiate a function based on the IMainFunction interface, and thus get the properly typed parameters from the noma plugins.

```ts
import { IMainFunction } from "./NomaConfig";

const main: IMainFunction = ({ config }) => {
    console.log(`config: `, config);
};

export default main;
```

## Plugin Creation
___
When creating a plugins' Typescript defition (.d.ts) file, please add the @types module to the dependencies, instead of devDependencies.  
This ensures the types are installed without the need to install them locally when using the noma plugins and services.

## Notes
___
The `'noma-tsc'` command should be executed every time a config file has been changed, every time a plugin has been updated, or when a new plugin is installed.  
The process of creating the NomaConfig.d.ts does not take long, so running it as a precursor to other npm scripts could be considered.  
The generated code can be nicely formatted by a formatter such as prettier, so running that after the `'noma-tsc'` command is another good consideration.
