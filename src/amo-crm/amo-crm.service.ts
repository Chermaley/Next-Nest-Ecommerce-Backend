import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AmoCrmAuthToken } from './models/amo-crm-auth-token.model';
import { AmoCrmModule } from './amo-crm.module';
import { ModuleRef } from '@nestjs/core';
import { Client } from 'amocrm-js';
import { IClientOptions } from 'amocrm-js/dist/interfaces/common';

@Injectable()
export class AmoCrmService implements OnModuleInit {
  private client: Client;
  constructor(
    @InjectModel(AmoCrmAuthToken)
    private authTokenRepository: typeof AmoCrmAuthToken,
  ) {}

  async onModuleInit() {
    this.client = new Client({
      domain: 'onelabcs',
      auth: {
        client_id: 'bd6eda77-2523-48a0-86d2-a29baef949f2',
        client_secret:
          'yJLZRahdfBl3lQQiOp7nKJ2TeGBdIvs7hlg2eNh8apdrIRX3CdX9LzkWV4wEFQ7j',
        redirect_uri: 'https://example.com',
        code: 'def50200c4a77c26b32528c8d1d26f8fc83894a1e61768bcee2d24723c4b74cac677ebd7f7e3d531ab64f7b6cbddd82dc67903eafea8755a99329ae92e472870452af532dab721fb9d72499b88aa07b45ca992c88693c2e2938df60cf26811ab73446b61d643bd71f093b9f54de618f65897e93f85c0cdec6666feb2c3423be5a794cd3fb805672e7299d19a532ca84cabceeb55d51b958e9697083cbea055d8c0c2d3404251b11826a1ac21ba3542bf160b6879a6a8f064fa2c9da9c02865a09ffe06a31b9eb9c727d7eddf99175cea60c56919a959e9231d92881c34b63737dd6480eb12052b07246768c1bed14d94cb37851cc7a2d3c51d16b73f65cb48eeedfcb637cc62db3c4371bfca604905502592974592640c680e83271c8513fa5a4bb279cc4329f16295aaab83e182a730778d9041f49aec51a6825b8086f7b71f6563106694d8ff74fb78dac98a3f8f9971e89244124adc18fcd526be32fc7c1e5d870de467f8494f33b18a0b8f56a3024c7a1e8366bdfa03e32d9a3003ddbc0a4404971e826323063bfd258cbaa11bc66434b13532beb050e77d77a630c7d7a29625a41a15ab8fb9430a71d44a8902f72c4ed26a5cb1bdd43e67c8c9bd954955c392a8b479645b3a4ce6f41aa59c37c3e9b97c6a', // Код для упрощённой авторизации, необязательный
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

  async getToken() {
    return await this.authTokenRepository.findOne();
  }
}
