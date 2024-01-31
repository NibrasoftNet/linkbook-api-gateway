import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.getAllAndOverride<number[]>('roles', [
			context.getHandler(),
			context.getClass(),
		]);

		if (!roles || roles.length === 0) {
			return true;
		}

		const gqlContext = GqlExecutionContext.create(context);
		const ctx = gqlContext.getContext();
		const user = ctx.req.user;

		if (!user || !user.role || !roles.includes(user.role.id)) {
			return false;
		}

		return true;
	}
}
