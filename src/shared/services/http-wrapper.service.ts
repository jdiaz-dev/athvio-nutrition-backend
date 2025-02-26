import { LayersServer } from './../enums/project';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AthvioLoggerService } from 'src/infraestructure/observability/athvio-logger.service';

@Injectable()
export class HttpWrapperService {
  constructor(private readonly http: HttpService, private readonly logger: AthvioLoggerService) {}

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
