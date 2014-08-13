/**
 * Created by andrey on 27.04.14.
 */
describe('Calculator', function(){
   it('should return numbers', function(){
        expect(Calculator.add(5)).toEqual(5);
        expect(Calculator.add(7)).toEqual(12);
   });
});
