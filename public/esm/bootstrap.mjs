// esm/bootstrap.mjs — import modules and expose a small namespace for the app
import * as H from './helpers.mjs';
import * as S from './simulation.mjs';
import * as St from './state.mjs';
import * as A from './actions.mjs';

if (typeof window !== 'undefined') {
  window.ESHelpers = H;
  window.ESSimulation = S;
  window.ESState = window.ESState || St;
  window.ESActions = window.ESActions || A;
}

export { H as ESHelpers, S as ESSimulation, St as ESState, A as ESActions };
