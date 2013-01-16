$('document').ready( function() {

  $('#submit').click( function() {

    if(localStorage) {

      localStorage.setItem('useCached', false);
      //console.log('saved local storage');

    }

  });

});
