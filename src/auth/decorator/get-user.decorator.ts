import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    //if you want specific data from user then use this code 
    if(data){
        return request.user[data];
    }
    //else use this code for retun all information of user
    return request.user;
  },
);