# Curie
A modular Node.js http/1.0 framework


## Table of Content
1. [Config](#config)
1. [File Structure](#file_structure)
    1. [Main File](#main_file)
    1. [Database File](#db_file)
    1. [Listeners](#list_files)
    1. [Middleware](#mdw_files)
    1. [Route Parser](#route_parser)
    1. [Template Files](#routes)
    1. [Single File Alternative](#single_file)
1. [Classes](#classes)
    1. [DBridge](#dbridge)
    1. [Listener](#listener)
    1. [Middleware](#middleware)
1. [Types](#types)
    1. [Request](#req)
    1. [Response](#res)
    1. [Server Parameters](#params)
    1. [CallbackReturnType](#callback_return_type) 

## <div id="config">Config</div>
Curie-server accepts a number of configuration options of the type:
```typescript
interface ServerParams {
  routes: string,
  routeParser: ClassConstructor<RouteParser>
  public: string
  port: number
  listeners: [string, string | RegExp]
  middleware: [string, string | RegExp]
  database: string,
  root: string
}
```
**Keep in mind that all the paths are relative to the main file**

## <div id="file_structure">File structure</div>
curie-server supports a multi file structure. An example file structure:
```
|public/
|--css/
|----main.css
|--js/
|----main.js
|routes/
|--index.pug
|listeners/
|--index.list.ts
|middleware/
|--logger.mdw.ts
|index.ts
|database.ts
```

### <div id="main_file">Main file</div>
The main file is the file, which is responsible for starting your application.
```typescript
import { initApp } from "curie-server"
initApp({
  port: 8000,
  public: "../public",
  routes: "../routes",
  listeners: ["./listeners", "list.[jt]s"],
  middleware: ["./middleware", "mdw.[jt]s"],
  database: ""
})
```

### <div id="db_file">Database file</div>
The database file is responcible for connecting with your database. It should export a class which extends the [DBridge](#dbridge) class. You may create your own class or use the so-called out of the box PotgreSQL DBridge.
It should look something like it:
```typescript
import { PostDBridge, database } from "curie-server"

@database("postgres://postgres:postgres@127.0.0.1:5432/postgres")
export default class extends PostDBridge {}
```

### <div id="list_files">Listeners</div>
Listeners are responsible for responding to incoming http requests. Both their location and extension are specified in the `Server` constructor parameters in the [main](#main_file) file. A listener should extend [the Listener class](#listener), implement `onGET` and/or `onPOST` method(s), such that they return [CallbackReturnType](#callback_return_type). Example:
```typescript
import c, { Listener, hookup } from "curie-server";

@hookup("/")
export default class extends Listener {
  async onGET(req: c.Request, res: c.Response): c.CallbackReturnType {
    this.server.routeParser.render(res, "index")
    return [null, false]
  }
}
``` 

### <div id="mdw_files">Middleware<div>
Middleware is responcible for interrupting incoming requests and can even reject them. Middleware should extends [the Middleware](#middleware) class and return [the CallbackReturnType](#callback_return_type). It should look something like this:
```typescript
import { CallbackReturnType, Middleware, withTime, Request, Response, c_log, use } from "curie-server";

@use()
export default class extends Middleware {
  async intercept(req: Request, res: Response) {
    c_log(withTime(`[LOGGER]> ${req.method}: ${req.url || ""}`))
    return [null, true] as CallbackReturnType
  }
}
```

### <div id="route_parser">RouteParser</div>
The `RouteParser` is responsible for parsing and rendering template files. If you want to use the lamplating language of your choice, you should provide a class that extends the `RouteParser`.
```typescript
abstract class RouteParser<RouteType = any> {
  path: string
  routes: LooseObject<RouteType>
  server: Server
  public constructor(path: string, server: Server) {/*...*/}
  abstract compile(route: string): CallbackReturnType
  abstract async compileAll(): Promise<CallbackReturnType>
  abstract async render(res: Response, route: string, locals?: LooseObject): Promise<CallbackReturnType>
}
```
Out of the box curie-server is providing support for the [pug](https://pugjs.org/api/getting-started.html) templating lang.

### <div id="routes">Routes</div>
Routes are themplates rendered by [the RouteParser](#route_parser). Out of the box you get the `PugParser`, which compiles `.pug` files and allows you to query items from the database 
(template: `//# $<variable_name>: <query>`).
```pug
//# $posts: SELECT * FROM posts

<!DOCTYPE html>
html(lang="en")
  head 
    // ...
  body
    ul.posts
      for post in posts
        li.posts__post
          h2.posts__post__title= post.title
          p.posts__post__body= post.body
```

### <div id="single_file">Single file approach<div>
While I highly advise you to take the advatnage of the multi file structure, around which the `curie-server` was built, you can fit everything into a single file.
```typescript
import c, { Server, PostDBridge, Listener, Middleware, c_log, withTime, initApp, database, hookup, use } from "curie-server";

(async () => {
  await initApp({
   port: 8000,
   public: "../public",
   routes: "../routes",
   listeners: ["./listeners", "list.[jt]s"],
   middleware: ["./middleware", "mdw.[jt]s"],
   database: ""
  })

  @database("postgres://postgres:postgres@127.0.0.1:5432/postgres")
  class Db extends PostDBridge {}

  @hookup("/")
  class IndexListener extends Listener {
    async onGET(req: c.Request, res: c.Response) {
      await this.render(res, "index")
      return [null, false] as c.CallbackReturnType
    }
  }
  @use()
  class Logger extends Middleware {
    async intercept(req: Request, res: Response) {
      c_log(withTime(`[LOGGER]> ${req.method}: ${req.url || ""}`))
      return [null, true] as c.CallbackReturnType
    }
  }
})()
```

## <div id="classes">Classes</div>
### <div id="dbridge">DBridge</div>
```typescript
@database("<connection_uri>")
class MyDBridge extends DBridge<DBInterface, QueryType> {
  async get(query: QueryType): Promise<LooseObject[] | any> {
    // Fetch the query! Good boy!
    return getResponse
  }
  async update(query: QueryType): Promise<UpdateResponse | any> {
    // Update something...
    return updateResponse
  }
  async delete(query: QueryType): Promise<DeleteResponse | any> {
    // Delete something...
    return deletionResponse  
  }
  async create<T extends ClassConstructor>(model: T, data: ConstructorParameters<T>): Promise<CreateResponse | any> {
    // Create something...
    return creationResponse
  }
}
```
### <div id="listener">Listener</div>
```typescript
@hookup("/")
class IndexListener extends Listener {  
  async onGET(
    req: http.IncomingMessage, 
    res: http.ServerResponse
    ): Promise<CallbackReturnType | undefined> {
      return [null, true]
    }
  async onPOST(
    req: http.IncomingMessage, 
    res: http.ServerResponse
    ): Promise<CallbackReturnType | undefined> {
      return [null, true]
    }
}
```
### <div id="middleware">Middleware</div>
```typescript
@use()
export default class Intercepter extends Middleware {
  async intercept(req: Request, res: Response) {
    // Do something
    return [null, true] as CallbackReturnType
  }
}
```

## <div id="types">Interfaces and types</div>
### <div id="req">Request</div>
```typescript
interface Request extends http.IncomingMessage {
  query: LooseObject<string>
  cookies: cookies
  body: LooseObject
}
```
### <div id="res">Response</div>
```typescript
interface Response extends http.ServerResponse {
  cookies: cookies
}
```

### <div id="params">ServerParams</div>
It is a configuration object passed to the Server constructor. 
```typescript
interface ServerParams {
  routes: string,
  routeParser: ClassConstructor<RouteParser>
  public: string
  port: number
  listeners: [string, string | RegExp]
  middleware: [string, string | RegExp]
  database: string,
  root: string
  [key: string]: any | any[]
}

Server.DEFAULT_SERVER_OPTIONS: ServerParams = {
    routes: "./routes",
    routeParser: PugParser,
    public: "./public",
    port: 8000,
    listeners: ["./", "list.[jt]s"],
    middleware: ["./", "mdw.[jt]s"],
    database: '',
    root: path.dirname((require.main as NodeModule).filename)
  }
```

### <div id="callback_return_type">CallbackReturnType</div>
CallbackReturnType is a value returned by many `curie-server` functions, but is used especially in [the Listener](#listener) and [the Middleware](#middleware) classes. The first part of the tuple is the `Error`, and the 2nd one is the `ShouldContinue` boolean, which tells the inner loop whether is should send the Response to the client or continue.
```typescript
type CallbackReturnType = [Error | null, boolean]
```