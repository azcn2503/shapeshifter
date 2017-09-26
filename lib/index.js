const TYPE_OBJECT = "TYPE_OBJECT";
const TYPE_ARRAY = "TYPE_ARRAY";
const TYPE_UNKNOWN = "TYPE_UNKNOWN";

class ShapeshifterResult {
  constructor({ obj, prefix, key, value, depth }) {
    let newKey;
    const type = this._buildType(obj);
    switch (type) {
      case TYPE_ARRAY:
        newKey = this._buildArrayKey(prefix, key);
      break;
      case TYPE_OBJECT:
        newKey = this._buildObjectKey(prefix, key);
      break;
      default:
        throw new Error("Unknown result type: " + type);
      break;
    }

    this.output = {
      __isShapeshifterResult: true,
      value: {
        type,
        key: newKey,
        originalKey: key,
        value,
        depth
      }
    };

    return this;
  }

  key() {
    return this.output.value.key;
  }

  value() {
    return this.output.value.value;
  }

  _buildType(obj) {
    if (obj instanceof Array) {
      return TYPE_ARRAY;
    } else if (obj instanceof Object) {
      return TYPE_OBJECT;
    } else {
      return TYPE_UNKNOWN;
    }
  }

  _buildObjectKey(prefix, key) {
    return prefix ? prefix + "." + key : key;
  }

  _buildArrayKey(prefix, key) {
    return prefix ? prefix + "[" + key + "]" : "[" + key + "]";
  }
}

class Shapeshifter {
  constructor(obj) {
    this.output = this._build(obj);
    return this;
  }

  _build(obj = {}, prefix = "", depth = 0, output = []) {
    if (obj instanceof Array || obj instanceof Object) {
      Object.keys(obj).forEach(key => {
        const result = new ShapeshifterResult({
          obj,
          key,
          value: obj[key],
          depth,
          prefix
        });
        output.push(result);
        return this._build(obj[key], result.key(), depth + 1, output);
      });
    }
    return {
      __isShapeshifter: true,
      value: output
    };
  }

  access(expression) {
    if (!expression instanceof RegExp) {
      throw new Error("expression must be a valid regular expression");
    }
    return this.value().filter(item => expression.test(item.key()));
  }

  value() {
    return this.output.value;
  }
}

module.exports = {
  Shapeshifter
};
