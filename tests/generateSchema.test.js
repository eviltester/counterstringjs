const generateSchemaForCounterString = require('../src/generateSchema');
const forwardCounterString = require('../src/forwardCounterString');

describe('generateSchemaForCounterString', () => {

  test('generates schema for length 0 as empty array', () => {
    const schema = generateSchemaForCounterString(0);
    expect(schema.length).toBe(0);
    const result = forwardCounterString(schema);
    expect(result.length).toBe(0);
  });

  test('generates schema for length 1', () => {
    const schema = generateSchemaForCounterString(1);
    expect(schema.length).toBe(1);
    expect(schema[0]).toEqual({startNumber:1, endNumber:1, increment:2});
    const result = forwardCounterString(schema);
    expect(result).toBe("*");
  });

  test('generates schema for length 2', () => {
    const schema = generateSchemaForCounterString(2);
    expect(schema.length).toBe(1);
    expect(schema[0]).toEqual({startNumber:2, endNumber:2, increment:2});
    const result = forwardCounterString(schema);
    expect(result).toBe("2*");
  });

  test('generates schema for length 3', () => {
    const schema = generateSchemaForCounterString(3);
    expect(schema.length).toBe(1);
    expect(schema[0]).toEqual({startNumber:1, endNumber:3, increment:2});
    const result = forwardCounterString(schema);
    expect(result).toBe("*3*");
  });

  test('generates schema for length 4', () => {
    const schema = generateSchemaForCounterString(4);
    expect(schema.length).toBe(1);
    expect(schema[0]).toEqual({startNumber:2, endNumber:4, increment:2});
    const result = forwardCounterString(schema);
    expect(result).toBe("2*4*");
  });

  test('generates schema for length 5', () => {
    const schema = generateSchemaForCounterString(5);
    expect(schema.length).toBe(1);
    expect(schema[0]).toEqual({startNumber:1, endNumber:5, increment:2});
    const result = forwardCounterString(schema);
    expect(result).toBe("*3*5*");
  });

  test('generates schema for length 10', () => {
    const schema = generateSchemaForCounterString(10);
    expect(schema.length).toBe(2);
    expect(schema[0]).toEqual({startNumber:1, endNumber:7, increment:2});
    expect(schema[1]).toEqual({startNumber:10, endNumber:10, increment:3});
    const result = forwardCounterString(schema);
    expect(result.length).toBe(10);
  });

  test('generates schema for length 17', () => {
    const schema = generateSchemaForCounterString(17);
    expect(schema.length).toBe(2);
    expect(schema[0]).toEqual({startNumber:2, endNumber:8, increment:2});
    expect(schema[1]).toEqual({startNumber:11, endNumber:17, increment:3});
    const result = forwardCounterString(schema);
    expect(result.length).toBe(17);
  });

  test('generates schema for length 99', () => {
    const schema = generateSchemaForCounterString(99);
    expect(schema.length).toBe(2);
    expect(schema[0]).toEqual({startNumber:1, endNumber:9, increment:2});
    expect(schema[1]).toEqual({startNumber:12, endNumber:99, increment:3});
    const result = forwardCounterString(schema);
    expect(result.length).toBe(99);
  });

   test('generates schema for length 100', () => {
    const schema = generateSchemaForCounterString(100);
    expect(schema.length).toBe(3);
    expect(schema[0]).toEqual({startNumber:1, endNumber:9, increment:2});
    expect(schema[1]).toEqual({startNumber:12, endNumber:96, increment:3});
    expect(schema[2]).toEqual({startNumber:100, endNumber:100, increment:4});
    const result = forwardCounterString(schema);
    expect(result.length).toBe(100);
  });

  test('generates schema for length 1000', () => {
    const schema = generateSchemaForCounterString(1000);
    expect(schema.length).toBe(4);
    expect(schema[0]).toEqual({startNumber:1, endNumber:9, increment:2});
    expect(schema[1]).toEqual({startNumber:12, endNumber:99, increment:3});
    expect(schema[2]).toEqual({startNumber:103, endNumber:995, increment:4});
    expect(schema[3]).toEqual({startNumber:1000, endNumber:1000, increment:5});
    const result = forwardCounterString(schema);
    expect(result.length).toBe(1000);
    expect(result).toBe("*3*5*7*9*12*15*18*21*24*27*30*33*36*39*42*45*48*51*54*57*60*63*66*69*72*75*78*81*84*87*90*93*96*99*103*107*111*115*119*123*127*131*135*139*143*147*151*155*159*163*167*171*175*179*183*187*191*195*199*203*207*211*215*219*223*227*231*235*239*243*247*251*255*259*263*267*271*275*279*283*287*291*295*299*303*307*311*315*319*323*327*331*335*339*343*347*351*355*359*363*367*371*375*379*383*387*391*395*399*403*407*411*415*419*423*427*431*435*439*443*447*451*455*459*463*467*471*475*479*483*487*491*495*499*503*507*511*515*519*523*527*531*535*539*543*547*551*555*559*563*567*571*575*579*583*587*591*595*599*603*607*611*615*619*623*627*631*635*639*643*647*651*655*659*663*667*671*675*679*683*687*691*695*699*703*707*711*715*719*723*727*731*735*739*743*747*751*755*759*763*767*771*775*779*783*787*791*795*799*803*807*811*815*819*823*827*831*835*839*843*847*851*855*859*863*867*871*875*879*883*887*891*895*899*903*907*911*915*919*923*927*931*935*939*943*947*951*955*959*963*967*971*975*979*983*987*991*995*1000*")
  });

  test('generates schema for length 100000', () => {
    const schema = generateSchemaForCounterString(100000);
    const result = forwardCounterString(schema);
    expect(result.length).toBe(100000);
  });

  test('generates schema for length 1000000', () => {
    const schema = generateSchemaForCounterString(1000000);
    const result = forwardCounterString(schema);
    expect(result.length).toBe(1000000);
  });
});