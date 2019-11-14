const byteNumForBitNum = bitNum => Math.floor(bitNum / 8)
const bitPosition = bitNum => bitNum % 8
const bitMask = bitPosition => 0b10000000 >>> bitPosition
const addMask = (a, b) => a | b
const subMask = (a, b) => a ^ b
const chkMask = (a, b) => (a & b) > 0
const delMask = (a, b) => chkMask(a, b) ? subMask(a, b) : a

class LargeBitfield {
  constructor(size, initValue) {
    this._bytes = Buffer.alloc(Math.ceil(size / 8))
    if(initValue) this.initAll(initValue)
  }

  initAll(value) {
    if(value === true) this.getBuffer().fill(0xFFFFFFFF)
    if(value === false) this.getBuffer().fill(0x00000000)
  }

  getBuffer() {
    return this._bytes
  }

  getByteAtAddress(address) {
    return this._bytes.readUInt8(address)
  }

  saveByteToAddress(address, byte) {
    return this._bytes.writeUInt8(byte, address)
  }

  read(id) {
    const bitField = this.getByteAtAddress(byteNumForBitNum(id))
    const mask = bitMask(bitPosition(id))
    return chkMask(bitField, mask)
  }

  true(id) {
    this.write(id, true)
    return this
  }

  false(id) {
    this.write(id, false)
    return this
  }

  write(id, value) {
    const bitField = this.getByteAtAddress(byteNumForBitNum(id))
    const mask = bitMask(bitPosition(id))
    const saveValue = value
      ? addMask(bitField, mask)
      : delMask(bitField, mask)
    this.saveByteToAddress(byteNumForBitNum(id), saveValue)
    return this
  }
}

LargeBitfield.utils = {
  byteNumForBitNum,
  bitPosition,
  bitMask,
  addMask,
  subMask,
  chkMask,
  delMask
}

module.exports = LargeBitfield