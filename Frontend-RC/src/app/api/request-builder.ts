import { HttpRequest, HttpHeaders, HttpParams } from '@angular/common/http';

export class RequestBuilder {
  private _headers = new HttpHeaders();
  private _params = new HttpParams();

  constructor(
    public method: string,
    public url: string,
    public body?: any
  ) {}

  header(name: string, value: string): this {
    this._headers = this._headers.set(name, value);
    return this;
  }

  query(name: string, value: any): this {
    if (value !== undefined && value !== null) {
      this._params = this._params.set(name, String(value));
    }
    return this;
  }

  build(): HttpRequest<any> {
    return new HttpRequest<any>(
      this.method,
      this.url,
      this.body,
      {
        headers: this._headers,
        params: this._params,
        responseType: 'json'
      }
    );
  }
}
