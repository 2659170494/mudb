import test = require('tape');
import {
    MuBoolean,
    MuUTF8,
    MuFloat32,
    MuArray,
    MuSortedArray,
    MuStruct,
    MuUnion,
    MuBytes,
    MuDictionary,
    MuVector,
    MuDate,
    MuJSON,
    MuSchema,
} from '../index';

test('primitive.assign()', (t) => {
    const bool = new MuBoolean();
    t.equal(bool.assign(true, true), true);
    t.equal(bool.assign(true, false), false);
    t.equal(bool.assign(false, true), true);
    t.equal(bool.assign(false, false), false);

    const float32 = new MuFloat32();
    t.equal(float32.assign(1, 2), 2);
    t.end();
});

test('array.assign()', (t) => {
    const array = new MuArray(new MuFloat32(), Infinity);
    const aSrc = array.alloc();
    const aDst = array.alloc();
    aSrc.push(0);
    t.is(array.assign(aDst, aSrc), aDst);
    t.deepEqual(aDst, [0]);
    aSrc.push(0.5);
    array.assign(aDst, aSrc);
    t.deepEqual(aDst, [0, 0.5]);
    aDst.push(1);
    array.assign(aDst, aSrc);
    t.deepEqual(aDst, [0, 0.5]);

    const nestedArray = new MuArray(
        new MuArray(new MuFloat32(), Infinity),
        Infinity,
    );
    const naSrc = nestedArray.alloc();
    const naDst = nestedArray.alloc();
    naSrc.push([]);
    t.is(nestedArray.assign(naDst, naSrc), naDst);
    t.deepEqual(naDst, [[]]);
    t.isNot(naDst[0], naSrc[0]);
    naSrc.push([0, 0.5]);
    nestedArray.assign(naDst, naSrc);
    t.deepEqual(naDst, [[], [0, 0.5]]);
    t.isNot(naDst[1], naSrc[1]);
    t.end();
});

test('sortedArray.assign()', (t) => {
    const array = new MuSortedArray(new MuFloat32(), Infinity);
    const aSrc = array.alloc();
    const aDst = array.alloc();
    aSrc.push(0);
    t.is(array.assign(aDst, aSrc), aDst);
    t.deepEqual(aDst, [0]);
    aSrc.push(0.5);
    array.assign(aDst, aSrc);
    t.deepEqual(aDst, [0, 0.5]);
    aDst.push(1);
    array.assign(aDst, aSrc);
    t.deepEqual(aDst, [0, 0.5]);

    const nestedArray = new MuSortedArray(
        new MuSortedArray(new MuFloat32(), Infinity),
        Infinity,
    );
    const naSrc = nestedArray.alloc();
    const naDst = nestedArray.alloc();
    naSrc.push([]);
    t.is(nestedArray.assign(naDst, naSrc), naDst);
    t.deepEqual(naDst, [[]]);
    t.isNot(naDst[0], naSrc[0]);
    naSrc.push([0, 0.5]);
    nestedArray.assign(naDst, naSrc);
    t.deepEqual(naDst, [[], [0, 0.5]]);
    t.isNot(naDst[1], naSrc[1]);
    t.end();
});

test('struct.assign()', (t) => {
    const struct = new MuStruct({
        f: new MuFloat32(),
    });
    const sSrc = struct.alloc();
    const sDst = struct.alloc();
    sSrc.f = 0.5;
    t.is(struct.assign(sDst, sSrc), sDst);
    t.deepEqual(sDst, sSrc);

    const nestedStruct = new MuStruct({
        s: new MuStruct({
            f: new MuFloat32(),
        }),
    });
    const nsSrc = nestedStruct.alloc();
    const nsDst = nestedStruct.alloc();
    nsSrc.s.f = 0.5;
    t.is(nestedStruct.assign(nsDst, nsSrc), nsDst);
    t.deepEqual(nsDst, nsSrc);
    t.isNot(nsDst.s, nsSrc.s);
    t.end();
});

test('union.assign()', (t) => {
    const stringOrFloat = new MuUnion({
        u: new MuUTF8(),
        f: new MuFloat32(),
    });
    const src = stringOrFloat.alloc();
    const dst = stringOrFloat.alloc();
    src.type = 'u';
    src.data = 'Iñtërnâtiônàlizætiøn☃💩';
    t.is(stringOrFloat.assign(dst, src), dst);
    t.deepEqual(dst, {type: 'u', data: 'Iñtërnâtiônàlizætiøn☃💩'});

    dst.data = 'Internationalization';
    stringOrFloat.assign(dst, src);
    t.deepEqual(dst, {type: 'u', data: 'Iñtërnâtiônàlizætiøn☃💩'});

    src.type = 'f';
    src.data = 0.5;
    stringOrFloat.assign(dst, src);
    t.deepEqual(dst, {type: 'f', data: 0.5});
    stringOrFloat.assign(dst, stringOrFloat.alloc());
    t.deepEqual(dst, stringOrFloat.alloc());

    const union = new MuUnion({
        us: new MuStruct({
            u: new MuUTF8(),
        }),
        fs: new MuStruct({
            f: new MuFloat32(),
        }),
    }, 'us');
    const uSrc = union.alloc();
    const uDst = union.alloc();
    uSrc.type = 'fs';
    uSrc.data = union.muData.fs.alloc();
    t.is(union.assign(uDst, uSrc), uDst);
    t.deepEqual(uDst, {type: 'fs', data: {f: 0}});
    t.isNot(uDst.data, uSrc.data);
    t.end();
});

