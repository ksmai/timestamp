'USE STRICT';
describe('timestamp directive', function() {
  var input1, input2, output1, output2;
  var injector, element, scope;

  beforeEach(function() {
    injector = angular.injector(['timestamp', 'ng']);
    injector.invoke(function($rootScope, $compile) {
      scope = $rootScope.$new();
      element = $compile('<timestamp></timestamp>')(scope);
      scope.$apply();
    });
    input1 = element.find('input[type="text"]').eq(0);
    input2 = element.find('input[type="text"]').eq(1);
    output1 = element.find('.panel-footer').eq(0);
    output2 = element.find('.panel-footer').eq(1);
  });

  it('displays output string for valid date/time input', function(done) {
    scope.$on('timestampCtrl', function() {
      input1.val('123456').trigger('change');
      assert.ok( input1);
      assert.isOk( output1.text().trim() );
      input2.val('22 June 2016').trigger('change');
      assert.isOk( output2.text().trim() );
      done();
    });
  });

  it('displays nothing for invalid date/time input', function(done) {
    scope.$on('timestampCtrl', function() {
      done();
    });
  });

  it('displays the difference section only when both outputs are'
      + 'available', function(done) {
        var inputs = ['123', '456', '22-06-17', 'Feb 4, 1999',
                      'hello', 'world', '234-456-0012(3)'];
        scope.$on('timestampCtrl', function() {
          done();
        });
  });

});
