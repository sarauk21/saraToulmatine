/*       ******     API 1      ********************************   */
//alert(" ia m in  js"); 
$('#btnSubmit1').click(function() {
	       //alert(" after on clic js"); 
		$.ajax({
			url: "libs/php/getCountryInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				country: $('#selCountry').val(),
				pc: $('#selPostcode').val()
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
					//alert(" stat ok js"); 

					var places = '';
						
					for (let i = 0; i < result['data'].length; i++) { 

					  // alert("hhhhhh insid for loop js"); 
					     //alert(i); 

						places += '<tr>';
						places += '<td>' + 
						result['data'][i]['postalcode'] +'***********'+ i+'</td>';
  
								places += '<td>' + 
                                result['data'][i]['placeName'] + '</td>';
  
								places += '<td>' + 
                                result['data'][i]['lat'] + '</td>';
  
								places += '<td>' + 
                                result['data'][i]['lng'] + '</td>';
  
								places += '</tr>';			
					}
					$('#table').append(places);
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
	}); 
	
});

/*       ******     API 2      ********************************   */

$('#btnSubmit2').click(function() {
	//alert(" API2  js"); 
 $.ajax({
	 url: "libs/php/getCountryInfoApi2.php",
	 type: 'POST',
	 dataType: 'json',
	 data: {
		 lat: $('#selLatitude').val(),
		 lng: $('#selLongitude').val(),
		 
	 },
	 success: function(result) {

		 console.log(JSON.stringify(result));

		 if (result.status.name == "ok") {
			 //alert(" API2 stat ok js"); 

			 var places1 = '';
				
				 places1 += '<tr>';
				 places1 += '<td>' + 
				 result['data']['countryName'] +'</td>';

						 places1 += '<td>' + 
						 result['data']['adminName1'] + '</td>';

						 places1 += '</tr>';			
			 
			 $('#table1').append(places1);
		 }
	 
	 },
	 error: function(jqXHR, textStatus, errorThrown) {
		 // your error code
	 }
}); 

});

/*       ******     API 3      ********************************   */

$('#btnSubmit3').click(function() {
	//alert(" API3  js"); 
 $.ajax({
	 url: "libs/php/getCountryInfoApi3.php",
	 type: 'POST',
	 dataType: 'json',
	 data: {
		 lat: $('#selLatitude').val(),
		 lng: $('#selLongitude').val(),
		 
	 },
	 success: function(result) {

		 console.log(JSON.stringify(result));

		 if (result.status.name == "ok") {
			 //alert(" API3 stat ok js"); 

			 var places3 = '';
			
				 places3 += '<tr>';
				 places3 += '<td>' + 
				 result['data']['countryName'] +'</td>';

						 places3 += '<td>' + 
						 result['data']['time'] + '</td>';
						 places3 += '<td>' + 
						 result['data']['sunset'] + '</td>';
						 places3 += '<td>' + 
						 result['data']['sunrise'] + '</td>';

						 places3 += '</tr>';			
			  
			 
			 $('#table3').append(places3);
		 }
	 
	 },
	 error: function(jqXHR, textStatus, errorThrown) {
		 // your error code
	 }
}); 

});