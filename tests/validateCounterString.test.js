const { validateCounterString } = require('../src/validateCounterString');

describe('validateCounterString', () => {
    test('throws error for empty string input', () => {
        expect(() => validateCounterString('')).toThrow('Input must be a non-empty string');
    });

    test('throws error for null input', () => {
        expect(() => validateCounterString(null)).toThrow('Input must be a non-empty string');
    });

    test('throws error for undefined input', () => {
        expect(() => validateCounterString(undefined)).toThrow('Input must be a non-empty string');
    });

    test('throws error for number input', () => {
        expect(() => validateCounterString(123)).toThrow('Input must be a non-empty string');
    });

    test('throws error for no asterisk markers', () => {
        expect(() => validateCounterString('abc')).toThrow('Invalid counterstring: No asterisk marker found');
    });



    test('throws error for duplicate position', () => {
        expect(() => validateCounterString('*3*3*')).toThrow('Invalid counterstring: Asterisk at index 4 but position is 3');
    });

    test('throws error for asterisk not at correct position', () => {
        expect(() => validateCounterString('*4*')).toThrow('Invalid counterstring: Asterisk at index 2 but position is 4');
    });

    test('returns true for valid single position "*" (length 1)', () => {
        expect(validateCounterString('*')).toBe(true);
    });

    test('returns true for valid counterstring "*3*" (length 3)', () => {
        expect(validateCounterString('*3*')).toBe(true);
    });

    test('returns true for valid counterstring "2*" (length 2)', () => {
        expect(validateCounterString('2*')).toBe(true);
    });

    test('returns true for valid counterstring with multiple positions', () => {
        expect(validateCounterString('*3*5*7*')).toBe(true);
    });

    test('returns true for valid counterstring starting from position 2', () => {
        expect(validateCounterString('2*4*6*8*')).toBe(true);
    });

    test('returns true for valid counterstring with multiple ranges', () => {
        expect(validateCounterString('*3*5*7*9*12*15*18*21*24*27*30*33*36*39*42*45*48*51*54*57*60*63*66*69*72*75*78*81*84*87*90*93*96*99*103*107*111*115*119*123*127*131*135*139*143*147*151*155*159*163*167*171*175*179*183*187*191*195*199*203*207*211*215*219*223*227*231*235*239*243*247*251*255*259*263*267*271*275*279*283*287*291*295*299*303*307*311*315*319*323*327*331*335*339*343*347*351*355*359*363*367*371*375*379*383*387*391*395*399*403*407*411*415*419*423*427*431*435*439*443*447*451*455*459*463*467*471*475*479*483*487*491*495*499*503*507*511*515*519*523*527*531*535*539*543*547*551*555*559*563*567*571*575*579*583*587*591*595*599*603*607*611*615*619*623*627*631*635*639*643*647*651*655*659*663*667*671*675*679*683*687*691*695*699*703*707*711*715*719*723*727*731*735*739*743*747*751*755*759*763*767*771*775*779*783*787*791*795*799*803*807*811*815*819*823*827*831*835*839*843*847*851*855*859*863*867*871*875*879*883*887*891*895*899*903*907*911*915*919*923*927*931*935*939*943*947*951*955*959*963*967*971*975*979*983*987*991*995*999*')).toBe(true);
    });
});