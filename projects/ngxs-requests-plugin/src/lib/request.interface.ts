export interface IRequest<U = any> {
  loading: boolean;
  loaded: boolean;
  status: string;
  data?: U;
}
