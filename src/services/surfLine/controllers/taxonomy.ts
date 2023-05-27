import { baseController } from './base';

const Earth = "58f7ed51dadb30820bb38782";
const NorthAmerica = "58f7ed51dadb30820bb38791";
const UnitedStates = "58f7ed51dadb30820bb3879c";
const Mexico = "58f7eeecdadb30820bb550cc"


export class taxonomy extends baseController {
  regions: {
    Earth: string,
    NorthAmerica: string,
    UnitedStates: string,
    Mexico: string
  }
  constructor() {
    super();
    this.regions = {
      Earth,
      NorthAmerica,
      UnitedStates,
      Mexico
    }
  }
  async get(id: string, maxDepth = 0) {
    const data = await super.get(`taxonomy?type=taxonomy&id=${id}&maxDepth=${maxDepth}`);
    return data;
  }
  async getContinents() {
    const data = await this.get(Earth);
    return data;
  }

  async getNorthAmerica() {
    const data = await this.get(NorthAmerica);
    return data;
  }

  async getUnitedStates() {
    const data = await this.get(UnitedStates);
    return data;
  }

  async getMexico() {
    const data = await this.get(Mexico);
    return data;
  }
}

 