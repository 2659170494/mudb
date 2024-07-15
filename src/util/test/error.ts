import * as test from 'tape';
import { makeError } from '../error';

test('makeError()(string)', (t) => {
    const path = 'util/test/error';
    const msg = 'contrived error';
    const error = makeError(path);

    try {
        throw error(msg);
    } catch (e) {
        let error = e as Error;
        t.equal(error.toString(), `Error: ${msg} [mudb/${path}]`, error.toString());
        t.end();
    }
});

test('makeError()(Error)', (t) => {
    const path = 'util/test/error';
    const msg = 'contrived error';
    const error = makeError(path);

    try {
        throw error(new Error(msg));
    } catch (e) {
        let error = e as Error;
        t.equal(error.toString(), `Error: Error: ${msg} [mudb/${path}]`, error.toString());
        t.end();
    }
});

test('makeError()(SyntaxError)', (t) => {
    const path = 'util/test/error';
    const error = makeError(path);

    try {
        JSON.parse('');
    } catch (e) {
        t.true(/^Error: SyntaxError: /.test(error(String(e)).toString()), error(String(e)).toString());
        t.end();
    }
});
