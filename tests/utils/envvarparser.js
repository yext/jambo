const { EnvironmentVariableParser } = require('../../src/utils/envvarparser');

describe('EnvironmentVariableParser works correctly', () => {
    const var1 = {
        foo: {
            bar: 'a string'
        },
        baz: 'a string'
    };
    const var2 = 'a string';
    const envVarsParser = 
        new EnvironmentVariableParser( { var2, var1: JSON.stringify(var1) });

    it('deserializes environment variables correctly', () => {
        expect(envVarsParser.parse(['var1'])).toEqual({ var1, var2 });
    });

    it('silently ignores non-existent JSON environment variables', () => {
        expect(envVarsParser.parse(['var1', 'var3'])).toEqual({ var1, var2 });
    })

    it('fails when cannot deserialize JSON enviornment variable', () => {
        expect(() => envVarsParser.parse(['var1', 'var2'])).toThrow();
    })
});