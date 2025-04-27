import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';
import { LayersServer } from 'src/shared/enums/project';

@Injectable()
export class HttpHandlerService {
  constructor(private readonly http: HttpService, private readonly logger: AthvioLoggerService) {}

  async post<T>(url: string, body: any, headers: any, customMessageError: string): Promise<T> {
    const res = await firstValueFrom(
      this.http.post<T>(url, body, headers).pipe(
        catchError((_error) => {
          this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error: _error });
          throw new InternalServerErrorException(customMessageError);
        }),
      ),
    );
    return res.data;
  }

  async get<T>(url: string, customMessageError: string): Promise<T> {
    const res = await firstValueFrom(
      this.http.get<T>(url).pipe(
        catchError((_error) => {
          this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error: _error });
          throw new InternalServerErrorException(customMessageError);
        }),
      ),
    );
    return res.data;
  }
}
