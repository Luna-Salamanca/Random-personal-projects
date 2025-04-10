import fetch, { Headers, Request, Response } from 'node-fetch';
import { TextDecoder, TextEncoder } from 'util';
global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
