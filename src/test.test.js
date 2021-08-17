import { expect } from '@esm-bundle/chai';
import { myFunction } from '../src/myFunction.js';

describe('myFunction', () => {
  it('adds two numbers together', () => {
    expect(myFunction(1, 2)).to.equal(3);
  });
});
