# Implicit Logger Context

Proof of concept to ease the use of child loggers in NestJs using
[asynchronous context tracking](https://nodejs.org/api/async_context.html).

## Example

Passing a logger down the call stack is no longer required. The context information is implicitly provided.

### Before

```ts
@Controller()
class CatController {
  constructor(
    private catService: CatService,
    private logger: Logger,
  ) {}

  @Get()
  getCat() {
    return this.catService.getCat(this.logger.child({ foo: 'bar' }))
  }
}

@Injectable()
class CatService {
  async getCat(logger: Logger) {
    logger.log('Get Cat!')

    return 'Garfield';
  }
}
```

### After

```ts
@Controller()
class CatController {
  constructor(private catService: CatService) {}

  @Get()
  getCat() {
    return withLogCtx({ foo: 'bar' }, () => this.catService.getCat())
  }
}

@Injectable()
class CatService {
  constructor(private logger: Logger) {}
  
  async getCat() {
    this.logger.log('Get Cat!')
    
    return 'Garfield';
  }
}
```

### Resulting Log Output

```json
{
  "foo":"bar",
  "msg":"Get Cat!",
  ...
}
```

## Pino Logger

The package `nestjs-pino` already uses `AsyncLocalStorage`. Therefore, much of the work is already done for us here.
This example only really adds `withLogCtx` to show how easy the usage can be. However, most other loggers should
be simple to be ported to use `AsyncLocalStorage`. Refer to the source code of `nestjs-pino` for details.
