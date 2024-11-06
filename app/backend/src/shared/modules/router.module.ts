import { Type, Module, DynamicModule } from '@nestjs/common';
import {
  RouterModule as CoreRouterModule,
  RouteTree,
  Routes,
} from '@nestjs/core';

export const extractModulesFromRoutes = (
  routes: Array<RouteTree | Type<any>>,
) => {
  const modules: Array<Type<any>> = [];

  for (const moduleOrRouteTree of routes) {
    if ('path' in moduleOrRouteTree) {
      const { module, children } = moduleOrRouteTree;

      if (module) modules.push(module);

      if (children?.length) modules.push(...extractModulesFromRoutes(children));
    } else {
      modules.push(moduleOrRouteTree);
    }
  }

  return modules;
};

@Module({})
export class RouterModule {
  public static register(routes: Routes): DynamicModule {
    return {
      module: RouterModule,
      imports: [
        ...extractModulesFromRoutes(routes),
        CoreRouterModule.register(routes),
      ],
    };
  }
}