test('bytes.assign()', (t) => {
    const bytes = new MuBytes();
    const src = new Uint8Array(3);
    const dst = new Uint8Array(3);
    src[1] = 1;
    src[2] = 255;
    t.is(bytes.assign(dst, src), dst);
    t.deepEqual(dst, new Uint8Array([0, 1, 255]));
    t.end();
});

test('dictionary.assign()', (t) => {
    const dictionary = new MuDictionary(new MuFloat32(), Infinity);
    const dSrc = dictionary.alloc();
    const dDst = dictionary.alloc();
    dSrc.a = 0.5;
    t.is(dictionary.assign(dDst, dSrc), dDst);
    t.deepEqual(dDst, {a: 0.5});

    dSrc.b = 1.5;
    dictionary.assign(dDst, dSrc);
    t.deepEqual(dDst, {a: 0.5, b: 1.5});

    dDst.c = 1;
    dictionary.assign(dDst, dSrc);
    t.deepEqual(dDst, {a: 0.5, b: 1.5});

    const nestedDictionary = new MuDictionary(
        new MuDictionary(new MuFloat32(), Infinity),
        Infinity,
    );
    const ndSrc = nestedDictionary.alloc();
    const ndDst = nestedDictionary.alloc();
    ndSrc.a = {};
    t.is(nestedDictionary.assign(ndDst, ndSrc), ndDst);
    t.deepEqual(ndDst, {a: {}});
    t.isNot(ndDst.a, ndSrc.a);

    ndSrc.b = {c: 0.5, d: 1.5};
    nestedDictionary.assign(ndDst, ndSrc);
    t.deepEqual(ndDst, {a: {}, b: {c: 0.5, d: 1.5}});

    ndDst.c = {e: 2.5};
    nestedDictionary.assign(ndDst, ndSrc);
    t.deepEqual(ndDst, {a: {}, b: {c: 0.5, d: 1.5}});
    t.end();
});

test('vector.assign()', (t) => {
    const vector = new MuVector(new MuFloat32(), 2);
    const src = vector.alloc();
    const dst = vector.alloc();
    src[0] = 0.5;
    src[1] = 1.5;
    t.is(vector.assign(dst, src), dst);
    t.deepEqual(dst, new Float32Array([0.5, 1.5]));
    t.end();
});

test('date.assign()', (t) => {
    const date = new MuDate();
    const src = date.alloc();
    const dst = date.alloc();
    dst.setTime(0);
    t.is(date.assign(dst, src), dst);
    t.deepEqual(dst, src);
    t.end();
});

test('json.assign', (t) => {
    const json = new MuJSON();
    const o = {a: 0, b: 1};
    const p = {a: {b: {c: [0]}}};
    t.is(json.assign(o, p), o);
    t.deepEqual(o, {a: {b: {c: [0]}}});
    t.isNot(o.a, p.a);

    const q = [0, 1, 2];
    const r = [{}, {}];
    t.is(json.assign(q, r), q);
    t.deepEqual(q, [{}, {}]);
    t.isNot(q[0], r[0]);
    t.end();
});

class MuMaybe<T> implements MuSchema<T|null> {
    public muType = 'maybe';
    public identity:T|null = null;
    public muData = { type: 'maybe' };
    public json = { type: 'maybe' };

    constructor () { }

    public alloc () : T|null { return null; }
    public assign (dst:T|null, src:T|null) : T|null { return src; }

    public free () { }
    public clone () { return null; }
    public equal () { return false; }
    public diff () { return false; }
    public patch () { return null; }
    public toJSON () { }
    public fromJSON () { return null; }
}

test('when dst is not reference', (t) => {
    const Human = new MuStruct({
        name: new MuUTF8(),
        power: new MuMaybe<{
            name:string,
            description:string,
        }>(),
    });

    const mortal = Human.alloc();
    mortal.name = 'Logan';
    const mutant = Human.alloc();
    mutant.name = 'Wolverine';
    mutant.power = {
        name: 'regenerative healing factor',
        description: 'ability to regenerate damaged tissue insanely fast',
    };
    Human.assign(mortal, mutant);
    t.deepEqual(mortal, mutant);
    t.equal(mortal.power, mutant.power);

    t.end();
});
