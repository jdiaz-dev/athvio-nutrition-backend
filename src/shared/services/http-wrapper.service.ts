import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class HttpWrapperService {
  constructor(private http: HttpService) {}

  async get<T>(url: string, messageError: string): Promise<T> {
    const res = await firstValueFrom(
      this.http.get<T>(url).pipe(
        catchError((_error) => {
          throw new InternalServerErrorException(messageError);
        }),
      ),
    );
    return res.data;
  }
}
