
import * as qs from 'qs';

import { NextFunction, Request, Response } from 'express';


export const queryParser = (req: Request, res: Response, next: NextFunction) => {
    const { query } = req;
    req['parsedQuery'] = qs.parse(query as unknown as string);
    
    next();
}