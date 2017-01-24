'USE STRICT';
describe('timestamp directive', function() {
  var inputEles, outputEles;
  var injector, element, scope;

  beforeEach(function() {
    injector = angular.injector(['timestamp']);
    injector.invoke(function($rootScope, $compile) {
      scope = $rootScope.$new();
      element = $compile('<timestamp></timestamp>')(scope);
      scope.$apply();
    });
  });

  it('displays output string for valid date/time input', function(done) {
    scope.$on('timestampCtrl', function() {
      inputEles = element.find('input[type="text"]')
                         .toArray()
                         .map( el => $(el) );
      outputEles = element.find('.panel-footer')
                          .toArray()
                          .map( el => $(el) );
      outputEles.forEach( el => assert.isNotOk( el.text().trim() ) );
      inputEles.forEach( el => assert.isNotOk( el.val().trim() ) )
      var inputs = ['12 June 2007', '1993-11-11', 'Oct 1st, 1949',
                    'today', '1/2/2000 3:42:42 pm'];
      for(let input of inputs) {
        inputEles.forEach( el => el.val(input).trigger('input') );
        outputEles.forEach( el => assert.isOk( el.text().trim() ) );
      }
      done();
    });
  });

  it('displays empty output for invalid date/time input', function(done) {
    scope.$on('timestampCtrl', function() {
      inputEles = element.find('input[type="text"]')
                         .toArray()
                         .map( el => $(el) );
      outputEles = element.find('.panel-footer')
                          .toArray()
                          .map( el => $(el) );
      var inputs = ['12+42=420', '192.168.0.1', 'http://google.com',
                    'yahoo@google.com', 'Hello world'];
      for(let input of inputs) {
        inputEles.forEach( el => el.val(input).trigger('input') );
        outputEles.forEach( el => assert.isNotOk( el.text().trim() ) );
      }
      done();
    });
  });

  it('displays different outputs when "local" is checked', function(done) {
    scope.$on('timestampCtrl', function() {
      inputEles = element.find('input[type="text"]')
                         .toArray()
                         .map( el => $(el) );
      outputEles = element.find('.panel-footer')
                          .toArray()
                          .map( el => $(el) );
      var localCheckboxes = element.find('.input-group-addon')
                                   .find('input[type="checkbox"]')
                                   .toArray()
                                   .map( el => $(el) );
      inputEles.forEach( el => el.val('24/1/2017 15:27').trigger('input') );
      assert.equal( outputEles.length, localCheckboxes.length );
      outputEles.forEach( function(el, idx) {
        var result = el.text().trim();
        var box = localCheckboxes[idx];
        assert.isOk( box.prop('checked') );
        box.trigger('click');
        assert.isNotOk( box.prop('checked') );
        assert.notEqual( result, el.text().trim() );
      });
      done();
    });
  });

  it('displays "Difference" section only with both outputs present',
       function(done) {
         scope.$on('timestampCtrl', function() {
           inputEles = element.find('input[type="text"]')
                              .toArray()
                              .map(el => $(el));
           outputEles = element.find('.panel-footer')
                               .toArray()
                               .map(el => $(el));
           var diffEle = element
                       .find('.panel-heading:contains("Difference")')
                       .parent().parent();
           assert.isOk( diffEle.hasClass('ng-hide') );

           var inputs = [ ['17-1-2016', 'now'],
                          ['invalid', '17-1-2016'],
                          ['17-1-2016', 'invalid'],
                          ['invalid1', 'invalid2'] ];
           for(let inputPair of inputs) {
             assert.equal(inputPair.length, inputEles.length);
             assert.equal(inputPair.length, outputEles.length);
             let allValid = true;
             inputPair.forEach( function(input, index) {
               inputEles[index].val(input);
               allValid = !!(allValid && !!outputEles[index].text().trim());
             });
             if(allValid) assert.isNotOk( diffEle.hasClass('ng-hide') );
             else assert.isOk( diffEle.hasClass('ng-hide') );
           }

           done();
         });
       }
  );

  it('displays difference in various units based on checkboxes',
      function(done) {
        scope.$on('timestampCtrl', function() {
          element.find('input[type="text"]')
                 .toArray()
                 .forEach( el => $(el).val('24/1/2017 16:29')
                                      .trigger('input') );
          element.find('.panel-footer')
                 .toArray()
                 .forEach( el => assert.isOk( $(el).text().trim() ) );
          var checkboxes = element.find('table')
                                  .find('input[type="checkbox"]')
                                  .toArray()
                                  .map(e => $(e));
          assert.equal(element.find('.ng-hide').length, 1);
          checkboxes.forEach( function(el, idx) {
            assert.equal( el.prop('checked'), idx === 0 );
            el.trigger('click');
            assert.equal( el.prop('checked'), idx !== 0 );
          });
          assert.equal(element.find('.ng-hide').length, 1);
          done();
        });
      }
  );

});
