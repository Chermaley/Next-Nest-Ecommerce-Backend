import {Injectable, OnModuleInit} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {AmoCrmAuthToken} from './amo-crm-auth-token.model';
import {Client} from 'amocrm-js';

@Injectable()
export class AmoCrmService implements OnModuleInit {
  private client: Client;
  constructor(
    @InjectModel(AmoCrmAuthToken)
    private authTokenRepository: typeof AmoCrmAuthToken,
  ) {}

  async onModuleInit() {
    this.client = new Client({
      domain: process.env.AMO_CRM_DOMAIN,
      auth: {
        redirect_uri: 'https://example.com',
        code: process.env.AMO_CRM_CODE, // Код для упрощённой авторизации, необязательный
        client_id: process.env.AMO_CRM_CLIENT_ID,
        client_secret: process.env.AMO_CRM_CLIENT_SECRET,
      },
    });
    this.client.token.on('change', () => {
      const token = this.client.token.getValue();
      this.setNewToken(JSON.stringify(token));
    });
    const token = await this.getToken();
    if (token) {
      this.client.token.setValue(JSON.parse(token.token));
    }
  }

  createLead(name: string) {
    this.client.leads.create([{ name }]);
  }

  async setNewToken(token: string) {
    await this.authTokenRepository.destroy({ where: {}, truncate: true });
    return await this.authTokenRepository.create({
      token,
    });
  }

  getToken() {
    return this.authTokenRepository.findOne();
  }
}
