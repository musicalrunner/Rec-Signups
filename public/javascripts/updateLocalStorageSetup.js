$('document').ready( function() {

  $('#submit').click( function() {

    if(sessionStorage) {

      sessionStorage.setItem('useCached', false);
      //console.log('saved local storage');

    }

  });

});
