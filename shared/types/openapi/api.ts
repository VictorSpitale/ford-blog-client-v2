// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
type PickDefined<TObject> = Pick<TObject, { [Key in keyof TObject]: TObject[Key] extends undefined ? undefined : Key; }[keyof TObject]>;

export type FetchOptions<Method, Query, Params, Json> =
    & { method: Method }
    & PickDefined<{ query: Query; params: Params; json: Json }>;

type ResponseWithStatus<Status extends number> = { responses: Record<Status, { content: { "application/json": any } }> };

export type SuccessResponse<Endpoint> =
    Endpoint extends ResponseWithStatus<200> ? Endpoint["responses"][200]["content"]["application/json"] :
        Endpoint extends ResponseWithStatus<201> ? Endpoint["responses"][201]["content"]["application/json"] : null;

export type FailureResponse = {
    message: string;
    statusCode?: number;
    code?: number;
}

type EndpointParameter<Endpoint, ParameterType extends string> = Endpoint extends { parameters: Record<ParameterType, object> } ? Endpoint["parameters"][ParameterType] : undefined;
export type QueryParameters<Endpoint> = EndpointParameter<Endpoint, "query">
export type PathParameters<Endpoint> = EndpointParameter<Endpoint, "path">

export type RequestBody<Endpoint, BodyType extends string = "application/json">
    = Endpoint extends { requestBody: { content: Record<BodyType, object> } }
    ? Endpoint["requestBody"]["content"][BodyType] : undefined;

