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
        catchError((error) => {
          this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error: error });
          throw new InternalServerErrorException(customMessageError);
        }),
      ),
    );
    return res.data;
  }

  async get<T>(url: string, customMessageError: string): Promise<T> {
    try {
      const res = await firstValueFrom(this.http.get<T>(url));
      return res.data;
    } catch (error: unknown) {
      this.logger.error({ layer: LayersServer.INFRAESTRUCTURE, error, message: (error as Error).message });
      throw new InternalServerErrorException(customMessageError);
    }
  }
}
