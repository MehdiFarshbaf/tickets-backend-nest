import { Request } from 'express';
import { CurrentUser } from './current-user.type';

export interface RequestWithUser extends Request {
  user: CurrentUser;
}
