(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === "object" && typeof module === "object")
    module.exports = factory();
  else if (typeof define === "function" && define.amd) define([], factory);
  else if (typeof exports === "object") exports["multiformats"] = factory();
  else root["multiformats"] = factory();
})(this, function () {
  return /******/ (function (modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {};
    /******/
    /******/ // The require function
    /******/ function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/ if (installedModules[moduleId])
        /******/ return installedModules[moduleId].exports;
      /******/
      /******/ // Create a new module (and put it into the cache)
      /******/ var module = (installedModules[moduleId] = {
        /******/ exports: {},
        /******/ id: moduleId,
        /******/ loaded: false,
        /******/
      });
      /******/
      /******/ // Execute the module function
      /******/ modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      );
      /******/
      /******/ // Flag the module as loaded
      /******/ module.loaded = true;
      /******/
      /******/ // Return the exports of the module
      /******/ return module.exports;
      /******/
    }
    /******/
    /******/
    /******/ // expose the modules object (__webpack_modules__)
    /******/ __webpack_require__.m = modules;
    /******/
    /******/ // expose the module cache
    /******/ __webpack_require__.c = installedModules;
    /******/
    /******/ // __webpack_public_path__
    /******/ __webpack_require__.p = "";
    /******/
    /******/ // Load entry module and return exports
    /******/ return __webpack_require__(0);
    /******/
  })(
    /************************************************************************/
    /******/ [
      /* 0 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });

        var cid = __webpack_require__(1);
        var base16 = __webpack_require__(10).base16;
        var varint = __webpack_require__(2);
        var bytes = __webpack_require__(5);
        var hasher = __webpack_require__(11);
        var digest = __webpack_require__(4);

        exports.CID = cid.CID;
        exports.varint = varint;
        exports.base16 = base16;
        exports.bytes = bytes;
        exports.hasher = hasher;
        exports.digest = digest;

        /***/
      },
      /* 1 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        var _slicedToArray = (function () {
          function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;
            try {
              for (
                var _i = arr[Symbol.iterator](), _s;
                !(_n = (_s = _i.next()).done);
                _n = true
              ) {
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
              }
            } catch (err) {
              _d = true;
              _e = err;
            } finally {
              try {
                if (!_n && _i["return"]) _i["return"]();
              } finally {
                if (_d) throw _e;
              }
            }
            return _arr;
          }
          return function (arr, i) {
            if (Array.isArray(arr)) {
              return arr;
            } else if (Symbol.iterator in Object(arr)) {
              return sliceIterator(arr, i);
            } else {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance"
              );
            }
          };
        })();

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        Object.defineProperty(exports, "__esModule", { value: true });

        var varint = __webpack_require__(2);
        var digest = __webpack_require__(4);
        var base58 = __webpack_require__(6);
        var base32 = __webpack_require__(9);
        var bytes = __webpack_require__(5);

        var CID = (function () {
          function CID(version, code, multihash, bytes) {
            _classCallCheck(this, CID);

            this.code = code;
            this.version = version;
            this.multihash = multihash;
            this.bytes = bytes;
            this.byteOffset = bytes.byteOffset;
            this.byteLength = bytes.byteLength;
            this.asCID = this;
            this._baseCache = new Map();
            Object.defineProperties(this, {
              byteOffset: hidden,
              byteLength: hidden,
              code: readonly,
              version: readonly,
              multihash: readonly,
              bytes: readonly,
              _baseCache: hidden,
              asCID: hidden,
            });
          }

          _createClass(
            CID,
            [
              {
                key: "toV0",
                value: function toV0() {
                  switch (this.version) {
                    case 0: {
                      return this;
                    }
                    default: {
                      var code = this.code,
                        multihash = this.multihash;

                      if (code !== DAG_PB_CODE) {
                        throw new Error(
                          "Cannot convert a non dag-pb CID to CIDv0"
                        );
                      }
                      if (multihash.code !== SHA_256_CODE) {
                        throw new Error(
                          "Cannot convert non sha2-256 multihash CID to CIDv0"
                        );
                      }
                      return CID.createV0(multihash);
                    }
                  }
                },
              },
              {
                key: "toV1",
                value: function toV1() {
                  switch (this.version) {
                    case 0: {
                      var _multihash = this.multihash,
                        code = _multihash.code,
                        digest$1 = _multihash.digest;

                      var multihash = digest.create(code, digest$1);
                      return CID.createV1(this.code, multihash);
                    }
                    case 1: {
                      return this;
                    }
                    default: {
                      throw Error(
                        "Can not convert CID version " +
                          this.version +
                          " to version 0. This is a bug please report"
                      );
                    }
                  }
                },
              },
              {
                key: "equals",
                value: function equals(other) {
                  return (
                    other &&
                    this.code === other.code &&
                    this.version === other.version &&
                    digest.equals(this.multihash, other.multihash)
                  );
                },
              },
              {
                key: "toString",
                value: function toString(base) {
                  var bytes = this.bytes,
                    version = this.version,
                    _baseCache = this._baseCache;

                  switch (version) {
                    case 0:
                      return toStringV0(
                        bytes,
                        _baseCache,
                        base || base58.base58btc.encoder
                      );
                    default:
                      return toStringV1(
                        bytes,
                        _baseCache,
                        base || base32.base32.encoder
                      );
                  }
                },
              },
              {
                key: "toJSON",
                value: function toJSON() {
                  return {
                    code: this.code,
                    version: this.version,
                    hash: this.multihash.bytes,
                  };
                },
              },
              {
                key: Symbol.for("nodejs.util.inspect.custom"),
                value: function value() {
                  return "CID(" + this.toString() + ")";
                },
              },
              {
                key: Symbol.toStringTag,
                get: function get() {
                  return "CID";
                },
              },
              {
                key: "toBaseEncodedString",
                get: function get() {
                  throw new Error("Deprecated, use .toString()");
                },
              },
              {
                key: "codec",
                get: function get() {
                  throw new Error(
                    '"codec" property is deprecated, use integer "code" property instead'
                  );
                },
              },
              {
                key: "buffer",
                get: function get() {
                  throw new Error(
                    "Deprecated .buffer property, use .bytes to get Uint8Array instead"
                  );
                },
              },
              {
                key: "multibaseName",
                get: function get() {
                  throw new Error('"multibaseName" property is deprecated');
                },
              },
              {
                key: "prefix",
                get: function get() {
                  throw new Error('"prefix" property is deprecated');
                },
              },
            ],
            [
              {
                key: "isCID",
                value: function isCID(value) {
                  deprecate(/^0\.0/, IS_CID_DEPRECATION);
                  return !!(
                    value &&
                    (value[cidSymbol] || value.asCID === value)
                  );
                },
              },
              {
                key: "asCID",
                value: function asCID(value) {
                  if (value instanceof CID) {
                    return value;
                  } else if (value != null && value.asCID === value) {
                    var _version = value.version,
                      code = value.code,
                      multihash = value.multihash,
                      _bytes = value.bytes;

                    return new CID(
                      _version,
                      code,
                      multihash,
                      _bytes || encodeCID(_version, code, multihash.bytes)
                    );
                  } else if (value != null && value[cidSymbol] === true) {
                    var _version2 = value.version,
                      _multihash2 = value.multihash,
                      _code = value.code;

                    var digest$1 = digest.decode(_multihash2);
                    return CID.create(_version2, _code, digest$1);
                  } else {
                    return null;
                  }
                },
              },
              {
                key: "create",
                value: function create(version, code, digest) {
                  if (typeof code !== "number") {
                    throw new Error("String codecs are no longer supported");
                  }
                  switch (version) {
                    case 0: {
                      if (code !== DAG_PB_CODE) {
                        throw new Error(
                          "Version 0 CID must use dag-pb (code: " +
                            DAG_PB_CODE +
                            ") block encoding"
                        );
                      } else {
                        return new CID(version, code, digest, digest.bytes);
                      }
                    }
                    case 1: {
                      var _bytes2 = encodeCID(version, code, digest.bytes);
                      return new CID(version, code, digest, _bytes2);
                    }
                    default: {
                      throw new Error("Invalid version");
                    }
                  }
                },
              },
              {
                key: "createV0",
                value: function createV0(digest) {
                  return CID.create(0, DAG_PB_CODE, digest);
                },
              },
              {
                key: "createV1",
                value: function createV1(code, digest) {
                  return CID.create(1, code, digest);
                },
              },
              {
                key: "decode",
                value: function decode(bytes) {
                  var _CID$decodeFirst = CID.decodeFirst(bytes),
                    _CID$decodeFirst2 = _slicedToArray(_CID$decodeFirst, 2),
                    cid = _CID$decodeFirst2[0],
                    remainder = _CID$decodeFirst2[1];

                  if (remainder.length) {
                    throw new Error("Incorrect length");
                  }
                  return cid;
                },
              },
              {
                key: "decodeFirst",
                value: function decodeFirst(bytes$1) {
                  var specs = CID.inspectBytes(bytes$1);
                  var prefixSize = specs.size - specs.multihashSize;
                  var multihashBytes = bytes.coerce(
                    bytes$1.subarray(
                      prefixSize,
                      prefixSize + specs.multihashSize
                    )
                  );
                  if (multihashBytes.byteLength !== specs.multihashSize) {
                    throw new Error("Incorrect length");
                  }
                  var digestBytes = multihashBytes.subarray(
                    specs.multihashSize - specs.digestSize
                  );
                  var digest$1 = new digest.Digest(
                    specs.multihashCode,
                    specs.digestSize,
                    digestBytes,
                    multihashBytes
                  );
                  var cid =
                    specs.version === 0
                      ? CID.createV0(digest$1)
                      : CID.createV1(specs.codec, digest$1);
                  return [cid, bytes$1.subarray(specs.size)];
                },
              },
              {
                key: "inspectBytes",
                value: function inspectBytes(initialBytes) {
                  var offset = 0;
                  var next = function next() {
                    var _varint$decode = varint.decode(
                        initialBytes.subarray(offset)
                      ),
                      _varint$decode2 = _slicedToArray(_varint$decode, 2),
                      i = _varint$decode2[0],
                      length = _varint$decode2[1];

                    offset += length;
                    return i;
                  };
                  var version = next();
                  var codec = DAG_PB_CODE;
                  if (version === 18) {
                    version = 0;
                    offset = 0;
                  } else if (version === 1) {
                    codec = next();
                  }
                  if (version !== 0 && version !== 1) {
                    throw new RangeError("Invalid CID version " + version);
                  }
                  var prefixSize = offset;
                  var multihashCode = next();
                  var digestSize = next();
                  var size = offset + digestSize;
                  var multihashSize = size - prefixSize;
                  return {
                    version: version,
                    codec: codec,
                    multihashCode: multihashCode,
                    digestSize: digestSize,
                    multihashSize: multihashSize,
                    size: size,
                  };
                },
              },
              {
                key: "parse",
                value: function parse(source, base) {
                  var _parseCIDtoBytes = parseCIDtoBytes(source, base),
                    _parseCIDtoBytes2 = _slicedToArray(_parseCIDtoBytes, 2),
                    prefix = _parseCIDtoBytes2[0],
                    bytes = _parseCIDtoBytes2[1];

                  var cid = CID.decode(bytes);
                  cid._baseCache.set(prefix, source);
                  return cid;
                },
              },
            ]
          );

          return CID;
        })();

        var parseCIDtoBytes = function parseCIDtoBytes(source, base) {
          switch (source[0]) {
            case "Q": {
              var decoder = base || base58.base58btc;
              return [
                base58.base58btc.prefix,
                decoder.decode("" + base58.base58btc.prefix + source),
              ];
            }
            case base58.base58btc.prefix: {
              var _decoder = base || base58.base58btc;
              return [base58.base58btc.prefix, _decoder.decode(source)];
            }
            case base32.base32.prefix: {
              var _decoder2 = base || base32.base32;
              return [base32.base32.prefix, _decoder2.decode(source)];
            }
            default: {
              if (base == null) {
                throw Error(
                  "To parse non base32 or base58btc encoded CID multibase decoder must be provided"
                );
              }
              return [source[0], base.decode(source)];
            }
          }
        };
        var toStringV0 = function toStringV0(bytes, cache, base) {
          var prefix = base.prefix;

          if (prefix !== base58.base58btc.prefix) {
            throw Error(
              "Cannot string encode V0 in " + base.name + " encoding"
            );
          }
          var cid = cache.get(prefix);
          if (cid == null) {
            var _cid = base.encode(bytes).slice(1);
            cache.set(prefix, _cid);
            return _cid;
          } else {
            return cid;
          }
        };
        var toStringV1 = function toStringV1(bytes, cache, base) {
          var prefix = base.prefix;

          var cid = cache.get(prefix);
          if (cid == null) {
            var _cid2 = base.encode(bytes);
            cache.set(prefix, _cid2);
            return _cid2;
          } else {
            return cid;
          }
        };
        var DAG_PB_CODE = 112;
        var SHA_256_CODE = 18;
        var encodeCID = function encodeCID(version, code, multihash) {
          var codeOffset = varint.encodingLength(version);
          var hashOffset = codeOffset + varint.encodingLength(code);
          var bytes = new Uint8Array(hashOffset + multihash.byteLength);
          varint.encodeTo(version, bytes, 0);
          varint.encodeTo(code, bytes, codeOffset);
          bytes.set(multihash, hashOffset);
          return bytes;
        };
        var cidSymbol = Symbol.for("@ipld/js-cid/CID");
        var readonly = {
          writable: false,
          configurable: false,
          enumerable: true,
        };
        var hidden = {
          writable: false,
          enumerable: false,
          configurable: false,
        };
        var version = "0.0.0-dev";
        var deprecate = function deprecate(range, message) {
          if (range.test(version)) {
            console.warn(message);
          } else {
            throw new Error(message);
          }
        };
        var IS_CID_DEPRECATION =
          "CID.isCID(v) is deprecated and will be removed in the next major release.\nFollowing code pattern:\n\nif (CID.isCID(value)) {\n  doSomethingWithCID(value)\n}\n\nIs replaced with:\n\nconst cid = CID.asCID(value)\nif (cid) {\n  // Make sure to use cid instead of value\n  doSomethingWithCID(cid)\n}\n";

        exports.CID = CID;

        /***/
      },
      /* 2 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });

        var varint$1 = __webpack_require__(3);

        var decode = function decode(data) {
          var code = varint$1.decode(data);
          return [code, varint$1.decode.bytes];
        };
        var encodeTo = function encodeTo(int, target) {
          var offset =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : 0;

          varint$1.encode(int, target, offset);
          return target;
        };
        var encodingLength = function encodingLength(int) {
          return varint$1.encodingLength(int);
        };

        exports.decode = decode;
        exports.encodeTo = encodeTo;
        exports.encodingLength = encodingLength;

        /***/
      },
      /* 3 */
      /***/ function (module, exports) {
        "use strict";

        var encode_1 = encode;
        var MSB = 128,
          REST = 127,
          MSBALL = ~REST,
          INT = Math.pow(2, 31);
        function encode(num, out, offset) {
          out = out || [];
          offset = offset || 0;
          var oldOffset = offset;
          while (num >= INT) {
            out[offset++] = (num & 255) | MSB;
            num /= 128;
          }
          while (num & MSBALL) {
            out[offset++] = (num & 255) | MSB;
            num >>>= 7;
          }
          out[offset] = num | 0;
          encode.bytes = offset - oldOffset + 1;
          return out;
        }
        var decode = read;
        var MSB$1 = 128,
          REST$1 = 127;
        function read(buf, offset) {
          var res = 0,
            offset = offset || 0,
            shift = 0,
            counter = offset,
            b,
            l = buf.length;
          do {
            if (counter >= l) {
              read.bytes = 0;
              throw new RangeError("Could not decode varint");
            }
            b = buf[counter++];
            res +=
              shift < 28
                ? (b & REST$1) << shift
                : (b & REST$1) * Math.pow(2, shift);
            shift += 7;
          } while (b >= MSB$1);
          read.bytes = counter - offset;
          return res;
        }
        var N1 = Math.pow(2, 7);
        var N2 = Math.pow(2, 14);
        var N3 = Math.pow(2, 21);
        var N4 = Math.pow(2, 28);
        var N5 = Math.pow(2, 35);
        var N6 = Math.pow(2, 42);
        var N7 = Math.pow(2, 49);
        var N8 = Math.pow(2, 56);
        var N9 = Math.pow(2, 63);
        var length = function (value) {
          return value < N1
            ? 1
            : value < N2
            ? 2
            : value < N3
            ? 3
            : value < N4
            ? 4
            : value < N5
            ? 5
            : value < N6
            ? 6
            : value < N7
            ? 7
            : value < N8
            ? 8
            : value < N9
            ? 9
            : 10;
        };
        var varint = {
          encode: encode_1,
          decode: decode,
          encodingLength: length,
        };
        var _brrp_varint = varint;
        var varint$1 = _brrp_varint;

        module.exports = varint$1;

        /***/
      },
      /* 4 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        var _slicedToArray = (function () {
          function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;
            try {
              for (
                var _i = arr[Symbol.iterator](), _s;
                !(_n = (_s = _i.next()).done);
                _n = true
              ) {
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
              }
            } catch (err) {
              _d = true;
              _e = err;
            } finally {
              try {
                if (!_n && _i["return"]) _i["return"]();
              } finally {
                if (_d) throw _e;
              }
            }
            return _arr;
          }
          return function (arr, i) {
            if (Array.isArray(arr)) {
              return arr;
            } else if (Symbol.iterator in Object(arr)) {
              return sliceIterator(arr, i);
            } else {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance"
              );
            }
          };
        })();

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        Object.defineProperty(exports, "__esModule", { value: true });

        var bytes = __webpack_require__(5);
        var varint = __webpack_require__(2);

        var create = function create(code, digest) {
          var size = digest.byteLength;
          var sizeOffset = varint.encodingLength(code);
          var digestOffset = sizeOffset + varint.encodingLength(size);
          var bytes = new Uint8Array(digestOffset + size);
          varint.encodeTo(code, bytes, 0);
          varint.encodeTo(size, bytes, sizeOffset);
          bytes.set(digest, digestOffset);
          return new Digest(code, size, digest, bytes);
        };
        var decode = function decode(multihash) {
          var bytes$1 = bytes.coerce(multihash);

          var _varint$decode = varint.decode(bytes$1),
            _varint$decode2 = _slicedToArray(_varint$decode, 2),
            code = _varint$decode2[0],
            sizeOffset = _varint$decode2[1];

          var _varint$decode3 = varint.decode(bytes$1.subarray(sizeOffset)),
            _varint$decode4 = _slicedToArray(_varint$decode3, 2),
            size = _varint$decode4[0],
            digestOffset = _varint$decode4[1];

          var digest = bytes$1.subarray(sizeOffset + digestOffset);
          if (digest.byteLength !== size) {
            throw new Error("Incorrect length");
          }
          return new Digest(code, size, digest, bytes$1);
        };
        var equals = function equals(a, b) {
          if (a === b) {
            return true;
          } else {
            return (
              a.code === b.code &&
              a.size === b.size &&
              bytes.equals(a.bytes, b.bytes)
            );
          }
        };

        var Digest = function Digest(code, size, digest, bytes) {
          _classCallCheck(this, Digest);

          this.code = code;
          this.size = size;
          this.digest = digest;
          this.bytes = bytes;
        };

        exports.Digest = Digest;
        exports.create = create;
        exports.decode = decode;
        exports.equals = equals;

        /***/
      },
      /* 5 */
      /***/ function (module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });

        var empty = new Uint8Array(0);
        var toHex = function toHex(d) {
          return d.reduce(function (hex, byte) {
            return hex + byte.toString(16).padStart(2, "0");
          }, "");
        };
        var fromHex = function fromHex(hex) {
          var hexes = hex.match(/../g);
          return hexes
            ? new Uint8Array(
                hexes.map(function (b) {
                  return parseInt(b, 16);
                })
              )
            : empty;
        };
        var equals = function equals(aa, bb) {
          if (aa === bb) return true;
          if (aa.byteLength !== bb.byteLength) {
            return false;
          }
          for (var ii = 0; ii < aa.byteLength; ii++) {
            if (aa[ii] !== bb[ii]) {
              return false;
            }
          }
          return true;
        };
        var coerce = function coerce(o) {
          if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
            return o;
          if (o instanceof ArrayBuffer) return new Uint8Array(o);
          if (ArrayBuffer.isView(o)) {
            return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
          }
          throw new Error("Unknown type, must be binary type");
        };
        var isBinary = function isBinary(o) {
          return o instanceof ArrayBuffer || ArrayBuffer.isView(o);
        };
        var fromString = function fromString(str) {
          return new TextEncoder().encode(str);
        };
        var toString = function toString(b) {
          return new TextDecoder().decode(b);
        };

        exports.coerce = coerce;
        exports.empty = empty;
        exports.equals = equals;
        exports.fromHex = fromHex;
        exports.fromString = fromString;
        exports.isBinary = isBinary;
        exports.toHex = toHex;
        exports.toString = toString;

        /***/
      },
      /* 6 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });

        var base = __webpack_require__(7);

        var base58btc = base.baseX({
          name: "base58btc",
          prefix: "z",
          alphabet:
            "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
        });
        var base58flickr = base.baseX({
          name: "base58flickr",
          prefix: "Z",
          alphabet:
            "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ",
        });

        exports.base58btc = base58btc;
        exports.base58flickr = base58flickr;

        /***/
      },
      /* 7 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        var _extends =
          Object.assign ||
          function (target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key];
                }
              }
            }
            return target;
          };

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();

        function _defineProperty(obj, key, value) {
          if (key in obj) {
            Object.defineProperty(obj, key, {
              value: value,
              enumerable: true,
              configurable: true,
              writable: true,
            });
          } else {
            obj[key] = value;
          }
          return obj;
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        Object.defineProperty(exports, "__esModule", { value: true });

        var baseX$1 = __webpack_require__(8);
        var bytes = __webpack_require__(5);

        var Encoder = (function () {
          function Encoder(name, prefix, baseEncode) {
            _classCallCheck(this, Encoder);

            this.name = name;
            this.prefix = prefix;
            this.baseEncode = baseEncode;
          }

          _createClass(Encoder, [
            {
              key: "encode",
              value: function encode(bytes) {
                if (bytes instanceof Uint8Array) {
                  return "" + this.prefix + this.baseEncode(bytes);
                } else {
                  throw Error("Unknown type, must be binary type");
                }
              },
            },
          ]);

          return Encoder;
        })();

        var Decoder = (function () {
          function Decoder(name, prefix, baseDecode) {
            _classCallCheck(this, Decoder);

            this.name = name;
            this.prefix = prefix;
            if (prefix.codePointAt(0) === undefined) {
              throw new Error("Invalid prefix character");
            }
            this.prefixCodePoint = prefix.codePointAt(0);
            this.baseDecode = baseDecode;
          }

          _createClass(Decoder, [
            {
              key: "decode",
              value: function decode(text) {
                if (typeof text === "string") {
                  if (text.codePointAt(0) !== this.prefixCodePoint) {
                    throw Error(
                      "Unable to decode multibase string " +
                        JSON.stringify(text) +
                        ", " +
                        this.name +
                        " decoder only supports inputs prefixed with " +
                        this.prefix
                    );
                  }
                  return this.baseDecode(text.slice(this.prefix.length));
                } else {
                  throw Error("Can only multibase decode strings");
                }
              },
            },
            {
              key: "or",
              value: function or(decoder) {
                return _or(this, decoder);
              },
            },
          ]);

          return Decoder;
        })();

        var ComposedDecoder = (function () {
          function ComposedDecoder(decoders) {
            _classCallCheck(this, ComposedDecoder);

            this.decoders = decoders;
          }

          _createClass(ComposedDecoder, [
            {
              key: "or",
              value: function or(decoder) {
                return _or(this, decoder);
              },
            },
            {
              key: "decode",
              value: function decode(input) {
                var prefix = input[0];
                var decoder = this.decoders[prefix];
                if (decoder) {
                  return decoder.decode(input);
                } else {
                  throw RangeError(
                    "Unable to decode multibase string " +
                      JSON.stringify(input) +
                      ", only inputs prefixed with " +
                      Object.keys(this.decoders) +
                      " are supported"
                  );
                }
              },
            },
          ]);

          return ComposedDecoder;
        })();

        var _or = function _or(left, right) {
          return new ComposedDecoder(
            _extends(
              {},
              left.decoders || _defineProperty({}, left.prefix, left),
              right.decoders || _defineProperty({}, right.prefix, right)
            )
          );
        };

        var Codec = (function () {
          function Codec(name, prefix, baseEncode, baseDecode) {
            _classCallCheck(this, Codec);

            this.name = name;
            this.prefix = prefix;
            this.baseEncode = baseEncode;
            this.baseDecode = baseDecode;
            this.encoder = new Encoder(name, prefix, baseEncode);
            this.decoder = new Decoder(name, prefix, baseDecode);
          }

          _createClass(Codec, [
            {
              key: "encode",
              value: function encode(input) {
                return this.encoder.encode(input);
              },
            },
            {
              key: "decode",
              value: function decode(input) {
                return this.decoder.decode(input);
              },
            },
          ]);

          return Codec;
        })();

        var from = function from(_ref3) {
          var name = _ref3.name,
            prefix = _ref3.prefix,
            encode = _ref3.encode,
            decode = _ref3.decode;
          return new Codec(name, prefix, encode, decode);
        };
        var baseX = function baseX(_ref4) {
          var prefix = _ref4.prefix,
            name = _ref4.name,
            alphabet = _ref4.alphabet;

          var _baseX$ = baseX$1(alphabet, name),
            encode = _baseX$.encode,
            _decode = _baseX$.decode;

          return from({
            prefix: prefix,
            name: name,
            encode: encode,
            decode: function decode(text) {
              return bytes.coerce(_decode(text));
            },
          });
        };
        var _decode2 = function _decode2(string, alphabet, bitsPerChar, name) {
          var codes = {};
          for (var i = 0; i < alphabet.length; ++i) {
            codes[alphabet[i]] = i;
          }
          var end = string.length;
          while (string[end - 1] === "=") {
            --end;
          }
          var out = new Uint8Array(((end * bitsPerChar) / 8) | 0);
          var bits = 0;
          var buffer = 0;
          var written = 0;
          for (var _i = 0; _i < end; ++_i) {
            var value = codes[string[_i]];
            if (value === undefined) {
              throw new SyntaxError("Non-" + name + " character");
            }
            buffer = (buffer << bitsPerChar) | value;
            bits += bitsPerChar;
            if (bits >= 8) {
              bits -= 8;
              out[written++] = 255 & (buffer >> bits);
            }
          }
          if (bits >= bitsPerChar || 255 & (buffer << (8 - bits))) {
            throw new SyntaxError("Unexpected end of data");
          }
          return out;
        };
        var _encode = function _encode(data, alphabet, bitsPerChar) {
          var pad = alphabet[alphabet.length - 1] === "=";
          var mask = (1 << bitsPerChar) - 1;
          var out = "";
          var bits = 0;
          var buffer = 0;
          for (var i = 0; i < data.length; ++i) {
            buffer = (buffer << 8) | data[i];
            bits += 8;
            while (bits > bitsPerChar) {
              bits -= bitsPerChar;
              out += alphabet[mask & (buffer >> bits)];
            }
          }
          if (bits) {
            out += alphabet[mask & (buffer << (bitsPerChar - bits))];
          }
          if (pad) {
            while ((out.length * bitsPerChar) & 7) {
              out += "=";
            }
          }
          return out;
        };
        var rfc4648 = function rfc4648(_ref5) {
          var name = _ref5.name,
            prefix = _ref5.prefix,
            bitsPerChar = _ref5.bitsPerChar,
            alphabet = _ref5.alphabet;

          return from({
            prefix: prefix,
            name: name,
            encode: function encode(input) {
              return _encode(input, alphabet, bitsPerChar);
            },
            decode: function decode(input) {
              return _decode2(input, alphabet, bitsPerChar, name);
            },
          });
        };

        exports.Codec = Codec;
        exports.baseX = baseX;
        exports.from = from;
        exports.or = _or;
        exports.rfc4648 = rfc4648;

        /***/
      },
      /* 8 */
      /***/ function (module, exports) {
        "use strict";

        function base(ALPHABET, name) {
          if (ALPHABET.length >= 255) {
            throw new TypeError("Alphabet too long");
          }
          var BASE_MAP = new Uint8Array(256);
          for (var j = 0; j < BASE_MAP.length; j++) {
            BASE_MAP[j] = 255;
          }
          for (var i = 0; i < ALPHABET.length; i++) {
            var x = ALPHABET.charAt(i);
            var xc = x.charCodeAt(0);
            if (BASE_MAP[xc] !== 255) {
              throw new TypeError(x + " is ambiguous");
            }
            BASE_MAP[xc] = i;
          }
          var BASE = ALPHABET.length;
          var LEADER = ALPHABET.charAt(0);
          var FACTOR = Math.log(BASE) / Math.log(256);
          var iFACTOR = Math.log(256) / Math.log(BASE);
          function encode(source) {
            if (source instanceof Uint8Array);
            else if (ArrayBuffer.isView(source)) {
              source = new Uint8Array(
                source.buffer,
                source.byteOffset,
                source.byteLength
              );
            } else if (Array.isArray(source)) {
              source = Uint8Array.from(source);
            }
            if (!(source instanceof Uint8Array)) {
              throw new TypeError("Expected Uint8Array");
            }
            if (source.length === 0) {
              return "";
            }
            var zeroes = 0;
            var length = 0;
            var pbegin = 0;
            var pend = source.length;
            while (pbegin !== pend && source[pbegin] === 0) {
              pbegin++;
              zeroes++;
            }
            var size = ((pend - pbegin) * iFACTOR + 1) >>> 0;
            var b58 = new Uint8Array(size);
            while (pbegin !== pend) {
              var carry = source[pbegin];
              var i = 0;
              for (
                var it1 = size - 1;
                (carry !== 0 || i < length) && it1 !== -1;
                it1--, i++
              ) {
                carry += (256 * b58[it1]) >>> 0;
                b58[it1] = carry % BASE >>> 0;
                carry = (carry / BASE) >>> 0;
              }
              if (carry !== 0) {
                throw new Error("Non-zero carry");
              }
              length = i;
              pbegin++;
            }
            var it2 = size - length;
            while (it2 !== size && b58[it2] === 0) {
              it2++;
            }
            var str = LEADER.repeat(zeroes);
            for (; it2 < size; ++it2) {
              str += ALPHABET.charAt(b58[it2]);
            }
            return str;
          }
          function decodeUnsafe(source) {
            if (typeof source !== "string") {
              throw new TypeError("Expected String");
            }
            if (source.length === 0) {
              return new Uint8Array();
            }
            var psz = 0;
            if (source[psz] === " ") {
              return;
            }
            var zeroes = 0;
            var length = 0;
            while (source[psz] === LEADER) {
              zeroes++;
              psz++;
            }
            var size = ((source.length - psz) * FACTOR + 1) >>> 0;
            var b256 = new Uint8Array(size);
            while (source[psz]) {
              var carry = BASE_MAP[source.charCodeAt(psz)];
              if (carry === 255) {
                return;
              }
              var i = 0;
              for (
                var it3 = size - 1;
                (carry !== 0 || i < length) && it3 !== -1;
                it3--, i++
              ) {
                carry += (BASE * b256[it3]) >>> 0;
                b256[it3] = carry % 256 >>> 0;
                carry = (carry / 256) >>> 0;
              }
              if (carry !== 0) {
                throw new Error("Non-zero carry");
              }
              length = i;
              psz++;
            }
            if (source[psz] === " ") {
              return;
            }
            var it4 = size - length;
            while (it4 !== size && b256[it4] === 0) {
              it4++;
            }
            var vch = new Uint8Array(zeroes + (size - it4));
            var j = zeroes;
            while (it4 !== size) {
              vch[j++] = b256[it4++];
            }
            return vch;
          }
          function decode(string) {
            var buffer = decodeUnsafe(string);
            if (buffer) {
              return buffer;
            }
            throw new Error(`Non-${name} character`);
          }
          return {
            encode: encode,
            decodeUnsafe: decodeUnsafe,
            decode: decode,
          };
        }
        var src = base;
        var _brrp__multiformats_scope_baseX = src;

        module.exports = _brrp__multiformats_scope_baseX;

        /***/
      },
      /* 9 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });

        var base = __webpack_require__(7);

        var base32 = base.rfc4648({
          prefix: "b",
          name: "base32",
          alphabet: "abcdefghijklmnopqrstuvwxyz234567",
          bitsPerChar: 5,
        });
        var base32upper = base.rfc4648({
          prefix: "B",
          name: "base32upper",
          alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
          bitsPerChar: 5,
        });
        var base32pad = base.rfc4648({
          prefix: "c",
          name: "base32pad",
          alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
          bitsPerChar: 5,
        });
        var base32padupper = base.rfc4648({
          prefix: "C",
          name: "base32padupper",
          alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
          bitsPerChar: 5,
        });
        var base32hex = base.rfc4648({
          prefix: "v",
          name: "base32hex",
          alphabet: "0123456789abcdefghijklmnopqrstuv",
          bitsPerChar: 5,
        });
        var base32hexupper = base.rfc4648({
          prefix: "V",
          name: "base32hexupper",
          alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
          bitsPerChar: 5,
        });
        var base32hexpad = base.rfc4648({
          prefix: "t",
          name: "base32hexpad",
          alphabet: "0123456789abcdefghijklmnopqrstuv=",
          bitsPerChar: 5,
        });
        var base32hexpadupper = base.rfc4648({
          prefix: "T",
          name: "base32hexpadupper",
          alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
          bitsPerChar: 5,
        });
        var base32z = base.rfc4648({
          prefix: "h",
          name: "base32z",
          alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
          bitsPerChar: 5,
        });

        exports.base32 = base32;
        exports.base32hex = base32hex;
        exports.base32hexpad = base32hexpad;
        exports.base32hexpadupper = base32hexpadupper;
        exports.base32hexupper = base32hexupper;
        exports.base32pad = base32pad;
        exports.base32padupper = base32padupper;
        exports.base32upper = base32upper;
        exports.base32z = base32z;

        /***/
      },
      /* 10 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });

        var base = __webpack_require__(7);

        var base16 = base.rfc4648({
          prefix: "f",
          name: "base16",
          alphabet: "0123456789abcdef",
          bitsPerChar: 4,
        });
        var base16upper = base.rfc4648({
          prefix: "F",
          name: "base16upper",
          alphabet: "0123456789ABCDEF",
          bitsPerChar: 4,
        });

        exports.base16 = base16;
        exports.base16upper = base16upper;

        /***/
      },
      /* 11 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        Object.defineProperty(exports, "__esModule", { value: true });

        var _digest = __webpack_require__(4);

        var from = function from(_ref) {
          var name = _ref.name,
            code = _ref.code,
            encode = _ref.encode;
          return new Hasher(name, code, encode);
        };

        var Hasher = (function () {
          function Hasher(name, code, encode) {
            _classCallCheck(this, Hasher);

            this.name = name;
            this.code = code;
            this.encode = encode;
          }

          _createClass(Hasher, [
            {
              key: "digest",
              value: function digest(input) {
                var _this = this;

                if (input instanceof Uint8Array) {
                  var result = this.encode(input);
                  return result instanceof Uint8Array
                    ? _digest.create(this.code, result)
                    : result.then(function (digest$1) {
                        return _digest.create(_this.code, digest$1);
                      });
                } else {
                  throw Error("Unknown type, must be binary type");
                }
              },
            },
          ]);

          return Hasher;
        })();

        exports.Hasher = Hasher;
        exports.from = from;

        /***/
      },
      /******/
    ]
  );
});
//# sourceMappingURL=index.umd.js.map
