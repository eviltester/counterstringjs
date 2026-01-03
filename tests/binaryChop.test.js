const BinaryChopifier = require('../extension/js/binaryChop');

describe('BinaryChopifier', () => {
    describe('Basic Functionality', () => {
        test('chop from 1024 to 2048 generates correct chop points', () => {
            const binaryChopper = new BinaryChopifier();
            const binaryChop = binaryChopper.chop(1024, 2048);
            
            expect(binaryChop.getStart()).toBe(1024);
            expect(binaryChop.getEnd()).toBe(2048);
            expect(binaryChop.countChopPoints()).toBe(11);
            
            expect(binaryChop.getChopPoint(1)).toBe(1536);
            expect(binaryChop.getChopPoint(2)).toBe(1792);
            expect(binaryChop.getChopPoint(3)).toBe(1920);
            expect(binaryChop.getChopPoint(4)).toBe(1984);
            expect(binaryChop.getChopPoint(5)).toBe(2016);
            expect(binaryChop.getChopPoint(6)).toBe(2032);
            expect(binaryChop.getChopPoint(7)).toBe(2040);
            expect(binaryChop.getChopPoint(8)).toBe(2044);
            expect(binaryChop.getChopPoint(9)).toBe(2046);
            expect(binaryChop.getChopPoint(10)).toBe(2047);
            expect(binaryChop.getChopPoint(11)).toBe(2048);
            
            expect(binaryChop.getChopPointDiff(1)).toBe(512);
            expect(binaryChop.getChopPointDiff(2)).toBe(256);
            expect(binaryChop.getChopPointDiff(3)).toBe(128);
            expect(binaryChop.getChopPointDiff(4)).toBe(64);
            expect(binaryChop.getChopPointDiff(5)).toBe(32);
            expect(binaryChop.getChopPointDiff(6)).toBe(16);
            expect(binaryChop.getChopPointDiff(7)).toBe(8);
            expect(binaryChop.getChopPointDiff(8)).toBe(4);
            expect(binaryChop.getChopPointDiff(9)).toBe(2);
            expect(binaryChop.getChopPointDiff(10)).toBe(1);
            expect(binaryChop.getChopPointDiff(11)).toBe(0);
        });
        
        test('chop with same start and end returns single chop point', () => {
            const binaryChopper = new BinaryChopifier();
            const binaryChop = binaryChopper.chop(100, 100);
            
            expect(binaryChop.getStart()).toBe(100);
            expect(binaryChop.getEnd()).toBe(100);
            expect(binaryChop.countChopPoints()).toBe(1);
            expect(binaryChop.getChopPoint(1)).toBe(100);
            expect(binaryChop.getChopPointDiff(1)).toBe(0);
        });
        
        test('chop from 0 to 10 generates correct chop points', () => {
            const binaryChopper = new BinaryChopifier();
            const binaryChop = binaryChopper.chop(0, 10);
            
            expect(binaryChop.getStart()).toBe(0);
            expect(binaryChop.getEnd()).toBe(10);
            expect(binaryChop.countChopPoints()).toBe(4);
            expect(binaryChop.getChopPoint(1)).toBe(5);
            expect(binaryChop.getChopPoint(2)).toBe(8);
            expect(binaryChop.getChopPoint(3)).toBe(9);
            expect(binaryChop.getChopPoint(4)).toBe(10);
            expect(binaryChop.getChopPointDiff(1)).toBe(5);
            expect(binaryChop.getChopPointDiff(2)).toBe(2);
            expect(binaryChop.getChopPointDiff(3)).toBe(1);
            expect(binaryChop.getChopPointDiff(4)).toBe(0);
        });
    });
    
    describe('Edge Cases', () => {
        test('chop from 0 to 1', () => {
            const binaryChopper = new BinaryChopifier();
            const binaryChop = binaryChopper.chop(0, 1);
            expect(binaryChop.countChopPoints()).toBe(1);
            expect(binaryChop.getChopPoint(1)).toBe(1);
            expect(binaryChop.getChopPointDiff(1)).toBe(0);
        });
        
        test('throws error when start > end', () => {
            const binaryChopper = new BinaryChopifier();
            expect(() => binaryChopper.chop(2048, 1024))
                .toThrow('start must be less than or equal to end');
        });
        
        test('throws error for negative start', () => {
            const binaryChopper = new BinaryChopifier();
            expect(() => binaryChopper.chop(-1, 100))
                .toThrow('start and end must be non-negative integers');
        });
        
        test('throws error for negative end', () => {
            const binaryChopper = new BinaryChopifier();
            expect(() => binaryChopper.chop(1, -100))
                .toThrow('start and end must be non-negative integers');
        });
        
        test('throws error for non-integer start', () => {
            const binaryChopper = new BinaryChopifier();
            expect(() => binaryChopper.chop(102.5, 2048))
                .toThrow('start and end must be integers');
        });
        
        test('throws error for non-integer end', () => {
            const binaryChopper = new BinaryChopifier();
            expect(() => binaryChopper.chop(1024, 2048.5))
                .toThrow('start and end must be integers');
        });
        
        test('handles large ranges', () => {
            const binaryChopper = new BinaryChopifier();
            const binaryChop = binaryChopper.chop(0, 10000);
            expect(binaryChop.countChopPoints()).toBe(14);
        });
        
        test('handles zero start with positive end', () => {
            const binaryChopper = new BinaryChopifier();
            const binaryChop = binaryChopper.chop(0, 5);
            expect(binaryChop.getStart()).toBe(0);
            expect(binaryChop.getEnd()).toBe(5);
            expect(binaryChop.getChopPoint(1)).toBe(3);
        });
    });
});
