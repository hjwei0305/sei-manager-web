import { utils } from 'suid';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'applicationModule',

  state: {
    filter: {},
  },
  effects: {},
});
