import { forcast } from './controllers/forcast';
import { taxonomy } from './controllers/taxonomy';

const SurfLineController = {
  taxonomy: new taxonomy(),
  forcast: new forcast(),
 }

export default SurfLineController;