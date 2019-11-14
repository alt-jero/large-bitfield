import test from 'ava'
const LargeBitfield = require('./LargeBitfield')
const { utils } = LargeBitfield

test('Utils: byteNumForBitNum', t => {
  const { byteNumForBitNum } = utils
  t.assert(byteNumForBitNum(0) === 0)
  t.assert(byteNumForBitNum(1) === 0)
  t.assert(byteNumForBitNum(2) === 0)
  t.assert(byteNumForBitNum(3) === 0)
  t.assert(byteNumForBitNum(4) === 0)
  t.assert(byteNumForBitNum(5) === 0)
  t.assert(byteNumForBitNum(6) === 0)
  t.assert(byteNumForBitNum(7) === 0)
  t.assert(byteNumForBitNum(8) === 1)
  t.assert(byteNumForBitNum(9) === 1)
})

test('Utils: bitPosition', t => {
  const { bitPosition } = utils
  t.assert(bitPosition(0) === 0)
  t.assert(bitPosition(1) === 1)
  t.assert(bitPosition(2) === 2)
  t.assert(bitPosition(3) === 3)
  t.assert(bitPosition(4) === 4)
  t.assert(bitPosition(5) === 5)
  t.assert(bitPosition(6) === 6)
  t.assert(bitPosition(7) === 7)
  t.assert(bitPosition(8) === 0)
  t.assert(bitPosition(9) === 1)
})

test('Utils: bitMask', t => {
  const { bitMask } = utils
  t.assert(bitMask(0) === 0b10000000)
  t.assert(bitMask(1) === 0b01000000)
  t.assert(bitMask(2) === 0b00100000)
  t.assert(bitMask(3) === 0b00010000)
  t.assert(bitMask(4) === 0b00001000)
  t.assert(bitMask(5) === 0b00000100)
  t.assert(bitMask(6) === 0b00000010)
  t.assert(bitMask(7) === 0b00000001)
})

test('Utils: addMask', t => {
  const { addMask } = utils
  t.assert(addMask(0b11110000,0b00001111) === 0b11111111)
  t.assert(addMask(0b00001111,0b00001111) === 0b00001111)
  t.assert(addMask(0b11110000,0b11110000) === 0b11110000)
  t.assert(addMask(0b00000000,0b11111111) === 0b11111111)
})

test('Utils: subMask', t => {
  const { subMask } = utils
  t.assert(subMask(0b11110000,0b00001111) === 0b11111111)
  t.assert(subMask(0b00001111,0b00001111) === 0b00000000)
  t.assert(subMask(0b11110000,0b11110000) === 0b00000000)
  t.assert(subMask(0b00000000,0b11111111) === 0b11111111)
})

test('Utils: chkMask', t => {
  const { chkMask } = utils
  t.assert(chkMask(0b11110000,0b00001111) === false)
  t.assert(chkMask(0b00001111,0b00001111) === true)
  t.assert(chkMask(0b11110000,0b11110000) === true)
  t.assert(chkMask(0b00000000,0b11111111) === false)
})

test('Utils: delMask', t => {
  const { delMask } = utils
  t.assert(delMask(0b11110000,0b00001111) === 0b11110000)
  t.assert(delMask(0b00001111,0b00001111) === 0b00000000)
  t.assert(delMask(0b11110000,0b11110000) === 0b00000000)
  t.assert(delMask(0b00000000,0b11111111) === 0b00000000)
})

test('Create Large Bitfield (512 MiB)', t => {
  const bits = new LargeBitfield(0xFFFFFFFF)
  t.assert(bits.getBuffer().length === 512 * 1024 * 1024)
})

test('Write true to all fields in Large Bitfield', t => {
  const bits = new LargeBitfield(64)
  for(let i = 0; i < 64; i++) {
    bits.write(i, true)
  }
  t.assert(bits.getBuffer().toString('hex') === 'ffffffffffffffff')
})

test('Write true then false to all fields in Large Bitfield', t => {
  const bits = new LargeBitfield(64)
  for(let i = 0; i < 64; i++) {
    bits.write(i, true)
  }
  t.assert(bits.getBuffer().toString('hex') === 'ffffffffffffffff')
  for(let i = 0; i < 64; i++) {
    bits.write(i, false)
  }
  t.assert(bits.getBuffer().toString('hex') === '0000000000000000')
})

test('Write then read from Large Bitfield', t => {
  const bits = new LargeBitfield(64)
  bits.write(0, true)
  t.assert(bits.read(0) === true)
  bits.write(0, false)
  t.assert(bits.read(0) === false)
  for(let i = 0; i < 64; i++) {
    if(i % 2 === 0) {
      bits.write(i, true)
    } else {
      bits.write(i, false)
    }
    t.assert(bits.read(i) === (i % 2 === 0))
  }
  t.assert(bits.getBuffer().toString('hex') === 'aaaaaaaaaaaaaaaa')
})

test('Initialization True Test', t => {
  const initializedTrue = new LargeBitfield(16, true) // 2-bytes
  t.true(Array(16).reduce((prev, curr, i) =>
    prev && initializedTrue.read(i), true))
})

test('Initialization False Test', t => {
  const initializedFalse = new LargeBitfield(16, false) // 2-bytes
  t.false(Array(16).reduce((prev, curr, i) =>
    prev || initializedFalse.read(i), false))
})