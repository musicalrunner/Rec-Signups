$('document').ready( function() {

  $('#submit').click( function() {

    if(localStorage) {

      localStorage.setItem('newData', true);
      console.log('saved local storage');

    }

  });

});
