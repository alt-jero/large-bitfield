# large-bitfield
Use node.js Buffer as a bitfield for storing lots of bools

# install
` npm i large-bitfield `

# usage
```javascript
const LargeBitfield = require('large-bitfield')

const field = new LargeBitfield(8) // 8 bits = 1 byte

field.true(4) // Set bit 4 to TRUE
field.false(7) // Set bit 7 to FALSE
field.write(0, true) // Set bit 0 to TRUE

field.read(3) // Read bit 3: Not defined - not initialized.
field.read(4) // TRUE
field.read(7) // FALSE


// Initializing values: (Otherwise behavior is undefined: Might be true or false.)
const initializedTrue = new LargeBitfield(16, true) // 2-bytes, initialized True
const initializedFalse = new LargeBitfield(16, false) // 2-bytes, initialized False

const trueTest = Array(16).reduce((prev, curr, i) =>
  prev && initializedTrue.read(i), true)
const falseTest = Array(16).reduce((prev, curr, i) =>
  prev || initializedFalse.read(i), false)

console.log(trueTest && !falseTest) //= true
```