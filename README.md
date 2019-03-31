# Curie
A modular Node.js http/1.0 framework

## <div id="config">Config</div>
Curie-server depends on a config file - `curie.config.js`, which has to exist in the same directory as the main file (i.e `index.ts`).
It has to be in the form of:
```json
{
  "server": "path_to_server_file",
  "public": "path_to_public_dir",
  "routes": "path_to_routes_dir",
  "listeners": ["path_to_listeners_dir", "listener_file_extension"],
  "middleware": ["path_to_middleware_dir", "middleware_file_extension"],
  "database": "path_to_database_dile"
}
```
**Keep in mind that all the paths are relative to the `curie.config.js` file**

## <div id="file_structure">File structure</div>
As you might already know from [the section above](#config), curie-server highly depends on the file structure. An example file structure:
```
|public/
|--css/
|--js/
|routes/
|--index.pug
|listeners/
|--index.list.ts
|middleware/
|--logger.mdw.ts
|index.ts
|database.ts
|server.ts
|curie.config.json
```

### <div id="main_file">Main file</div>
The main file is the file, which is responsible for starting your application. As it's not specified in [the config file](#config), you're responcible for choosing it.
```typescript
import { initApp } from "curie-server/dist/@core"
initApp()
```

### Server file
While [the main file](#main_file) is the starting point of your application, the server file is it's heart. It contains your `Server Instance`, which will be used in different files (i.e middleware, listeners). It should look something like this:
```typescript
import { Server } from "curie-server"

export default new Server({
  port: 8000
})
```

### Database file
The database file is responcible for connecting with your database. It should export a class which extends the [DBridge]() class. You may create your own class or use the so-called out of the box PotgreSQL DBridge.

It should look something like it:
```typescript
import { PostDBridge } from "curie-server"
import server from "./server"

@server.database("postgres://postgres:postgres@127.0.0.1:5432/postgres")
export default class extends PostDBridge {}
```

### Listeners
Listeners are responsible for responding to incoming http requests. Both their location and extension are specified in [the config](#config) file. A listener should extends [the Listener class](#listener). Example:
```typescript
import c, { Listener } from "curie-server";
import server from "../server"

@server.hookup("/")
export default class extends Listener {
  async onGET(req: c.Request, res: c.Response): c.CallbackReturnType {
    this.server.routeParser.render(res, "index")
    return [null, false]
  }
}
``` 

### Middleware
### Routes

## Classes
### <div id="dbridge">DBridge</div>
```typescript
class MyDBridge extends DBridge<DBInterface, QueryType> {
  async get(query: QueryType): Promise<LooseObject[] | any> {
    return new Promise(res => res())
  }
  async update(query: QueryType): Promise<UpdateResponse | any> {
    return new Promise(res => res())
  }
  async delete(query: QueryType): Promise<DeleteResponse | any> {
    // Delete something...
    return creationResponse  
  }
  async create<T extends ClassConstructor>(model: T, data: ConstructorParameters<T>): Promise<CreateResponse | any> {
    // Create something...
    return creationResponse
  }
}
```
### <div id="listener">Listener</div>
```typescript
@server.hookup("/")
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
### Middleware

## Interfaces
### ServerOptions
It is a configuration object passed to the Server constructor. 
```typescript
interface ServerOptions {
  routes: string,
  routeParser: ClassConstructor<RouteParser>
  public: string
  port: number
}

const DefaultOptions {
  port: 8000,
  routeParser: PugParser,
  routes: "FROM_CONFIG_FILE",
  public: "FROM_CONFIG_FILE"
}
```