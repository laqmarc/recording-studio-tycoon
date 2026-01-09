// esm/bootstrap.mjs — import modules and expose a small namespace for the app
import * as H from './helpers.mjs';
import * as S from './simulation.mjs';

if (typeof window !== 'undefined') {
  window.ESHelpers = H;
  window.ESSimulation = S;
}

export { H as ESHelpers, S as ESSimulation };
